import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { addSchoolSchoolTypeUsingPost } from '@/services/henu-backend/schoolSchoolTypeController';
import { listSchoolTypeVoByPageUsingPost } from '@/services/henu-backend/schoolTypeController';

interface CreateProps {
  onCancel: () => void;
  onSubmit: (values: API.SchoolSchoolTypeAddRequest) => Promise<void>;
  visible: boolean;
}

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.SchoolSchoolTypeAddRequest) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addSchoolSchoolTypeUsingPost({
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
const CreateSchoolSchoolTypeTypeModal: React.FC<CreateProps> = (props) => {
  const { visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm<API.SchoolSchoolTypeAddRequest>();
  return (
    <ModalForm
      title={'更新高校与高校类型关联信息'}
      open={visible}
      form={form}
      onFinish={async (values: API.SchoolSchoolTypeAddRequest) => {
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
      <ProFormText name={'schoolName'} label={'高校名称'} />
      <ProFormSelect
        mode="multiple"
        name={'schoolTypes'}
        request={async () => {
          const res = await listSchoolTypeVoByPageUsingPost({});
          if (res.code === 0 && res.data) {
            return (
              res.data.records?.map((schoolType) => ({
                label: schoolType.typeName,
                value: schoolType.typeName,
              })) ?? []
            );
          } else {
            return [];
          }
        }}
        placeholder="请选择高校类型"
        style={{ width: '100%' }}
      />
    </ModalForm>
  );
};
export default CreateSchoolSchoolTypeTypeModal;
