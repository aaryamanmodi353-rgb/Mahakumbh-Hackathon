'use client';

import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import styles from '../page.module.css'; // Reuse some basic layout styles if needed

export default function AlertsPage() {
  const { locationData, t, t_dynamic } = useLocationContext();
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.alertsTitle}</h1>
          <p className={styles.subtitle}>{t.alertsSub}</p>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>{t.severity}</th>
              <th style={{ padding: '1rem' }}>{t.message}</th>
              <th style={{ padding: '1rem' }}>{t.time}</th>
              <th style={{ padding: '1rem' }}>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {locationData.logs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{t.noLogs}</td>
              </tr>
            )}
            {locationData.logs.map(alert => (
              <tr key={alert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>
                  {alert.type === 'danger' && <span style={{ color: 'var(--accent-danger)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><ShieldAlert size={16}/> Critical</span>}
                  {alert.type === 'warning' && <span style={{ color: 'var(--accent-warning)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertTriangle size={16}/> Warning</span>}
                  {alert.type === 'info' && <span style={{ color: 'var(--accent-success)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Info size={16}/> Info</span>}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{t_dynamic(alert.message)}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{alert.time}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.85rem',
                    background: alert.status === 'Active' ? 'rgba(255, 23, 68, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: alert.status === 'Active' ? 'var(--accent-danger)' : 'var(--text-secondary)'
                  }}>
                    {t_dynamic(alert.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
