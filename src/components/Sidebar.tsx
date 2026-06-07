'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, CarFront, Users, AlertTriangle, Settings, HelpCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLocationContext } from '@/context/LocationContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { isLightMode, toggleTheme } = useTheme();
  const { language } = useLocationContext();

  const navItems = [
    { name: language === 'hi' ? 'डैशबोर्ड' : 'Live Dashboard', path: '/', icon: <Map size={20} /> },
    { name: language === 'hi' ? 'स्मार्ट पार्किंग' : 'Smart Parking', path: '/parking', icon: <CarFront size={20} /> },
    { name: language === 'hi' ? 'भीड़ प्रवाह' : 'Crowd Flow', path: '/crowd', icon: <Users size={20} /> },
    { name: language === 'hi' ? 'अलर्ट लॉग' : 'Alert Logs', path: '/alerts', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <aside className={`${styles.sidebar} glass-panel`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}></div>
        <h2>Kumbh Yatra AI</h2>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button onClick={toggleTheme} className={styles.navItem} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: 'inherit' }}>
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          <span>{isLightMode ? (language === 'hi' ? 'डार्क मोड' : 'Dark Mode') : (language === 'hi' ? 'लाइट मोड' : 'Light Mode')}</span>
        </button>
        <Link href="/settings" className={`${styles.navItem} ${pathname === '/settings' ? styles.active : ''}`}>
          <Settings size={20} />
          <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
        </Link>
        <Link href="/help" className={`${styles.navItem} ${pathname === '/help' ? styles.active : ''}`}>
          <HelpCircle size={20} />
          <span>{language === 'hi' ? 'सहायता केंद्र' : 'Help Center'}</span>
        </Link>
      </div>
    </aside>
  );
}
