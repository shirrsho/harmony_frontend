'use client'
import React from "react";
import { Layout, theme } from "antd";
import Link from "next/link";

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "0.50px" }}>
        <Layout style={{ padding: "2.4px", background: colorBgContainer }}>
          <Content style={{ padding: "2.4px", minHeight: 280, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Link target={"_blank"} href={'https://github.com/shirrsho/harmony_backend'}>Go to Github</Link>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Home;
