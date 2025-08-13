import request from '@/utils/request'

export default {
  /**
   * 获取订单统计数据
   * @param {object} params - 查询参数 { beginDate, endDate, meals, idDish }
   */
  getOrderStats: function(params) {
    return request({
      url: '/statistics/orderStats',
      method: 'get',
      params: params
    })
  }
}