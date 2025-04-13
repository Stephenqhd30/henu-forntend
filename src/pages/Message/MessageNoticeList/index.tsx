import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Tag } from 'antd';
import React, { useRef } from 'react';
import { listMessageNoticeVoByPageUsingPost } from '@/services/henu-backend/messageNoticeController';
import { exportMessageNoticeUsingGet } from '@/services/henu-backend/excelController';
import { MESSAGE_NOTICE_EXCEL } from '@/constants';
import { pushStatusEnum } from '@/enums/PushStatusEnum';

/**
 * 面试通知管理列表
 * @constructor
 */
const MessageNoticeList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * 下载面试通知信息
   */
  const downloadMessageNoticeInfo = async () => {
    try {
      const res = await exportMessageNoticeUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', MESSAGE_NOTICE_EXCEL);
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
  const columns: ProColumns<API.MessageNoticeVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '报名登记表信息',
      dataIndex: 'registrationId',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hidden: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => <span>{record?.userVO?.userName}</span>,
    },
    {
      title: '面试内容',
      dataIndex: 'content',
      valueType: 'text',
    },
    {
      title: '通知状态',
      dataIndex: 'pushStatus',
      valueType: 'text',
      hideInForm: true,
      valueEnum: pushStatusEnum,
      render: (_, record) => {
        // @ts-ignore
        const pushStatus = pushStatusEnum[record.pushStatus];
        return <Tag color={pushStatus?.color}>{pushStatus.text}</Tag>;
      },
    },
    {
      title: '创建管理员id',
      dataIndex: 'adminId',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
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
      <ProTable<API.MessageNotice, API.PageParams>
        headerTitle={'面试通知日志'}
        actionRef={actionRef}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadMessageNoticeInfo();
              }}
            >
              <DownloadOutlined />
              导出面试通知信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'create_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listMessageNoticeVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.MessageNoticeQueryRequest);

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
export default MessageNoticeList;
