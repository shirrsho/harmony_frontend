'use client'
  import { Layout } from 'antd';
  
  const App = ({ children }: { children: React.ReactNode }) => {
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
          {children}
      </Layout>
    );
  };
  
  export default App;