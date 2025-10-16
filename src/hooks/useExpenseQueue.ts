import { expenseService, useFlushQueue } from "@/src/state";
import { Expense } from "@/src/types";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook to manage offline expense queue
 * @param expenses - Current list of expenses (used to trigger queue length updates)
 * @param isOnline - Network connectivity status
 * @returns Object containing queue length and flush mutation
 */
export const useExpenseQueue = (expenses: Expense[], isOnline: boolean) => {
  const [queueLength, setQueueLength] = useState(0);
  const flushQueueMutation = useFlushQueue();

  useEffect(() => {
    setQueueLength(expenseService.getQueueLength());
  }, [expenses]);

  const handleFlushQueue = useCallback(() => {
    flushQueueMutation.mutate();
  }, [flushQueueMutation]);

  useEffect(() => {
    if (isOnline && queueLength > 0) {
      handleFlushQueue();
    }
  }, [isOnline, queueLength, handleFlushQueue]);

  return { queueLength, flushQueueMutation };
};
