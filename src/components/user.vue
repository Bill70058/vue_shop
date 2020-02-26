<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容"
                      v-model="getUserInfo.query"
                      class="input-with-select">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="getUserList()"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="dialogFormVisible = true">添加用户</el-button>

          <el-dialog title="新增用户信息"
                     :visible.sync="dialogFormVisible"
                     id="addForm">
            <el-form :model="addForm"
                     :rules="addFormRule"
                     ref="addFormRef">
              <el-form-item label="用户名"
                            label-width="80px"
                            prop="username">
                <el-input v-model="addForm.username"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码"
                            label-width="80px"
                            prop="password">
                <el-input v-model="addForm.password"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱"
                            label-width="80px"
                            prop="email">
                <el-input v-model="addForm.email"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话"
                            label-width="80px"
                            prop="mobile">
                <el-input v-model="addForm.mobile"
                          autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="affirm('cancel')">取 消</el-button>
              <el-button type="primary"
                         @click="affirm()">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>

      <el-table :data="userList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="edit"
                        placement="top"
                        :enterable="false">
              <!-- 编辑按钮 -->
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle
                         size="mini"
                         @click="searchUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="delete"
                        placement="top"
                        :enterable="false">
              <!-- 删除按钮 -->
              <el-button type="danger"
                         icon="el-icon-delete"
                         circle
                         size="mini"
                         @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="setting"
                        placement="top"
                        :enterable="false">
              <!-- 设置按钮 -->
              <el-button type="warning"
                         icon="el-icon-s-tools"
                         circle
                         size="mini"
                         @click="settingRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑用户表单 -->
      <el-dialog title="编辑用户"
                 :visible.sync="editFormVisible">
        <el-form :model="editForm"
                 ref="editFormRef"
                 :rules="editFormRule">
          <el-form-item label="用户名"
                        label-width="120px">
            <el-input v-model="editForm.username"
                      autocomplete="off"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        label-width="120px"
                        prop="email">
            <el-input v-model="editForm.email"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话"
                        label-width="120px"
                        prop="mobile">
            <el-input v-model="editForm.mobile"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="edit('cancel')">取 消</el-button>
          <el-button type="primary"
                     @click="edit()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 设置用户权限对话框 -->
      <el-dialog title="设置权限"
                 :visible.sync="roleDialogVisible">
        <p>当前用户：{{this.userInfo.username}}</p>
        <p>当前角色：{{this.userInfo.role_name}}</p>
        <el-select v-model="selectRole"
                   placeholder="设置角色">
          <el-option v-for="item in roleList"
                     :key="item.id"
                     :value="item.id"
                     :label="item.roleName"></el-option>
        </el-select>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="confirmRole('cancel')">取 消</el-button>
          <el-button type="primary"
                     @click="confirmRole()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="getUserInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="getUserInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      getUserInfo: {
        query: '', // 查询的关键字
        pagenum: 1, // 当前页码
        pagesize: 2 // 显示查询条目数量
      },
      total: 0,
      userList: [],
      userId: 0, // 用户id
      userInfo: '', // 设置权限时用户信息
      selectRole: '', // 设置权限时选择的权限
      roleList: [], // 角色列表
      dialogFormVisible: false, // 新增用户表单显示属性
      editFormVisible: false, // 编辑用户表单显示属性
      roleDialogVisible: false, // 设置权限对话框显示属性
      addForm: {},
      editForm: {},
      addFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: false, message: '电话不能为空' }
        ]
      },
      editFormRule: {
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: false, message: '电话不能为空' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList: async function () {
      const { data: res } = await this.$http.get('users', {
        params: this.getUserInfo
      })
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 每页展示条数
    handleSizeChange: function (newsize) {
      this.getUserInfo.pagesize = newsize
      this.getUserList()
    },
    // 当前页码
    handleCurrentChange: function (newpage) {
      this.getUserInfo.pagenum = newpage
      this.getUserList()
    },
    // 更改用户状态事件
    userStateChange: async function (userinfo) {
      const { data: res } = await this.$http.put(`/users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('用户状态更改失败')
      this.$message.success('用户状态更改成功')
    },
    // 添加用户 -- 确认添加
    affirm: function (msg) {
      if (msg === 'cancel') {
        if (this.$refs.addFormRef !== undefined) {
          return this.dialogFormVisible = false
        }
      }
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success(res.meta.msg)
        this.dialogFormVisible = false
      })
    },
    // 查询用户信息
    searchUser: async function (userId) {
      this.userId = userId
      let { data: res } = await this.$http.get(`users/${userId}`)
      res = res.data
      this.editForm = res
      this.editFormVisible = true
    },
    // 编辑用户信息
    edit: function (msg) {
      if (msg === 'cancel') return this.editFormVisible = false
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.userId}`, this.editForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success(res.meta.msg)
        this.editFormVisible = false
      })
    },
    // 删除单个用户
    deleteUser: async function (userId) {
      const msg = await this.$confirm('此操作将永久删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg === 'cancel') return this.$message('取消删除')
      if (msg === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${userId}`)
        if (res.meta.status !== 200) return this.$message(res.meta.msg)
        this.$message.success(res.meta.msg)
      }
      this.getUserList()
    },
    // 设置用户权限
    settingRole: function (role) {
      this.userInfo = role
      this.getRole()
      this.roleDialogVisible = true
    },
    // 用户权限确认事件
    confirmRole: async function (msg) {
      if (msg === 'cancel') return this.roleDialogVisible = false
      if (!this.selectRole) return this.$message.error('请选择分配的角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRole })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.roleDialogVisible = false
    },
    // 获取权限列表
    getRole: async function () {
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
    }
  },
  watch: {
    dialogFormVisible (newData, oldData) {
      if (!newData) this.$refs.addFormRef.resetFields()
    },
    roleDialogVisible (newData, oldData) {
      if (!newData) this.selectRole = ''
    }
  }
}
</script>

<style>
#addForm > .el-dialog > div.el-dialog__body {
  padding: 30px 20px 30px 0px !important;
}
</style>

<style scoped lang="less">
.el-card {
  box-shadow: rgba(0, 0, 0, 0.15) !important;
}
.el-row {
  display: flex;
  align-items: flex-end;
}
.el-pagination {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.dialog {
  div.el-dialog__body {
    padding: 30px 20px 30px 0px !important;
  }
}
</style>
