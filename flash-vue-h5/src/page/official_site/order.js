import { XHeader, Selector, XButton, Popup, Group, Cell, Datetime, LoadMore, TransferDom, XInput, XTextarea } from 'vux'
import {getApiUrl} from '../../util/tool'
import api from '../../fetch/api'


export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader, Selector, XButton, Popup, Group, Cell, Datetime, LoadMore, XInput, XTextarea
  },
  data() {
    return {
      list: [],
      listLoading: true,
      options1: [
        { key: '', value: '全部' }, // 添加一个“全部”选项
        { key: 'fast_food', value: '快餐便当' },
        { key: 'pizza', value: '汉堡披萨' },
        { key: 'porridge', value: '粥粉面饭' },
        { key: 'fried', value: '烤串炸鸡' },
        { key: 'dumplings', value: '饺子包子' },
        { key: 'other', value: '其他' }
      ],
      options2: [
        { key: '', value: '全部' },
        { key: 'breakfast', value: '早餐' },
        { key: 'lunch', value: '午餐' },
        { key: 'dinner', value: '晚餐' }
      ],
      listQuery: {
        page: 1,
        size: 10,
        category: '',
        meals: '',
        isShow: true
      },
      dishPopupVisible: false, // 菜品详情弹窗
      userInfoPopupVisible: false, // 用户信息弹窗

      selectedDish: null, // 当前选中的菜品
      orderForm: {
        idDish: null,
        orderDate: '',
        user_name: '',
        mobile: '',
        address: '',
        remark: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('Fetching data with query:', this.listQuery)
      this.listLoading = true
      api.getDishList(this.listQuery).then(response => {
        console.log('Data fetched:', response)
        if (response && response.data && response.data.content) { 
          this.list = response.data.content.map(dish => {
            return {
              id: dish.id,
              name: dish.name,
              price: dish.price,
              icon: dish.icon,
              remark: dish.remark,
              category: dish.category,
              meals: dish.meals,
              inventory: dish.inventory,
              supplyStartDate: dish.supplyStartDate,
              supplyEndDate: dish.supplyEndDate
            }
          })
        } else {
          this.list = []
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilterChange() {
      this.fetchData()
    },
    getImageUrl(iconId) {
      if (!iconId) return ''
      return getApiUrl() + '/file/getImgStream?idFile=' + iconId
    },
    getCategoryLabel(value) {
      const option = this.options1.find(item => item.key === value)
      return option ? option.value : value
    },
    getMealsLabel(value) {
      const option = this.options2.find(item => item.key === value)
      return option ? option.value : value
    },
    // 点击“下单”按钮，显示菜品详情弹窗
    showDishPopup(dish) {
      this.selectedDish = dish
      // 初始化订单信息
      this.orderForm = {
        idDish: dish.id,
        orderDate: '',
        user_name: '',
        mobile: '',
        address: '',
        remark: ''
      }
      this.dishPopupVisible = true
    },

    // 核心改动3：从菜品详情弹窗进入用户信息填写弹窗
    goToUserInfoStep() {
      if (!this.orderForm.orderDate) {
        this.$vux.toast.show({ text: '请选择下单日期', type: 'warn' })
        return
      }
      this.dishPopupVisible = false
      this.userInfoPopupVisible = true
    },
    // 提交订单
    submitOrder() {
      // 校验用户信息
      if (!this.orderForm.user_name || !this.orderForm.mobile || !this.orderForm.address) {
        this.$vux.toast.show({ text: '请填写完整的姓名、电话和地址', type: 'warn' })
        return
      }

      this.$vux.loading.show({ text: '正在提交...' })
      // 发送完整的orderForm对象
      api.saveOrder(this.orderForm).then(() => {
        this.$vux.loading.hide()
        this.userInfoPopupVisible = false // 关闭第二个弹窗
        this.$vux.toast.show({ text: '下单成功！', type: 'success' })
        this.fetchData() // 刷新菜品列表
      }).catch(() => {
        this.$vux.loading.hide()
        this.$vux.toast.show({ text: '下单失败，请重试', type: 'warn' })
      })
    }
  }
}