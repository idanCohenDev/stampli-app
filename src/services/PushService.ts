import * as Notifications from 'expo-notifications';
import { Expense, ExpenseCategory } from "@/src/types";

type PushNotificationCallback = (expense: Expense) => void;

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class PushService {
  private listeners: PushNotificationCallback[] = [];

  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  onPushReceived(callback: PushNotificationCallback): () => void {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  async simulatePushNotification(): Promise<Expense> {
    const mockExpense: Expense = {
      id: `push-${Date.now()}`,
      merchant: "Starbucks",
      amount: 5.75,
      category: ExpenseCategory.FOOD,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Schedule local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💰 New Expense',
        body: `${mockExpense.merchant} - $${mockExpense.amount.toFixed(2)}`,
        data: { expense: mockExpense },
        sound: true,
      },
      trigger: null, // null means show immediately
    });

    // Notify internal listeners
    this.listeners.forEach((listener) => listener(mockExpense));

    return mockExpense;
  }
}

export const pushService = new PushService();
