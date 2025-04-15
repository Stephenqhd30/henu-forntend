import { message } from 'antd';
import { ModalForm, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { addMessageUsingPost } from '@/services/henu-backend/messageController';

interface MessageModalProps {
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
    const res = await addMessageUsingPost({
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
 * 批量创建通知信息弹窗
 * @param props
 * @constructor
 */
const BatchCreateMessageModal: React.FC<MessageModalProps> = (props) => {
  const { visible, onCancel, onSubmit } = props;
  const [form] = ProForm.useForm();
  return (
    <ModalForm
      title={'批量创建通知信息'}
      open={visible}
      form={form}
      onFinish={async (values: API.MessageAddRequest) => {
        const success = await handleAdd({
          ...values,
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
      <ProFormText
        fieldProps={{
          required: true,
        }}
        name={'title'}
        label={'通知主题'}
      />
      <ProFormTextArea
        fieldProps={{
          required: true,
        }}
        name={'content'}
        label={'通知内容'}
      />
    </ModalForm>
  );
};

export default BatchCreateMessageModal;
