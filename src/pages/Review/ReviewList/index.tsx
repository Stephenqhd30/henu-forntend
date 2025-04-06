import React, { useRef, useState } from 'react';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Grid, Select, Space, Tag, Typography } from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { BatchReviewModal, ReviewModal } from '@/pages/Review/ReviewList/components';
import { listRegistrationFormVoByPageUsingPost } from '@/services/henu-backend/registrationFormController';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';
import { MarryStatus, marryStatusEnum } from '@/enums/MarryStatusEnum';
import { JobDetailsModal } from '@/components/ReJob';
import { UserDetailsModal } from '@/components/ReUser';
import { listSchoolTypeVoByPageUsingPost } from '@/services/henu-backend/schoolTypeController';

const { useBreakpoint } = Grid;
/**
 * 报名登记表信息审核
 * @constructor
 */
const RegistrationReview: React.FC = () => {
  const scene = useBreakpoint();
  const isMobile = !scene.md;
  const actionRef = useRef<ActionType>();
  // 用户详细 Modal 框
  const [userModal, setUserModal] = useState<boolean>(false);
  // 岗位信息 Modal
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
      title: '身份证号',
      dataIndex: 'userIdCard',
      valueType: 'password',
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '证件照',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '生活照',
      dataIndex: 'userLifePhoto',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '工作经历',
      dataIndex: 'workExperience',
      valueType: 'text',
    },
    {
      title: '主要学生干部经历',
      dataIndex: 'studentLeader',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        if (record) {
          return (
            record?.studentLeaders?.map((type: any) => (
              <Space key={"space"} wrap={true} direction={"vertical"}>
                <Tag key={type} color="blue">
                  {type}
                </Tag>
              </Space>
            )) ?? []
          );
        }
        return <Tag>{'无'}</Tag>;
      },
    },
    {
      title: '干部经历描述',
      dataIndex: 'leaderExperience',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '主要获奖情况',
      dataIndex: 'studentAwards',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '民族',
      dataIndex: 'ethnic',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '入党时间',
      dataIndex: 'partyTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '紧急联系电话',
      dataIndex: 'emergencyPhone',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '报名登记表文件',
      dataIndex: 'registrationForm',
      valueType: 'text',
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
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '学校类型',
      dataIndex: 'schoolTypes',
      hideInForm: true,
      hideInTable: true,
      hideInSetting: true,
      renderFormItem: (_, { value }, form) => {
        const parsedValue = Array.isArray(value) ? value : [];
        return (
          <ProFormSelect
            mode="multiple"
            // @ts-ignore
            value={parsedValue}
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
            onChange={(val) => form.setFieldsValue({ schoolTypes: val })}
            placeholder="请选择高校类型"
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: isMobile ? undefined : 'right',
      render: (_, record) => (
        <Space>
          <Typography.Link
            key={'user-details'}
            onClick={async () => {
              setUserModal(true);
              setCurrentRow(record);
            }}
          >
            用户信息
          </Typography.Link>
          <Typography.Link
            key={'job-details'}
            onClick={async () => {
              setJobModal(true);
              setCurrentRow(record);
            }}
          >
            岗位信息
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
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listRegistrationFormVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
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
      {/*用户信息*/}
      {userModal && (
        <UserDetailsModal
          visible={userModal}
          onCancel={() => setUserModal(false)}
          registration={currentRow}
        />
      )}
      {/*岗位信息*/}
      {jobModal && (
        <JobDetailsModal
          visible={jobModal}
          onCancel={() => setJobModal(false)}
          job={currentRow?.jobVO ?? {}}
        />
      )}
    </PageContainer>
  );
};

export default RegistrationReview;
