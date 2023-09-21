"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import axios from "../utils/axios";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationContextType {
//   user: any; // Replace 'any' with your actual user type
//   token: string;
//   login: (email: string, password: string) => void;
//   logout: () => void;
//   loading: boolean;
  raiseNotification: (type: NotificationType, message:string) => void
}

// import notification from "antd/es/notification";

// type NotificationType = "success" | "info" | "warning" | "error";
// const openNotification = (
//   api: any,
//   type: NotificationType,
//   message: string,
//   details: string = ""
// ) => {
//   api[type]({
//     message: message,
//     description: details,
//   });
// };

// export default openNotification;

// const [notificationapi, notificationHolder] = notification.useNotification();


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within an NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notificationapi, notificationHolder] = notification.useNotification();

  const raiseNotification = async (type: NotificationType, message: string) => {
    // Simulate a login by setting a mock user object

        notificationapi[type]({
            message: message
        });
    };

  return (
    <NotificationContext.Provider value={{ raiseNotification }}>
      {notificationHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
