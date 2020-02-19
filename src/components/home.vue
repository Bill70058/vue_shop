<template>
  <div id="home">
    <!-- 网页上半部分（头部）代码块 -->
    <el-container>
      <el-header>
        <div id="header">
          <img src="../assets/home_header.png"
               alt="系统图标">
          <span>后台管理系统</span>
        </div>
        <div id="buts">
          <el-button @click="logout">退出</el-button>
        </div>
      </el-header>
      <!-- 网页下半部分代码块 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isShrink?'60px':'160px'">
          <div id="shrink"
               @click="changeShrink()"><span>||||</span></div>
          <el-menu class="el-menu-vertical-demo"
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b"
                   unique-opened
                   :collapse="isShrink"
                   :collapse-transition="false"
                   router>
            <el-submenu :index="item.id + ''"
                        v-for="item in menuList"
                        :key="item.id"
                        id="submenuSelf">
              <template slot="title"
                        style="padding-left:0px;padding-right:50px;">
                <i :class="iconList[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"><i class="el-icon-menu"></i><span>{{subItem.authName}}</span></el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主内容区 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconList:
      {
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        103: 'el-icon-s-check',
        125: 'el-icon-s-custom',
        145: 'el-icon-s-data'
      },
      isShrink: false
    }
  },
  methods: {
    logout: function () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登陆页
      this.$router.push('/login')
    },
    /**
     * 侧边栏目录请求
     */
    getMenuList: async function () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    /**
     * 侧边栏收缩事件
     */
    changeShrink: function () {
      this.isShrink = !this.isShrink
    }
  },
  created () {
    this.menuList = this.getMenuList()
  }
}
</script>

<style scoped lang="less">
#home {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0;
  #header {
    float: left;
    left: 0;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    img {
      width: 60px;
      height: 60px;
    }
    span {
      display: flex;
      align-items: center;
      padding-left: 10px;
    }
  }
  #buts {
    float: right;
    right: 0;
  }
}

.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;
  text-align: center;
  height: 100%;
  .el-menu {
    border-right: 0;
  }
  #shrink {
    color: #fff;
    height: 20px;
    line-height: 20px;
    background: gray;
    span{
      font-size: 5px;
    }
  }
  #shrink:hover {
    cursor: pointer;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-container {
  height: 100%;
  width: 100%;
}
</style>
