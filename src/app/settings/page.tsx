'use client';

import { useState, useEffect } from 'react';
import CustomDialog from '@/components/CustomDialog';

export default function SettingsPage() {
  const [pushNotif, setPushNotif] = useState(true);
  const [smsFallback, setSmsFallback] = useState(false);
  const [autoDivert, setAutoDivert] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPushNotif(parsed.pushNotifications ?? true);
        setSmsFallback(parsed.smsFallback ?? false);
        setAutoDivert(parsed.autoDivertTraffic ?? true);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    // Persist to localStorage
    localStorage.setItem('settings', JSON.stringify({
      pushNotifications: pushNotif,
      smsFallback: smsFallback,
      autoDivertTraffic: autoDivert,
    }));
    setDialogOpen(true);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Settings</h1>
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', maxWidth: '600px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <h3>Push Notifications</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Receive instant alerts for critical events.</p>
          </div>
          <input type="checkbox" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <h3>SMS Alert Fallback</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Send SMS to officials if push fails.</p>
          </div>
          <input type="checkbox" checked={smsFallback} onChange={() => setSmsFallback(!smsFallback)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Auto-Divert Traffic</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Let AI automatically reroute traffic at 90% capacity.</p>
          </div>
          <input type="checkbox" checked={autoDivert} onChange={() => setAutoDivert(!autoDivert)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        </div>
        
        <button className="glass-button" style={{ marginTop: '2rem' }} onClick={handleSave}>Save Preferences</button>
      </div>

      <CustomDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title="Preferences Saved" 
        message="Your settings have been saved successfully. Changes will take effect immediately across all modules." 
      />
    </div>
  );
}
