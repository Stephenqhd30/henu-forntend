import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {
  exportSchoolTypeTemplateUsingGet,
  exportSchoolTypeUsingGet,
} from '@/services/henu-backend/excelController';
import { EXPORT_SCHOOL_TYPE_EXCEL, SCHOOL_TYPE_EXCEL } from '@/constants';
import {
  deleteSchoolTypeUsingPost,
  listSchoolTypeByPageUsingPost,
} from '@/services/henu-backend/schoolTypeController';
import {
  CreateSchoolTypeModal,
  UpdateSchoolTypeModal,
  UploadSchoolTypeModal,
} from '@/pages/School/SchoolTypeList/components';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    const res = await deleteSchoolTypeUsingPost({
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
 * 高校类型信息管理
 * @constructor
 */
const SchoolTypeList: React.FC = () => {
  // 新建窗口的Modal框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新窗口的Modal框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 上传窗口 Modal 框
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前标签的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.SchoolType>();

  /**
   * 下载高校类型信息
   */
  const downloadSchoolTypeInfo = async () => {
    const hide = message.loading('文件下载中....');
    try {
      const res = await exportSchoolTypeUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', SCHOOL_TYPE_EXCEL);
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
   * 下载导入息高校信示例数据
   */
  const downloadSchoolTypeExample = async () => {
    try {
      const res = await exportSchoolTypeTemplateUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', EXPORT_SCHOOL_TYPE_EXCEL);
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
  const columns: ProColumns<API.SchoolType>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '类型名称',
      dataIndex: 'typeName',
      valueType: 'text',
    },
    {
      title: '创建人id',
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
              actionRef.current?.reload();
            }}
          >
            修改
          </Typography.Link>
          {/*删除表单高校类型信息的PopConfirm框*/}
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
      <ProTable<API.SchoolTypeVO, API.PageParams>
        headerTitle={'高校类型信息'}
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
              新建高校类型信息
            </Button>
            <Button
              icon={<DownloadOutlined />}
              key={'export-example'}
              onClick={async () => {
                await downloadSchoolTypeExample();
              }}
            >
              下载导入高校类型信息示例数据
            </Button>
            <Button
              icon={<UploadOutlined />}
              key={'upload'}
              onClick={() => {
                setUploadModalVisible(true);
              }}
            >
              批量导入高校类型信息
            </Button>
            <Button
              icon={<DownloadOutlined />}
              key={'export'}
              onClick={async () => {
                await downloadSchoolTypeInfo();
              }}
            >
              导出高校类型信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listSchoolTypeByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.SchoolTypeQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />

      {/*新建表单的Modal框*/}
      {createModalVisible && (
        <CreateSchoolTypeModal
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          onSubmit={async () => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          visible={createModalVisible}
          columns={columns}
        />
      )}
      {/*更新表单的Modal框*/}
      {updateModalVisible && (
        <UpdateSchoolTypeModal
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
          onSubmit={async () => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          visible={updateModalVisible}
          columns={columns}
          oldData={currentRow}
        />
      )}
      {/*上传高校类型信息*/}
      {uploadModalVisible && (
        <UploadSchoolTypeModal
          onCancel={() => {
            setUploadModalVisible(false);
          }}
          visible={uploadModalVisible}
          onSubmit={async () => {
            setUploadModalVisible(false);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default SchoolTypeList;
