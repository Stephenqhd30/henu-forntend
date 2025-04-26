import {DownloadOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {ActionType, PageContainer, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, message, Popconfirm, Space, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import {deleteCadreTypeUsingPost, listCadreTypeByPageUsingPost} from '@/services/henu-backend/cadreTypeController';
import {exportCadreTypeUsingGet} from '@/services/henu-backend/excelController';
import {CADRE_TYPE_EXCEL} from '@/constants';
import CreateCadreTypeModal from '@/pages/Job/CadreTypeList/components/CreateCadreTypeModal';
import UpdateCadreTypeModal from '@/pages/Job/CadreTypeList/components/UpdateCadreTypeModal';
import {UploadCadreTypeModal} from '@/pages/Job/CadreTypeList/components';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteCadreTypeUsingPost({
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
 * 干部类型管理列表
 * @constructor
 */
const CadreTypeList: React.FC = () => {
  // 创建干部类型 Modal 框
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 更新干部类型 Modal 框
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 上传窗口 Modal 框
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前干部类型的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.CadreType>();

  /**
   * 下载干部类型信息
   */
  const downloadCadreTypeInfo = async () => {
    const hide = message.loading('文件下载中....');
    try {
      const res = await exportCadreTypeUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', CADRE_TYPE_EXCEL);
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
   * 表格列数据
   */
  const columns: ProColumns<API.CadreType>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '干部类型名称',
      dataIndex: 'type',
      valueType: 'text',
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
      <ProTable<API.CadreType, API.PageParams>
        headerTitle={'干部类型查询'}
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
              新建干部类型信息
            </Button>
            <Button
              icon={<UploadOutlined />}
              key={'upload'}
              onClick={() => {
                setUploadModalVisible(true);
              }}
            >
              批量导入干部类型信息
            </Button>
            <Button
              key={'export'}
              onClick={async () => {
                await downloadCadreTypeInfo();
              }}
            >
              <DownloadOutlined />
              导出干部类型信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listCadreTypeByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.CadreTypeQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {createModalVisible && (
        <CreateCadreTypeModal
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
        <UpdateCadreTypeModal
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
      {uploadModalVisible && (
        <UploadCadreTypeModal
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
export default CadreTypeList;
