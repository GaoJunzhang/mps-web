import { axios } from '@/utils/request'
const deviceApi = {
  deviceTypeData: '/deviceType/getByPage',
  deviceTypeById: '/deviceType/get',
  getAllDeviceType: '/deviceType/getAll',
  addDeviceType: '/deviceType/addDeviceType',
  delDeviceTypeByIds: '/deviceType/delByIds',
  resourcTypeData: '/resourceType/getByPage',
  resourceTypeById: '/resourceType/get',
  getAllResourceType: '/resourceType/getAll',
  addResourceType: '/resourceType/saveOrUpdate',
  delResourceTypeByIds: '/resourceType/delByIds',
  findBydTypeId: '/resourceType/findBydTypeId',
  batchSaveRtypeDtype: '/rtypeDtype/batchSave',
  deleteBydtIdAndrtId: '/rtypeDtype/deleteBydtIdAndrtId'
}
export default deviceApi

export function deviceTypeData (parameter) {
  return axios({
    url: deviceApi.deviceTypeData,
    method: 'get',
    params: parameter
  })
}

export const deviceTypeById = (id) => {
  return axios({
    url: deviceApi.deviceTypeById + `/${id}`,
    method: 'get'
  })
}

export const getAllDeviceType = () => {
  return axios({
    url: deviceApi.getAllDeviceType,
    method: 'get'
  })
}

export const addDeviceType = (params) => {
  return axios({
    url: deviceApi.addDeviceType,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

export const delDeviceTypeByIds = (id) => {
  return axios({
    url: deviceApi.delDeviceTypeByIds + `/${id}`,
    method: `delete`
  })
}

/**
 * resourceType
 */
export const resourcTypeData = (params) => {
  return axios({
    url: deviceApi.resourcTypeData,
    method: 'get',
    params: params
  })
}
export const resourceTypeById = (id) => {
  return axios({
    url: deviceApi.resourceTypeById + `/${id}`,
    method: 'get'
  })
}
export const getAllResourceType = () => {
  return axios({
    url: deviceApi.getAllResourceType,
    method: 'get'
  })
}
export const addResourceType = (params) => {
  return axios({
    url: deviceApi.addResourceType,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

export const delResourceTypeByIds = (id) => {
  return axios({
    url: deviceApi.delResourceTypeByIds + `/${id}`,
    method: `delete`
  })
}

export const findBydTypeId = (dtid) => {
  return axios({
    url: deviceApi.findBydTypeId + `/${dtid}`,
    method: 'get'
  })
}

export const batchSaveRtypeDtype = (params) => {
  return axios({
    url: deviceApi.batchSaveRtypeDtype,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

export const deleteBydtIdAndrtId = (params) => {
  return axios({
    url: deviceApi.deleteBydtIdAndrtId,
    method: `delete`,
    params: params
  })
}
