import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
import {ResType} from 'views/constants'

const Home: React.FC<{}> = () => {

  const getData = () => {
    // 获取数据
    // axios({
    //   url: 'http://localhost:8000/posts',
    //   method: 'get',
    //   timeout: 120000
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })

    // 添加数据  传递post需要的data参数，参数不要少传，不要传错
    // axios({
    //   url: 'http://localhost:8000/posts',
    //   method: 'post',
    //   timeout: 120000,
    //   data: { title: '罗马人的故事', author: '盐野七生' }
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })

    // 修改
    // JSON server  put会将之前的对象替换，之前对象中的属性可能会消失
    // patch 会以打补丁的方式，替换需要替换字段的属性
    // 为什么只能查询字符串修改
    // axios({
    //   url: 'http://localhost:8000/posts',
    //   method: 'put',
    //   timeout: 120000,
    //   data: { id: 2, title: 'shenmoa' }
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })

    // axios({
    //   url: 'http://localhost:8000/posts/2',
    //   method: 'patch',
    //   timeout: 120000,
    //   data: {title: 'shenmoa' }
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })
    
    // 名字为post 其他表名内部关联要起名 postId ，post这个id对应的对象删除了，这个被关联的也会被删除
    // axios({
    //   url: 'http://localhost:8000/posts/1',
    //   method: 'delete',
    //   timeout: 120000,
    //   data: {title: 'shenmoa' }
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })
    
    // _embed 向下关联
    // 
    // axios({
    //   url: 'http://localhost:8000/posts?_embed=comments',
    //   method: 'get'
    //   // 缺少类型为何不报错?
    // }).then((res: ResType) => {
    //   if (res) {
    //     console.log('res', res)
    //   }
    // }).catch((err: ResType) => {
    //   console.log('err', err)
    // })
    
    // 评论关联文章 _expand 
    // 注意 comments 内必须有 postId 作为和 post 表的关联  ， post是什么名字， comments内关联的Id前缀就是什么
    axios({
      url: 'http://localhost:8000/comments?_expand=post',
      method: 'get'
      // 缺少类型为何不报错?
    }).then((res: ResType) => {
      if (res) {
        console.log('res', res)
      }
    }).catch((err: ResType) => {
      console.log('err', err)
    })
  }

  return (
    <>
      <Button type='primary' onClick={getData}>点击</Button>
    </>
  )
}

export default Home