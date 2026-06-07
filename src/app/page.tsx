"use client";

import dynamic from 'next/dynamic';
import { Users, CarFront, AlertTriangle, TrendingUp, Droplets } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocationContext } from '@/context/LocationContext';
import styles from './page.module.css';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default function Home() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  
  const { activeLocation, setActiveLocation, locationData, locationsList, customPin, setCustomPin, language, setLanguage, t, t_dynamic } = useLocationContext();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export');
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kumbh_report_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.commandCenter}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.statusIndicator}>
            <span className={styles.pulse}></span>
            {t.liveUpdates}
          </div>
          
          {activeLocation === 'prayagraj' && !customPin && (
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {t.hostBadge}
            </div>
          )}

          {customPin && (
            <button 
              className="glass-button" 
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,23,68,0.15)', borderColor: 'rgba(255,23,68,0.4)' }}
              onClick={() => setCustomPin(null)}
            >
              {t.clearPin}
            </button>
          )}

          <select 
            className="glass-button" 
            style={{ padding: '0.65rem 1rem', cursor: 'pointer' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
          >
            <option value="en" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>EN (English)</option>
            <option value="hi" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>HI (हिंदी)</option>
            <option value="es" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>ES (Español)</option>
            <option value="fr" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>FR (Français)</option>
          </select>

          <select 
            className="glass-button" 
            style={{ padding: '0.65rem 1rem', cursor: 'pointer' }}
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value as any)}
          >
            {locationsList.map((loc) => (
              <option key={loc.key} value={loc.key} style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>
                {loc.name}
              </option>
            ))}
          </select>

          <button 
            className="glass-button" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? '...' : t.exportReport}
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>{t.totalFootfall}</span>
            <Users className={styles.statIcon} style={{ color: 'var(--primary)' }} />
          </div>
          <div className={styles.statValue}>{formatNumber(locationData.stats.footfall)}</div>
          <div className={styles.statTrend} style={{ color: locationData.stats.footfallTrend.startsWith('+') ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
            <TrendingUp size={16} /> {t_dynamic(locationData.stats.footfallTrend)}
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>{t.activeVehicles}</span>
            <CarFront className={styles.statIcon} style={{ color: 'var(--accent-warning)' }} />
          </div>
          <div className={styles.statValue}>{locationData.stats.vehicles.toLocaleString()}</div>
          <div className={styles.statTrend} style={{ color: 'var(--accent-warning)' }}>
            {locationData.parkingLots.length > 0 ? `${Math.round((locationData.parkingLots.reduce((acc, lot) => acc + lot.filled, 0) / locationData.parkingLots.reduce((acc, lot) => acc + lot.capacity, 0)) * 100)}% ${t.parkingCapacity}` : t.dataUnavailable}
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>{t.criticalAlerts}</span>
            <AlertTriangle className={styles.statIcon} style={{ color: locationData.stats.alerts > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }} />
          </div>
          <div className={styles.statValue}>{locationData.stats.alerts}</div>
          <div className={styles.statTrend} style={{ color: locationData.stats.alerts > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
            {locationData.stats.alerts > 0 ? t_dynamic(locationData.insights[0]?.text) : t.allClear}
          </div>
        </div>
      </div>

      <div className={styles.mainArea}>
        <div className={styles.mapSection}>
          <MapComponent 
            center={locationData.coords} 
            zoom={locationData.zoom} 
            hotspots={locationData.hotspots}
            customPin={customPin}
            onPinDrop={(latlng) => setCustomPin(latlng)}
            onPinRemove={() => setCustomPin(null)}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
            {t.pinHint}
          </p>
        </div>
        
        <div className={styles.sidePanel}>
          {/* River Safety Widget */}
          <div className={`${styles.panelCard} glass-panel`} style={{ marginBottom: '1rem', borderTop: `4px solid ${locationData.riverData.safe ? 'var(--accent-success)' : 'var(--accent-danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={18} color="var(--primary)" /> {t.riverSafety}
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: locationData.riverData.safe ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                {locationData.riverData.safe ? t.safeBathing : t.unsafeBathing}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.waterLevel}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{locationData.riverData.waterLevel}m</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.currentSpeed}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{locationData.riverData.speed}m/s</div>
              </div>
            </div>
          </div>

          <div className={`${styles.panelCard} glass-panel`}>
            <h3>{t.aiInsights}</h3>
            <div className={styles.insightList}>
              {locationData.insights.map((insight, i) => (
                <div key={i} className={styles.insightItem}>
                  <div className={styles.insightDot} style={{ background: `var(--accent-${insight.type})` }}></div>
                  <p>{t_dynamic(insight.text)}</p>
                </div>
              ))}
            </div>
            <button 
              className="glass-button" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => router.push('/alerts')}
            >
              {t.viewAllInsights}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
