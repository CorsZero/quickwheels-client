/**
 * Quick Wheel Vehicle Rental App
 * Component: Alert (Toast Message)
 * Description: Reusable toast notification component for success, error, info, and warning messages
 * Tech: React + TypeScript + CSS Modules
 */

import { useEffect } from 'react';
import styles from './Alert.module.css';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertProps {
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

const Alert = ({ message, type = 'info', duration = 5000, onClose }: AlertProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{getIcon()}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      {onClose && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
