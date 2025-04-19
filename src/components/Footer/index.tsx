import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import { HENU_IPC, HENU_URL, HEUN_DEFAULT_MESSAGE } from '@/constants';

const Footer: React.FC = () => {
  const defaultMessage = HEUN_DEFAULT_MESSAGE;
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${defaultMessage} ${currentYear}`}
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'LEARNING_IPC',
          title: HENU_IPC,
          href: HENU_URL,
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
