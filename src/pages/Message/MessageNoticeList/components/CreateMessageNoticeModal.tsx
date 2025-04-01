import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
import { addMessageNoticeUsingPost } from '@/services/henu-backend/messageNoticeController';

interface CreateProps {
  onCancel: () => void;
  onSubmit: (values: API.MessageNoticeAddRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.MessageNotice>[];
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.MessageNoticeAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addMessageNoticeUsingPost({
      ...fields,
    });
    if (res.code === 0 && res.data) {
      message.success('添加成功');
      return true;
    } else {
      message.error(`添加失败${res.message}, 请重试!`);
      return false;
    }
  } catch (error: any) {
    message.error(`添加失败${error.message}, 请重试!`);
    return false;
  } finally {
    hide();
  }
};

/**
 * 常见弹窗
 * @param props
 * @constructor
 */
const CreateMessageNoticeModal: React.FC<CreateProps> = (props) => {
  const { visible, onSubmit, onCancel, columns } = props;
  return (
    <Modal
      destroyOnClose
      title={'新建面试通知'}
      onCancel={() => onCancel?.()}
      open={visible}
      footer
    >
      <ProTable
        columns={columns}
        onSubmit={async (values: API.MessageNoticeAddRequest) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
        type={'form'}
      />
    </Modal>
  );
};
export default CreateMessageNoticeModal;
