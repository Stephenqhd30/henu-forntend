import {ModalForm, ProColumns, ProForm, ProFormSelect, ProFormText, ProTable} from '@ant-design/pro-components';
import {message, Modal, Select} from 'antd';
import React from 'react';
import { updateSchoolSchoolTypeUsingPost } from '@/services/henu-backend/schoolSchoolTypeController';
import {UserGender, userGenderEnum} from '@/enums/UserGenderEnum';
import {listSchoolTypeVoByPageUsingPost} from '@/services/henu-backend/schoolTypeController';

interface UpdateProps {
  oldData?: API.SchoolSchoolTypeVO;
  onCancel: () => void;
  onSubmit: (values: API.SchoolTypeUpdateRequest) => Promise<void>;
  visible: boolean;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.SchoolTypeUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    const res = await updateSchoolSchoolTypeUsingPost(fields);
    if (res.code === 0 && res.data) {
      message.success('更新成功');
      return true;
    } else {
      message.error(`更新失败${res.message}, 请重试!`);
      return false;
    }
  } catch (error: any) {
    message.error(`更新失败${error.message}, 请重试!`);
    return false;
  } finally {
    hide();
  }
};

/**
 * 更新高校信息
 * @param props
 * @constructor
 */
const UpdateSchoolTypeTypeModal: React.FC<UpdateProps> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  const [form] = ProForm.useForm<API.SchoolTypeUpdateRequest>();
  if (!oldData) {
    return <></>;
  }

  return (
    <ModalForm
      title={'更新高校与高校类型关联信息'}
      open={visible}
      form={form}
      initialValues={oldData}
      onFinish={async (values: API.SchoolTypeUpdateRequest) => {
        const success = await handleUpdate({
          ...values,
          id: oldData?.id,
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
          submitText: '更新',
          resetText: '取消',
        },
      }}
    >
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
export default UpdateSchoolTypeTypeModal;
