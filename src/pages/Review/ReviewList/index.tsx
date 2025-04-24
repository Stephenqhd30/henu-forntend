import type { Key } from 'react';
import React, { useRef, useState } from 'react';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, notification, Progress, Select, Space, Tag } from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import {
  BatchCreateMessageModal,
  BatchCreateMessageNoticeModal,
  BatchReviewModal,
  CreateMessageNoticeModal,
  ReviewModal,
  UploadMessageNoticeModal,
  UserDetailsCard,
} from '@/pages/Review/ReviewList/components';
import { listRegistrationFormVoByPageUsingPost } from '@/services/henu-backend/registrationFormController';
import { UserGender, userGenderEnum } from '@/enums/UserGenderEnum';
import { MarryStatus, marryStatusEnum } from '@/enums/MarryStatusEnum';
import { listSchoolTypeVoByPageUsingPost } from '@/services/henu-backend/schoolTypeController';
import { listCadreTypeVoByPageUsingPost } from '@/services/henu-backend/cadreTypeController';
import { listJobVoByPageUsingPost } from '@/services/henu-backend/jobController';
import { EducationStage, educationStageEnum } from '@/enums/EducationalStageEnum';
import {
  downloadFileByBatchUsingPost,
  downloadFileByUserIdUsingPost,
} from '@/services/henu-backend/fileLogController';
import { RegistrationStatus, registrationStatusEnum } from '@/enums/RegistrationStatusEnum';
import {
  ArrowDownOutlined,
  CheckOutlined,
  DownloadOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { politicalStatusEnum } from '@/enums/PoliticalStatusEnum';
import { REGISTRATION_EXCEL } from '@/constants';
import {
  exportRegistrationFormByUserIdUsingPost,
  exportRegistrationFormUsingGet,
} from '@/services/henu-backend/excelController';

/**
 * 报名登记表信息审核
 * @constructor
 */
const RegistrationReview: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 创建面试通知 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 批量创建面试通知 Modal 框
  const [batchCreateModalVisible, setBatchCreateModalVisible] = useState<boolean>(false);
  // 批量创建短信通知 Modal 框
  const [batchCreateMessageNoticeModalVisible, setBatchCreateMessageNoticeModalVisible] =
    useState<boolean>(false);
  // 上传面试通知信息窗口 Modal 框
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  // 审核信息 Modal 框
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  // 批量审核信息 Modal 框
  const [batchReviewModal, setBatchReviewModal] = useState<boolean>(false);
  // 当前行数据
  const [currentRow, setCurrentRow] = useState<API.RegistrationFormVO>({});
  // 选中行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  // 选中的数据
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // 可展开
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);

  /**
   * 下载用户上传的文件（ZIP）
   * @param userId
   */
  const downloadFileByUserId = async (userId: any) => {
    const key = 'downloadFileByUserId';
    let percent = 0;
    let downloadCompleted = false;
    // 显示初始通知
    notification.open({
      key,
      message: '文件下载中...',
      description: <Progress percent={percent} status="active" />,
      duration: 0,
      placement: 'top',
    });
    // 模拟进度增长
    const interval = setInterval(() => {
      if (percent < 95) {
        percent += Math.floor(Math.random() * 10) + 5;
        if (percent > 95) percent = 95;
        notification.open({
          key,
          message: '文件下载中...',
          description: <Progress percent={percent} status="active" />,
          duration: 0,
          placement: 'top',
        });
      } else if (downloadCompleted) {
        percent = 100;
        clearInterval(interval);
        notification.open({
          key,
          message: '文件下载完成',
          description: <Progress percent={percent} status="success" />,
          duration: 2,
          placement: 'top',
        });
      }
    }, 50);
    try {
      const response = await downloadFileByUserIdUsingPost(
        { userId: userId },
        {
          responseType: 'blob',
          getResponse: true,
        },
      );
      const blob = new Blob([response.data], { type: 'application/zip' });
      // 从响应头中获取文件名
      const disposition = response.headers['content-disposition'];
      let fileName = '附件信息.zip';
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }
      // 创建并点击下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // 释放 URL 对象
      window.URL.revokeObjectURL(url);
      downloadCompleted = true;
    } catch (error: any) {
      clearInterval(interval);
      notification.open({
        key,
        message: '文件下载失败: ' + (error?.message || '未知错误'),
        description: <Progress percent={100} status="exception" />,
        duration: 2,
        placement: 'top',
      });
    }
  };

  /**
   * 批量下载用户上传的文件（ZIP）
   */
  const downloadFileByBatch = async () => {
    const key = 'downloadFileByBatch';
    let percent = 0;
    let downloadCompleted = false;
    // 显示初始通知
    notification.open({
      key,
      message: '文件下载中...',
      description: <Progress percent={percent} status="active" />,
      duration: 0,
      placement: 'top',
    });
    // 模拟进度增长
    const interval = setInterval(() => {
      if (percent < 95) {
        percent += Math.floor(Math.random() * 10) + 5;
        if (percent > 95) percent = 95;
        notification.open({
          key,
          message: '文件下载中...',
          description: <Progress percent={percent} status="active" />,
          duration: 0,
          placement: 'top',
        });
      } else if (downloadCompleted) {
        percent = 100;
        clearInterval(interval);
        notification.open({
          key,
          message: '文件下载完成',
          description: <Progress percent={percent} status="success" />,
          duration: 2,
          placement: 'top',
        });
      }
    }, 500);
    try {
      const response = await downloadFileByBatchUsingPost(
        { userIds: selectedRows.map((row) => row.userId) },
        {
          responseType: 'blob',
          getResponse: true,
        },
      );
      const blob = new Blob([response.data], { type: 'application/zip' });
      const disposition = response.headers['content-disposition'];
      let fileName = '附件信息.zip';
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      downloadCompleted = true;
    } catch (error: any) {
      clearInterval(interval);
      notification.open({
        key,
        message: '文件下载失败: ' + (error?.message || '未知错误'),
        description: <Progress percent={100} status="exception" />,
        duration: 2,
        placement: 'top',
      });
    }
  };

  /**
   * 下载报名登记表信息
   */
  const downloadRegistrationFormInfo = async () => {
    const hide = message.loading('文件下载中....');
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
    } finally {
      hide();
    }
  };

  /**
   * 批量下载报名登记表信息
   */
  const downloadRegistrationFormByBatch = async () => {
    const hide = message.loading('文件下载中....');
    try {
      const res = await exportRegistrationFormByUserIdUsingPost(
        {
          userIds: selectedRows.map((row) => row.userId),
        },
        {
          responseType: 'blob',
        },
      );
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
    } finally {
      hide();
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.RegistrationFormVO>[] = [
    {
      title: '教育阶段',
      dataIndex: 'educationStages',
      valueType: 'select',
      hideInForm: true,
      hideInTable: true,
      hideInSetting: true,
      valueEnum: educationStageEnum,
      renderFormItem: (_, { value }, form) => {
        return (
          <Select
            mode="multiple"
            value={value}
            onChange={(val) => form.setFieldsValue({ educationStages: val })}
            placeholder="请选择教育阶段"
            allowClear
          >
            <Select.Option value={EducationStage.UNDERGRADUATE_COURSE}>
              {educationStageEnum[EducationStage.UNDERGRADUATE_COURSE].text}
            </Select.Option>
            <Select.Option value={EducationStage.POSTGRADUATE}>
              {educationStageEnum[EducationStage.POSTGRADUATE].text}
            </Select.Option>
            <Select.Option value={EducationStage.DOCTOR_DEGREE}>
              {educationStageEnum[EducationStage.DOCTOR_DEGREE].text}
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: '学校类型',
      dataIndex: 'schoolTypes',
      hideInForm: true,
      hideInTable: true,
      hideInSetting: true,
      colSize: 2,
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
          />
        );
      },
    },
    {
      title: '岗位信息',
      dataIndex: 'jobId',
      valueType: 'select',
      colSize: 2,
      render: (_, record) => <span>{record.jobVO?.jobName}</span>,
      renderFormItem: (_, { value }, form) => {
        return (
          <ProFormSelect
            mode="single"
            initialValue={value}
            onChange={(val) => form.setFieldsValue({ jobId: val })}
            request={async () => {
              const res = await listJobVoByPageUsingPost({});
              if (res.code === 0 && res.data) {
                return (
                  res.data.records?.map((job) => ({
                    label: job.jobName,
                    value: job.id,
                  })) ?? []
                );
              } else {
                return [];
              }
            }}
            placeholder="请选择岗位"
          />
        );
      },
    },
    {
      title: '主要学生干部经历',
      dataIndex: 'studentLeaders',
      valueType: 'select',
      colSize: 2,
      hideInForm: true,
      hideInTable: true,
      hideInSetting: true,
      renderFormItem: (_, { value }, form) => {
        return (
          <ProFormSelect
            mode="multiple"
            initialValue={value}
            onChange={(val) => form.setFieldsValue({ studentLeaders: val })}
            request={async () => {
              const res = await listCadreTypeVoByPageUsingPost({});
              if (res.code === 0 && res.data) {
                return (
                  res.data.records?.map((cadreType) => ({
                    label: cadreType.type,
                    value: cadreType.type,
                  })) ?? []
                );
              } else {
                return [];
              }
            }}
            placeholder="请选择干部类型"
          />
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      width: 120
    },
    {
      title: '身份证号',
      dataIndex: 'userIdCard',
      valueType: 'password',
      hideInSearch: true,
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalStatus',
      valueType: 'select',
      valueEnum: politicalStatusEnum,
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
      width: 600,
    },
    {
      title: '主要学生干部经历',
      dataIndex: 'studentLeaders',
      valueType: 'text',
      hideInSearch: true,
      width: 600,
      render: (_, record) => {
        if (record) {
          return (
            record?.studentLeaders?.map((type: any) => (
              <Space key={'space'} wrap={true} direction={'vertical'}>
                <Tag key={type} color="blue">
                  {type}
                </Tag>
              </Space>
            )) ?? []
          );
        }
        return <Tag>{'无'}</Tag>;
      },
      renderFormItem: (_, { value }, form) => {
        return (
          <ProFormSelect
            mode="multiple"
            fieldProps={{
              style: { width: '100%', minWidth: 240 },
            }}
            initialValue={value}
            onChange={(val) => form.setFieldsValue({ studentLeaders: val })}
            request={async () => {
              const res = await listCadreTypeVoByPageUsingPost({});
              if (res.code === 0 && res.data) {
                return (
                  res.data.records?.map((cadreType) => ({
                    label: cadreType.type,
                    value: cadreType.type,
                  })) ?? []
                );
              } else {
                return [];
              }
            }}
            placeholder="请选择干部类型"
          />
        );
      },
    },
    {
      title: '干部经历描述',
      dataIndex: 'leaderExperience',
      valueType: 'text',
      hideInSearch: true,
      width: 600,
    },
    {
      title: '主要获奖情况',
      dataIndex: 'studentAwards',
      valueType: 'text',
      hideInSearch: true,
      width: 600,
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
      valueType: 'select',
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
      width: 600,
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      valueType: 'date',
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
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '紧急联系电话',
      dataIndex: 'emergencyPhone',
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
      width: 600,
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
      title: '报名状态',
      dataIndex: 'registrationStatus',
      valueType: 'select',
      valueEnum: registrationStatusEnum,
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
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          expandedRowRender: (record) => {
            return (
              <ProCard
                title={
                  <Space wrap={true}>
                    <Button
                      key={'review'}
                      type="primary"
                      onClick={async () => {
                        setReviewModal(true);
                        setCurrentRow(record);
                      }}
                      icon={<CheckOutlined />}
                    >
                      审核用户信息
                    </Button>
                    {record.reviewStatus === ReviewStatus.PASS &&
                      record.registrationStatus === RegistrationStatus.YES && (
                        <Button
                          icon={<PlusOutlined />}
                          key={'export'}
                          type={'primary'}
                          onClick={async () => {
                            setCreateModalVisible(true);
                            setCurrentRow(record);
                          }}
                        >
                          新建并发送通知信息
                        </Button>
                      )}
                    <Button
                      key={'file'}
                      onClick={async () => {
                        await downloadFileByUserId(record?.userId);
                      }}
                      icon={<ArrowDownOutlined />}
                    >
                      下载附件信息
                    </Button>
                  </Space>
                }
              >
                <UserDetailsCard registration={record} />
              </ProCard>
            );
          },
        }}
        toolBarRender={() => [
          <Space key={'tool'} wrap={true}>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              key={'batch-review'}
              onClick={async () => {
                setBatchReviewModal(true);
                actionRef.current?.reload();
              }}
            >
              批量审核
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              key={'review'}
              onClick={async () => {
                setBatchCreateModalVisible(true);
                actionRef.current?.reload();
              }}
            >
              新建通知
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              key={'message-push'}
              onClick={async () => {
                setBatchCreateMessageNoticeModalVisible(true);
              }}
            >
              批量发送
            </Button>
            <Button
              key={'download'}
              icon={<DownloadOutlined />}
              onClick={async () => {
                await downloadFileByBatch();
                setSelectedRowKeys([]);
              }}
            >
              下载选中行附件
            </Button>
            <Button
              key={'download'}
              icon={<DownloadOutlined />}
              onClick={async () => {
                await downloadRegistrationFormByBatch();
                setSelectedRowKeys([]);
              }}
            >
              下载选中行报名信息
            </Button>
            <Button
              key={'download'}
              icon={<DownloadOutlined />}
              onClick={async () => {
                await downloadRegistrationFormInfo();
              }}
            >
              下载所有报名信息
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
            notId: RegistrationStatus.NO,
          } as API.RegistrationFormQueryRequest);
          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: ['20', '50', '100'],
          showSizeChanger: true,
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
          },
        }}
      />
      {/*新建面试通知*/}
      {createModalVisible && (
        <CreateMessageNoticeModal
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          onSubmit={async () => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          visible={createModalVisible}
          registrationForm={currentRow ?? {}}
        />
      )}
      {/*批量新建通知*/}
      {batchCreateModalVisible && (
        <BatchCreateMessageModal
          visible={batchCreateModalVisible}
          onCancel={() => setBatchCreateModalVisible(false)}
          selectedRowKeys={selectedRowKeys ?? []}
          onSubmit={async () => {
            setBatchCreateModalVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
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
      {/*批量发送通知*/}
      {batchCreateMessageNoticeModalVisible && (
        <BatchCreateMessageNoticeModal
          onCancel={() => {
            setBatchCreateMessageNoticeModalVisible(false);
          }}
          visible={batchCreateMessageNoticeModalVisible}
          onSubmit={async () => {
            setBatchCreateMessageNoticeModalVisible(false);
            setSelectedRowKeys([]);
            actionRef.current?.reload();
          }}
          selectedRowKeys={selectedRowKeys}
        />
      )}
      {uploadModalVisible && (
        <UploadMessageNoticeModal
          onCancel={() => {
            setUploadModalVisible(false);
          }}
          visible={uploadModalVisible}
          onSubmit={async () => {
            setUploadModalVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default RegistrationReview;
