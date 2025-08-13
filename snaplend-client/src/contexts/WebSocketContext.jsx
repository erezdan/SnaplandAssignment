// src/contexts/WebSocketContext.jsx

import React, { createContext, useEffect, useState } from "react";
import AuthService from "../services/auth-service";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "../services/web-socket-service";
import { getAllUsersStatus } from "../api/users-api";
import { useToast } from "../components/ui/use-toast";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState({}); // { [userId]: { ...user } }
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const { toast } = useToast();

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(AuthService.isLoggedIn());
    };
  
    window.addEventListener("auth-change", syncLoginState);
    return () => window.removeEventListener("auth-change", syncLoginState);
  }, []);

  // Handler for incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    // Display toast for server error messages
    if (message.type === "error") {
      toast({
        title: "Server Error",
        description: message.error || "An unknown error occurred.",
        variant: "destructive",
      });
      return;
    }

    // Standard handling for user presence
    switch (message.type) {
      case "users_status":
        try {
          const updatedUsers = {};
          for (const user of message.users) {
            updatedUsers[user.id] = user;
          }
          setActiveUsers(updatedUsers);
        }
        catch (err){
          console.log("Error on getting users_status: ", err.message);
        }
        break;
        
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      disconnectWebSocket();
      return;
    }

    // Fetch all users initially
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
        } else {
          console.error("Failed to fetch users:", error);
        }
      }
    };

    fetchUsers();

    // Handlers for WebSocket lifecycle
    let reconnectToastShown = false;

    const handleOpen = () => {
      if (reconnectToastShown) {
        toast({
          title: "WebSocket Reconnected",
          description: "Reconnected to the real-time server.",
          variant: "success",
        });
      } else {
        toast({
          title: "WebSocket Connected",
          description: "Connected to the real-time server.",
          variant: "success",
        });
        reconnectToastShown = true;
      }
      console.log("WebSocket connected");
    };

    const handleClose = () => {
      toast({
        title: "WebSocket Disconnected",
        description: "Connection to the real-time server was closed.",
        variant: "destructive",
      });
      reconnectToastShown = true; // next open is reconnect
      console.log("WebSocket disconnected");
    };

    const handleError = (event) => {
      toast({
        title: "WebSocket Error",
        description: "A connection error occurred.",
        variant: "destructive",
      });
      console.error("WebSocket error", event);
    };

    connectWebSocket(handleWebSocketMessage, handleOpen, handleClose, handleError);

    return () => {
      disconnectWebSocket();
    };
  }, [isLoggedIn]);

  return (
    <WebSocketContext.Provider value={{ activeUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};
