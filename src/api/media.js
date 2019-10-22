import { axios } from '@/utils/request'
const mediaApi = {
  getMediaData: '/media/getMediaData',
  saveMedia: '/media/saveMedia',
  delMedia: '/media/delMedia',
  getTransStatus: '/media/getTransStatus'
}

export default mediaApi

export function getMediaData (parameter) {
  return axios({
    url: mediaApi.getMediaData,
    method: 'get',
    params: parameter
  })
}

export function saveMedia (parameter) {
  return axios({
    url: mediaApi.saveMedia,
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

export function delMedia (ids, parameter) {
  return axios({
    url: mediaApi.delMedia + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}

export function getTransStatus () {
  return axios({
    url: mediaApi.getTransStatus,
    method: `get`
  })
}
