import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {Button, message, Select, Space, Tag, Typography} from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { listRegistrationFormVoByPageUsingPost } from '@/services/henu-backend/registrationFormController';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';
import { MarryStatus, marryStatusEnum } from '@/enums/MarryStatusEnum';
import { JobDetailsModal } from '@/components/ReJob';
import { exportRegistrationFormUsingGet } from '@/services/henu-backend/excelController';
import { REGISTRATION_EXCEL } from '@/constants';
import { DownloadOutlined } from '@ant-design/icons';

/**
 * 报名登记表信息管理页面
 * @constructor
 */
const RegistrationList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 岗位信息 Modal
  const [jobModal, setJobModal] = useState<boolean>(false);
  // 当前行数据
  const [currentRow, setCurrentRow] = useState<API.RegistrationFormVO>({});

  /**
   * 下载报名登记表信息
   */
  const downloadRegistrationFormInfo = async () => {
    try {
      const res = await exportRegistrationFormUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', REGISTRATION_EXCEL);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 释放对象 URL
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error('导出失败: ' + error.message);
    }
  };
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
            record?.studentLeader?.map((type: any) => (
              <Tag key={type} color="blue">
                {type}
              </Tag>
            )) ?? []
          );
        }
        return <Tag>{'无'}</Tag>;
      },
    },
    {
      title: '主要获奖情况',
      dataIndex: 'studentAwards',
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
      title: '入党时间',
      dataIndex: 'partyTime',
      valueType: 'dateTime',
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
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RegistrationFormVO, API.PageParams>
        headerTitle={'报名登记表信息管理'}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadRegistrationFormInfo();
              }}
            >
              <DownloadOutlined />
              导出报名登记表信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listRegistrationFormVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.RegistrationFormQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
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

export default RegistrationList;
