import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  priority?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'info':
        return Info;
      case 'trend':
        return TrendingUp;
      default:
        return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-orange-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      case 'trend':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-6 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-96 max-h-96 overflow-hidden animate-slide-in-right border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-bounce" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${iconColor} animate-pulse`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {notification.priority === 'high' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">No notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-300 transform hover:scale-105 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
              Mark All as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;