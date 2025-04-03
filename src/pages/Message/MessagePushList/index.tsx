import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { exportMessagePushUsingGet } from '@/services/henu-backend/excelController';
import { MESSAGE_PUSH_EXCEL } from '@/constants';
import { pushStatusEnum } from '@/enums/PushStatusEnum';
import {
  deleteMessagePushUsingPost,
  listMessagePushByPageUsingPost,
} from '@/services/henu-backend/messagePushController';
import { pushTypeEnum } from '@/enums/PushTypeEnum';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteMessagePushUsingPost({
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
 * 短信推送管理列表
 * @constructor
 */
const MessagePushList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前短信推送的所点击的数据
  const [, setCurrentRow] = useState<API.MessagePush>();

  /**
   * 下载短信推送信息
   */
  const downloadMessagePushInfo = async () => {
    try {
      const res = await exportMessagePushUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', MESSAGE_PUSH_EXCEL);
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
  const columns: ProColumns<API.MessagePush>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '消息通知id',
      dataIndex: 'messageNoticeId',
      valueType: 'text',
    },
    {
      title: '通知用户名',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '推送消息',
      dataIndex: 'pushMessage',
      valueType: 'textarea',
    },
    {
      title: '消息推送方式',
      dataIndex: 'pushType',
      valueType: 'text',
      valueEnum: pushTypeEnum,
    },
    {
      title: '消息通知状态',
      dataIndex: 'pushStatus',
      valueType: 'select',
      hideInForm: true,
      valueEnum: pushStatusEnum,
      render: (_, record) => {
        // @ts-ignore
        const pushStatus = pushStatusEnum[record.pushStatus];
        return <Tag color={pushStatus?.color}>{pushStatus.text}</Tag>;
      },
    },
    {
      title: '失败重试次数',
      dataIndex: 'retryCount',
      valueType: 'digit',
      hideInForm: true,
    },
    {
      title: '失败错误消息',
      dataIndex: 'errorMessage',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '推送用户id',
      dataIndex: 'userId',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size={'middle'}>
          {/*删除表单短信推送的PopConfirm框*/}
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
      <ProTable<API.MessagePush, API.PageParams>
        headerTitle={'短信推送查询'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadMessagePushInfo();
              }}
            >
              <DownloadOutlined />
              导出短信推送信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'create_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listMessagePushByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.MessagePushQueryRequest);

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
export default MessagePushList;
