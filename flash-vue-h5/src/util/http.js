import axios from 'axios'
import { getApiUrl } from './tool'

const service = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000
})

// 响应拦截器，直接返回 data，错误则抛出
service.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export function get(url, params) {
  return service.get(url, { params })
}

export function post(url, data) {
  return service.post(url, data)
}