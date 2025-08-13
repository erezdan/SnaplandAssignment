// src/services/web-socket-service.js

import AuthService from "./auth-service";

let socket = null;

export function connectWebSocket(onMessage, onOpen, onClose, onError) {
  const token = AuthService.getToken();
  if (!token) {
    console.warn("Missing token. Cannot open WebSocket.");
    return;
  }

  const port = process.env.REACT_APP_WS_BASE;
  const wsUrl = `${port}?token=${token}`;

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    // Always send "user:active" after connecting
    socket.send(JSON.stringify({ type: "user:active" }));

    if (onOpen) {
      onOpen();
    } else {
      console.log("WebSocket connected");
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };
  socket.onclose = onClose || (() => console.log("WebSocket disconnected"));
  socket.onerror = onError || ((err) => console.error("WebSocket error", err));
}

export function sendMessage(type, payload) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, payload }));
  } else {
    console.warn("WebSocket is not open. Message not sent:", { type, payload });
  }
}

export function disconnectWebSocket() { 
  if (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "user:inactive" }));
    }
    
    socket.close();
    socket = null;
  }
}

export function getWebSocketInstance() {
  return socket;
}
