import { axios } from '@/utils/request'

const mgroupApi = {
  getMgroupList: '/mgroup/mgroupListData',
  getMgroupByName: 'mgroup/mgroupByName',
  saveMgroup: '/mgroup/saveMgroup',
  delMgroup: '/mgroup/delMgroup',
  getAuhtSelectData: '/mgroup/getAuhtSelectData'
}

export default mgroupApi

export function getMgroupList (parameter) {
  return axios({
    url: mgroupApi.getMgroupList,
    method: 'get',
    params: parameter
  })
}

export function getMgroupByName (parameter) {
  return axios({
    url: mgroupApi.getMgroupByName,
    method: 'get',
    params: parameter
  })
}

export function saveMgroup (parameter) {
  return axios({
    url: mgroupApi.saveMgroup,
    method: 'post',
    data: parameter
  })
}

export function delMgroup (parameter) {
  return axios({
    url: mgroupApi.delMgroup + `/${parameter}`,
    method: 'delete',
    data: parameter
  })
}

export function getAuhtSelectData (parameter) {
  return axios({
    url: mgroupApi.getAuhtSelectData,
    method: 'get',
    params: parameter
  })
}
