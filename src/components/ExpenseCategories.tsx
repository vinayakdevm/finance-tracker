import React, { useState } from 'react';
import { PieChart, TrendingUp, TrendingDown, CreditCard as Edit3, Trash2, Plus, Save, X } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface ExpenseCategoriesProps {
  categories: ExpenseCategory[];
  onUpdateCategory: (categoryId: string, budget: number) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddCategory: (category: Omit<ExpenseCategory, 'id' | 'spent'>) => void;
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ 
  categories, 
  onUpdateCategory, 
  onDeleteCategory, 
  onAddCategory 
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editBudget, setEditBudget] = useState<number>(0);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: '',
    color: '#3B82F6'
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const handleEditCategory = (categoryId: string, currentBudget: number) => {
    setEditingCategory(categoryId);
    setEditBudget(currentBudget);
  };

  const handleSaveEdit = (categoryId: string) => {
    onUpdateCategory(categoryId, editBudget);
    setEditingCategory(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditBudget(0);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.budget) return;

    onAddCategory({
      name: newCategory.name,
      budget: parseFloat(newCategory.budget),
      color: newCategory.color
    });

    setNewCategory({
      name: '',
      budget: '',
      color: '#3B82F6'
    });
    setIsAddingCategory(false);
  };

  const colors = [
    '#3B82F6', '#10B981', '#F97316', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expense Categories</h2>
        </div>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-750">
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Utilities"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Budget
                </label>
                <input
                  type="number"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newCategory.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = calculatePercentage(category.spent, category.budget);
          const remaining = category.budget - category.spent;

          return (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatAmount(category.spent)} of {formatAmount(category.budget)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {percentage}%
                  </span>
                  {getStatusIcon(percentage)}
                  <button
                    onClick={() => handleEditCategory(category.id, category.budget)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Budget Edit or Display */}
              <div className="flex items-center justify-between text-sm">
                {editingCategory === category.id ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Budget: $</span>
                    <input
                      type="number"
                      value={editBudget}
                      onChange={(e) => setEditBudget(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                    />
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                    >
                      <Save className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`font-medium ${
                      remaining > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {remaining > 0 ? formatAmount(remaining) : formatAmount(Math.abs(remaining))} 
                      {remaining > 0 ? ' left' : ' over budget'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Budget: {formatAmount(category.budget)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expense categories yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start by creating your first expense category</p>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Category
          </button>
        </div>
      )}

      {/* Summary */}
      {categories.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(categories.reduce((sum, cat) => sum + cat.spent, 0))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(categories.reduce((sum, cat) => sum + cat.budget, 0))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                <span>Total Budget</span>
                <Edit3 className="w-3 h-3" title="Click edit icon on each category to change budget" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategories;