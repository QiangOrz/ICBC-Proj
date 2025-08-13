import axios from 'axios'
import qs from 'qs'

import * as _ from '../util/tool'
import router from '../router/router'
import store from '../store/store'
import * as types from '../store/types'

// axios 配置
axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = env.BASE_API

// 创建一个基础的 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 60000
})

// request 请求拦截器
// request 响应拦截器
request.interceptors.request.use(
  config => {
    // 从移动端的vuex store中获取token
    if (store.state.token) {
      config.headers['Authorization'] = store.state.token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// request 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 关键修正点：
    // 您的后端 (flash-api) 使用 code: 0 代表成功。
    // PC端使用的 code: 20000 是另一个系统的标准，我们必须使用 0。
    if (res.code !== 0) {
      // 使用 VUX 的 toast 组件来显示错误信息
      _.toast(res.message || '操作失败', 'fail')

      // 可选：处理token失效等特定错误码
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        store.commit(types.LOGOUT)
        router.replace({ path: 'login' })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 成功时，返回响应体中的 'data' 部分。
      // 这与您移动端其他部分(如article.js)的逻辑保持一致。
      return res.data
    }
  },
  error => {
    console.log('请求错误: ' + error) // for debug
    
    // 处理网络层面的错误
    if (error.response && error.response.status === 401) {
      store.commit(types.LOGOUT)
      router.replace({ path: 'login' })
    } else {
      _.toast(error.message || '网络异常', 'fail')
    }
    return Promise.reject(error)
  }
)

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }

  if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `${store.state.token}`
  }
  if (store.state.appKey) {
    config.headers.appKey = `${store.state.appKey}`
  }
  return config
}, (error) => {
  _.toast('错误的传参', 'fail')
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
  if (res.headers['content-type'] === 'images/jpeg') {
    return res
  }
  return res
}, (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        store.commit(types.LOGOUT)
        router.replace({
          path: 'login',
          query: {redirect: router.currentRoute.fullPath}
        })
        break
      case 500:
        router.replace({
          path: 'error',
          query: {redirect: router.currentRoute.fullPath}
        })
        break
    }
  }
  _.toast('网络异常', 'fail')
  return Promise.reject(error)
})

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {

  getOffcialSite () {
    return get('/offcialsite')
  },
  getProductList () {
    return get('/offcialsite/product')
  },

  getSolutionList () {
    return get('/offcialsite/solution')
  },

  getCaseList () {
    return get('/offcialsite/case')
  },
  getNewsList () {
    return get('/offcialsite/news')
  },
  getArticle (id, type) {
    console.log('Fetching article with id:', id, 'and type:', type)
    return get('/offcialsite/article?id=' + id + '&type=' + type)
  },
  saveContact (params) {
    // 使用独立的axios实例
    const instance = axios.create({
      baseURL: env.BASE_API,
      headers: {
        'Content-Type': 'application/json',
        'appKey': store.state.appKey || ''
      }
    })

    // 添加请求拦截器（只处理认证）
    instance.interceptors.request.use(config => {
      if (store.state.token) {
        config.headers.Authorization = `${store.state.token}`
      }
      return config
    })

    return instance.post('/offcialsite/contact', params)
  },


// 获取菜品详情
  getDishList (params) {
    console.log('Fetching dish list with params:', params)
    // return request({
    //   url: '/dish/list1',
    //   method: 'get',
    //   params
    // })
    return get('/offcialsite/dish/list1', { params })
  },
  saveOrder (dishData) {
    const instance = axios.create({
      baseURL: env.BASE_API,
      headers: {
        'Content-Type': 'application/json',
        'appKey': store.state.appKey || ''
      }
    })

    // 添加请求拦截器（只处理认证）
    instance.interceptors.request.use(config => {
      if (store.state.token) {
        config.headers.Authorization = `${store.state.token}`
      }
      return config
    })

    return instance.post('/offcialsite/order/save', dishData)
  }
}
