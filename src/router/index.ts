import React from 'react'

const Login = React.lazy(() => import('views/login'))
const Layout = React.lazy(() => import('views/Layout'))

const Home = React.lazy(() => import('views/pages/home'))

const UserMangeList = React.lazy(() => import('views/pages/user-mange-list'))

const RoleList = React.lazy(() => import('views/pages/right-mange/right-mange-role-list'))
const RigthList = React.lazy(() => import('views/pages/right-mange/rigth'))

export type Routers = {
  path: string,
  component: React.FC,
  exact?: boolean,
  children: CommonRouter[]
}

// 如果一个类型要在后面使用 解构或者在这个对象上点的方式，那么这个属性后面一定不能加？  就比如layout拿这个 children
// layout 组件报错 ; 不能将类型“CommonRouter[] | undefined”分配给类型“(Routers | CommonRouter)[]”。
// 不能将类型“undefined”分配给类型“(Routers | CommonRouter)[]
export type CommonRouter = Pick<Routers, 'path' | 'component' | 'exact'>

// 为了兼顾包含和不包含二级路由的情况，使用元组对数组进行严格指定
export const routes: [
  CommonRouter,
  CommonRouter,
  Routers] = [
    {
      path: '/',    // 默认页面，相当于重定向
      component: Login,
      exact: true
    },
    {
      path: 'login',  // 为什么按路径却出不来  ，因为 http://localhost:3000/#/login 前没加#号
      component: Login,
      exact: false
    },
    {
      path: 'layout',  // 加不加/都一样
      component: Layout,
      exact: false,
      children: [
        {
          path: 'home',
          component: Home,
          exact: false
        },

        // /user-manage
        {
          path: 'user-manage/list',
          component: UserMangeList,
          exact: false
        },

        // /right-manage 权限管理 

        {
          path: 'right-manage/role/list',
          component: RoleList,
          exact: false
        },
        {
          path: 'right-manage/right/list',
          component: RigthList,
          exact: false
        },
      ]
    },
  ]
