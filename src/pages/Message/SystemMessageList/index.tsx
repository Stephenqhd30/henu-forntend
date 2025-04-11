import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Select, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { exportSystemMessagesUsingGet } from '@/services/henu-backend/excelController';
import { SYSTEM_MESSAGE_EXCEL } from '@/constants';
import { PushStatus, pushStatusEnum } from '@/enums/PushStatusEnum';
import {
  deleteSystemMessagesUsingPost,
  listSystemMessagesByPageUsingPost, updateSystemMessagesUsingPost
} from '@/services/henu-backend/systemMessagesController';
import CreateSystemMessagesModal from '@/pages/Message/SystemMessageList/components/CreateSystemMessagesModal';
import UpdateSystemMessagesModal from '@/pages/Message/SystemMessageList/components/UpdateSystemMessagesModal';
import { systemTypeEnum } from '@/enums/SystemTypeEnum';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteSystemMessagesUsingPost({
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
 * 系统消息管理列表
 * @constructor
 */
const SystemMessagesList: React.FC = () => {
  // 创建系统消息 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新系统消息 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前系统消息的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.SystemMessages>();
  /**
   * 发送消息
   *
   * @param row
   */
  const handlePush = async (row: any) => {
    const hide = message.loading('正在发送中');
    if (!row) return true;
    try {
      const res = await updateSystemMessagesUsingPost({
        id: row.id,
        pushStatus: PushStatus.SUCCEED,
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
   * 下载系统消息信息
   */
  const downloadSystemMessagesInfo = async () => {
    try {
      const res = await exportSystemMessagesUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', SYSTEM_MESSAGE_EXCEL);
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
  const columns: ProColumns<API.SystemMessages>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '通知标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      valueType: 'textarea',
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      valueType: 'text',
      valueEnum: systemTypeEnum,
    },
    {
      title: '消息通知状态',
      dataIndex: 'pushStatus',
      valueType: 'text',
      hideInForm: true,
      valueEnum: pushStatusEnum,
      renderFormItem: () => {
        return (
          <Select>
            <Select.Option value={PushStatus.NOT_PUSHED}>
              {pushStatusEnum[PushStatus.NOT_PUSHED].text}
            </Select.Option>
            <Select.Option value={PushStatus.SUCCEED}>
              {pushStatusEnum[PushStatus.SUCCEED].text}
            </Select.Option>
            <Select.Option value={PushStatus.FAILED}>
              {pushStatusEnum[PushStatus.FAILED].text}
            </Select.Option>
          </Select>
        );
      },
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
          {/*发送系统通知的PopConfirm框*/}
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
              发送
            </Typography.Link>
          </Popconfirm>
          {/*删除表单系统消息的PopConfirm框*/}
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
      <ProTable<API.SystemMessages, API.PageParams>
        headerTitle={'系统消息查询'}
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
              新建系统消息信息
            </Button>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadSystemMessagesInfo();
              }}
            >
              <DownloadOutlined />
              导出系统消息信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listSystemMessagesByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.SystemMessagesQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateSystemMessagesModal
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
        <UpdateSystemMessagesModal
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
export default SystemMessagesList;
