import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  Plus, 
  Download, 
  Bell, 
  Settings, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  Target,
  Home,
  Activity,
  FileText,
  HelpCircle,
  Search,
  ChevronDown,
  User,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import TransactionModal from './components/TransactionModal';
import SpendingChart from './components/SpendingChart';
import TransactionHistory from './components/TransactionHistory';
import GoalsSection from './components/GoalsSection';
import ExpenseCategories from './components/ExpenseCategories';
import NotificationPanel from './components/NotificationPanel';
import SettingsPanel from './components/SettingsPanel';
import ViewTransition from './components/ViewTransition';
import PieChart from './components/PieChart';
import LineChart from './components/LineChart';
import Footer from './components/Footer';
import { Transaction, Category, Goal, ExpenseCategory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { 
  calculateMetrics, 
  calculateCategorySpending, 
  getSpendingChartData, 
  getPieChartData,
  generateNotifications 
} from './utils/dataCalculations';

const categories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#EF4444' },
  { id: '2', name: 'Transportation', color: '#F97316' },
  { id: '3', name: 'Shopping', color: '#EAB308' },
  { id: '4', name: 'Entertainment', color: '#22C55E' },
  { id: '5', name: 'Bills & Utilities', color: '#3B82F6' },
  { id: '6', name: 'Health & Fitness', color: '#8B5CF6' },
  { id: '7', name: 'Travel', color: '#06B6D4' },
  { id: '8', name: 'Income', color: '#10B981' },
];

const initialExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Housing', spent: 0, budget: 2000, color: '#3B82F6' },
  { id: '2', name: 'Transportation', spent: 0, budget: 500, color: '#10B981' },
  { id: '3', name: 'Groceries', spent: 0, budget: 400, color: '#F97316' },
  { id: '4', name: 'Dining Out', spent: 0, budget: 200, color: '#EF4444' },
  { id: '5', name: 'Entertainment', spent: 0, budget: 150, color: '#8B5CF6' },
  { id: '6', name: 'Healthcare', spent: 0, budget: 300, color: '#EC4899' },
];

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [expenseCategories, setExpenseCategories] = useLocalStorage<ExpenseCategory[]>('expenseCategories', initialExpenseCategories);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMetric, setActiveMetric] = useState('All Metrics');
  const [currentView, setCurrentView] = useState('dashboard');
  const [previousView, setPreviousView] = useState('dashboard');
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate real metrics from transactions
  const metrics = useMemo(() => calculateMetrics(transactions), [transactions]);

  // Calculate monthly change percentage
  const monthlyChange = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthSavings = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

    const lastMonthSavings = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

    if (lastMonthSavings === 0) return currentMonthSavings > 0 ? 100 : 0;
    return ((currentMonthSavings - lastMonthSavings) / Math.abs(lastMonthSavings)) * 100;
  }, [transactions]);

  // Calculate real expense categories with spending
  const calculatedExpenseCategories = useMemo(() => 
    calculateCategorySpending(transactions, expenseCategories), 
    [transactions, expenseCategories]
  );

  // Generate real notifications
  const notifications = useMemo(() => 
    generateNotifications(transactions, goals, calculatedExpenseCategories),
    [transactions, goals, calculatedExpenseCategories]
  );

  // Get real chart data
  const spendingChartData = useMemo(() => getSpendingChartData(transactions), [transactions]);
  const pieChartData = useMemo(() => getPieChartData(transactions, categories), [transactions]);

  const handleViewChange = (newView: string) => {
    if (newView === currentView) return;
    
    setIsViewTransitioning(true);
    setIsLoading(true);
    setPreviousView(currentView);
    
    setTimeout(() => {
      setCurrentView(newView);
      setIsLoading(false);
      setTimeout(() => {
        setIsViewTransitioning(false);
      }, 300);
    }, 150);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateGoal = (goalId: string, newAmount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.max(0, Math.min(newAmount, goal.targetAmount)) }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateExpenseCategory = (categoryId: string, budget: number) => {
    setExpenseCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, budget: Math.max(0, budget) } : cat
    ));
  };

  const deleteExpenseCategory = (categoryId: string) => {
    setExpenseCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const addExpenseCategory = (category: Omit<ExpenseCategory, 'id' | 'spent'>) => {
    const newCategory: ExpenseCategory = {
      ...category,
      id: Date.now().toString(),
      spent: 0,
    };
    setExpenseCategories(prev => [...prev, newCategory]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ transactions, goals, expenseCategories }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'finance-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetFilters = () => {
    setSelectedPeriod('Last 30 Days');
    setSelectedCategory('All Categories');
    setSearchTerm('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
              <button
                onClick={() => handleViewChange('dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
            <TransactionHistory 
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              categories={categories}
            />
          </div>
        );
      case 'goals':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals & Budget Management</h1>
              <button
                onClick={() => handleViewChange('dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
            <GoalsSection 
              goals={goals} 
              setGoals={setGoals}
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
              onAddGoal={addGoal}
            />
            <ExpenseCategories 
              categories={calculatedExpenseCategories}
              onUpdateCategory={updateExpenseCategory}
              onDeleteCategory={deleteExpenseCategory}
              onAddCategory={addExpenseCategory}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
              <button
                onClick={() => handleViewChange('dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">${metrics.income.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Income</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">${metrics.expenses.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">${metrics.savings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Net Savings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {metrics.income > 0 ? ((metrics.savings / metrics.income) * 100).toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense Categories</h3>
                  {pieChartData.length > 0 ? (
                    <PieChart data={pieChartData} size={300} />
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No expense data available
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
                  <LineChart 
                    data={spendingChartData.map(d => ({ month: d.month, value: d.expenses }))}
                    color="#EF4444"
                    height={300}
                    showArea={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={exportData}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105"
                >
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Download JSON file</div>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
                  <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">CSV Export</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Raw transaction data</div>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Excel Report</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Interactive spreadsheet</div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <span>Advanced Analytics</span>
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">Comprehensive financial insights and trends</p>
                </div>
                <button
                  onClick={() => handleViewChange('dashboard')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  Back to Dashboard
                </button>
              </div>
              <SpendingChart transactions={transactions} activeMetric={activeMetric} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Expense Breakdown</span>
                </h3>
                {pieChartData.length > 0 ? (
                  <PieChart data={pieChartData} size={280} />
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No expense data available
                  </div>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Income Trend</span>
                </h3>
                <LineChart 
                  data={spendingChartData.map(d => ({ month: d.month, value: d.income }))}
                  color="#10B981"
                  showArea={true}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Savings Rate</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {metrics.income > 0 ? ((metrics.savings / metrics.income) * 100).toFixed(1) : '0.0'}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current month</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Goals</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">{goals.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Savings goals</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transactions</h3>
                <p className="text-3xl font-bold text-purple-600 mb-1">{transactions.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total recorded</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4 mb-8 animate-fade-in-up">
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent outline-none text-sm font-medium dark:text-white"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Last Year</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent outline-none text-sm font-medium dark:text-white"
                >
                  <option>All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transform hover:scale-105"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <MetricCard
                title="Total Balance"
                amount={metrics.balance}
                icon={DollarSign}
                color="blue"
                trend={null}
                subtitle="Your current balance"
              />
              <MetricCard
                title="Monthly Income"
                amount={metrics.income}
                icon={TrendingUp}
                color="green"
                trend={{ value: 2.3, isPositive: true }}
                subtitle="from last month"
              />
              <MetricCard
                title="Monthly Expenses"
                amount={metrics.expenses}
                icon={CreditCard}
                color="red"
                trend={{ value: 5.2, isPositive: false }}
                subtitle="from last month"
              />
              <MetricCard
                title="Monthly Savings"
                amount={metrics.savings}
                icon={PiggyBank}
                color="purple"
                trend={{ value: 12.8, isPositive: true }}
                subtitle="from last month"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-500 hover:shadow-2xl animate-fade-in-up transform hover:scale-[1.02]" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Spending Analytics</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Track your financial trends over time</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {['All Metrics', 'Income', 'Expenses', 'Savings'].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setActiveMetric(metric)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                        activeMetric === metric
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl scale-110'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md'
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
              
              <SpendingChart transactions={transactions} activeMetric={activeMetric} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span>Quick Analytics</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Key insights at a glance</p>
                </div>
                <button
                  onClick={() => handleViewChange('analytics')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  View Full Analytics
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Expense Breakdown</h3>
                  {pieChartData.length > 0 ? (
                    <PieChart data={pieChartData} size={200} />
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No expense data available
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">6-Month Income Trend</h3>
                  <LineChart 
                    data={spendingChartData.map(d => ({ month: d.month, value: d.income }))}
                    color="#10B981"
                    height={200}
                    showArea={true}
                  />
                </div>
              </div>
            </div>

            {goals.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>Savings Goals Progress</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track your financial objectives</p>
                  </div>
                  <button
                    onClick={() => handleViewChange('goals')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Manage Goals
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.slice(0, 4).map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                      <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${progress}%`,
                              backgroundColor: goal.color
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>${goal.currentAmount.toLocaleString()}</span>
                          <span>${goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Recent Transactions</span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your latest financial activity</p>
                  </div>
                  <button
                    onClick={() => handleViewChange('transactions')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    View All Transactions
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: category?.color || '#6B7280' }}
                          >
                            {transaction.type === 'income' ? '↗' : category?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span>Financial Reports</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly and yearly summaries</p>
                </div>
                <button
                  onClick={() => handleViewChange('reports')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                >
                  Generate Reports
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    ${metrics.savings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Net Income</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">This Month</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {metrics.income > 0 ? ((metrics.savings / metrics.income) * 100).toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Target: 30%</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {transactions.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Transactions</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Total</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar
        onAddTransaction={() => setIsTransactionModalOpen(true)}
        currentView={currentView}
        setCurrentView={handleViewChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        balance={metrics.balance}
        monthlyChange={monthlyChange}
        goalsCount={goals.length}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-all duration-300 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  title="Expand sidebar"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-gray-900 dark:text-white animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceFlow</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Professional Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 transform focus:scale-105"
                />
              </div>
              
              <button
                onClick={() => setIsTransactionModalOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </button>
              
              <button 
                onClick={exportData}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-lg transform hover:scale-110 active:scale-95"
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="p-2 relative hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>
                )}
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500 animate-spin" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 animate-pulse" />
                )}
              </button>
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-90 active:scale-95"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-all duration-300 transform hover:scale-105">
                <div className="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-medium">
                  U
                </div>
                <div className="text-sm hidden lg:block">
                  <div className="font-medium text-gray-900 dark:text-white">User</div>
                  <div className="text-gray-500 dark:text-gray-400">Premium Plan</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 transition-all duration-300 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-10">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Loading...</span>
              </div>
            </div>
          )}
          <ViewTransition
            isTransitioning={isViewTransitioning}
            currentView={currentView}
            previousView={previousView}
          >
            {renderCurrentView()}
          </ViewTransition>
        </main>

        <Footer />
      </div>

      {isTransactionModalOpen && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          onSubmit={addTransaction}
          categories={categories}
        />
      )}

      {isNotificationOpen && (
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
        />
      )}

      {isSettingsOpen && (
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;