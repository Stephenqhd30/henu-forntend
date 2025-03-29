import { ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import {Image, Modal, Select} from 'antd';
import {UserGender, userGenderEnum} from '@/enums/UserGenderEnum';
import {MarryStatus, marryStatusEnum} from '@/enums/MarryStatusEnum';
import {ReviewStatus, reviewStatusEnum} from '@/enums/ReviewStatusEnum';

interface Props {
  registration: API.RegistrationFormVO;
  visible: boolean;
  onCancel: () => void;
}

/**
 * 岗位信息详细
 * @param props
 * @constructor
 */
const RegistrationDetailsModal: React.FC<Props> = (props) => {
  const { registration, visible, onCancel } = props;

  /**
   * 表格列数据
   */
  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '身份证号',
      dataIndex: 'userIdCard',
      valueType: 'password',
    },
    {
      title: '性别',
      dataIndex: 'userGender',
      valueType: 'text',
      valueEnum: userGenderEnum,
      renderFormItem: () => {
        return (
          <Select>
            <Select.Option value={UserGender.MALE}>
              {userGenderEnum[UserGender.MALE].text}
            </Select.Option>
            <Select.Option value={UserGender.FEMALE}>
              {userGenderEnum[UserGender.FEMALE].text}
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: '联系电话',
      dataIndex: 'userPhone',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
    },
    {
      title: '婚姻状况',
      dataIndex: 'marryStatus',
      valueType: 'text',
      valueEnum: marryStatusEnum,
      renderFormItem: () => {
        return (
          <Select>
            <Select.Option value={MarryStatus.YES}>
              {marryStatusEnum[MarryStatus.YES].text}
            </Select.Option>
            <Select.Option value={MarryStatus.NO}>
              {marryStatusEnum[MarryStatus.NO].text}
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: '家庭住址',
      dataIndex: 'address',
      valueType: 'text',
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      valueType: 'text',
    },
    {
      title: '民族',
      dataIndex: 'ethnic',
      valueType: 'text',
    },
    {
      title: '证件照',
      dataIndex: 'userId',
      valueType: 'text',
      render: (_: any, record: any) => {
        return <Image width={64}>{record?.userVO?.userAvatar}</Image>;
      },
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '生活照',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '入党时间',
      dataIndex: 'partyTime',
      valueType: 'dateTime',
    },
    {
      title: '工作经历',
      dataIndex: 'workExperience',
      valueType: 'text',
    },
    {
      title: '主要学生干部经历及获奖情况',
      dataIndex: 'studentLeaderAwards',
      valueType: 'text',
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueType: 'select',
      valueEnum: reviewStatusEnum,
      renderFormItem: () => {
        return (
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
        );
      },
    },
    {
      title: '审核意见',
      dataIndex: 'reviewComments',
      valueType: 'textarea',
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      valueType: 'text',
      hideInForm: true,
    },
  ];

  return (
    <Modal open={visible} destroyOnClose onCancel={onCancel} footer={null}>
      <ProDescriptions
        title="报名登记表详细"
        columns={columns}
        column={1}
        dataSource={registration}
      />
    </Modal>
  );
};

export default RegistrationDetailsModal;
