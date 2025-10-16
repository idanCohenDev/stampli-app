import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type ConnectionChangeCallback = (isConnected: boolean) => void;

export class NetInfoService {
  private listeners: ConnectionChangeCallback[] = [];
  private isConnected: boolean = true;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    NetInfo.fetch().then(state => {
      this.isConnected = state.isConnected ?? false;
    });

    NetInfo.addEventListener((state: NetInfoState) => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected ?? false;

      if (wasConnected !== this.isConnected) {
        this.notifyListeners(this.isConnected);
      }
    });
  }

  private notifyListeners(isConnected: boolean): void {
    this.listeners.forEach(listener => listener(isConnected));
  }

  onConnectionChange(callback: ConnectionChangeCallback): () => void {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const netInfoService = new NetInfoService();
