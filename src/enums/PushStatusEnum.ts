export enum PushStatus {
  NOT_PUSHED = 0,
  SUCCEED = 1,
  FAILED = 2,
}

/**
 * 消息推送状态(0-未推送,1-成功,2-失败,3-重试中)
 */
export const pushStatusEnum = {
  [PushStatus.NOT_PUSHED]: {
    text: '未推送',
    value: PushStatus.NOT_PUSHED,
    color: 'yellow',
  },
  [PushStatus.SUCCEED]: {
    text: '成功',
    value: PushStatus.SUCCEED,
    color: 'green',
  },
  [PushStatus.FAILED]: {
    text: '失败',
    value: PushStatus.FAILED,
    color: 'red',
  },
};
