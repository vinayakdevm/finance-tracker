export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  categoryId: string;
  date: string;
  tags?: string[];
  location?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface MetricTrend {
  value: number;
  isPositive: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  color: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  priority?: string;
}