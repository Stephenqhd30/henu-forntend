import React from 'react';
import { Modal, Select } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';

interface Props {
  onCancel: () => void;
  visible: boolean;
  user: API.UserVO;
}

/**
 * 用户详细信息 Modal 框
 * @param props
 * @constructor
 */
const UserDetailsModal: React.FC<Props> = (props) => {
  const { onCancel, visible, user } = props;
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'userPhone',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'userGender',
      valueType: 'text',
      valueEnum: userGenderEnum,
      renderFormItem: () => {
        return (
          <Select>
            <Select.Option value={UserGender.MALE}>
              {userGenderEnum[UserGender.MALE].text}
            </Select.Option>
            <Select.Option value={UserGender.FEMALE}>
              {userGenderEnum[UserGender.FEMALE].text}
            </Select.Option>
          </Select>
        );
      },
    },
  ];
  return (
    <Modal
      destroyOnClose
      title={'用户信息'}
      open={visible}
      onCancel={() => {
        onCancel?.();
      }}
      footer={null}
    >
      <ProDescriptions dataSource={user} column={1} columns={columns} />
    </Modal>
  );
};
export default UserDetailsModal;
