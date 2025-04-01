import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
import { updateJobUsingPost } from '@/services/henu-backend/jobController';

interface UpdateProps {
  oldData?: API.JobVO;
  onCancel: () => void;
  onSubmit: (values: API.JobUpdateRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.JobVO>[];
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.JobUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateJobUsingPost(fields);
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
const UpdateJobModal: React.FC<UpdateProps> = (props) => {
  const { oldData, visible, onSubmit, onCancel, columns } = props;
  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新岗位信息'}
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
        onSubmit={async (values: API.JobUpdateRequest) => {
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
export default UpdateJobModal;
