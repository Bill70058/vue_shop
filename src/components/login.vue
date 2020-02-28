<template>
  <div id="login">
    <!-- 登陆组件 -->
    <div id="login_box">
      <!-- 头像区域 -->
      <div id="avatar_box">
        <img src="../assets/logo.png"
             alt="头像">
      </div>
      <!-- 登陆区域 -->
      <el-form class="form"
               :model="loginForm"
               :rules="loginFormRule"
               ref="loginFormRef">
        <el-form-item prop="user">
          <el-input prefix-icon="el-icon-user"
                    v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
                    type="password"
                    @keyup.enter.native="submit()"></el-input>
        </el-form-item>
        <!-- 登陆按钮 -->
        <div class="btns">
          <el-button type="primary"
                     @click="submit()">登陆</el-button>
          <el-button @click="reset()">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const usernameRule = (rule, value, callback) => {
      if (this.loginForm.username === '' || typeof (this.loginForm.username) === 'undefined') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const passwordRule = (rule, value, callback) => {
      if (this.loginForm.password === '') {
        callback(new Error('请输入密码'))
      } else if (isNaN(this.loginForm.password)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {},
      loginFormRule: {
        user: [
          { validator: usernameRule, trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: passwordRule, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit: function () {
      // 因为validate没有传第二个参数（函数）的话，返回是异步的，所以需要在函数前用async与awaite修饰
      this.$refs.loginFormRef.validate(async valid => {
        // 用validate在发送登陆请求前再一次利用表单进行验证规则，如果验证失败则返回空
        if (!valid) return
        // 将返回数据中的data属性解构
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message({
            message: '登陆失败',
            type: 'warning'
          })
        } else {
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    reset: function () {
      if (this.$refs.loginFormRef !== undefined) {
        this.$refs.loginFormRef.resetFields()
      }
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  background-color: #2b4b6b;
  height: 100%;
  #login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #fff;
      }
    }
  }
  .form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -45%);
    width: 90%;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
