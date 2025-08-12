// src/contexts/WebSocketContext.jsx

import React, { createContext, useEffect, useState } from "react";
import AuthService from "../services/auth-service";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "../services/web-socket-service";
import { getAllUsersStatus } from "../api/users-api";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState({}); // { [userId]: { ...user } }

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case "user_joined":
      case "user_updated":
        setActiveUsers((prev) => ({
          ...prev,
          [message.user.id]: { ...prev[message.user.id], ...message.user, isActive: true },
        }));
        break;

      case "user_left":
        setActiveUsers((prev) => {
          const updated = { ...prev };
          if (updated[message.userId]) {
            updated[message.userId].isActive = false;
          }
          return updated;
        });
        break;

      default:
        break;
    }
  };

  // Initial fetch + connect WebSocket
  useEffect(() => {
    // Skip fetch if user is not authenticated
    const token = AuthService.getToken();
    if (!token) return;

    // Fetch all users and store them in state
    const fetchUsers = async () => {
      try {
        const users = await getAllUsersStatus();
        const mappedUsers = {};
        users.forEach((u) => {
          mappedUsers[u.id] = u;
        });
        setActiveUsers(mappedUsers);
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn("Unauthorized: User is not authenticated.");
          // Optionally trigger login modal here
        } else {
          console.error("Failed to fetch users:", error);
        }
      }
    };

    fetchUsers();

    // Connect to WebSocket for live updates
    connectWebSocket(handleWebSocketMessage);

    return () => {
      // Cleanup WebSocket connection
      disconnectWebSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ activeUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};
