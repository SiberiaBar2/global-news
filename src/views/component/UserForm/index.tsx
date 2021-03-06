import React, { memo, forwardRef, useState } from 'react';
import { Form, Input, Select } from 'antd'
import { UserFormType } from 'views/pages/user-mange-list'
const { Option } = Select;


const UserForm = (props: UserFormType, ref: any) => {
  const {
    regionList,
    roleList
  } = props;
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const rolesChaneg = (value: number) => {
    if (value === 1) {
      setIsDisable(true);
      ref.current.setFieldsValue({
        region: ''
      })
    }
    else {
      setIsDisable(false);
    }
  }

  return <>
    <Form
      ref={ref}
      layout='vertical' // label 和input是否同行显示
    >
      <Form.Item
        name='username'
        label="用户名"
        rules={[{
          required: true,
          message: 'please input the value'
        }]} // 校验这里也是可以写正则的
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='password'
        label="密码"
        rules={[{
          required: true,
          message: 'please input the value'
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='region'
        label="区域"
        rules={isDisable// 禁用没有校验
          ? []
          : [{
            required: true,
            message: 'please input the value'
          }]}
      >
        <Select
          disabled={isDisable}>
          {regionList.map(item => {
            return (
              <Option
                value={item.value}
                key={item.value}>
                {item.title}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name='roleId'
        label="角色"
        rules={[{
          required: true,
          message: 'please input the value'
        }]}
      >
        <Select onChange={rolesChaneg}>
          {roleList.map(item => {
            return (
              <Option
                value={item.id}
                key={item.id}>
                {item.roleName}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  </>;
}

export default memo(forwardRef(UserForm));