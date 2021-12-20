/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect, Fragment, ReactElement } from 'react'
import axios from 'axios'
import { Table, Tag, Modal, Button, Switch } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ResType } from 'views/constants'

const { confirm } = Modal;


// grade: 2
// id: 3
// key: "/user-manage/add"
// rightId: 2
// title: "添加用户"

export interface ListType {
  children: ListItemType[] | string
  grade: number
  id: number
  pagepermisson: number
  title: string,
}

interface ListItemType extends Pick<ListType, 'grade' | 'id' | 'title'> {
  rightId: number,
  [props:string]: any
}

interface ColumnsType<T, U, K> {
  title: T,
  dataIndex: T,
  render?: (value: T, record: U) => ReactElement // 或 JSX.Element // 有的地方缺少参数为什么不报错？
}

interface RoleType { 
    "id": number,
    "roleName": string,
    "roleType": number,
    "rights": string[]
}

const UserList: React.FC<{}> = () => {

  const [tableData, setTableData] = useState<(ListType)[]>([])

  useEffect(() => {
    axios({
      url: 'http://localhost:5000/users?_expand=role',
      method: 'get'
    })
      .then((res: ResType) => {
        console.log('res', res)
        if (res.status === 200) {
          const list = res.data as ListType[]
          list.forEach(item => {  // forEach操作外部数据
            if (item.children?.length === 0) {
              list[0].children = ''
            }
          })
          setTableData(() => {
            return list
          })
        }
      })
      .catch((err: ResType) => {
        throw err
      })
  }, []);

  const deleteMethod = (item: ListType | ListItemType) => {
    console.log('item', item)

  };
  const handelConfilm = (item: ListType | ListItemType) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns: ColumnsType<string | boolean | any, ListType | ListItemType, number>[] = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region ? region : '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, record) => {
        return <Switch checked={roleState} disabled={(record as ListItemType).default}></Switch>
      }
    },
    {
      title: '操作', 
      dataIndex: 'todo',
      render: (todo, record) => {
        return <Fragment>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={(record as ListItemType).default}
            onClick={() => handelConfilm(record)} />
          <Button
            type="primary"
            shape="circle"
            disabled={(record as ListItemType).default}
            icon={<EditOutlined />} />
        </Fragment>
      }
    },
  ];

  const tableConfig = {
    dataSource: tableData,
    columns: columns,
    pagination: { pageSize: 5 },
    rowKey: (item: any) =>item.id
  }

  return (
    <Fragment>
      <Table {...tableConfig} />
    </Fragment>
  )
}

export default UserList