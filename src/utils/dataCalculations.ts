import { Transaction, Goal, ExpenseCategory } from '../types';

export const calculateMetrics = (transactions: Transaction[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const income = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = transactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);
  
  const savings = income - expenses;

  return { balance, income, expenses, savings };
};

export const calculateCategorySpending = (transactions: Transaction[], categories: any[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth &&
           transactionDate.getFullYear() === currentYear &&
           t.type === 'expense';
  });

  // Map transaction categories to expense categories
  const categoryMapping: { [key: string]: string[] } = {
    'Housing': ['Bills & Utilities'],
    'Transportation': ['Transportation', 'Travel'],
    'Groceries': ['Food & Dining'],
    'Dining Out': ['Food & Dining'],
    'Entertainment': ['Entertainment', 'Shopping'],
    'Healthcare': ['Health & Fitness']
  };

  return categories.map(category => {
    const mappedCategories = categoryMapping[category.name] || [category.name];
    const spent = currentMonthTransactions
      .filter(t => mappedCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...category,
      spent: Math.round(spent)
    };
  });
};

export const getSpendingChartData = (transactions: Transaction[]) => {
  const months = [];
  const currentDate = new Date();
  
  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === date.getMonth() && 
             transactionDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(income - expenses)
    });
  }
  
  return months;
};

export const getPieChartData = (transactions: Transaction[], categories: any[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear &&
           t.type === 'expense';
  });

  const categoryTotals = categories
    .filter(cat => cat.name !== 'Income')
    .map(category => {
      const total = currentMonthExpenses
        .filter(t => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: Math.round(total),
        color: category.color
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return categoryTotals;
};

export const generateNotifications = (
  transactions: Transaction[], 
  goals: Goal[], 
  expenseCategories: ExpenseCategory[]
) => {
  const notifications = [];
  const now = new Date();

  // Budget alerts
  expenseCategories.forEach(category => {
    const percentage = (category.spent / category.budget) * 100;
    if (percentage >= 90) {
      notifications.push({
        id: `budget-${category.id}`,
        type: 'warning',
        title: 'Budget Alert',
        message: `You've spent ${Math.round(percentage)}% of your ${category.name} budget this month`,
        time: 'Just now',
        priority: percentage >= 100 ? 'high' : 'medium'
      });
    }
  });

  // Goal achievements
  goals.forEach(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    if (progress >= 75 && progress < 100) {
      notifications.push({
        id: `goal-${goal.id}`,
        type: 'success',
        title: 'Goal Progress',
        message: `Great progress! You've reached ${Math.round(progress)}% of your ${goal.name} goal`,
        time: '1 hour ago',
        priority: 'medium'
      });
    }
  });

  // Recent large transactions
  const recentTransactions = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const daysDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 1 && t.amount >= 500;
    });

  if (recentTransactions.length > 0) {
    notifications.push({
      id: 'large-transaction',
      type: 'info',
      title: 'Large Transaction',
      message: `Large ${recentTransactions[0].type} of $${recentTransactions[0].amount.toLocaleString()} recorded`,
      time: '2 hours ago',
      priority: 'low'
    });
  }

  return notifications.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};