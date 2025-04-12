import { message } from 'antd';
import { ModalForm, ProForm, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { addMessageNoticeByBatchUsingPost } from '@/services/henu-backend/messageNoticeController';

interface ReviewModalProps {
  visible: boolean;
  onCancel?: () => void;
  selectedRowKeys: any[];
  onSubmit: () => Promise<void>;
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.MessageNoticeAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addMessageNoticeByBatchUsingPost({
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
 * 批量创建面试通知信息弹窗
 * @param props
 * @constructor
 */
const BatchReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { visible, onCancel, selectedRowKeys, onSubmit } = props;
  const [form] = ProForm.useForm();
  return (
    <ModalForm
      title={'批量创建面试通知信息'}
      open={visible}
      form={form}
      onFinish={async (values: API.MessageNoticeAddRequest) => {
        const success = await handleAdd({
          ...values,
          registrationIds: selectedRowKeys,
        });
        if (success) {
          onSubmit?.();
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
          submitText: '新建',
          resetText: '取消',
        },
      }}
    >
      <ProFormTextArea name={'content'} label={'面试内容'} />
    </ModalForm>
  );
};

export default BatchReviewModal;
