<template>
  <div id="home">
    <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout: function () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登陆页
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">
</style>
