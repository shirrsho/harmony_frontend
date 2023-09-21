import "./globals.css";

import { Inter } from "next/font/google";
// import StyledComponentsRegistry from "./lib/AntdRegistry";
import { Metadata } from "next";
import React from "react";
import { ConfigProvider } from "antd";
import theme from "./theme/themeConfig";
import CustomFooter from "./components/Footer";
import Providers from "./components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmony",
  description: "Conflict detection in software requirements!",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ConfigProvider theme={theme}>
          <Providers>
          {children}
          </Providers>
        <CustomFooter/>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
