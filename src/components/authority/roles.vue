<template>
  <div>
    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table stripe border :data="tableData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['dbBottom',i1 === 0 ? 'dbTop' : '', 'tagCenter']">
              <el-col :span="5">
                <el-tag closable @close="closeItem(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级加三级权限区 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'dbTop', 'tagCenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="closeItem(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="closeItem(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
            <el-button type="warning" size="mini" @click="getRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="treeDialogVisible" label="权限列表" width="50%">
      <el-tree :data="treeData" :props="treeProp" node-key="id" default-expand-all show-checkbox :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <div slot="footer" class="dialog-footer">
      <el-button @click="treeDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allRights()">确认</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      treeProp: {
        label: 'authName',
        children: 'children'
      },
      treeData: [],
      treeDialogVisible: false,
      defKeys: [],
      roleId: 0
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取权限列表
    getTableData: async function () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data
    },
    // 删除单个权限
    closeItem: async function (role, childrenId) {
      const msg = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg !== 'confirm') return this.$message('取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${childrenId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 获取权限树状图
    getRights: async function (role) {
      this.treeDialogVisible = true
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 调用获取三级权限的方法，渲染前将三级权限默认勾选数组挂载
      this.getChildrenNode(role, this.defKeys)
      this.treeData = res.data
      this.roleId = role.id
    },
    // 递归获取当前节点下三级节点权限, node： 当前节点；arr：三级权限数组
    getChildrenNode: function (node, arr) {
      // 如果当前节点不包含children属性，则是三级节点，将所有权限推入树形勾选数组
      if (!node.children) return arr.push(node.id)
      // 如果包含子节点，则递归查找下一节点
      node.children.forEach(item => {
        this.getChildrenNode(item, arr)
      })
    },
    allRights: async function () {
      // 将所有勾选（勾选加半选）的id获取，展开到数组中
      var keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      var ids = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ids })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getTableData()
      this.treeDialogVisible = false
    }
  },
  watch: {
    treeDialogVisible (newData, oldData) {
      if (!newData) {
        this.defKeys = []
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.dbTop {
  border-top: 1px solid #eee;
}
.dbBottom {
  border-bottom: 1px solid #eee;
}
.tagCenter {
  display: flex;
  align-items: center;
}
</style>
