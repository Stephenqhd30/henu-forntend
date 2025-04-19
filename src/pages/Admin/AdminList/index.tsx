import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import {
  exportAdminTemplateUsingGet,
  exportAdminUsingGet,
} from '@/services/henu-backend/excelController';
import { ADMIN_EXCEL, EXPORT_ADMIN_EXCEL } from '@/constants';
import {
  deleteAdminUsingPost,
  listAdminByPageUsingPost,
} from '@/services/henu-backend/adminController';
import { adminTypeEnum } from '@/enums/AdminTypeEnum';
import CreateAdminModal from '@/pages/Admin/AdminList/components/CreateAdminModal';
import { UpdateAdminModal, UploadAdminModal } from '@/pages/Admin/AdminList/components';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteAdminUsingPost({
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
 * 管理员管理列表
 * @constructor
 */
const AdminList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前管理员的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.Admin>();
  // 创建管理员 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新管理员 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 上传窗口 Modal 框
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);

  /**
   * 下载管理员信息
   */
  const downloadAdminInfo = async () => {
    const hide = message.loading('文件下载中....');
    try {
      const res = await exportAdminUsingGet({
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
    } finally {
      hide();
    }
  };

  /**
   * 下载导入管理员示例数据
   */
  const downloadAdminExample = async () => {
    try {
      const res = await exportAdminTemplateUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', EXPORT_ADMIN_EXCEL);
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
  const columns: ProColumns<API.Admin>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '管理员',
      dataIndex: 'adminName',
      valueType: 'text',
    },
    {
      title: '管理员编号',
      dataIndex: 'adminNumber',
      valueType: 'text',
    },
    {
      title: '管理员密码',
      dataIndex: 'adminPassword',
      valueType: 'password',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '权限',
      dataIndex: 'adminType',
      valueEnum: adminTypeEnum,
      render: (_, record) => {
        // @ts-ignore
        const role = adminTypeEnum[record.adminType];
        return <Tag color={role?.color}>{role.text}</Tag>;
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
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          {/*删除表单管理员的PopConfirm框*/}
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
      <ProTable<API.Admin, API.PageParams>
        headerTitle={'管理员查询'}
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
              新建管理员
            </Button>
            <Button
              icon={<DownloadOutlined />}
              key={'export-example'}
              onClick={async () => {
                await downloadAdminExample();
              }}
            >
              下载导入管理员示例数据
            </Button>
            <Button
              icon={<UploadOutlined />}
              key={'upload'}
              onClick={() => {
                setUploadModalVisible(true);
              }}
            >
              批量导入管理员信息
            </Button>
            <Button
              icon={<DownloadOutlined />}
              key={'export'}
              onClick={async () => {
                await downloadAdminInfo();
              }}
            >
              导出管理员信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listAdminByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.AdminQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateAdminModal
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
        <UpdateAdminModal
          oldData={currentRow}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
          onSubmit={async () => {
            actionRef.current?.reload();
            setUpdateModalVisible(false);
          }}
          visible={updateModalVisible}
        />
      )}
      {/*上传管理员信息*/}
      {uploadModalVisible && (
        <UploadAdminModal
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
export default AdminList;
