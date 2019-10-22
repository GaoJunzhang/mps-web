import { axios } from '@/utils/request'
const resourceApi = {
  resourcLabData: '/resourceLab/getByPage',
  resourceLabById: '/resourceLab/get',
  getAllResourceLab: '/resourceLab/getAll',
  addResourceLab: '/resourceLab/saveOrUpdate',
  delResourceLabByIds: '/resourceLab/delByIds',
  resourceData: '/resource/getByPage',
  resourceById: '/resource/get',
  reourceListByUid: '/resource/reourceListByUid',
  addresource: '/resource/saveOrUpdate',
  delResourceIds: '/resource/delByIds',
  resourcTypeData: '/resourceType/getByPage',
  resourceTypeById: '/resourceType/get',
  getAllResourceType: '/resourceType/getAll',
  addResourceType: '/resourceType/saveOrUpdate',
  delResourceTypeByIds: '/resourceType/delByIds',
  findBydTypeId: '/resourceType/findBydTypeId',
  pageOssData: '/common/oss/pageOssData',
  deviceData: '/device/getByPage',
  getVaildDevicePage: '/device/getVaildDevicePage',
  deviceById: '/device/get',
  addDevice: '/device/saveOrUpdate',
  delDeviceIds: '/device/delByIds',
  deviceTypeData: '/deviceType/getByPage',
  deviceTypeById: '/deviceType/get',
  getAllDeviceType: '/deviceType/getAll',
  addDeviceType: '/deviceType/addDeviceType',
  delDeviceTypeByIds: '/deviceType/delByIds',
  uResourceData: '/userResource/getByPage',
  addUResource: '/userResource/saveOrUpdate',
  editUResource: '/userResource/edit',
  uResourceById: '/userResource/get',
  delUResourceIds: '/userResource/delByIds',
  getUserResourceByUid: '/userResource/getUserResourceByUid',
  userAuthData: '/userResource/userAuthData',
  updateUrIsforever: '/userResource/updateUrIsforever',
  updateUrStatus: '/userResource/updateUrStatus',
  addUrTime: '/userResource/addUrTime',
  uDeviceData: '/userDevice/getByPage',
  addUDevice: '/userDevice/saveOrUpdate',
  editUDevice: '/userDevice/edit',
  uDeviceById: '/userDevice/get',
  delUDeviceIds: '/userDevice/delByIds',
  getUserDeviceByUid: '/userDevice/getUserDeviceByUid'
}
export default resourceApi
/**
 * userDevice
 */
export const uDeviceData = (params) => {
  return axios({
    url: resourceApi.uDeviceData,
    method: 'get',
    params: params
  })
}
export const addUDevice = (params) => {
  return axios({
    url: resourceApi.addUDevice,
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
export const editUDevice = (params) => {
  return axios({
    url: resourceApi.editUDevice,
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
export const uDeviceById = (id) => {
  return axios({
    url: resourceApi.uDeviceById + `/${id}`,
    method: 'get'
  })
}
export const delUDeviceIds = (id) => {
  return axios({
    url: resourceApi.delUDeviceIds + `/${id}`,
    method: `delete`
  })
}
export const getUserDeviceByUid = (uid) => {
  return axios({
    url: resourceApi.getUserDeviceByUid + `/${uid}`,
    method: 'get'
  })
}
/**
 * userResource
 */
export const uResourceData = (params) => {
  return axios({
    url: resourceApi.uResourceData,
    method: 'get',
    params: params
  })
}
export const addUResource = (params) => {
  return axios({
    url: resourceApi.addUResource,
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
export const editUResource = (params) => {
  return axios({
    url: resourceApi.editUResource,
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
export const uResourceById = (id) => {
  return axios({
    url: resourceApi.uResourceById + `/${id}`,
    method: 'get'
  })
}
export const delUResourceIds = (id) => {
  return axios({
    url: resourceApi.delUResourceIds + `/${id}`,
    method: `delete`
  })
}
export const getUserResourceByUid = (uid) => {
  return axios({
    url: resourceApi.getUserResourceByUid + `/${uid}`,
    method: 'get'
  })
}
export const userAuthData = (params) => {
  return axios({
    url: resourceApi.userAuthData,
    method: 'get',
    params: params
  })
}
export const updateUrIsforever = (params) => {
  return axios({
    url: resourceApi.updateUrIsforever,
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
export const updateUrStatus = (params) => {
  return axios({
    url: resourceApi.updateUrStatus,
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
export const addUrTime = (params) => {
  return axios({
    url: resourceApi.addUrTime,
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
/**
 * deviceType
 */
export const deviceTypeData = (params) => {
  return axios({
    url: resourceApi.deviceTypeData,
    method: 'get',
    params: params
  })
}
export const deviceTypeById = (id) => {
  return axios({
    url: resourceApi.deviceTypeById + `/${id}`,
    method: 'get'
  })
}
export const getAllDeviceType = () => {
  return axios({
    url: resourceApi.getAllDeviceType,
    method: 'get'
  })
}
export const addDeviceType = (params) => {
  return axios({
    url: resourceApi.addDeviceType,
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
    url: resourceApi.delDeviceTypeByIds + `/${id}`,
    method: `delete`
  })
}
/**
 * device
 */
export const deviceData = (params) => {
  return axios({
    url: resourceApi.deviceData,
    method: 'get',
    params: params
  })
}
export const getVaildDevicePage = (params) => {
  return axios({
    url: resourceApi.getVaildDevicePage,
    method: 'get',
    params: params
  })
}
export const deviceById = (id) => {
  return axios({
    url: resourceApi.deviceById + `/${id}`,
    method: 'get'
  })
}
export const addDevice = (params) => {
  return axios({
    url: resourceApi.addDevice,
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
export const delDeviceIds = (id) => {
  return axios({
    url: resourceApi.delDeviceIds + `/${id}`,
    method: `delete`
  })
}
/**
 * resourceLab
 */
export function resourcLabData (parameter) {
  return axios({
    url: resourceApi.resourcLabData,
    method: 'get',
    params: parameter
  })
}

export const resourceLabById = (id) => {
  return axios({
    url: resourceApi.resourceLabById + `/${id}`,
    method: 'get'
  })
}

export const getAllResourceLab = () => {
  return axios({
    url: resourceApi.getAllResourceLab,
    method: 'get'
  })
}

export const addResourceLab = (params) => {
  return axios({
    url: resourceApi.addResourceLab,
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
export const delResourceLabByIds = (id) => {
  return axios({
    url: resourceApi.delResourceLabByIds + `/${id}`,
    method: `delete`
  })
}
/**
 * resource
 */
export const resourceData = (params) => {
  return axios({
    url: resourceApi.resourceData,
    method: 'get',
    params: params
  })
}
export const resourceById = (id) => {
  return axios({
    url: resourceApi.resourceById + `/${id}`,
    method: 'get'
  })
}
export const reourceListByUid = (uid) => {
  return axios({
    url: resourceApi.reourceListByUid + `/${uid}`,
    method: 'get'
  })
}
export const addresource = (params) => {
  return axios({
    url: resourceApi.addresource,
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
export const delResourceIds = (id) => {
  return axios({
    url: resourceApi.delResourceIds + `/${id}`,
    method: `delete`
  })
}
/**
 * resourceType
 */
export const resourcTypeData = (params) => {
  return axios({
    url: resourceApi.resourcTypeData,
    method: 'get',
    params: params
  })
}
export const resourceTypeById = (id) => {
  return axios({
    url: resourceApi.resourceTypeById + `/${id}`,
    method: 'get'
  })
}
export const getAllResourceType = () => {
  return axios({
    url: resourceApi.getAllResourceType,
    method: 'get'
  })
}
export const addResourceType = (params) => {
  return axios({
    url: resourceApi.addResourceType,
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
    url: resourceApi.delResourceTypeByIds + `/${id}`,
    method: `delete`
  })
}
export const findBydTypeId = (dtid) => {
  return axios({
    url: resourceApi.findBydTypeId + `/${dtid}`,
    method: 'get'
  })
}

export const pageOssData = (params) => {
  return axios({
    url: resourceApi.pageOssData,
    method: 'get',
    params: params
  })
}
