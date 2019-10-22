import { axios } from '@/utils/request'
const menuApi = {
  getAuthById: '/menu/getById',
  saveAuth: '/menu/saveAuth',
  delAuth: '/menu/delAuth'
}

export default menuApi

export function getAuthById (id) {
  return axios({
    url: menuApi.getAuthById + `/${id}`,
    method: 'get'
  })
}

export function saveAuth (parameter) {
  return axios({
    url: menuApi.saveAuth,
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

export function delAuth (ids, parameter) {
  return axios({
    url: menuApi.delAuth + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}
