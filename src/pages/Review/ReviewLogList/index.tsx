import React, { useRef } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Select } from 'antd';
import { ReviewStatus, reviewStatusEnum } from '@/enums/ReviewStatusEnum';
import { exportReviewLogUsingGet } from '@/services/henu-backend/excelController';
import { REVIEW_LOG_EXCEL } from '@/constants';
import { DownloadOutlined } from '@ant-design/icons';
import { listReviewLogVoByPageUsingPost } from '@/services/henu-backend/reviewLogController';

/**
 * 审核信息列表
 * @constructor
 */
const ReviewLogList: React.FC = () => {
  const actionRef = useRef<ActionType>();
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
      hideInForm: true,
    },
    {
      title: '报名登记表id',
      dataIndex: 'registrationId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      valueType: 'select',
      valueEnum: reviewStatusEnum,
      renderFormItem: () => {
        return (
          <Select>
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
  ];
  return (
    <PageContainer>
      <ProTable<API.ReviewLog, API.PageParams>
        headerTitle={'审核日志'}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
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
          const sortField = 'create_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listReviewLogVoByPageUsingPost({
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
      />
    </PageContainer>
  );
};

export default ReviewLogList;
