import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { ProFormText } from '@ant-design/pro-components';

/**
 * 登录页面
 * @constructor
 */
const AccountLoginPage: React.FC = () => (
  <>
    {/* 用户注册填写的表单 */}
    <ProFormText
      name="adminNumber"
      fieldProps={{
        size: 'large',
        prefix: <UserOutlined />,
      }}
      placeholder={'请输入账号'}
      rules={[
        {
          required: true,
          message: '请输入合法账号！',
        },
      ]}
    />
    <ProFormText.Password
      name="adminPassword"
      fieldProps={{
        size: 'large',
        prefix: <LockOutlined />,
      }}
      placeholder={'请输入密码'}
      rules={[
        {
          required: true,
          message: '请输入合法身份密码！',
        },
      ]}
    />
  </>
);

export default AccountLoginPage;
