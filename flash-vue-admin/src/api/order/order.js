import request from '@/utils/request'

export default {
  /**
   * 保存订单 (下单)
   * @param {object} data 包含菜品ID和用户信息的订单对象
   */

  getList: function(params) {
    return request({
      url: '/dish/list1',
      method: 'get',
      params
    })
  },

  saveOrder: function(data) {
    console.log('保存订单数据:', data)
    return request({
      url: '/order/save',
      method: 'post',
      data
    })
  }
}