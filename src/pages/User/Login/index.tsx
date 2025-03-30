import { Footer } from '@/components';
import { LoginForm, ProCard, ProConfigProvider } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Grid, Image, message, theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { HENU_SUBTITLE, HENU_TITLE } from '@/constants';
import { adminLoginUsingPost } from '@/services/henu-backend/adminController';
import AccountLoginPage from '@/pages/User/Login/components/AccountLoginPage';

const { useBreakpoint } = Grid;
/**
 * 登录信息页
 * @constructor
 */
const LoginPage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [redirected, setRedirected] = useState(false);
  const { token } = theme.useToken();
  const scene = useBreakpoint();
  const isMobile = !scene.md;
  // 用户登录
  const handleLoginSubmit = async (values: API.AdminLoginRequest) => {
    try {
      // 登录
      const res = await adminLoginUsingPost({
        ...values,
      });
      if (res.code === 0 && res.data) {
        // 保存已登录的用户信息
        setInitialState({
          ...initialState,
          currentAdmin: res?.data,
        });
        localStorage.setItem('henu-token', res?.data?.token || '');
        setRedirected(true);
        message.success('登录成功！');
      } else {
        message.error(`登录失败${res.message}, 请重试！`);
      }
    } catch (error: any) {
      message.error(`登录失败${error.message}, 请重试！`);
    }
  };

  // useEffect 监听 redirected 状态的变化
  useEffect(() => {
    if (redirected) {
      const urlParams = new URL(window.location.href).searchParams;
      history.replace(urlParams.get('redirect') || '/');
    }
  }, [redirected]);

  return (
    <>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '85vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ProConfigProvider hashed={false}>
          <div style={{ backgroundColor: token.colorBgContainer }}>
            <ProCard boxShadow={!isMobile} bodyStyle={{ padding: isMobile ? 0 : 24 }}>
              <LoginForm
                logo={<Image src={'/logo.png'} preview={false} width={56} />}
                title={<Typography.Title level={3}>{HENU_TITLE}</Typography.Title>}
                subTitle={<Typography.Title level={5}>{HENU_SUBTITLE}</Typography.Title>}
                containerStyle={{
                  padding: isMobile ? 0 : 24,
                }}
                onFinish={async (values) => {
                  await handleLoginSubmit(values as API.AdminLoginRequest);
                }}
              >
                <AccountLoginPage key={'account'} />
              </LoginForm>
            </ProCard>
          </div>
        </ProConfigProvider>
      </div>
      <Footer />
    </>
  );
};
export default LoginPage;
