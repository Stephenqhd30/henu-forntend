export enum SystemPushType {
  SYSTEM_MAINTAIN_NOTICE = 'system_maintain_notice',
  SYSTEM_NOTICE = 'system_notice',
}

export const systemTypeEnum = {
  [SystemPushType.SYSTEM_MAINTAIN_NOTICE]: {
    text: '系统维护通知',
    value: SystemPushType.SYSTEM_MAINTAIN_NOTICE,
  },
  [SystemPushType.SYSTEM_NOTICE]: {
    text: '系统公告',
    value: SystemPushType.SYSTEM_NOTICE,
  },
};
