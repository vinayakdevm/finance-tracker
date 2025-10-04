import React from 'react';
import { 
  Plus, 
  Download, 
  Home, 
  BarChart3, 
  Target, 
  CreditCard, 
  FileText, 
  Settings, 
  HelpCircle,
  User,
  Crown,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  onAddTransaction: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  balance: number;
  monthlyChange: number;
  goalsCount: number;
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddTransaction,
  currentView,
  setCurrentView,
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  balance,
  monthlyChange,
  goalsCount,
  onSettingsClick,
  onHelpClick
}) => {
  const navigationItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard', badge: null },
    { icon: BarChart3, label: 'Analytics', view: 'analytics', badge: 'Pro' },
    { icon: Target, label: 'Goals', view: 'goals', badge: goalsCount > 0 ? goalsCount.toString() : null },
    { icon: CreditCard, label: 'Transactions', view: 'transactions', badge: null },
    { icon: FileText, label: 'Reports', view: 'reports', badge: null },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 dark:border-gray-700 relative overflow-hidden flex-shrink-0">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-50"></div>
        
        <div className="relative z-10">
          <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-white text-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-12">
                <BarChart3 className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="ml-3 transition-opacity duration-300">
                  <h2 className="font-bold text-white animate-pulse">FinanceFlow</h2>
                  <p className="text-gray-400 text-sm">Professional</p>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-800 rounded-lg transition-all duration-300 text-gray-400 transform hover:scale-110 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* User Profile - Only show when not collapsed */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3 mb-4 group cursor-pointer">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-700">
                <span className="text-sm font-medium text-white">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate transition-all duration-300 group-hover:text-blue-300">User</h3>
                <p className="text-gray-400 text-sm truncate">User@email.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-800 dark:border-gray-700">
          <div className="space-y-2">
            <button
              onClick={onAddTransaction}
              className={`w-full bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 flex items-center shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 ${
                isCollapsed ? 'justify-center p-3' : 'justify-center px-4 py-3 space-x-2'
              }`}
              title={isCollapsed ? 'Add Transaction' : ''}
            >
              <Plus className="w-4 h-4" />
              {!isCollapsed && <span>Add Transaction</span>}
            </button>
            
            {!isCollapsed && (
              <button className="w-full text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-gray-800 transform hover:scale-105">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  currentView === item.view
                    ? 'bg-gray-800 text-white shadow-xl transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
                } ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}`}
                title={isCollapsed ? item.label : ''}
              >
                {/* Active indicator */}
                {currentView === item.view && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full animate-pulse"></div>
                )}
                
                <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3 flex-1'}`}>
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    currentView === item.view ? 'animate-pulse' : 'group-hover:scale-110'
                  }`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 animate-bounce ${
                    item.badge === 'Pro'
                      ? 'bg-yellow-500 text-yellow-900'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Stats - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Balance</span>
                </div>
                <span className="text-sm font-medium text-white">${balance.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-4 h-4 ${monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-sm text-gray-300">This Month</span>
                </div>
                <span className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-700">
          <div className="space-y-2">
            <button
              onClick={onSettingsClick}
              className={`w-full flex items-center rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 ${
                isCollapsed ? 'justify-center p-3' : 'justify-start space-x-3 px-4 py-3'
              }`}
              title={isCollapsed ? 'Settings' : ''}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </button>
            <button
              onClick={onHelpClick}
              className={`w-full flex items-center rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 ${
                isCollapsed ? 'justify-center p-3' : 'justify-start space-x-3 px-4 py-3'
              }`}
              title={isCollapsed ? 'Help & Support' : ''}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Help & Support</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-800 dark:border-gray-700 hidden lg:block flex-shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 animate-pulse" />
          ) : (
            <ChevronLeft className="w-5 h-5 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-gray-900 text-white transition-all duration-500 shadow-2xl ${
        isCollapsed ? 'w-16' : 'w-64'
      } fixed left-0 top-0 h-full z-30`}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-all duration-500 shadow-2xl ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;