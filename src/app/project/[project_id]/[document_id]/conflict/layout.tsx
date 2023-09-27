'use client'
import { Layout, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
  
  const App = ({ children }: { children: React.ReactNode }) => {
    const {
      token: { colorPrimary, colorBgContainer },
    } = theme.useToken();

    return (
      <Layout style={{ minHeight: '100vh' }}>
                      {/* <Header
                style={{
                  padding: 10,
                  paddingLeft: "30px",
                  background: colorBgContainer,
                }}
              >
              <Title level={3}>Projects</Title>
            </Header> */}
          {children}
      </Layout>
    );
  };
  
  export default App;