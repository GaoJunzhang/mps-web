<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入账号"
          v-decorator="[ 'account', {rules: [{ required: true, message: '请输入账号' }], validateTrigger: 'change'} ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[ 'password', {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'} ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input
              size="large"
              type="text"
              placeholder="请输入验证码"
              v-decorator="[ 'code', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'} ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-col>
          <a-col :span="8">
            <img :src="kaptchaImg" @click="changeKaptchaImage()" class="kaptcha-img">
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
      <div class="user-login-other">

        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { timeFix } from '@/utils/util'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      loginBtn: false,
      form: this.$form.createForm(this),
      cap: 0,
      state: {
        time: 60,
        loginBtn: false
      }
    }
  },
  created () { },
  computed: {
    kaptchaImg: function () {
      return '/kaptcha/getKaptchaImage?' + this.cap
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['account', 'password', 'code']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.password = md5(values.password)
          console.log('loginParams', loginParams)
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      console.log('登录成功', res)
      if (res.errCode === 0) {
        this.$router.push({ name: 'welcome' })
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
      } else {
        this.showErrMsg(res.errMsg)
        this.changeKaptchaImage()
      }
    },
    requestFailed (err) {
      console.log(err)
      this.showErrMsg(((err.response || {}).data || {}).message || '请求出现错误，请稍后再试')
    },
    showErrMsg (msg) {
      this.$notification['error']({
        message: '错误',
        description: msg || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    changeKaptchaImage () {
      this.cap++
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .kaptcha-img {
    width: 100%;
    height: 100%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
