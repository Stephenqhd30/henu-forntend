import { LogoutOutlined, PicLeftOutlined } from '@ant-design/icons';
import { history, Link, useModel } from '@umijs/max';
import { Button } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { adminLogoutUsingPost } from '@/services/henu-backend/adminController';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentAdmin } = initialState || {};
  return <span className="anticon">{currentAdmin?.adminName}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await adminLogoutUsingPost();
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: '/',
        }),
      });
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentAdmin: undefined }));
        });
        loginOut();
        return;
      }
      history.push(`${key}`);
    },
    [setInitialState],
  );
  // 获取当前登录用户的信息
  const { currentAdmin } = initialState || {};

  // 如果用户没有登录展示一个登录框
  if (!currentAdmin) {
    return (
      <Link to={'/user/login'}>
        <Button type="primary">登录</Button>
      </Link>
    );
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'review',
            icon: <PicLeftOutlined />,
            label: '信息审核',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'review',
      icon: <PicLeftOutlined />,
      label: '信息审核',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      <span>{currentAdmin.adminName}</span>
    </HeaderDropdown>
  );
};
