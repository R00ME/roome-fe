import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY';

export class WebSocketService {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private activityListeners = new Set<() => void>();
  private inactivityTimeout: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly INACTIVE_THRESHOLD = 10 * 60 * 1000; // 10분
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectAttempts = 0;
  private connectionStatus: ConnectionStatus = 'DISCONNECTED';
  private isManualLogout = false;

  constructor() {
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    const handleActivity = () => {
      if (this.isManualLogout) return;

      this.resetInactivityTimer();
      this.attemptReconnectIfNeeded();
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach((event) => {
      const listener = () => handleActivity();
      window.addEventListener(event, listener);
      this.activityListeners.add(() =>
        window.removeEventListener(event, listener),
      );
    });

    const visibilityListener = () => {
      if (this.isManualLogout) return;

      if (document.hidden) {
        this.handleVisibilityHidden();
      } else {
        this.handleVisibilityVisible();
      }
    };

    document.addEventListener('visibilitychange', visibilityListener);
    this.activityListeners.add(() =>
      document.removeEventListener('visibilitychange', visibilityListener),
    );
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }

    this.inactivityTimeout = setTimeout(() => {
      if (this.connectionStatus === 'CONNECTED') {
        this.disconnect();
      }
    }, this.INACTIVE_THRESHOLD);
  }

  private attemptReconnectIfNeeded(): void {
    if (this.connectionStatus === 'DISCONNECTED') {
      // // // console.log('연결이 끊어진 상태에서 사용자 활동 감지. 재연결 시도');
      this.connect();
    }
  }

  private handleVisibilityHidden(): void {
    if (this.connectionStatus === 'CONNECTED') {
      this.disconnect();
    }
  }

  private handleVisibilityVisible(): void {
    if (this.connectionStatus === 'DISCONNECTED') {
      this.connect();
    }
  }

  private async handleConnectionError(): Promise<void> {
    if (this.isManualLogout) {
      // // // console.log('명시적 로그아웃 상태: 재연결 시도 무시');
      return;
    }

    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      // // // console.log('최대 재연결 시도 횟수 초과');
      this.cleanupConnection();
      return;
    }

    this.reconnectAttempts++;
    // // console.log(
    //   `재연결 시도 ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`,
    // );

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const backoffDelay = 2000 * Math.pow(2, this.reconnectAttempts - 1);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, backoffDelay);
  }

  private cleanupConnection(): void {
    this.connectionStatus = 'DISCONNECTED';
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.unsubscribeAll();
  }

  async connect(): Promise<void> {
    if (this.isManualLogout || this.connectionStatus === 'CONNECTING') {
      return;
    }

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      // console.error('웹소켓 연결 실패: 토큰이 없음');
      return;
    }

    try {
      this.connectionStatus = 'CONNECTING';
      await this.initializeClient(token);
    } catch (error) {
      console.error('웹소켓 연결 실패:', error);
      this.handleConnectionError();
    }
  }

  private async initializeClient(token: string): Promise<void> {
    const WS_URL = import.meta.env.VITE_API_URL + '/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: this.handleConnect.bind(this),
      onDisconnect: this.handleDisconnect.bind(this),
      onStompError: this.handleStompError.bind(this),
      onWebSocketError: this.handleWebSocketError.bind(this),
      // debug: (msg: string) => // // console.log('STOMP Debug:', msg),
    });

    await this.client.activate();
  }

  private handleConnect(): void {
    // console.log('웹소켓 연결 성공');
    this.connectionStatus = 'CONNECTED';
    this.reconnectAttempts = 0;
    this.setupSubscriptions();
    this.sendUserStatus('ONLINE');
    // Header 컴포넌트에 연결 상태 변경을 알림
    window.dispatchEvent(new CustomEvent('websocketConnected'));
  }

  private handleDisconnect(): void {
    // console.log('웹소켓 연결 해제');
    if (!this.isManualLogout) {
      this.handleConnectionError();
    }
    this.connectionStatus = 'DISCONNECTED';
    // Header 컴포넌트에 연결 해제 상태 변경을 알림
    window.dispatchEvent(new CustomEvent('websocketDisconnected'));
  }

  private handleStompError(frame: unknown): void {
    console.error('Stomp 에러:', frame);
    this.handleConnectionError();
  }

  private handleWebSocketError(): void {
    // console.error('웹소켓 에러:', event);
    this.handleConnectionError();
  }

  private setupSubscriptions(): void {
    this.subscribeToNotifications();
    this.subscribeToUserStatus();
  }

  private subscribeToNotifications(): void {
    const user = useUserStore.getState().user;
    if (!user) {
      console.error('사용자 정보 없음');
      return;
    }

    const subscriptionPath = `/user/${user.userId}/notification`;
    try {
      const subscription = this.client?.subscribe(
        subscriptionPath,
        this.handleNotification.bind(this),
      );
      if (subscription) {
        this.subscriptions.set('notifications', subscription);
      }
    } catch (error) {
      console.error('알림 구독 실패:', error);
    }
  }

  private handleNotification(message: Message): void {
    try {
      const notification = JSON.parse(message.body);
      window.dispatchEvent(
        new CustomEvent('newNotification', { detail: notification }),
      );
    } catch (error) {
      console.error('알림 처리 실패:', error);
    }
  }

  private subscribeToUserStatus(): void {
    const subscription = this.client?.subscribe(
      '/topic/status',
      (message: Message) => {
        const statusUpdate = JSON.parse(message.body);
        window.dispatchEvent(
          new CustomEvent('userStatusChange', { detail: statusUpdate }),
        );
      },
    );
    if (subscription) {
      this.subscriptions.set('userStatus', subscription);
    }
  }

  disconnect(isManualLogout = false): void {
    this.isManualLogout = isManualLogout;
    this.clearTimeouts();

    if (this.client?.connected) {
      this.sendUserStatus('OFFLINE');
    }

    this.cleanupConnection();
    this.removeActivityListeners();
  }

  private clearTimeouts(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  private removeActivityListeners(): void {
    this.activityListeners.forEach((removeListener) => removeListener());
    this.activityListeners.clear();
  }

  private sendUserStatus(status: UserStatus): void {
    const user = useUserStore.getState().user;
    if (!user || !this.client?.connected) return;

    this.client.publish({
      destination: '/app/status',
      body: JSON.stringify({ userId: user.userId, status }),
    });
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();
  }

  isConnected(): boolean {
    return this.connectionStatus === 'CONNECTED';
  }

  handleLogin(): void {
    this.isManualLogout = false;
    this.connect();
  }
}

export const webSocketService = new WebSocketService();
