import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
import { updateDeadlineUsingPost } from '@/services/henu-backend/deadlineController';

interface UpdateProps {
  oldData?: API.DeadlineVO;
  onCancel: () => void;
  onSubmit: (values: API.DeadlineUpdateRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.DeadlineVO>[];
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.DeadlineUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateDeadlineUsingPost(fields);
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
const UpdateDeadlineModal: React.FC<UpdateProps> = (props) => {
  const { oldData, visible, onSubmit, onCancel, columns } = props;
  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新截止时间信息'}
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
        onSubmit={async (values: API.DeadlineUpdateRequest) => {
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
export default UpdateDeadlineModal;
