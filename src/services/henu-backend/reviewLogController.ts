// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addReviewLog POST /api/reviewLog/add */
export async function addReviewLogUsingPost(
  body: API.ReviewLogAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/reviewLog/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** batchAddReviewLogs POST /api/reviewLog/add/batch */
export async function batchAddReviewLogsUsingPost(
  body: API.ReviewLogAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/reviewLog/add/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getReviewLogVOById GET /api/reviewLog/get/vo */
export async function getReviewLogVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewLogVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseReviewLogVO_>('/api/reviewLog/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listReviewLogByPage POST /api/reviewLog/list/page */
export async function listReviewLogByPageUsingPost(
  body: API.ReviewLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageReviewLog_>('/api/reviewLog/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listReviewLogVOByPage POST /api/reviewLog/list/page/vo */
export async function listReviewLogVoByPageUsingPost(
  body: API.ReviewLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageReviewLogVO_>('/api/reviewLog/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
