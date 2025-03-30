import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message, Select } from 'antd';
import React from 'react';
import { updateAdminUsingPost } from '@/services/henu-backend/adminController';
import { AdminType, adminTypeEnum } from '@/enums/AdminTypeEnum';

interface UpdateProps {
  oldData?: API.AdminVO;
  onCancel: () => void;
  onSubmit: (values: API.AdminUpdateRequest) => Promise<void>;
  visible: boolean;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.AdminUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateAdminUsingPost(fields);
    if (res.code === 0 && res.data) {
      hide();
      message.success('更新成功');
      return true;
    }
    return false;
  } catch (error: any) {
    hide();
    message.error(`更新失败${error.message}, 请重试!`);
    return false;
  }
};
const UpdateAdminModal: React.FC<UpdateProps> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm<API.AdminUpdateRequest>();
  if (!oldData) {
    return <></>;
  }

  return (
    <ModalForm
      title={'更新管理员信息'}
      open={visible}
      form={form}
      initialValues={oldData}
      onFinish={async (values: API.AdminUpdateRequest) => {
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
          submitText: '更新管理员信息',
          resetText: '取消',
        },
      }}
    >
      <ProFormText name={'adminName'} label={'管理员'} />
      <ProFormText name={'adminNumber'} label={'管理员编号'} />
      <ProFormSelect name={'adminType'} label={'权限'} valueEnum={adminTypeEnum}>
        <Select>
          <Select.Option value={AdminType.SYSTEM_ADMIN}>
            {adminTypeEnum[AdminType.SYSTEM_ADMIN].text}
          </Select.Option>
          <Select.Option value={AdminType.ADMIN}>
            {adminTypeEnum[AdminType.ADMIN].text}
          </Select.Option>
        </Select>
      </ProFormSelect>
    </ModalForm>
  );
};
export default UpdateAdminModal;
