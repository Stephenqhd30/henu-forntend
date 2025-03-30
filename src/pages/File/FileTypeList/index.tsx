import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Select, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { FILE_TYPE_EXCEL } from '@/constants';
import { deleteFileLogUsingPost } from '@/services/henu-backend/fileLogController';
import { exportFileLogUsingGet } from '@/services/henu-backend/excelController';
import { listFileTypeByPageUsingPost } from '@/services/henu-backend/fileTypeController';
import { CreateFileTypeModal, UpdateFileTypeModal } from '@/pages/File/FileTypeList/components';

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
 * 文件上传类型管理
 * @constructor
 */
const FileTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前数据
  const [currentRow, setCurrentRow] = useState<API.FileType>();
  // 创建文件上传类型 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新文件上传类型 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  /**
   * 下载文件上传日志信息
   */
  const downloadFileTypeInfo = async () => {
    try {
      const res = await exportFileLogUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', FILE_TYPE_EXCEL);
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
  const columns: ProColumns<API.FileType>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '文件上传类型名称',
      dataIndex: 'typeName',
      valueType: 'text',
    },
    {
      title: '文件上传类型值',
      dataIndex: 'typeValues',
      render: (_, record) => {
        if (record.typeValues) {
          const typeList = JSON.parse(record.typeValues as string);
          return typeList.map((type: any) => (
            <Tag key={type} color="blue">
              {type}
            </Tag>
          ));
        }
        return <Tag>{'无'}</Tag>;
      },
      renderFormItem: (_, { value }, form) => {
        const parsedValue = Array.isArray(value) ? value : [];
        return (
          <Select
            mode="tags"
            value={parsedValue}
            onChange={(val) => form.setFieldsValue({ typeValues: val })}
            placeholder="请输入文件类型，回车确认"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          >
            {/* 默认选项 */}
            <Select.Option value="jpg">JPG</Select.Option>
            <Select.Option value="png">PNG</Select.Option>
            <Select.Option value="webp">WEBP</Select.Option>
            <Select.Option value="pdf">PDF</Select.Option>
          </Select>
        );
      },
    },
    {
      title: '最大可上传文件大小',
      dataIndex: 'maxFileSize',
      valueType: 'digit',
      render: (_, record) => {
        // eslint-disable-next-line eqeqeq
        if (record.maxFileSize != null) {
          const sizeInMB = (record.maxFileSize / (1024 * 1024)).toFixed(2);
          return `${sizeInMB} MB`;
        }
        return '未设置';
      },
      renderFormItem: (_, { value }, form) => {
        const sizeOptions = [1, 2, 5, 10]; // 默认选项：1MB、2MB、5MB、10MB
        return (
          <Select
            value={value}
            onChange={(val) => {
              // 将 MB 转换为字节（B）
              // eslint-disable-next-line eqeqeq
              const sizeInBytes = val != null ? val * 1024 * 1024 : null;
              form.setFieldsValue({ maxFileSize: sizeInBytes });
            }}
            placeholder="请选择文件大小"
            style={{ width: '100%' }}
          >
            {sizeOptions.map((size) => (
              // @ts-ignore
              <Option key={size} value={size}>
                {`${size} MB`}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '创建者id',
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
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
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
      <ProTable<API.FileType, API.PageParams>
        headerTitle={'文件上传类型'}
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
              新建文件上传类型
            </Button>
            <Button
              icon={<DownloadOutlined />}
              key={'export'}
              onClick={async () => {
                await downloadFileTypeInfo();
              }}
            >
              导出文件上传类型
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listFileTypeByPageUsingPost({
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
      {createModalVisible && (
        <CreateFileTypeModal
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
        <UpdateFileTypeModal
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
    </>
  );
};
export default FileTypeList;
