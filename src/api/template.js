import { axios } from '@/utils/request'

const templateApi = {
  getTemplateList: '/template/templateListData',
  saveTemplate: '/template/saveTemplate',
  delTemplate: '/template/delTemplate'
}

export default templateApi

export function getTemplateList (parameter) {
  return axios({
    url: templateApi.getTemplateList,
    method: 'get',
    params: parameter
  })
}

export function saveTemplate (parameter) {
  return axios({
    url: templateApi.saveTemplate,
    method: 'post',
    data: parameter
  })
}

export function delTemplate (parameter) {
  return axios({
    url: templateApi.delTemplate + `/${parameter}`,
    method: 'delete',
    data: parameter
  })
}
