"use client";
import React from "react";

import { ConfigProvider } from "antd";

import { QueryClient, QueryClientProvider } from "react-query";

import theme from "../theme/themeConfig";
import NotificationProvider from "../contexts/notification.context";


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
