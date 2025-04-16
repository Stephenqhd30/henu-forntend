import { message } from 'antd';
import React from 'react';
import { ModalForm, ProForm, ProFormUploadDragger } from '@ant-design/pro-components';
import { importMessageNoticeUsingPost } from '@/services/henu-backend/excelController';

interface Props {
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  visible: boolean;
}

/**
 * 常见弹窗
 * @param props
 * @constructor
 */
const UploadMessageNoticeModal: React.FC<Props> = (props) => {
  const { visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm();

  return (
    <ModalForm
      title={'批量导入面试通知信息'}
      open={visible}
      form={form}
      onFinish={async (values: any) => {
        const hide = message.loading('正在导入面试通知信息，请稍等...');
        try {
          const res = await importMessageNoticeUsingPost({
            file: values.file[0].originFileObj,
          });
          if (res.code === 0 && res?.data) {
            message.success('面试通知信息导入成功');
            onSubmit?.();
          } else {
            message.error('面试通知信息导入失败请重试');
          }
        } catch (error: any) {
          message.error(`面试通知信息导入失败${error.message}` + '请重试');
        } finally {
          hide();
        }
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          onCancel?.();
        },
      }}
      submitter={{
        searchConfig: {
          submitText: '上传',
          resetText: '取消',
        },
      }}
    >
      <ProFormUploadDragger
        onChange={async (info) => {
          const { status } = info.file;
          if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
          }
        }}
        name={'file'}
        label="拖拽上传"
        max={1}
      />
    </ModalForm>
  );
};

export default UploadMessageNoticeModal;
