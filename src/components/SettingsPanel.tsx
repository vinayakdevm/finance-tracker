import React from 'react';
import { X, Moon, Sun, User, Bell, Shield, CreditCard, Download, HelpCircle, Settings } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  toggleDarkMode 
}) => {
  if (!isOpen) return null;

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDarkMode ? Sun : Moon,
          label: 'Dark Mode',
          description: 'Toggle between light and dark themes',
          action: toggleDarkMode,
          type: 'toggle',
          value: isDarkMode
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: 'Manage your personal information',
          action: () => {},
          type: 'button'
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Control your privacy settings',
          action: () => {},
          type: 'button'
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          description: 'Receive alerts for important updates',
          action: () => {},
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          description: 'Download your financial data',
          action: () => {},
          type: 'button'
        },
        {
          icon: CreditCard,
          label: 'Connected Accounts',
          description: 'Manage linked bank accounts',
          action: () => {},
          type: 'button'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help and contact support',
          action: () => {},
          type: 'button'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-96 overflow-hidden animate-bounce-in border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600 animate-spin" />
            <span>Settings</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-6">
          <div className="space-y-8">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      
                      {item.type === 'toggle' ? (
                        <button
                          onClick={item.action}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 transform hover:scale-110 ${
                            item.value 
                              ? 'bg-blue-600' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={item.action}
                          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-105 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          Configure
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;