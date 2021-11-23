import React, { useState, Fragment } from 'react'
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import cx from 'classnames'
import {
  UserOutlined
} from '@ant-design/icons'
import './index.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

interface menuType {
  key: string,
  title: string
  icon: JSX.Element,
  children?: menuType[]
}
// 不会指定类型，就先不写类型，等他推断
const menuList: menuType[] = [
  {
    key: '/home',
    icon: <UserOutlined />,
    title: '首页'
  },
  {
    key: '/user-manage',
    title: '用户管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/user-manage/list',
        title: '用户列表',
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/right-manage',
    title: '权限管理',
    icon: <UserOutlined />,
    children: [
      {
        key: '/right-manage/role/list',
        title: '角色列表',
        icon: <UserOutlined />
      },
      {
        key: '/right-manage/right/list',
        title: '权限列表',
        icon: <UserOutlined />
      },
    ]
  },
]
// 泛型接口
// interface Generic<T> {
//   num: T,
//   config?: string
// }
// interface Props extends Generic<menuType> { }

const Navabar: React.FC<{}> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  let navigate = useNavigate();

  // 为什么render函数这里必须再次指定类型？ 因为需要指定函数参数
  const renderMenu = (menuList: menuType[]) => {
    return menuList.map(item => {
      if (item.children) {
        return <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          title={item.title}
          onClick={() => {
            navigate(`/layout${item.key}`)
          }}>
          {item.title}
        </Menu.Item>
      )
    })
  }
  return (
    <Fragment>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={cx('logo')} >全球新闻发布管理系统</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          {/*  
          没有返回值的错误：
          第 1 个重载(共 2 个)，“(props: MenuProps | Readonly<MenuProps>): Menu”，出现以下错误。
          不能将类型“void”分配给类型“ReactNode”。
          第 2 个重载(共 2 个)，“(props: MenuProps, context: any): Menu”，出现以下错误。
          不能将类型“void”分配给类型“ReactNode”。ts(2769) 
          函数调用中加上return解决
          */}
          {renderMenu(menuList)}
        </Menu>
      </Sider>
    </Fragment>
  )
}

export default Navabar