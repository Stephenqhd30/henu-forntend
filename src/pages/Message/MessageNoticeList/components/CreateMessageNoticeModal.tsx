import {
  ModalForm,
  ProColumns,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { addMessageNoticeUsingPost } from '@/services/henu-backend/messageNoticeController';
import { PushStatus } from '@/enums/PushStatusEnum';
import { listRegistrationFormVoByPageUsingPost } from '@/services/henu-backend/registrationFormController';

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
  const { visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm<API.MessageNoticeAddRequest>();
  return (
    <ModalForm
      title={'添加短信推送信息'}
      open={visible}
      form={form}
      onFinish={async (values: API.MessageNoticeAddRequest) => {
        const success = await handleAdd({
          ...values,
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
        name={'registrationId'}
        request={async () => {
          const res = await listRegistrationFormVoByPageUsingPost({
            reviewStatus: PushStatus.SUCCEED,
          });
          if (res.code === 0 && res.data) {
            return (
              res.data.records?.map((registrationForm) => ({
                label: registrationForm?.userName + ' - ' + registrationForm.jobVO?.jobName,
                value: registrationForm.id,
              })) ?? []
            );
          } else {
            return [];
          }
        }}
        placeholder="请选择消息通知人"
        style={{ width: '100%' }}
      />
      <ProFormTextArea name={'interviewLocation'} label={'面试地点'} />
      <ProFormDateTimePicker name={'interviewTime'} label={'面试时间'} />
    </ModalForm>
  );
};
export default CreateMessageNoticeModal;
