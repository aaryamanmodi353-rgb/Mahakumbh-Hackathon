'use client';

import { CarFront, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocationContext } from '@/context/LocationContext';
import CustomDialog from '@/components/CustomDialog';
import styles from '../page.module.css'; // Reuse basic layout

export default function ParkingPage() {
  const router = useRouter();
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
          <h1 className={styles.title}>{t.smartParkingTitle}</h1>
          <p className={styles.subtitle}>{t.smartParkingSub}</p>
        </div>
        <button className="glass-button">{t.globalDiversion}</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {locationData.parkingLots.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>{t.noParking}</p>
        )}
        {locationData.parkingLots.map(lot => {
          const percent = Math.round((lot.filled / lot.capacity) * 100);
          const color = percent >= 90 ? 'var(--accent-danger)' : percent >= 80 ? 'var(--accent-warning)' : 'var(--accent-success)';
          
          return (
            <div key={lot.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CarFront size={20} color={color} />
                  {t_dynamic(lot.name)}
                </h3>
                {percent >= 90 && <AlertCircle size={20} color="var(--accent-danger)" />}
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{lot.filled.toLocaleString()} / {lot.capacity.toLocaleString()} {t.spaces}</span>
                  <span style={{ color, fontWeight: 'bold' }}>{percent}% {t.full}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 1s ease' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button onClick={() => router.push('/')} className="glass-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>{t.viewMap}</button>
                <button 
                  className="glass-button" 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: percent >= 90 ? 'rgba(255,23,68,0.2)' : '' }}
                  onClick={() => triggerAlert(`Traffic diversion active for ${t_dynamic(lot.name)}. Teams notified.`)}
                >
                  {percent >= 90 ? t.closeLot : t.divertTraffic}
                </button>
              </div>
            </div>
          )
        })}
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
