import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { exportDeadlineUsingGet } from '@/services/henu-backend/excelController';
import { DEADLINE_EXCEL } from '@/constants';
import {
  deleteDeadlineUsingPost,
  listDeadlineByPageUsingPost,
} from '@/services/henu-backend/deadlineController';
import { CreateDeadlineModal, UpdateDeadlineModal } from '@/pages/Job/DeadlineList/components';
import { listJobByPageUsingPost } from '@/services/henu-backend/jobController';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteDeadlineUsingPost({
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
 * 截止时间管理列表
 * @constructor
 */
const DeadlineList: React.FC = () => {
  // 创建截止时间 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新截止时间 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前截止时间的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.Deadline>();

  /**
   * 下载截止时间信息
   */
  const downloadDeadlineInfo = async () => {
    try {
      const res = await exportDeadlineUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', DEADLINE_EXCEL);
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
  const columns: ProColumns<API.Deadline>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '岗位名称',
      dataIndex: 'jobId',
      valueType: 'select',
      request: async () => {
        const res = await listJobByPageUsingPost({});
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
      },
      fieldProps: {
        placeholder: '请选择岗位信息',
      },
    },
    {
      title: '截止时间',
      dataIndex: 'deadlineTime',
      valueType: 'dateTime',
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
          {/*删除表单截止时间的PopConfirm框*/}
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
      <ProTable<API.Deadline, API.PageParams>
        headerTitle={'截止时间查询'}
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
              新建截止时间信息
            </Button>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadDeadlineInfo();
              }}
            >
              <DownloadOutlined />
              导出截止时间信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listDeadlineByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.DeadlineQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateDeadlineModal
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
        <UpdateDeadlineModal
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
export default DeadlineList;
