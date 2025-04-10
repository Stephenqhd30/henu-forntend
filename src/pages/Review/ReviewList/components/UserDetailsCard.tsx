import React from 'react';
import { Tag } from 'antd';
import { ProList } from '@ant-design/pro-components';

interface Props {
  registration: API.RegistrationFormVO;
}

/**
 * 用户详细信息
 * @param props
 * @constructor
 */
const UserDetailsModal: React.FC<Props> = (props) => {
  const { registration } = props;

  return (
    <>
      <ProList
        headerTitle="教育经历"
        dataSource={registration.educationVOList || []}
        metas={{
          title: {
            render: (_, row) => `${row.educationalStage} - ${row.schoolVO?.schoolName}`,
          },
          subTitle: {
            render: (_, row: API.EducationVO) => {
              if (row?.schoolVO?.schoolTypes && row.schoolVO.schoolTypes.length > 0) {
                return row.schoolVO.schoolTypes.map((type: string) => (
                  <Tag key={type} color="blue">
                    {type}
                  </Tag>
                ));
              }
            },
          },
          description: {
            render: (_, row) => {
              return <span>{`专业: ${row.major} - 学习时间: ${row.studyTime}`}</span>;
            },
          },
        }}
        locale={{ emptyText: '暂无教育经历' }}
      />
      <ProList
        headerTitle="家庭信息"
        dataSource={registration.familyVOList || []}
        metas={{
          title: { dataIndex: 'familyName', title: '姓名' },
          subTitle: {
            render: (_, row) => {
              return (
                <Tag key={row.userId} color="blue">
                  {row.appellation}
                </Tag>
              );
            },
          },
          description: { dataIndex: 'workDetail', title: '职业' },
        }}
        locale={{ emptyText: '暂无家庭信息' }}
      />
      <ProList
        headerTitle="附件信息"
        dataSource={registration.fileLogVOList || []}
        metas={{
          title: {
            render: (_, row) => {
              return (
                <a target={'_blank'} rel="noopener noreferrer" href={row.filePath}>
                  {row?.fileTypeVO?.typeName}
                </a>
              );
            },
          },
        }}
        locale={{ emptyText: '暂无文件上传信息' }}
      />
    </>
  );
};
export default UserDetailsModal;
