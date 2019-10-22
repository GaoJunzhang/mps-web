import { axios } from '@/utils/request'
const roleApi = {
  getRoleData: '/role/getRoleData',
  saveRole: '/role/saveRole',
  delRole: '/role/delRole',
  getRoleAuths: '/role/getRoleAuth',
  getPermission: '/role/getPermission'
}

export default roleApi

export function getRoleData (parameter) {
  return axios({
    url: roleApi.getRoleData,
    method: 'get',
    params: parameter
  })
}

export function saveRole (parameter) {
  return axios({
    url: roleApi.saveRole,
    method: 'post',
    data: parameter,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

export function delRole (ids, parameter) {
  return axios({
    url: roleApi.delRole + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}

export function getRoleAuths (parameter) {
  return axios({
    url: roleApi.getRoleAuths,
    method: 'get',
    params: parameter
  })
}
export function getPermission () {
  return axios({
    url: roleApi.getPermission,
    method: 'get'
  })
}
