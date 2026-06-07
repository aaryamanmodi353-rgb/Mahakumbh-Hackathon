'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useLocationContext } from '@/context/LocationContext';
import CustomDialog from '@/components/CustomDialog';
import styles from '../page.module.css';

export default function CrowdPage() {
  const { locationData, t, t_dynamic } = useLocationContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');

  const triggerAlert = (msg: string) => {
    setDialogMsg(msg);
    setDialogOpen(true);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.crowdAnalysisTitle}</h1>
          <p className={styles.subtitle}>{t.crowdAnalysisSub}</p>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Chart Section */}
        <div className="glass-panel" style={{ flex: '2', minWidth: '400px', padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.footfallTrendTitle}</h3>
          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={locationData.crowdTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="yesterday" stroke="var(--text-secondary)" fill="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="today" stroke="var(--primary)" fillOpacity={1} fill="url(#colorToday)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Breakdown */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t.currentZoneDensity}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {locationData.zoneDensity.map(zone => (
              <div key={zone.zone}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{t_dynamic(zone.zone)}</span>
                  <span style={{ color: zone.color, fontWeight: 'bold' }}>{zone.density}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${zone.density}%`, height: '100%', background: zone.color }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="glass-button" 
            style={{ width: '100%', marginTop: '2rem' }}
            onClick={() => triggerAlert(`Volunteer teams deployed to ${locationData.zoneDensity.filter(z => z.density > 80).map(z => t_dynamic(z.zone)).join(', ') || 'critical areas'}.`)}
          >
            <Users size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
            {t.deployTeams}
          </button>
        </div>

      </div>

      <CustomDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title="Action Confirmed" 
        message={dialogMsg} 
      />
    </div>
  );
}
