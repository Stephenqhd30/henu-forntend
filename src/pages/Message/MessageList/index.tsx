import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';

import {
  deleteMessageUsingPost,
  listMessageByPageUsingPost,
} from '@/services/henu-backend/messageController';
import { message, Popconfirm, Space, Typography } from 'antd';
import { CreateMessageModal, UpdateMessageModal } from '@/pages/Message/MessageList/components';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteMessageUsingPost({
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
 * 通知信息管理列表
 * @constructor
 */
const MessageList: React.FC = () => {
  // 创建通知信息 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新通知信息 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前干部类型的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.CadreType>();
  /**
   * 表格列数据
   */
  const columns: ProColumns<API.MessageVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '通知主题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '通知内容',
      dataIndex: 'content',
      valueType: 'text',
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
          {/*删除表单干部类型的PopConfirm框*/}
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
      <ProTable<API.Message, API.PageParams>
        headerTitle={'消息通知'}
        actionRef={actionRef}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listMessageByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.MessageQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateMessageModal
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
        <UpdateMessageModal
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
export default MessageList;
