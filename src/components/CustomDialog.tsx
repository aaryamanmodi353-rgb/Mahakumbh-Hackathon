'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function CustomDialog({ isOpen, onClose, title, message }: CustomDialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); // Wait for fade out
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s ease'
    }}>
      <div className="glass-panel" style={{
        backgroundColor: 'var(--surface)',
        padding: '2rem',
        borderRadius: 'var(--border-radius-lg)',
        maxWidth: '400px',
        width: '90%',
        boxShadow: 'var(--glass-shadow)',
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="glass-button" onClick={onClose}>Acknowledge</button>
        </div>
      </div>
    </div>
  );
}
