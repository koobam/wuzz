// import { NitroWebSocket } from 'react-native-nitro-websockets';
// import Config from 'react-native-config';
// import { ACCESS_TOKEN_STORAGE, storage } from './storage';

// type MessageHandler = (data: string | ArrayBuffer) => void;
// type StatusHandler = () => void;
// type ErrorHandler = (error: Event) => void;

// export type WsSubscription = {
//   unsubscribe: () => void;
// };

// const getWsBaseUrl = (): string => {
//   const base = (Config as { WS_URL?: string }).WS_URL;
//   if (!base) throw new Error('Missing WS_URL in .env');
//   return base.replace(/\/$/, '');
// };

// class WuzzWebSocket {
//   private socket: NitroWebSocket | null = null;
//   private messageHandlers = new Set<MessageHandler>();
//   private openHandlers = new Set<StatusHandler>();
//   private closeHandlers = new Set<StatusHandler>();
//   private errorHandlers = new Set<ErrorHandler>();
//   private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
//   private reconnectDelay = 2000;
//   private path = '';
//   private manualClose = false;

//   connect(path: string): void {
//     this.path = path;
//     this.manualClose = false;
//     this.openSocket();
//   }

//   private openSocket(): void {
//     const token = storage.getString(ACCESS_TOKEN_STORAGE);
//     const url = `${getWsBaseUrl()}${this.path}`;

//     const headers: Record<string, string> = {};
//     if (token) headers.Authorization = `Bearer ${token}`;

//     this.socket = new NitroWebSocket(url, [], headers);

//     this.socket.onopen = () => {
//       this.reconnectDelay = 2000;
//       this.openHandlers.forEach((h) => h());
//     };

//     this.socket.onmessage = (event) => {
//       this.messageHandlers.forEach((h) => h(event.data));
//     };

//     this.socket.onerror = (event) => {
//       this.errorHandlers.forEach((h) => h(event));
//     };

//     this.socket.onclose = () => {
//       this.closeHandlers.forEach((h) => h());
//       if (!this.manualClose) this.scheduleReconnect();
//     };
//   }

//   private scheduleReconnect(): void {
//     if (this.reconnectTimer) return;
//     this.reconnectTimer = setTimeout(() => {
//       this.reconnectTimer = null;
//       this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
//       this.openSocket();
//     }, this.reconnectDelay);
//   }

//   send(data: string | object): void {
//     if (this.socket?.readyState !== 1) return;
//     const payload = typeof data === 'string' ? data : JSON.stringify(data);
//     this.socket.send(payload);
//   }

//   disconnect(): void {
//     this.manualClose = true;
//     if (this.reconnectTimer) {
//       clearTimeout(this.reconnectTimer);
//       this.reconnectTimer = null;
//     }
//     this.socket?.close();
//     this.socket = null;
//   }

//   onMessage(handler: MessageHandler): WsSubscription {
//     this.messageHandlers.add(handler);
//     return { unsubscribe: () => this.messageHandlers.delete(handler) };
//   }

//   onOpen(handler: StatusHandler): WsSubscription {
//     this.openHandlers.add(handler);
//     return { unsubscribe: () => this.openHandlers.delete(handler) };
//   }

//   onClose(handler: StatusHandler): WsSubscription {
//     this.closeHandlers.add(handler);
//     return { unsubscribe: () => this.closeHandlers.delete(handler) };
//   }

//   onError(handler: ErrorHandler): WsSubscription {
//     this.errorHandlers.add(handler);
//     return { unsubscribe: () => this.errorHandlers.delete(handler) };
//   }

//   get isConnected(): boolean {
//     return this.socket?.readyState === 1;
//   }
// }

// export const wsClient = new WuzzWebSocket();
