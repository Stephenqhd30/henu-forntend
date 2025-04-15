import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { addMessageNoticeByBatchUsingPost } from '@/services/henu-backend/messageNoticeController';
import { listMessageVoByPageUsingPost } from '@/services/henu-backend/messageController';

interface CreateProps {
  onCancel: () => void;
  onSubmit: (values: API.MessageNoticeAddRequest) => Promise<void>;
  visible: boolean;
  selectedRowKeys: any[];
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
 * 常见弹窗
 * @param props
 * @constructor
 */
const BatchCreateMessageNoticeModal: React.FC<CreateProps> = (props) => {
  const { visible, onSubmit, onCancel, selectedRowKeys } = props;
  const [form] = ProForm.useForm<API.MessageNoticeAddRequest>();
  return (
    <ModalForm
      title={'批量添加短信推送信息'}
      open={visible}
      form={form}
      onFinish={async (values: API.MessageNoticeAddRequest) => {
        const success = await handleAdd({
          ...values,
          registrationIds: selectedRowKeys,
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
          submitText: '创建',
          resetText: '取消',
        },
      }}
    >
      <ProFormSelect
        fieldProps={{
          style: { width: '100%' },
          size: 'middle',
        }}
        request={async () => {
          const res = await listMessageVoByPageUsingPost({
            sortField: 'update_time',
            sortOrder: 'descend',
          });
          if (res.code === 0 && res.data) {
            return (
              res.data.records?.map((message) => ({
                label: message.title,
                value: message.content,
              })) ?? []
            );
          } else {
            return [];
          }
        }}
        name={'content'}
        placeholder="请选择通知内容"
        style={{ width: '100%' }}
      />
    </ModalForm>
  );
};
export default BatchCreateMessageNoticeModal;
