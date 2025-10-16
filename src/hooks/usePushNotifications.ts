import { pushService } from "@/src/services";
import { Expense } from "@/src/types";
import { useEffect } from "react";
import { Alert } from "react-native";

/**
 * Hook to set up push notification handling
 * Requests permissions and listens for incoming notifications
 */
export const usePushNotifications = () => {
  useEffect(() => {
    pushService.requestPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = pushService.onPushReceived((expense: Expense) => {
      Alert.alert("New Expense!", `${expense.merchant} - $${expense.amount.toFixed(2)}`, [{ text: "OK" }]);
    });

    return unsubscribe;
  }, []);

  return {
    simulatePush: pushService.simulatePushNotification.bind(pushService),
  };
};
