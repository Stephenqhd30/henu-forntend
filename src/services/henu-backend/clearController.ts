// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** clearAllData GET /api/clear/all */
export async function clearAllDataUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearDeadline GET /api/clear/deadline */
export async function clearDeadlineUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/deadline', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearEducation GET /api/clear/education */
export async function clearEducationUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/education', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearFamily GET /api/clear/family */
export async function clearFamilyUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/family', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearFileLog GET /api/clear/file/log */
export async function clearFileLogUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/file/log', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearJob GET /api/clear/job */
export async function clearJobUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/job', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearMessage GET /api/clear/message */
export async function clearMessageUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/message', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearMessageNotice GET /api/clear/message/notice */
export async function clearMessageNoticeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/message/notice', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearMessagePush GET /api/clear/message/push */
export async function clearMessagePushUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/message/push', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearOperationLog GET /api/clear/operation/log */
export async function clearOperationLogUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/operation/log', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearRegistrationForm GET /api/clear/registration/form */
export async function clearRegistrationFormUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/registration/form', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearReviewLog GET /api/clear/review/log */
export async function clearReviewLogUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/review/log', {
    method: 'GET',
    ...(options || {}),
  });
}

/** clearSystemMessage GET /api/clear/system/message */
export async function clearSystemMessageUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/clear/system/message', {
    method: 'GET',
    ...(options || {}),
  });
}
