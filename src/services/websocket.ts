import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  connect() {
    if (this.socket?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket:', WS_URL);

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('connected', (data) => {
      console.log('📡 Server confirmation:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached. Please check backend server.');
      }
    });

    this.socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    // Pong response for ping
    this.socket.on('pong', (data) => {
      console.log('🏓 Pong received:', data);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event listeners for simulation updates
  onSimulationUpdate(callback: (data: any) => void) {
    this.socket?.on('simulationUpdate', callback);
  }

  offSimulationUpdate(callback: (data: any) => void) {
    this.socket?.off('simulationUpdate', callback);
  }

  // Event listeners for DNS queries
  onDNSQuery(callback: (data: any) => void) {
    this.socket?.on('dnsQuery', callback);
  }

  offDNSQuery(callback: (data: any) => void) {
    this.socket?.off('dnsQuery', callback);
  }

  // Event listeners for metrics updates
  onMetricsUpdate(callback: (data: any) => void) {
    this.socket?.on('metricsUpdate', callback);
  }

  offMetricsUpdate(callback: (data: any) => void) {
    this.socket?.off('metricsUpdate', callback);
  }

  // Event listeners for attack events
  onAttackEvent(callback: (data: any) => void) {
    this.socket?.on('attackEvent', callback);
  }

  offAttackEvent(callback: (data: any) => void) {
    this.socket?.off('attackEvent', callback);
  }

  // Send ping to server
  ping() {
    if (this.socket?.connected) {
      console.log('🏓 Sending ping...');
      this.socket.emit('ping');
    } else {
      console.warn('⚠️ Cannot ping: WebSocket not connected');
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Singleton instance
const websocketService = new WebSocketService();

export default websocketService;