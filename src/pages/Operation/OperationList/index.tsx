import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useRef } from 'react';
import { exportOperationLogUsingGet } from '@/services/henu-backend/excelController';
import { ADMIN_EXCEL } from '@/constants';
import { listOperationLogByPageUsingPost } from '@/services/henu-backend/operationLogController';

/**
 * 操作日志信息管理列表
 * @constructor
 */
const OperationLogList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  /**
   * 下载操作日志信息信息
   */
  const downloadOperationLogInfo = async () => {
    try {
      const res = await exportOperationLogUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ADMIN_EXCEL);
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
  const columns: ProColumns<API.OperationLog>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '请求唯一id',
      dataIndex: 'requestId',
      valueType: 'text',
    },
    {
      title: '请求路径',
      dataIndex: 'requestPath',
      valueType: 'text',
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
      valueType: 'text',
    },
    {
      title: '请求IP地址',
      dataIndex: 'requestIp',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'textarea',
    },
    {
      title: '响应时间（毫秒）',
      dataIndex: 'responseTime',
      valueType: 'textarea',
    },
    {
      title: '用户代理',
      dataIndex: 'userAgent',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.OperationLog, API.PageParams>
        headerTitle={'操作日志信息查询'}
        actionRef={actionRef}
        scroll={{ x: 'max-content'}}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              icon={<DownloadOutlined />}
              key={'export'}
              onClick={async () => {
                await downloadOperationLogInfo();
              }}
            >
              导出操作日志信息信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listOperationLogByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.OperationLogQueryRequest);

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
export default OperationLogList;
