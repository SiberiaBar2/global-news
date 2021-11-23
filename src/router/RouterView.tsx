import { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Routers, CommonRouter } from './index'
import Login from 'views/login'


type View = {
  // 为了 兼容一级和二级路由，view得到的类型不同，这里必须使用联合类型！！
  // 传过来值的地方 要和接收值的地方的值类型一致！
  routerList: (CommonRouter | Routers)[]    // Routers后面不写[] 会报  ：类型“Routers[]”缺少类型“Routers”中的以下属性: path, componentts(2739)
}

const RouterView = ({
  routerList
}: View) => {  // ts 必须为props 接收的每一个属性指定类型！！
  // `${item.path}/*`  v6 二级路由

  return (
    <Fragment>
      <Routes>
        {routerList.map((item) => {
          if (!sessionStorage.getItem('token')) {
            return <Route key={item.path} path={item.path} element={< Login />} />
          }
          if (item.hasOwnProperty('children')) {
            return <Route key={item.path} path={`${item.path}/*`} element={<item.component />} />
          }
          return <Route key={item.path} path={item.path} element={< item.component />} />
        })}
      </Routes>
    </Fragment>
  )
}

export default RouterView