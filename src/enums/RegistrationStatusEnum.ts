export enum RegistrationStatus {
  NO = 0,
  YES = 1,
  INTERVIEW = 2,
  ADMIT = 3,
}

export const registrationStatusEnum = {
  [RegistrationStatus.NO]: {
    text: '待报名',
    value: RegistrationStatus.NO,
  },
  [RegistrationStatus.YES]: {
    text: '已报名',
    value: RegistrationStatus.YES,
  },
  [RegistrationStatus.INTERVIEW]: {
    text: '待发送面试通知',
    value: RegistrationStatus.INTERVIEW,
  },
  [RegistrationStatus.ADMIT]: {
    text: '已发送面试通知',
    value: RegistrationStatus.ADMIT,
  },
};
