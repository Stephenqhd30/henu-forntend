import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, Select } from 'antd';
import React from 'react';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';
import { updateUserUsingPost } from '@/services/henu-backend/userController';

interface Props {
  oldData?: API.User;
  onCancel: () => void;
  onSubmit: (values: API.UserUpdateRequest) => Promise<void>;
  visible: boolean;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateUserUsingPost(fields);
    if (res.code === 0 && res.data) {
      message.success('更新成功');
      return true;
    } else {
      message.error(`更新失败${res.message}, 请重试!`);
      return false;
    }
  } catch (error: any) {
    message.error(`更新失败${error.message}, 请重试!`);
    return false;
  } finally {
    hide();
  }
};

/**
 * 更新用户 Modal
 * @param props
 * @constructor
 */
const UpdateUserModal: React.FC<Props> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm<API.UserUpdateRequest>();
  if (!oldData) {
    return <></>;
  }

  return (
    <ModalForm
      title={'更新用户信息'}
      open={visible}
      form={form}
      initialValues={oldData}
      onFinish={async (values: API.UserUpdateRequest) => {
        const success = await handleUpdate({
          ...values,
          id: oldData?.id,
        });
        if (success) {
          onSubmit?.(values);
        }
      }}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          onCancel?.();
        },
      }}
      submitter={{
        searchConfig: {
          submitText: '更新用户信息',
          resetText: '取消',
        },
      }}
    >
      <ProFormText name={'userName'} label={'姓名'} />
      <ProFormText name={'userIdCard'} label={'身份证号'} />
      <ProFormText name={'userEmail'} label={'邮箱'} />
      <ProFormText name={'userPhone'} label={'电话'} />
      <ProFormSelect name={'userGender'} label={'性别'} valueEnum={userGenderEnum}>
        <Select>
          <Select.Option value={UserGender.MALE}>
            {userGenderEnum[UserGender.MALE].text}
          </Select.Option>
          <Select.Option value={UserGender.FEMALE}>
            {userGenderEnum[UserGender.FEMALE].text}
          </Select.Option>
        </Select>
      </ProFormSelect>
    </ModalForm>
  );
};
export default UpdateUserModal;
