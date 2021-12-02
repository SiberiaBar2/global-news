/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect, Fragment, ReactElement } from 'react'
import axios from 'axios'
import { Table, Tag, Modal, Button, Popover, Switch } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ResType } from 'views/constants'

const { confirm } = Modal;


// grade: 2
// id: 3
// key: "/user-manage/add"
// rightId: 2
// title: "添加用户"

interface ListType {
  children: ListItemType[] | string
  grade: number
  id: number
  key: string
  pagepermisson: number
  title: string,
  rightId?: number // 先耍个赖
}

interface ListItemType extends Pick<ListType, 'grade' | 'id' | 'key' | 'title'> {
  rightId: number
}

interface ColumnsType<T, U, K> {
  title: T,
  dataIndex: T,
  key: T,
  render?: (value: T, record: U) => ReactElement // 或 JSX.Element // 有的地方缺少参数为什么不报错？
}

const RigthList: React.FC<{}> = () => {

  const [tableData, setTableData] = useState<(ListType)[]>([])

  useEffect(() => {
    axios({
      url: 'http://localhost:5000/rights?_embed=children',
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

  const deleteMethod = (item: ListType) => {
    console.log('item', item)
    if (item.id === 1) {
      setTableData(() => {
        return tableData.filter(data => data.id !== item.id)
      })
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      console.log('item.id', item.rightId)
      let lists = tableData.filter(data => data.id === item.rightId)
      lists[0].children = Array.isArray(lists[0].children) // lists[0].children as ListItemType[]  // 不知为何这种方式没用？？
        ? lists[0].children.filter(data => data.id !== item.id)  //若不 Array.isArray ，报错 string 不存在 filter方法
        : []

      // 这边需要注意，filter类似于浅拷贝二级数据被真实拷贝，第二点react只对比一级数据，因此set新的数组才能识别???
      setTableData([...tableData]) // 必须要以这样的方式来更新一级下的
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  };
  const handelConfilm = (item: ListType) => {
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

  const checkChange = (item: ListType) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1  // 为什么不呢个直接赋值
    setTableData([...tableData])  // 为什么可以这样改，引用类型一改全改是什么意思

    // 同步后端
    if (item.grade === 1) { // 一级
      axios.patch(`http://localhost:5000/rights/${item.id}`, { // 补丁请求
        pagepermisson: item.pagepermisson
      })
    } else {     // 二级
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  };

  const columns: ColumnsType<string, ListType, number>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'key',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'key'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => { // 这里函数的类型是string, 在初始指定类型时也要给类型的形参指定类型
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: 'todo',
      key: 'todo',
      render: (todo: string, record) => { // 这里函数的类型是string, 在初始指定类型时也要给类型的形参指定类型 
        // record: U  render的参数加？就无法赋值，不能将undefined赋值
        return <Fragment>
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => handelConfilm(record)} />
          <Popover
            content={<div style={{ textAlign: 'center' }} >
              <Switch checked={record.pagepermisson === 1}
                onChange={() => checkChange(record)} />
            </div>} title="配置项"
            trigger={record.pagepermisson === undefined ? '' : 'click'}>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={record.pagepermisson === undefined} />
          </Popover>
        </Fragment>
      }
    },
  ];

  // const getMaxTableHeight = () => {
  //   const tableElement = document.querySelector('.common-table') as Element
  //   return tableElement.offsetHeight < 400 ?
  //     tableElement.offsetHeight 
  // }


  const tableConfig = {
    className: "common-table",
    dataSource: tableData,
    columns: columns,
    pagination: { pageSize: 5 }
  }

  return (
    <Fragment>
      {/* scroll={{ y: getMaxTableHeight() }} */}
      <Table {...tableConfig} />
    </Fragment>
  )
}

export default RigthList