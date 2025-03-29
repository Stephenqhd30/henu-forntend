import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
import { updateAdminUsingPost } from '@/services/henu-backend/adminController';

interface UpdateProps {
  oldData?: API.AdminVO;
  onCancel: () => void;
  onSubmit: (values: API.AdminUpdateRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.AdminVO>[];
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
  const { oldData, visible, onSubmit, onCancel, columns } = props;
  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新管理员信息'}
      onCancel={() => onCancel?.()}
      open={visible}
      footer
    >
      <ProTable
        type={'form'}
        form={{
          initialValues: oldData,
        }}
        columns={columns}
        onSubmit={async (values: API.AdminUpdateRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default UpdateAdminModal;
