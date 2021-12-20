import React, { useState, useEffect, Fragment, ReactElement } from 'react'
import axios from 'axios'
import { Table, Modal, Button, Tree } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ResType } from 'views/constants'
import { ListType } from '../rigth'
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

interface RoleType {
  id: number,
  rights: Keytype | React.Key[]
  roleName: string
  roleType: number
}


interface TreeType {
  children: []
  grade: number
  id: number
  key: string
  pagepermisson: number
  title: string
}

interface Sectype extends Pick<TreeType, 'grade' | 'id' | 'key'> {
  rightId: number,
  title: string
}

interface Keytype {
  checked: React.Key[];
  halfChecked: React.Key[];
}


const RoleList: React.FC<{}> = () => {
  const [roleData, setRoleData] = useState<RoleType[]>([])
  const [treeData, setTreeData] = useState<TreeType[]>([])
  const [curId, setCurId] = useState<number>(0)
  const [currentRights, setCurrentRights] = useState<Keytype | React.Key[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  // const [currentId, setCurrentId] = useState<number>(0)
  useEffect(() => {
    axios({
      url: 'http://localhost:5000/roles',
      method: 'get'
    })
      .then((res: ResType) => {
        console.log('res', res)
        if (res.status === 200) {
          const list = res.data
          console.log('list', list)
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
    setRoleData(roleData.map(item => {
      if (item.id === curId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }));
    // 同步后端
    axios.patch(`http://localhost:5000/roles/${curId}`, {
      rights: currentRights
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onCheck = (checkedKeys: Keytype | React.Key[]) => {
    console.log('onCheck', checkedKeys); // 为什么写成接口，就是check的值了
    setCurrentRights((checkedKeys as Keytype).checked)
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
              setCurId(record.id)
              setCurrentRights(record.rights)
              // setCurrentId(record.id)
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
    onCheck: onCheck as (checkedKeys: Keytype | React.Key[]) => void,
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