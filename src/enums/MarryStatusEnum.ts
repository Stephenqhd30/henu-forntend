export enum MarryStatus {
  NO = 0,
  YES = 1,
}

export const marryStatusEnum = {
  [MarryStatus.YES]: {
    text: '已婚',
    value: MarryStatus.YES,
  },

  [MarryStatus.NO]: {
    text: '未婚',
    value: MarryStatus.NO,
  },
};
