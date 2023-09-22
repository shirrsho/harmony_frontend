'use client'
import {
    DesktopOutlined,
    FileOutlined,
    FileSyncOutlined,
    PieChartOutlined,
    SmileOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import type { MenuProps } from 'antd';
  import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import Projects from './page';
import Title from 'antd/es/typography/Title';
import { useRouter } from 'next/navigation';
import Providers from './components/Provider';
import CustomFooter from './components/Footer';
import Topbar from './components/topbar';
import './globals.css'
  
  const { Header, Content, Footer, Sider } = Layout;
  
  type MenuItem = Required<MenuProps>['items'][number];
  
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  
  const items: MenuItem[] = [
    getItem('Annalyis', '1', <PieChartOutlined />),
    getItem('Projects', '2', <DesktopOutlined />),
    // getItem('User', 'sub1', <UserOutlined />, [
    //   getItem('Tom', '3'),
    //   getItem('Bill', '4'),
    //   getItem('Alex', '5'),
    // ]),
    getItem('Contribute', '3', <TeamOutlined />),
    getItem('Methodology', '4', <FileSyncOutlined />),
    getItem('Sponsor', '5', <SmileOutlined />),
  ];
  
  const App = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorPrimary, colorBgContainer },
    } = theme.useToken();

    const router = useRouter()

    const handleMenu = (e:any) => {
      console.log(e);
      
      if(e == 2) router.push("/project")
      if(e == 1) router.push('/')
    }
  
    return (
      <html lang="en">
      <body style={{ maxHeight: '100vh' }}>
      <Providers>
      <Layout style={{ minHeight: '100vh' }}>
      <Topbar />
        <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        theme="dark"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        color={colorPrimary}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ marginTop: "1vh", paddingTop:'14vh' }} >
          {/* <div className="demo-logo-vertical" >Logo</div> */}
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={(e)=>handleMenu(e.key)} style={{marginBottom:'45vh'}}/>
          <CustomFooter/>
        </Sider>
        <Layout>
          <Content style={{ margin: '5vh', paddingTop:'10vh' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
      </Providers>
      </body>
      </html>
    );
  };
  
  export default App;