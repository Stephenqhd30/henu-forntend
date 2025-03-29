import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Select, Space, Typography } from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { BatchReviewModal, ReviewModal } from '@/pages/Review/components';
import { listRegistrationFormVoByPageUsingPost } from '@/services/henu-backend/registrationFormController';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';
import { MarryStatus, marryStatusEnum } from '@/enums/MarryStatusEnum';
import { JobDetailsCard } from '@/components/ReJob';

const CertificateReview: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 用户详细 Modal 框
  const [jobModal, setJobModal] = useState<boolean>(false);
  // 审核信息 Modal 框
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  // 批量审核信息 Modal 框
  const [batchReviewModal, setBatchReviewModal] = useState<boolean>(false);
  // 当前行数据
  const [currentRow, setCurrentRow] = useState<API.RegistrationFormVO>({});
  // 选中行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.RegistrationFormVO>[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
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
      title: '照片',
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
      title: '填写用户',
      dataIndex: 'userId',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
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
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Typography.Link
            key={'job-details'}
            onClick={async () => {
              setJobModal(true);
              setCurrentRow(record);
            }}
          >
            查看岗位信息
          </Typography.Link>
          <Typography.Link
            key={'review'}
            onClick={async () => {
              setReviewModal(true);
              setCurrentRow(record);
            }}
          >
            审核
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RegistrationFormVO, API.PageParams>
        headerTitle={'报名登记表审核'}
        rowKey={'id'}
        scroll={{ x: 'max-content', y: 400 }}
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listRegistrationFormVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
            notId: ReviewStatus.PASS,
          } as API.ReviewLogQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertOptionRender={() => {
          return (
            <Space>
              <Button
                type="primary"
                onClick={async () => {
                  setBatchReviewModal(true);
                  actionRef.current?.reload();
                }}
              >
                批量审核
              </Button>
            </Space>
          );
        }}
      />
      {/*审核*/}
      {reviewModal && (
        <ReviewModal
          visible={reviewModal}
          onCancel={() => setReviewModal(false)}
          registrationForm={currentRow ?? {}}
          onSubmit={async () => {
            setReviewModal(false);
            actionRef.current?.reload();
          }}
        />
      )}
      {/*批量审核*/}
      {batchReviewModal && (
        <BatchReviewModal
          visible={batchReviewModal}
          onCancel={() => setBatchReviewModal(false)}
          selectedRowKeys={selectedRowKeys ?? []}
          columns={columns}
          onSubmit={async () => {
            setReviewModal(false);
            setSelectedRowKeys([]);
            actionRef.current?.reload();
          }}
        />
      )}
      {/*岗位信息*/}
      {jobModal && (
        <JobDetailsCard
          visible={jobModal}
          onCancel={() => setJobModal(false)}
          job={currentRow?.jobVO ?? {}}
        />
      )}
    </PageContainer>
  );
};

export default CertificateReview;
