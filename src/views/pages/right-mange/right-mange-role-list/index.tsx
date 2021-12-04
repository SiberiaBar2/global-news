import React, { useState, useEffect, Fragment, ReactElement } from 'react'
import axios from 'axios'
import { Table, Modal, Button, Tree } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ResType } from 'views/constants'
import { type } from 'os';
// Record 专注于对象和数组的键与键值
// interface CommonType {
//   list: Record<number, unknown>[] // 键值为number ，值类型为unknow, 指定对象或数组的键值与键值的类型
// }
// const data: CommonType = {
//   list: ['11'] // 为什么不报错？
// }

interface CommonType {
  list: Record<string, unknown>[]
}
const data: CommonType = {
  list: [{
    name: 'Eric', //  key 的键是string ，值为unknow
    age: 18,
    sex: '男'
  }]
}
// type TypeAll = 'name' | 'age' | 'sex'
// interface CommonType {
//   list: Record<TypeAll, unknown> // 键值为string ，值类型为unknow
// }
interface OtherType {
  name: string,
  age: number,
  sex: string
}
// const data: CommonType = {
//   list: {
//     name: '承一',
//     age: 27,
//     sex: '男',
//     // npx: 1 // 多一个属性，报错
//   } 
// }
// console.log('data.list', data.list[0].age)
// console.log('lisss', data.list.name)

// 所有类型的变量都可以赋值给unknow的变量
let uncertain: unknown = 'Hello'!;

uncertain = 12;
uncertain = { hello: () => 'Hello!' };
// console.log('uncertain', uncertain)


// 不能将类型“unknown”分配给类型“string”
// let notSure: string = uncertain;

// unknow类型的变量只能赋值给any 或 unknow 
let notSure: any = uncertain;
// console.log('notSure', notSure)


type Colmnustype = {
  title: string,
  dataIndex: string,
  render?: (value: string, record: any) => ReactElement
}


const RoleList: React.FC<{}> = () => {
  const [roleData, setRoleData] = useState([])
  const [treeData, setTreeData] = useState([])
  const [currentRights, setCurrentRights] = useState<{
    checked: React.Key[];
    halfChecked: React.Key[];
  } | React.Key[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  useEffect(() => {
    axios({
      url: 'http://localhost:5000/roles',
      method: 'get'
    })
      .then((res: ResType) => {
        console.log('res', res)
        if (res.status === 200) {
          const list = res.data
          setRoleData(list)
        }
      })
      .catch((err: ResType) => {
        throw err
      })
    axios({
      url: 'http://localhost:5000/rights?_embed=children',
      method: 'get'
    })
      .then((res: ResType) => {
        console.log('树形', res)
        if (res.status === 200) {
          const list = res.data
          setTreeData(list)
        }
      })
      .catch((err: ResType) => {
        throw err
      })
  }, [])

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCheck = (checkedKeys: {
    checked: React.Key[];
    halfChecked: React.Key[];
  } | React.Key[]) => {
    console.log('onCheck', checkedKeys);
    setCurrentRights(checkedKeys)
  };
  const columns: Colmnustype[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      dataIndex: 'todo',
      render: (todo: string, record) => {
        return <Fragment>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
          />
          <Button
            type="primary"
            shape="circle"
            onClick={() => {
              setIsModalVisible(true);
              setCurrentRights(record.rights)
            }}
            icon={<EditOutlined />} />
        </Fragment>
      }
    }
  ];

  const tableConfig = {
    dataSource: roleData,
    columns: columns,
    pagination: { pageSize: 5 },
    rowKey: (record: any) => record.id
  };
  const modalConfig = {
    title: '分配权限',
    visible: isModalVisible,
    onOk: handleOk,
    onCancel: handleCancel
  };
  const treeConfig = {
    checkable: true as true,
    onCheck: onCheck,
    checkStrictly: true as true,  // 取消什么关联来着？
    checkedKeys: currentRights,   // checkedKeys 受控的，default 只有第一次生效
    treeData: treeData
  };
  
  return (
    <Fragment>
      {/* {data.list.map(item => {
        return ( // unknow必须使用类型收缩，否则无法使用
          <div key={typeof item.age === 'number' ? item.age : null}>{typeof item.name === 'string' && item.name}</div>
        )
      })} */}
      <Table {...tableConfig} />
      <Modal {...modalConfig}>
        <Tree {...treeConfig} />
      </Modal>
    </Fragment>
  )
}

export default RoleList