import React from 'react';
import { X, HelpCircle, MessageCircle, Mail, Book, FileText, Video, Phone, ExternalLink } from 'lucide-react';

interface HelpSupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpSupportPanel: React.FC<HelpSupportPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const helpResources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      action: () => {},
      color: 'blue'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      action: () => {},
      color: 'red'
    },
    {
      icon: FileText,
      title: 'FAQs',
      description: 'Frequently asked questions',
      action: () => {},
      color: 'green'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => {},
      color: 'purple'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@financeflow.com',
      action: () => {},
      color: 'orange'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us: 1-800-FINANCE',
      action: () => {},
      color: 'teal'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-bounce-in border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <span>Help & Support</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-2">We're Here to Help!</h3>
              <p className="text-blue-100">
                Get the support you need to make the most of FinanceFlow. Our team is available 24/7 to assist you.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helpResources.map((resource, index) => (
                <button
                  key={index}
                  onClick={resource.action}
                  className="group flex items-start p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-left"
                >
                  <div className={`p-3 rounded-lg ${colorClasses[resource.color as keyof typeof colorClasses]} transition-all duration-300 group-hover:scale-110 mr-4 flex-shrink-0`}>
                    <resource.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center space-x-2">
                      <span>{resource.title}</span>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Topics
            </h3>
            <div className="space-y-2">
              {[
                'How do I add a new transaction?',
                'Setting up savings goals',
                'Understanding budget categories',
                'Exporting my financial data',
                'Dark mode and theme settings',
                'Managing multiple accounts'
              ].map((topic, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-102 hover:border-blue-300 dark:hover:border-blue-600 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {topic}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Need More Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our support team is ready to assist you with any questions or concerns.
            </p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Start a Conversation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPanel;
