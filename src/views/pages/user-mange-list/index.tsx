/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect, Fragment, ReactElement, useRef, MutableRefObject } from 'react'
import axios from 'axios'
import { Table, Tag, Modal, Button, Switch } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ResType } from 'views/constants'
import UserForm from 'views/component/UserForm';

const { confirm } = Modal;
<<<<<<< HEAD
=======

// grade: 2
// id: 3
// key: "/user-manage/add"
// rightId: 2
// title: "添加用户"

>>>>>>> 4c0b3272b92a6f8c40846e5c7c55c07ec7b93425
export interface ListType {
  children: ListItemType[] | string
  grade: number
  id: number
  pagepermisson: number
  title: string,
}

interface ListItemType extends Pick<ListType, 'grade' | 'id' | 'title'> {
  rightId: number,
  [props: string]: any
}

interface ColumnsType<T, U, K> {
  title: T,
  dataIndex: T,
  render?: (value: T, record: U) => ReactElement // 或 JSX.Element // 有的地方缺少参数为什么不报错？
}

interface RoleType {
<<<<<<< HEAD
  id: number,
  roleName: string,
  roleType: number,
  rights: string[]
=======
  "id": number,
  "roleName": string,
  "roleType": number,
  "rights": string[]
>>>>>>> 4c0b3272b92a6f8c40846e5c7c55c07ec7b93425
}

interface RegionType {
  id: number,
  title: string,
  value: string
}
interface RoleType {
  id: number,
  roleName: string,
  roleType: number,
  rights: string[]
}
export interface UserFormType { // 传的什么类型，子组件接收就是什么类型
  regionList: RegionType[]
  roleList: RoleType[]
}

const UserList: React.FC<{}> = () => {

  const [tableData, setTableData] = useState<(ListType)[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [regionList, setRegionList] = useState<RegionType[]>([]);
  const [roleList, setRoleList] = useState<RoleType[]>([]);
  const userFormRef: MutableRefObject<any> = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.error('userFormRef', userFormRef)
    userFormRef.current.validateFields()
      .then((value: any) => {
        console.log('value', value)
        setIsModalVisible(false);

        axios.post('http://localhost:5000/users', {
          ...value,
          roleState: true,
          default: false,
        })
          .then((res: any) => {
            console.log('res.dtat', res.data)
            setTableData([...tableData, res.data]);
          })
      })
      .catch((err: any) => {
        console.log('err', err)
      })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  useEffect(() => {
    axios.get('http://localhost:5000/regions')
      .then((res: ResType) => {
        if (res.status === 200) {
          const list = res.data;
          console.log('list', list)
          setRegionList(list);
        }
      })
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then((res: ResType) => {
        if (res.status === 200) {
          const list = res.data;
          setRoleList(list);
        }
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

  const columns:
    ColumnsType<string | boolean | any,
      ListType | ListItemType,
      number
    >[] = [
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
          return role?.roleName
        }
      },
      {
        title: '用户名',
        dataIndex: 'username',
        render: (username) => {
          return <Tag color='orange'>{username}</Tag>
        }
      },
      {
        title: '用户状态',
        dataIndex: 'roleState',
        render: (roleState, record) => {
          return <Switch
            checked={roleState}
            disabled={(record as ListItemType).default}></Switch>
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
    rowKey: (item: any) => item.id
  }

  const moadlConfig = {
    title: "新增用户",
    visible: isModalVisible,
    onOk: handleOk,
    onCancel: handleCancel
  }

  const userFormConfig = {
    regionList,
    roleList
  }

  return (
    <Fragment>
      <Button
        type='primary'
        onClick={showModal}>
        新增
      </Button>
      <Table {...tableConfig} />
      <Modal {...moadlConfig}>
        <UserForm
          {...userFormConfig}
          ref={userFormRef}
        />
      </Modal>
    </Fragment>
  )
}

export default UserList