import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';
import { Button, message, Popconfirm } from 'antd';
import {
  clearRegistrationFormUsingGet,
  clearFileLogUsingGet,
  clearEducationUsingGet,
  clearFamilyUsingGet,
  clearJobUsingGet,
  clearDeadlineUsingGet,
  clearReviewLogUsingGet,
  clearOperationLogUsingGet,
  clearMessageNoticeUsingGet,
  clearMessagePushUsingGet,
  clearSystemMessageUsingGet,
  clearAllDataUsingGet, clearMessageUsingGet
} from '@/services/henu-backend/clearController';

/**
 * 数据清理列表
 * @constructor
 */
const ClearList: React.FC = () => {
  const clearItems = [
    { key: 'all', label: '所有', api: clearAllDataUsingGet },
    { key: 'registrationForm', label: '报名登记表', api: clearRegistrationFormUsingGet },
    { key: 'fileLog', label: '文件上传', api: clearFileLogUsingGet },
    { key: 'education', label: '教育经历', api: clearEducationUsingGet },
    { key: 'family', label: '家庭成员', api: clearFamilyUsingGet },
    { key: 'job', label: '岗位信息', api: clearJobUsingGet },
    { key: 'deadline', label: '截止日期信息', api: clearDeadlineUsingGet },
    { key: 'reviewLog', label: '审核记录', api: clearReviewLogUsingGet },
    { key: 'operationLog', label: '操作日志', api: clearOperationLogUsingGet },
    { key: 'message', label: '消息通知', api: clearMessageUsingGet },
    { key: 'messageNotice', label: '面试通知', api: clearMessageNoticeUsingGet },
    { key: 'messagePush', label: '短信推送日志', api: clearMessagePushUsingGet },
    { key: 'systemMessages', label: '系统消息', api: clearSystemMessageUsingGet },
  ];

  const handleClear = async (api: () => Promise<any>, label: string) => {
    const hide = message.loading(`正在清除 ${label} 数据...`);
    try {
      const res = await api();
      if (res.code === 0 && res.data) {
        message.success(`${label}数据清除成功`);
      } else {
        message.error(`${label}数据清除失败` + res.message);
      }
    } catch (error: any) {
      message.error(`${label}数据清除失败` + error.message);
    } finally {
      hide();
    }
  };

  return (
    <PageContainer>
      <ProCard gutter={[16, 16]} wrap>
        {clearItems.map(({ key, label, api }) => (
          <ProCard
            bordered
            key={key}
            title={`清除${label}数据`}
            colSpan={{ xs: 24, sm: 12, md: 12, lg: 6, xl: 6 }}
            layout="center"
            extra={
              <Popconfirm
                title={`确定清除${label}数据？`}
                onConfirm={() => handleClear(api, label)}
                okText="确定"
                cancelText="取消"
              >
                <Button size={'small'} danger>
                  清理
                </Button>
              </Popconfirm>
            }
          />
        ))}
      </ProCard>
    </PageContainer>
  );
};

export default ClearList;
