import { axios } from '@/utils/request'

const taskApi = {
  getTaskList: '/task/taskListData',
  delTask: '/task/delTask',
  auditTask: '/task/auditTask',
  auditTaskRecords: '/task/auditTaskRecords'
}

export default taskApi

export function getTaskList (parameter) {
  return axios({
    url: taskApi.getTaskList,
    method: 'get',
    params: parameter
  })
}

export function delTask (ids, parameter) {
  return axios({
    url: taskApi.delTask + `/${ids}`,
    method: 'delete',
    data: parameter
  })
}

export function auditTask (parameter) {
  return axios({
    url: taskApi.auditTask,
    method: 'post',
    data: parameter
  })
}

export function auditTaskRecords (id) {
  return axios({
    url: taskApi.auditTaskRecords + `/${id}`,
    method: 'get'
  })
}
