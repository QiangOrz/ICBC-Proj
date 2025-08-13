import * as echarts from 'echarts'
import statisticsApi from '@/api/statistics/statistics'
import dishApi from '@/api/dishMgr/dish' // 复用获取菜品列表的API

export default {
  name: 'Statistics',
  data() {
    return {
      chart: null,
      chartLoading: true,
      listQuery: {
        dateRange: [], // [beginDate, endDate]
        meals: '',
        idDish: null
      },
      mealsOptions: [
        { label: '早餐', value: 'breakfast' },
        { label: '午餐', value: 'lunch' },
        { label: '晚餐', value: 'dinner' }
      ],
      dishOptions: [] // 用于菜品选择器
    }
  },
  created() {
    this.setDefaultDateRange()
    this.fetchAllDishes()
  },
  mounted() {
    this.initChart()
    this.fetchChartData()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    // 设置默认日期范围为最近7天
    setDefaultDateRange() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.listQuery.dateRange = [this.formatDate(start), this.formatDate(end)]
    },
    // 获取所有菜品用于筛选
    fetchAllDishes() {
      dishApi.getList({ page: 1, size: 9999 }).then(response => {
        this.dishOptions = response.data.content
      })
    },
    // 初始化ECharts实例
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
    },
    // 获取并渲染图表数据
    fetchChartData() {
      this.chartLoading = true
      const params = {
        beginDate: this.listQuery.dateRange[0],
        endDate: this.listQuery.dateRange[1],
        meals: this.listQuery.meals,
        idDish: this.listQuery.idDish
      }
      statisticsApi.getOrderStats(params).then(response => {
        console.log('response data:', response.data)

        let { categories, series } = response.data

        // 按餐次筛选时也是返回菜品名，因此直接通过菜品进行过滤
        if (this.listQuery.idDish) {
          const dish = this.dishOptions.find(d => d.id === this.listQuery.idDish)
          if (dish) {
            series = series.filter(item => item.name === dish.name)
          }
        }

        this.chart.clear()
        this.chart.setOption({
          title: {
            text: '订单量统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: series.map(item => item.name),
            orient: 'vertical',
            left: 'right',
            top: 'middle'
          },
          grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: categories // X轴：日期
          },
          yAxis: {
            type: 'value'
          },
          series: series // Y轴：曲线数据
        })
        this.chartLoading = false
      }).catch(() => {
        this.chartLoading = false
      })
    },
    // 点击查询按钮
    handleFilter() {
      this.fetchChartData()
    },
    // 窗口大小改变时重绘图表
    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    }
  }
}
