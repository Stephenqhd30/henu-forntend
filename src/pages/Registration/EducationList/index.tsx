import { DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useRef } from 'react';
import { EDUCATION_EXCEL } from '@/constants';
import { listEducationVoByPageUsingPost } from '@/services/henu-backend/educationController';
import { exportEducationUsingGet } from '@/services/henu-backend/excelController';

/**
 * 教育经历列表
 * @constructor
 */
const EducationVOList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * 下载教育经历信息
   */
  const downloadEducationVOInfo = async () => {
    const hide = message.loading('文件下载中....');
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
    } finally {
      hide();
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
      title: '用户',
      dataIndex: 'userId',
      render: (_, record) => <span>{record?.userVO?.userName}</span>,
      hideInSearch: true,
    },
    {
      title: '学校',
      dataIndex: 'schoolId',
      render: (_, record) => <span>{record?.schoolVO?.schoolName}</span>,
      hideInSearch: true,
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
          const sortField = 'update_time';
          const sortOrder = sort?.[sortField] ?? 'descend';
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
    </PageContainer>
  );
};
export default EducationVOList;
