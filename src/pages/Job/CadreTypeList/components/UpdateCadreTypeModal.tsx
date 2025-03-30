import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
import { updateCadreTypeUsingPost } from '@/services/henu-backend/cadreTypeController';

interface UpdateProps {
  oldData?: API.CadreTypeVO;
  onCancel: () => void;
  onSubmit: (values: API.CadreTypeUpdateRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.CadreTypeVO>[];
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.CadreTypeUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateCadreTypeUsingPost(fields);
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
const UpdateCadreTypeModal: React.FC<UpdateProps> = (props) => {
  const { oldData, visible, onSubmit, onCancel, columns } = props;
  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新干部类型信息'}
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
        onSubmit={async (values: API.CadreTypeUpdateRequest) => {
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
export default UpdateCadreTypeModal;
