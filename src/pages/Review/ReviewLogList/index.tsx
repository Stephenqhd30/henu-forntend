import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Select, Space, Typography } from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { exportReviewLogUsingGet } from '@/services/henu-backend/excelController';
import { REVIEW_LOG_EXCEL } from '@/constants';
import { DownloadOutlined } from '@ant-design/icons';
import {
  deleteReviewLogUsingPost,
  listReviewLogVoByPageUsingPost,
} from '@/services/henu-backend/reviewLogController';
import { RegistrationDetailsModal } from '@/components/ReRegistration';
import UpdateReviewLogModal from '@/pages/Review/ReviewLogList/components/UpdateReviewLogModal';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteReviewLogUsingPost({
      id: row.id,
    });
    hide();
    message.success('删除成功');
  } catch (error: any) {
    hide();
    message.error(`删除失败${error.message}, 请重试!`);
  }
};

/**
 * 审核信息列表
 * @constructor
 */
const ReviewLogList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前行数据
  const [currentRow, setCurrentRow] = useState<API.ReviewLogVO>({});
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 报名登记Modal框
  const [registrationModal, setRegistrationModal] = useState<boolean>(false);
  /**
   * 下载审核日志信息
   */
  const downloadReviewLogInfo = async () => {
    try {
      const res = await exportReviewLogUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', REVIEW_LOG_EXCEL);
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
  const columns: ProColumns<API.ReviewLogVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
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
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Typography.Link
            key={'registration-details'}
            onClick={async () => {
              setRegistrationModal(true);
              setCurrentRow(record);
            }}
          >
            查看报名登记表信息
          </Typography.Link>
          <Typography.Link
            key="update"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </Typography.Link>
          {/*删除表单用户的PopConfirm框*/}
          <Popconfirm
            title="确定删除？"
            description="删除后将无法恢复?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handleDelete(record);
              actionRef.current?.reload();
            }}
          >
            <Typography.Link
              key={'delete'}
              type={'danger'}
              onClick={() => {
                setCurrentRow(record);
              }}
            >
              删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.ReviewLog, API.PageParams>
        headerTitle={'审核日志'}
        rowKey={'id'}
        scroll={{ x: 'max-content', y: 400 }}
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            icon={<DownloadOutlined />}
            key={'export'}
            onClick={async () => {
              await downloadReviewLogInfo();
            }}
          >
            导出审核日志信息
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listReviewLogVoByPageUsingPost({
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
      />
      {/*报名登记包信息*/}
      {registrationModal && (
        <RegistrationDetailsModal
          visible={registrationModal}
          onCancel={() => setRegistrationModal(false)}
          registration={currentRow?.registrationFormVO ?? {}}
        />
      )}
      {updateModalVisible && (
        <UpdateReviewLogModal
          oldData={currentRow}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
          onSubmit={async () => {
            actionRef.current?.reload();
            setUpdateModalVisible(false);
          }}
          visible={updateModalVisible}
          columns={columns}
        />
      )}
    </PageContainer>
  );
};

export default ReviewLogList;
