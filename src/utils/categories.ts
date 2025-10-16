import { ExpenseCategory } from '@/src/types';

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    [ExpenseCategory.FOOD]: '#FF6B6B',
    [ExpenseCategory.TRANSPORT]: '#4ECDC4',
    [ExpenseCategory.ENTERTAINMENT]: '#95E1D3',
    [ExpenseCategory.UTILITIES]: '#F38181',
    [ExpenseCategory.SHOPPING]: '#AA96DA',
    [ExpenseCategory.HEALTHCARE]: '#FCBAD3',
    [ExpenseCategory.OTHER]: '#A8DADC',
  };
  return colors[category];
};

export const getCategoryIcon = (category: ExpenseCategory): string => {
  const icons: Record<ExpenseCategory, string> = {
    [ExpenseCategory.FOOD]: '🍔',
    [ExpenseCategory.TRANSPORT]: '🚗',
    [ExpenseCategory.ENTERTAINMENT]: '🎬',
    [ExpenseCategory.UTILITIES]: '💡',
    [ExpenseCategory.SHOPPING]: '🛍️',
    [ExpenseCategory.HEALTHCARE]: '🏥',
    [ExpenseCategory.OTHER]: '📦',
  };
  return icons[category];
};

export const getAllCategories = (): ExpenseCategory[] => {
  return Object.values(ExpenseCategory);
};
