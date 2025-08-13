import request from '@/utils/request'
const apiUrl = process.env.BASE_API
export function getApiUrl() {
  return apiUrl
}
export default {
  getList: function(params) {
    return request({
      url: '/dish/list',
      method: 'get',
      params
    })
  },

  saveDish: function(data) {
    return request({
      url: '/dish/save',
      method: 'post',
      data
    })
  },
  deleteDish: function(id) {
    return request({
      url: '/dish',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  toggleDishStatus: function(params) {
    return request({
      url: '/dish/toggleStatus',
      method: 'post',
      params
    })
  },
  exportDish: function(params) {
    return request({
      url: '/dish/export',
      method: 'get',
      params
    })
  }
}
