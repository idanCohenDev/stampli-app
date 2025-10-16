import { netInfoService } from "@/src/services";
import { useEffect, useState } from "react";

/**
 * Hook to monitor network connectivity status
 * @returns Object containing online status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(netInfoService.getConnectionStatus());

    const unsubscribe = netInfoService.onConnectionChange((isConnected) => {
      setIsOnline(isConnected);
    });

    return unsubscribe;
  }, []);

  return { isOnline };
};
