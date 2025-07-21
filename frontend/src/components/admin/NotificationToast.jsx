// frontend/src/components/admin/NotificationToast.jsx
import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

const NotificationToast = ({ notification }) => {
  const { removeNotification } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Animation states
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-remove after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300); // Match exit animation duration
  };

  // Get icon and styles based on notification type
  const getNotificationConfig = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          progressColor: 'bg-green-500'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          progressColor: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          progressColor: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  // Get notification title
  const getTitle = () => {
    if (notification.title) return notification.title;
    
    switch (notification.type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  };

  return (
    <div
      className={`
        relative max-w-sm w-full border rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out
        ${config.bgColor} ${config.borderColor}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
      `}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
        <div 
          className={`h-full ${config.progressColor} transition-all duration-5000 ease-linear`}
          style={{
            width: isVisible && !isLeaving ? '0%' : '100%',
            transitionDuration: `${notification.duration || 5000}ms`
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${config.titleColor}`}>
              {getTitle()}
            </h4>
            <p className={`mt-1 text-sm ${config.messageColor}`}>
              {notification.message}
            </p>
            
            {/* Additional details */}
            {notification.details && (
              <p className={`mt-2 text-xs ${config.messageColor} opacity-75`}>
                {notification.details}
              </p>
            )}

            {/* Action buttons */}
            {notification.actions && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.handler();
                      handleRemove();
                    }}
                    className={`
                      text-xs font-medium px-3 py-1 rounded transition-colors
                      ${action.primary 
                        ? `${config.progressColor.replace('bg-', 'bg-')} text-white hover:opacity-90`
                        : `${config.titleColor} hover:${config.bgColor}`
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Timestamp */}
            {notification.timestamp && (
              <p className={`mt-2 text-xs ${config.messageColor} opacity-60`}>
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Close button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleRemove}
              className={`
                rounded-md p-1 transition-colors
                ${config.titleColor} hover:${config.bgColor}
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Click to dismiss */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleRemove}
      />
    </div>
  );
};

export default NotificationToast;