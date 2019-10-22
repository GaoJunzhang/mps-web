import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    params: parameter
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getInfo () {
  return axios({
    url: '/user/info',
    method: 'get'
  })
}
export function getSmsCaptcha () {
  return axios({
    url: '/user/getSmsCaptcha',
    method: 'get'
  })
}
export function sendSms (parameter) {
  return axios({
    url: '/kaptcha/sendSms',
    method: 'get',
    params: parameter
  })
}
export function register (parameter) {
  return axios({
    url: '/auth/register',
    method: 'post',
    data: parameter
  })
}
