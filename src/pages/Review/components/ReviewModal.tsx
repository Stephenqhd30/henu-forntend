import { message, Select } from 'antd';
import { ModalForm, ProForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { addReviewLogUsingPost } from '@/services/henu-backend/reviewLogController';

interface ReviewModalProps {
  visible: boolean;
  onCancel?: () => void;
  registrationForm: API.RegistrationFormVO;
  onSubmit: (values: API.ReviewLogAddRequest) => Promise<void>;
}

/**
 * 审核信息模态框
 * @param props
 * @constructor
 */
const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const { visible, onCancel, registrationForm, onSubmit } = props;
  const [form] = ProForm.useForm();
  return (
    <ModalForm
      title={'审核证书信息'}
      open={visible}
      form={form}
      initialValues={registrationForm}
      onFinish={async (values: API.ReviewLogAddRequest) => {
        try {
          const success = await addReviewLogUsingPost({
            ...values,
            registrationId: registrationForm.id,
          });
          if (success.code === 0 && success.data) {
            onSubmit?.(values);
            message.success('审核信息已更新');
          } else {
            message.error('审核失败');
          }
        } catch (error: any) {
          message.error('审核失败' + error.message);
        } finally {
          onCancel?.();
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
          submitText: '审核',
          resetText: '取消',
        },
      }}
    >
      <ProFormSelect name={'reviewStatus'} label={'审核状态'}>
        <Select>
          <Select.Option value={ReviewStatus.REVIEWING}>
            {reviewStatusEnum[ReviewStatus.REVIEWING].text}
          </Select.Option>
          <Select.Option value={ReviewStatus.PASS}>
            {reviewStatusEnum[ReviewStatus.PASS].text}
          </Select.Option>
          <Select.Option value={ReviewStatus.REJECT}>
            {reviewStatusEnum[ReviewStatus.REJECT].text}
          </Select.Option>
        </Select>
      </ProFormSelect>
      <ProFormTextArea name={'reviewComments'} label={'审核意见'} />
    </ModalForm>
  );
};

export default ReviewModal;
