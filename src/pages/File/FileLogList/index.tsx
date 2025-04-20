import { ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm, Progress, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { FILE_LOG_EXCEL } from '@/constants';
import {
  deleteFileLogUsingPost,
  downloadFileUsingGet,
  listFileLogVoByPageUsingPost,
} from '@/services/henu-backend/fileLogController';
import { exportFileLogUsingGet } from '@/services/henu-backend/excelController';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    const res = await deleteFileLogUsingPost({
      id: row.id,
    });
    if (res.code === 0 && res.data) {
      message.success('删除成功');
    } else {
      message.error(`删除失败${res.message}, 请重试!`);
    }
  } catch (error: any) {
    message.error(`删除失败${error.message}, 请重试!`);
  } finally {
    hide();
  }
};

/**
 * 文件上传日志管理
 * @constructor
 */
const FileLogVOList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前标签的所点击的数据
  const [, setCurrentRow] = useState<API.FileLogVO>();

  /**
   * 下载文件上传日志信息
   */
  const downloadFileLogVOInfo = async () => {
    const hide = message.loading('文件下载中....');
    try {
      const res = await exportFileLogUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', FILE_LOG_EXCEL);
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
   * 下载的文件（ZIP）
   */
  const downloadFile = async () => {
    const key = 'downloadFile';
    let percent = 0;
    let downloadCompleted = false;
    // 显示初始通知
    notification.open({
      key,
      message: '文件下载中...',
      description: <Progress percent={percent} status="active" />,
      duration: 0,
      placement: "top",
    });
    // 模拟进度增长
    const interval = setInterval(() => {
      if (percent < 95) {
        percent += Math.floor(Math.random() * 5) + 5;
        if (percent > 95) percent = 95;
        notification.open({
          key,
          message: '文件下载中...',
          description: <Progress percent={percent} status="active" />,
          duration: 0,
          placement: "top",
        });
      } else if (downloadCompleted) {
        percent = 100;
        clearInterval(interval);
        notification.open({
          key,
          message: '文件下载完成',
          description: <Progress percent={percent} status="success" />,
          duration: 2,
          placement: "top",
        });
      }
    }, 2000);
    try {
      const response = await downloadFileUsingGet({
        responseType: 'blob',
        getResponse: true,
      });
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
        placement: "top",
      });
    }
  };

  /**
   * 表格列数据
   */
  const columns: ProColumns<API.FileLogVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      valueType: 'text',
    },
    {
      title: '文件上传路径',
      dataIndex: 'filePath',
      valueType: 'text',
    },
    {
      title: '文件类型',
      dataIndex: 'fileTypeVO',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => <span>{record?.fileTypeVO?.typeName}</span>,
    },
    {
      title: '上传用户',
      dataIndex: 'userId',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => <span>{record?.userVO?.userName}</span>,
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
          {/*删除表单文件上传日志的PopConfirm框*/}
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
    <>
      <ProTable<API.FileLogVO, API.PageParams>
        headerTitle={'文件上传日志'}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
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
                await downloadFileLogVOInfo();
              }}
            >
              导出文件上传日志
            </Button>
            <Button
              key={'file'}
              onClick={async () => {
                await downloadFile();
              }}
              icon={<ArrowDownOutlined />}
            >
              下载附件信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'create_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listFileLogVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.FileLogQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
    </>
  );
};
export default FileLogVOList;
