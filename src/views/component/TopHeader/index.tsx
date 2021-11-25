import React, { useState, Fragment } from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const TopHeader: React.FC<{}> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const collapsedChange = () => {
    setCollapsed(!collapsed)
  }

  const menu = (
    <Menu>
      <Menu.Item key='1'> 超级管理员</Menu.Item>
      <Menu.Item key='2' danger>退出</Menu.Item>
    </Menu>
  );

  return (
    <Fragment>
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
        {collapsed ? <MenuUnfoldOutlined onClick={collapsedChange} />
          : <MenuFoldOutlined onClick={collapsedChange} />}
        <div style={{ float: 'right' }}>
          <span>欢迎admin回来</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    </Fragment>
  )
}

export default TopHeader