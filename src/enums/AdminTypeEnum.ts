export enum AdminType {
  ADMIN = 'admin',
  SYSTEM_ADMIN = 'system_admin',
}

export const adminTypeEnum = {
  [AdminType.ADMIN]: {
    text: '普通管理员',
    value: AdminType.ADMIN,
    color: 'processing',
  },
  [AdminType.SYSTEM_ADMIN]: {
    text: '系统管理员',
    value: AdminType.SYSTEM_ADMIN,
    color: 'success',
  },
};
