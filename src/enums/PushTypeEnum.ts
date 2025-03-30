export enum PushType {
  SMS = 'sms',
}

export const pushTypeEnum = {
  [PushType.SMS]: {
    text: '短信通知',
    value: PushType.SMS,
  },
};
