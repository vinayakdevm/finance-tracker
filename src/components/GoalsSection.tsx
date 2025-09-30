import React, { useState } from 'react';
import { Target, Plus, Calendar, DollarSign, TrendingUp, CreditCard as Edit3, Trash2, Save, X } from 'lucide-react';
import { Goal } from '../types';

interface GoalsSectionProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  onUpdateGoal: (goalId: string, newAmount: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ 
  goals, 
  setGoals, 
  onUpdateGoal, 
  onDeleteGoal, 
  onAddGoal 
}) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    dueDate: '',
    color: '#3B82F6'
  });

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusText = (daysUntil: number, progress: number) => {
    if (progress >= 100) return 'Completed';
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Due Today';
    return `${daysUntil} days left`;
  };

  const getStatusColor = (daysUntil: number, progress: number) => {
    if (progress >= 100) return 'text-green-600 dark:text-green-400';
    if (daysUntil < 0) return 'text-red-600 dark:text-red-400';
    if (daysUntil <= 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.dueDate) return;

    onAddGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      dueDate: newGoal.dueDate,
      color: newGoal.color
    });

    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      dueDate: '',
      color: '#3B82F6'
    });
    setIsAddingGoal(false);
  };

  const handleEditGoal = (goalId: string, currentAmount: number) => {
    setEditingGoal(goalId);
    setEditAmount(currentAmount);
  };

  const handleSaveEdit = (goalId: string) => {
    onUpdateGoal(goalId, editAmount);
    setEditingGoal(null);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setEditAmount(0);
  };

  const colors = [
    '#3B82F6', '#10B981', '#F97316', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
        </div>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {isAddingGoal && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-750">
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Amount
                </label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newGoal.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysUntil = getDaysUntilDue(goal.dueDate);
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: goal.color }}
                  >
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(daysUntil, progress)}`}>
                      {Math.round(progress)}%
                    </div>
                    <div className={`text-xs ${getStatusColor(daysUntil, progress)}`}>
                      {getStatusText(daysUntil, progress)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditGoal(goal.id, goal.currentAmount)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: goal.color
                    }}
                  />
                </div>
              </div>

              {/* Amount Details */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {editingGoal === goal.id ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 dark:text-gray-400">$</span>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="0"
                        max={goal.targetAmount}
                      />
                      <span className="text-gray-600 dark:text-gray-400">saved</span>
                      <button
                        onClick={() => handleSaveEdit(goal.id)}
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
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatAmount(goal.currentAmount)} saved
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatAmount(goal.targetAmount)} goal
                      </span>
                    </>
                  )}
                </div>
                {editingGoal !== goal.id && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatAmount(remaining)} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No savings goals yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start by creating your first savings goal</p>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;