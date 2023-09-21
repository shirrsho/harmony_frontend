'use client'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import type { MenuProps } from 'antd';
  import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import Topbar from '../components/topbar';
import Projects from './page';
import Title from 'antd/es/typography/Title';
import { useRouter } from 'next/navigation';
  
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
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Tom', '3'),
      getItem('Bill', '4'),
      getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
  ];
  
  const App = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer },
    } = theme.useToken();

    const router = useRouter()

    const handleMenu = (e:any) => {
      console.log(e);
      
      if(e === 1) router.push('/project')
      if(e === 2) router.push('/')
    }
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
      <Topbar />
        <Sider className='pt-24' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={(e)=>handleMenu(e.key)}/>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px', paddingTop:'100px' }}>
              <Header
            style={{
              padding: 10,
              paddingLeft: "30px",
              background: colorBgContainer,
            }}
          >
            <Title level={3}>Projects</Title>
          </Header>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };
  
  export default App;