import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {
  deleteMessageNoticeUsingPost,
  listMessageNoticeByPageUsingPost,
} from '@/services/henu-backend/messageNoticeController';
import { exportMessageNoticeUsingGet } from '@/services/henu-backend/excelController';
import { MESSAGE_NOTICE_EXCEL } from '@/constants';
import { PushStatus, pushStatusEnum } from '@/enums/PushStatusEnum';
import {
  CreateMessageNoticeModal,
  UpdateMessageNoticeModal,
} from '@/pages/Message/MessageNoticeList/components';
import { addMessagePushUsingPost } from '@/services/henu-backend/messagePushController';
import { PushType } from '@/enums/PushTypeEnum';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteMessageNoticeUsingPost({
      id: row.id,
    });
    message.success('删除成功');
  } catch (error: any) {
    message.error(`删除失败${error.message}, 请重试!`);
  } finally {
    hide();
  }
};

/**
 * 删除节点
 *
 * @param row
 */
const handlePush = async (row: any) => {
  const hide = message.loading('正在发送中');
  if (!row) return true;
  try {
    const res = await addMessagePushUsingPost({
      messageNoticeId: row?.id,
      pushType: PushType.SMS,
    });
    if (res.code === 0 && res.data) {
      message.success('消息发送成功');
    } else {
      message.error(`消息发送失败${res.message}`);
    }
  } catch (error: any) {
    message.error(`消息发送失败${error.message}, 请重试!`);
  } finally {
    hide();
  }
};

/**
 * 面试通知管理列表
 * @constructor
 */
const MessageNoticeList: React.FC = () => {
  // 创建面试通知 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新面试通知 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前面试通知的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.MessageNotice>();

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
  const columns: ProColumns<API.MessageNotice>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '报名登记表信息',
      dataIndex: 'registrationId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '通知用户名',
      dataIndex: 'userName',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '面试地点',
      dataIndex: 'interviewLocation',
      valueType: 'text',
    },
    {
      title: '面试时间',
      dataIndex: 'interviewTime',
      valueType: 'dateTime',
    },
    {
      title: '消息通知状态',
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size={'middle'}>
          <Typography.Link
            key="update"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </Typography.Link>
          {/*删除表单面试通知的PopConfirm框*/}
          <Popconfirm
            title="确定发送信息？"
            description="发送信息后将无法撤回?"
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              await handlePush(record);
              actionRef.current?.reload();
            }}
          >
            <Typography.Link
              key={'push'}
              type={'secondary'}
              onClick={() => {
                setCurrentRow(record);
              }}
            >
              发送短信
            </Typography.Link>
          </Popconfirm>
          {/*删除表单面试通知的PopConfirm框*/}
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
      <ProTable<API.MessageNotice, API.PageParams>
        headerTitle={'面试通知查询'}
        actionRef={actionRef}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Space key={'space'} wrap>
            <Button
              icon={<PlusOutlined />}
              key={'export'}
              type={'primary'}
              onClick={() => setCreateModalVisible(true)}
            >
              新建面试通知信息
            </Button>
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
          const sortField = 'createTime';
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listMessageNoticeByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
            notId: PushStatus.SUCCEED,
          } as API.MessageNoticeQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateMessageNoticeModal
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          onSubmit={async () => {
            actionRef.current?.reload();
            setCreateModalVisible(false);
          }}
          visible={createModalVisible}
          columns={columns}
        />
      )}
      {updateModalVisible && (
        <UpdateMessageNoticeModal
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
export default MessageNoticeList;
