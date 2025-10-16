import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense, NewExpense } from '@/src/types';
import { expenseService } from './expenseService.instance';

const EXPENSES_KEY = ['expenses'];

export const useExpenses = () => {
  return useQuery<Expense[]>({
    queryKey: EXPENSES_KEY,
    queryFn: () => expenseService.getMockExpenses(),
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newExpense: NewExpense) => expenseService.addTransaction(newExpense),
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: EXPENSES_KEY });

      const previousExpenses = queryClient.getQueryData<Expense[]>(EXPENSES_KEY);

      const optimisticExpense: Expense = {
        id: `optimistic-${Date.now()}`,
        ...newExpense,
        date: newExpense.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Expense[]>(EXPENSES_KEY, (old) =>
        old ? [optimisticExpense, ...old] : [optimisticExpense]
      );

      return { previousExpenses };
    },
    onError: (_error, _newExpense, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(EXPENSES_KEY, context.previousExpenses);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
};

export const useFlushQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => expenseService.flushQueue(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
};
