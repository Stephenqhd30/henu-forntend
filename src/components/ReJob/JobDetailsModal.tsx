import { ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Modal } from 'antd';

interface Props {
  job: API.JobVO;
  visible: boolean;
  onCancel: () => void;
}

/**
 * 岗位信息详细
 * @param props
 * @constructor
 */
const JobDetailsModal: React.FC<Props> = (props) => {
  const { job, visible, onCancel } = props;

  // 配置 ProDescriptions 的列
  const columns = [
    {
      title: '岗位编号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '岗位名称',
      dataIndex: 'jobName',
      valueType: 'text',
    },
    {
      title: '岗位描述',
      dataIndex: 'jobExplanation',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'date',
    },
  ];

  return (
    <Modal open={visible} destroyOnClose onCancel={onCancel} footer={null}>
      <ProDescriptions
        title="岗位信息详细"
        columns={columns}
        column={1}
        dataSource={job}
      />
    </Modal>
  );
};

export default JobDetailsModal;
