import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { ResType } from 'views/constants'

const RoleList: React.FC<{}> = () => {

  useEffect(() => {
    axios({
      url: 'http://localhost:5000/roles',
      method: 'get'
    })
      .then((res: ResType) => {
        console.log('res', res)
        if (res.status === 200) {
          const list = res.data
          list.forEach((item: any) => {  // forEach操作外部数据
            if (item.children?.length === 0) {
              list[0].children = ''
            }
          })
          // setTableData(() => {
          //   return list
          // })
        }
      })
      .catch((err: ResType) => {
        throw err
      })
  }, [])
  return (
    <Fragment>RoleList</Fragment>
  )
}

export default RoleList