import {XHeader, XInput, Group, XTextarea, XButton, AlertModule} from 'vux'
import footMenu from '../../components/footer/footMenu'
import api from '../../fetch/api'

export default {
  components: {
    XHeader, XInput, Group, XTextarea, XButton, footMenu, AlertModule
  },
  data () {
    return {
      form: {
        userName: '',
        mobile: '',
        email: '',
        remark: ''
      }
    }
  },
  methods: {
    submit () {
      if (this.valid()) {
        const formData = {
          userName: this.form.userName,
          mobile: this.form.mobile,
          email: this.form.email,
          remark: this.form.remark
        }

        console.log('发送数据:', JSON.stringify(formData))

        api.saveContact(formData)
          .then(res => {
            AlertModule.show({content: '提交成功'})
          }).catch(error => {
            console.error('完整错误:', error)
            AlertModule.show({content: '提交失败'})
          })
      } else {
        AlertModule.show({content: '请填写完整信息'})
      }
    },
    valid () {
      if (this.form.username === '') {
        return false
      }

      if (this.form.mobile === '') {
        return false
      }

      if (this.form.email === '') {
        return false
      }

      if (this.form.description === '') {
        return false
      }
      return true
    }
  }
}
