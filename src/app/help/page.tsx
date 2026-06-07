export default function HelpPage() {
  return (
    <div style={{ padding: '2rem', height: '100%', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Help Center</h1>
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', maxWidth: '800px' }}>
        
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Frequently Asked Questions</h2>
        
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>How do I export the current data?</h4>
          <p style={{ color: 'var(--text-secondary)' }}>You can export the live dashboard data at any time by clicking the "Export Report" button in the top right corner of the Live Dashboard.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>How does the AI predict stampedes?</h4>
          <p style={{ color: 'var(--text-secondary)' }}>The platform analyzes historical footfall data, incoming transit volumes, and real-time CCTV density feeds to forecast choke points up to 45 minutes in advance.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>How do I change the location?</h4>
          <p style={{ color: 'var(--text-secondary)' }}>Use the dropdown in the top right corner of the Live Dashboard to switch between Prayagraj, Haridwar, Ujjain, and Nashik.</p>
        </div>

        <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Contact Support</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>For urgent administrative overrides, contact the central command IT support.</p>
        <button className="glass-button">Open Support Ticket</button>

      </div>
    </div>
  );
}
