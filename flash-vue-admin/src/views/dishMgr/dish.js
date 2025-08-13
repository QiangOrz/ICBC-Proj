import dishApi from '@/api/dishMgr/dish'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

export default {
  // 未调试方便此处不设权限的配置
  // directives: { permission },
  name: 'DishManager',
  data() {
    return {
      uploadUrl: getApiUrl() + '/file',
      uploadHeaders: {
        'Authorization': ''
      },
      loadingInstance: {},
      formVisible: false,
      formTitle: '新增菜品',
      isAdd: true,
      options1: [
        { label: '快餐便当', value: 'fast_food' },
        { label: '汉堡披萨', value: 'pizza' },
        { label: '粥粉面饭', value: 'porridge' },
        { label: '烤串炸鸡', value: 'fried' },
        { label: '饺子包子', value: 'dumplings' },
        { label: '其他', value: 'other' }
      ],
      options2: [
        { label: '早餐', value: 'breakfast' },
        { label: '午餐', value: 'lunch' },
        { label: '晚餐', value: 'dinner' }
      ],
      form: {
        id: null,
        name: '',
        icon: '', // 只保存图片id
        remark: '',
        price: 0.00,
        category: 'fast_food',
        supplyStartDate: null,
        supplyEndDate: null,
        supplyTimeRange: [],
        meals: 'breakfast',
        inventory: 99,
        isShow: true
      },
      listQuery: {
        page: 1,
        size: 20,
        category: undefined,
        meals: undefined
      },
      list: [],
      total: 0,
      listLoading: true
    }
  },
  computed: {
    iconUrl() {
      if (this.form.icon) {
        return this.getImageUrl(this.form.icon)
      }
      return ''
    },
    rules() {
      return {
        name: [
          { required: true, message: '菜品名称不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '菜品价格不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '菜品分类不能为空', trigger: 'change' }
        ],
        meals: [
          { required: true, message: '餐次不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 获取初始化的表单数据
    init() {
      this.fetchData()
    },
    // 从后端获取数据
    fetchData() {
      this.listLoading = true
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      dishApi.getList(this.listQuery).then(response => {
        console.log('获取菜品列表：', this.listQuery.category, this.listQuery.meals)
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      }).catch(err => {
        console.error(err)
        this.$message.error('数据加载失败')
        this.listLoading = false
      })
    },
    getImageUrl(iconId) {
      return getApiUrl() + '/file/getImgStream?idFile=' + iconId
    },
    exportXls() {
      dishApi.exportDish(this.listQuery).then(response => {
        console.log('导出菜品列表：', this.listQuery.category, this.listQuery.meals)

        const fileId = response.data.id
        console.log('导出文件ID:', fileId)
        // 拼接下载URL并打开新窗口下载
        window.location.href = getApiUrl() + '/file/download?idFile=' + fileId
        this.$message.success('导出任务已创建，请稍后')
      }).catch(err => {
        console.error(err)
        this.$message.error('导出失败')
      })
    },
    resetForm() {
      return {
        id: null,
        name: '',
        icon: '',
        remark: '',
        price: 0.00,
        category: 'fast_food',
        supplyTime: '',
        meals: 'breakfast',
        inventory: 99,
        isShow: true
      }
    },
    // 新增按钮点击
    add() {
      this.formTitle = '新增菜品'
      this.form = this.resetForm()
      this.formVisible = true
    },
    // 编辑按钮点击
    edit(row) {
      this.formTitle = '编辑菜品'
      this.form = Object.assign({}, row)
      if (this.form.supplyStartDate && this.form.supplyEndDate) {
        this.form.supplyTimeRange = [this.form.supplyStartDate, this.form.supplyEndDate]
      } else {
        this.form.supplyTimeRange = []
      }
      this.formVisible = true
    },
    // 保存（新增或编辑）
    save() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        if (this.form.supplyTimeRange && this.form.supplyTimeRange.length === 2) {
          this.form.supplyStartDate = this.form.supplyTimeRange[0]
          this.form.supplyEndDate = this.form.supplyTimeRange[1]
        } else {
          // 如果用户清空了日期，则将字段设为null
          this.form.supplyStartDate = null
          this.form.supplyEndDate = null
        }
        dishApi.saveDish(this.form).then(response => {
          this.$message.success('保存成功')
          this.formVisible = false
          this.fetchData() // 重新加载数据
        }).catch(err => {
          console.error(err)
          this.$message.error('保存失败')
        })
      })
    },
    // 上/下架
    toggleStatus(row) {
      const newStatus = !row.isShow
      const statusText = newStatus ? '上架' : '下架'
      this.$confirm(`确定要${statusText}该菜品吗? 请确保库存不为零！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(`菜品的id为 ${row.id}`)
        console.log(`将菜品 ${row.name} 的状态改为 ${statusText}`)
        dishApi.toggleDishStatus({
          id: row.id,
          isShow: newStatus
        }).then(response => {
          console.log(`新状态为`, row.id, newStatus)
          row.isShow = newStatus // 直接在前端更新状态，或调用fetchData()刷新
        })
      })
    },
    removeImage() {
      this.form.icon = ''
    },
    // 删除
    remove(row) {
      this.$confirm(`确定要删除菜品【${row.name}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(`删除菜品的id为 ${row.id}`)
        console.log(`删除菜品 ${row.name}`)
        dishApi.deleteDish(row.id).then(response => {
          this.$message.success('删除成功')
          this.fetchData() // 重新加载数据
        }).catch(err => {
          console.error(err)
          this.$message.error('删除失败')
        })
      })
    },
    handleBeforeUpload() {
      this.loadingInstance = Loading.service({
        lock: true,
        text: '图片上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleUploadSuccess(response, raw) {
      this.loadingInstance.close()
      if (response.code === 20000) {
        this.form.icon = response.data.id // 保存图片ID到form中
      } else {
        this.$message({
          message: response.message || '上传失败',
          type: 'error'
        })
      }
    },
    search() {
      this.listQuery.page = 1
      this.fetchData()
    },
    reset() {
      this.listQuery.category = undefined
      this.listQuery.meals = undefined
      this.listQuery.page = 1
      this.fetchData()
    },
    fetchNext() {
      this.listQuery.page += 1
      this.fetchData()
    },
    fetchPrev() {
      if (this.listQuery.page > 1) {
        this.listQuery.page -= 1
        this.fetchData()
      }
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(size) {
      this.listQuery.size = size
      this.fetchData()
    }
  }
}
