import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useRef } from 'react';
import { FAMILY_EXCEL } from '@/constants';
import { exportFamilyUsingGet } from '@/services/henu-backend/excelController';
import { listFamilyVoByPageUsingPost } from '@/services/henu-backend/familyController';

/**
 * 家庭关系列表
 * @constructor
 */
const FamilyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  /**
   * 下载家庭关系信息
   */
  const downloadFamilyInfo = async () => {
    try {
      const res = await exportFamilyUsingGet({
        responseType: 'blob',
      });
      // 创建 Blob 对象
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', FAMILY_EXCEL);
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
  const columns: ProColumns<API.FamilyVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户姓名',
      dataIndex: 'userVO',
      hideInSearch: true,
      render: (_, record) => <span>{record?.userVO?.userName}</span>,
    },
    {
      title: '家庭成员姓名',
      dataIndex: 'familyName',
      valueType: 'text',
    },
    {
      title: '称谓',
      dataIndex: 'appellation',
      valueType: 'text',
    },

    {
      title: '工作单位及职务',
      dataIndex: 'workDetail',
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
  ];
  return (
    <PageContainer>
      <ProTable<API.FamilyVO, API.PageParams>
        headerTitle={'家庭关系查询'}
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
                await downloadFamilyInfo();
              }}
            >
              <DownloadOutlined />
              导出家庭关系信息
            </Button>
          </Space>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
          const { data, code } = await listFamilyVoByPageUsingPost({
            ...params,
            ...filter,
            sortField,
            sortOrder,
          } as API.FamilyQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: data?.total || 0,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};
export default FamilyList;
