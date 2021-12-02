import React, { Fragment, Suspense } from 'react'
import { Layout, Spin } from 'antd';

import Navabar from 'views/component/Navabar'
import TopHeader from 'views/component/TopHeader'
import { routes, Routers } from 'router'
import RouterView from 'router/RouterView'

import './index.css'

const { Content } = Layout;
const Layouts: React.FC<{}> = () => {

  // 必须加 [] ? 不必须！
  // ts 会对当前取得的值推断类型，如果这个类型之前被赋予了相关的接口类型，就会推断出该类型，并且还会根据数组不同层级的类型来推断

  // 待定问题 undefined find 找不到就是undefined
  // const secondRouter = routes.find(item => item.hasOwnProperty('children') ) 
  // const child = secondRouter.children
  const secondRouter = routes[2].children
  console.log('secondRouter', secondRouter)
  return (
    <Fragment>
      <Layout>
        <Navabar />
        <Layout className="site-layout">
          <TopHeader />
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow: 'auto'
            }}
          >
            <Suspense fallback={<div style={{ textAlign: 'center' }}><Spin size="large" /></div>}>
              <RouterView routerList={secondRouter} />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  )
}

export default Layouts