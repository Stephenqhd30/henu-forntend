import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { EDUCATION_EXCEL } from '@/constants';
import {
  deleteEducationUsingPost,
  listEducationVoByPageUsingPost,
} from '@/services/henu-backend/educationController';
import { exportEducationUsingGet } from '@/services/henu-backend/excelController';
import { UserDetailsModal } from '@/components/ReUser';

/**
 * 删除节点
 *
 * @param row
 */
const handleDelete = async (row: API.DeleteRequest) => {
  const hide = message.loading('正在删除');
  if (!row) return true;
  try {
    await deleteEducationUsingPost({
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
 * 教育经历列表
 * @constructor
 */
const EducationVOList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前教育经历的所点击的数据
  const [currentRow, setCurrentRow] = useState<API.EducationVO>();
  // 用户详细Modal
  const [userModal, setUserModal] = useState<boolean>(false);

  /**
   * 下载教育经历信息
   */
  const downloadEducationVOInfo = async () => {
    try {
      const res = await exportEducationUsingGet({
        responseType: 'blob',
      });

      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', EDUCATION_EXCEL);
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
  const columns: ProColumns<API.EducationVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户姓名',
      dataIndex: 'userVO',
      render: (_, record) => <span>{record?.userVO?.userName}</span>,
    },
    {
      title: '学校名称',
      dataIndex: 'schoolVO',
      render: (_, record) => <span>{record?.schoolVO?.schoolName}</span>,
    },
    {
      title: '教育阶段',
      dataIndex: 'educationalStage',
      valueType: 'text',
    },
    {
      title: '专业',
      dataIndex: 'major',
      valueType: 'text',
    },
    {
      title: '学习起止年月',
      dataIndex: 'studyTime',
      valueType: 'text',
    },
    {
      title: '证明人',
      dataIndex: 'certifier',
      valueType: 'text',
    },
    {
      title: '证明人联系电话',
      dataIndex: 'certifierPhone',
      valueType: 'text',
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
            key="user-details"
            onClick={() => {
              setUserModal(true);
              setCurrentRow(record);
            }}
          >
            查看用户信息
          </Typography.Link>
          {/*删除表单教育经历的PopConfirm框*/}
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
      <ProTable<API.EducationVO, API.PageParams>
        headerTitle={'教育经历查询'}
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
                await downloadEducationVOInfo();
              }}
            >
              <DownloadOutlined />
              导出教育经历信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listEducationVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.EducationQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
      {userModal && (
        <UserDetailsModal
          onCancel={() => {
            setUserModal(false);
          }}
          visible={userModal}
          user={currentRow?.userVO ?? {}}
        />
      )}
    </PageContainer>
  );
};
export default EducationVOList;
