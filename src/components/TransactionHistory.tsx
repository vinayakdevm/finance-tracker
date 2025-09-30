import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, Heart, MapPin, Tag, Trash2, CreditCard as Edit } from 'lucide-react';
import { Transaction, Category } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  searchTerm: string;
  selectedCategory: string;
  categories: Category[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  searchTerm,
  selectedCategory,
  categories
}) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (transaction.tags && transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesType = typeFilter === 'All Types' || transaction.type === typeFilter.toLowerCase();
      const matchesCategory = categoryFilter === 'All Categories' || transaction.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy, sortOrder]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    
    filteredAndSortedTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateKey = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    
    return groups;
  }, [filteredAndSortedTransactions]);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name.charAt(0) || '?';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
              {filteredAndSortedTransactions.length}
            </span>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option>All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
          {['Date', 'Amount', 'Description'].map((option) => (
            <button
              key={option}
              onClick={() => handleSort(option.toLowerCase())}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                sortBy === option.toLowerCase()
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{option}</span>
              {sortBy === option.toLowerCase() && (
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">{date}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {dayTransactions.length} transaction{dayTransactions.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {dayTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                    >
                      {transaction.type === 'income' ? '↗' : getCategoryIcon(transaction.categoryId)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </h4>
                        {transaction.tags && transaction.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {transaction.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{transaction.category}</span>
                        </span>
                        
                        <span className="flex items-center space-x-1">
                          <span>{new Date(transaction.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </span>
                        
                        {transaction.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{transaction.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold text-lg ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                        <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {filteredAndSortedTransactions.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;