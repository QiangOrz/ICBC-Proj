import dishApi from '@/api/dishMgr/dish'
import orderApi from '@/api/order/order' // 引入新建的order.js
import { getApiUrl } from '@/utils/utils'

export default {
  name: 'OrderPlacement',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        category: '',
        meals: '',
        isShow: true // 只查询上架的菜品
      },
      // 筛选选项
      categoryOptions: [
        { label: '快餐便当', value: 'fast_food' },
        { label: '汉堡披萨', value: 'pizza' },
        { label: '粥粉面饭', value: 'porridge' },
        { label: '烤串炸鸡', value: 'fried' },
        { label: '饺子包子', value: 'dumplings' },
        { label: '其他', value: 'other' }
      ],
      mealsOptions: [
        { label: '早餐', value: 'breakfast' },
        { label: '午餐', value: 'lunch' },
        { label: '晚餐', value: 'dinner' }
      ],
      
      // 下单弹窗相关
      dialogVisible: false,
      activeStep: 0, // 步骤条
      selectedDish: {},
      orderForm: {
        id: null,
        idDish: null,
        orderDate: '',
        user_name: '',
        mobile: '',
        address: '',
        remark: ''
      },
      orderFormRules: {
        user_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' },
            {
                pattern: /^1[3-9]\d{9}$/, 
                message: '请输入正确的手机号格式', 
                trigger: 'blur'
            }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        orderDate: [{ required: true, message: '请选择下单日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取菜品列表
    fetchData() {
      this.listLoading = true
      orderApi.getList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 点击下单按钮
    handleOrderClick(row) {
      this.activeStep = 0
      this.selectedDish = row
      // 重置表单
      this.orderForm = {
        idDish: row.id,
        orderDate: '',
        user_name: '',
        mobile: '',
        address: '',
        remark: ''
      }
      if (this.$refs.orderForm) {
        this.$refs.orderForm.clearValidate()
      }
      this.dialogVisible = true
    },
    // 提交订单
    submitOrder() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交订单吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            orderApi.saveOrder(this.orderForm).then(() => {
              console.log('订单提交成功:', this.orderForm)
              this.dialogVisible = false
              this.$message.success('下单成功！')
              this.fetchData() // 刷新菜品列表
            }).catch(err => {
              this.$message.error('下单失败: ' + err.message)
            })
          })
        } else {
          this.$message.error('请完整填写必填项')
          return false
        }
      })
    },
    // 步骤条控制
    nextStep() {
      this.activeStep++
      if (this.activeStep > 1) this.activeStep = 0
    },
    // 搜索与重置
    search() {
      this.listQuery.page = 1
      this.fetchData()
    },
    reset() {
      this.listQuery.category = ''
      this.listQuery.meals = ''
      this.listQuery.page = 1
      this.fetchData()
    },
    // 工具方法
    getImageUrl(iconId) {
      if (!iconId) return ''
      return getApiUrl() + '/file/getImgStream?idFile=' + iconId
    },
    getCategoryLabel(value) {
      const option = this.categoryOptions.find(item => item.value === value)
      return option ? option.label : value
    },
    getMealsLabel(value) {
      const option = this.mealsOptions.find(item => item.value === value)
      return option ? option.label : value
    }
  }
}
