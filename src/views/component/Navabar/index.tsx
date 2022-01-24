import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import cx from 'classnames'
import {
  UserOutlined
} from '@ant-design/icons'
import { ResType } from 'views/constants'
import './index.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

interface iconType {
  [propsname: string]: JSX.Element
}

const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/right-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />,
  '/news-manage': <UserOutlined />,
  '/news-manage/add': <UserOutlined />,
  '/news-manage/draft': <UserOutlined />,
  '/news-manage/category': <UserOutlined />,
  '/audit-manage': <UserOutlined />,
  '/audit-manage/audit': <UserOutlined />,
  '/audit-manage/list': <UserOutlined />,
  '/publish-manage': <UserOutlined />,
  '/publish-manage/unpublished': <UserOutlined />,
  '/publish-manage/published': <UserOutlined />,
  '/publish-manage/sunset': <UserOutlined />,
} as iconType
// interface menuType {
//   key: string,
//   title: string
//   icon: JSX.Element,
//   children?: menuType[]
// }
// 不会指定类型，就先不写类型，等他推断
// const menuList: menuType[] = [
//   {
//     key: '/home',
//     icon: <UserOutlined />,
//     title: '首页'
//   },
//   {
//     key: '/user-manage',
//     title: '用户管理',
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: '/user-manage/list',
//         title: '用户列表',
//         icon: <UserOutlined />
//       }
//     ]
//   },
//   {
//     key: '/right-manage',
//     title: '权限管理',
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: '/right-manage/role/list',
//         title: '角色列表',
//         icon: <UserOutlined />
//       },
//       {
//         key: '/right-manage/right/list',
//         title: '权限列表',
//         icon: <UserOutlined />
//       },
//     ]
//   },
// ]
// 泛型接口
// interface Generic<T> {
//   num: T,
//   config?: string
// }
// interface Props extends Generic<menuType> { }

// 如何为一个空对象赋值  let obj = {} as interface接口

const Navabar: React.FC<{}> = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const nowLoactionRef = useRef('/home')
  const [menu, setMenu] = useState<ResType[]>([]) // 数组类型一定在interface 后面加上[]

  let navigate = useNavigate();
  let nowLoacll = sessionStorage.getItem('nowloaction') as string // 解决不能将类型“string | null”分配给类型“string”
  useEffect(() => {
    console.log('nowLoacll', nowLoacll)
    axios({
      url: 'http://localhost:5000/rights?_embed=children',
      method: 'get'
    })
      .then((res: ResType) => {
        // console.log('res', res)
        if (res.status === 200) {
          setMenu(() => {
            return res.data
          })
        }
      })
      .catch((err: ResType) => {
        throw err
      })
  }, [])
  // 为什么render函数这里必须再次指定类型？ 因为需要指定函数参数
  const getNeedRender = (item: ResType) => {
    return item.pagepermisson === 1
  }
  const renderMenu = (menuList: ResType[]) => {
    return menuList.map(item => {  // item.children?.length 牛逼写法
      if (item.children?.length && getNeedRender(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title} >
          {renderMenu(item.children)}
        </SubMenu>
      }

      return (
        getNeedRender(item) &&
        <Menu.Item
          key={item.key}
          icon={iconList[item.key]}
          title={item.title}
          onClick={() => {
            nowLoactionRef.current = item.key
            sessionStorage.setItem('nowloaction', item.key)
            navigate(`/layout${item.key}`)
          }}>
          {item.title}
        </Menu.Item>
      )
    })
  }

  // {/*  
  //         没有返回值的错误：
  //         第 1 个重载(共 2 个)，“(props: MenuProps | Readonly<MenuProps>): Menu”，出现以下错误。
  //         不能将类型“void”分配给类型“ReactNode”。
  //         第 2 个重载(共 2 个)，“(props: MenuProps, context: any): Menu”，出现以下错误。
  //         不能将类型“void”分配给类型“ReactNode”。ts(2769) 
  //         函数调用中加上return解决
  //         */}
  // {renderMenu(menu)}

  // !初始展开的 SubMenu 菜单项 key 数组 初始展开，用ref组件重渲会再次被赋值
  let openKeys = ['/' + nowLoacll?.split('/')[1]]
  return (
    <Fragment>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ display: 'flex', height: "100%", flexDirection: 'column' }}>
          <div className={cx('logo')} >全球新闻发布管理系统</div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {/* {console.log('nowLoactionRef', nowLoactionRef.current)} */}
            <Menu theme="dark" mode="inline" selectedKeys={[nowLoacll]} defaultOpenKeys={openKeys}>
              {renderMenu(menu)}
            </Menu>
          </div>
        </div>
      </Sider>
    </Fragment>
  )
}

export default Navabar