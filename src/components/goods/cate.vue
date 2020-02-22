<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-button type="primary"
                 @click="addDialogFormVisible = true">添加分类</el-button>
      <tree-table :data="tableData"
                  :columns='columns'
                  :selection-type="false"
                  :expand-type="false"
                  :show-index="true"
                  index-text="#"
                  width="100px"
                  :border="true">
        <!-- 是否有效模版 -->
        <template slot-scope="scope"
                  slot="isOk">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color:lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>
        <!-- 排序模版 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1"
                  type="warning">二级</el-tag>
          <el-tag v-else
                  type="danger">三级</el-tag>
        </template>
        <!-- 编辑插槽 -->
        <template slot="option">
          <el-button class="el-icon-edit"
                     type="primary"
                     @click="editDialogFormVisible = true">编辑</el-button>
          <el-button class="el-icon-delete"
                     type="danger"
                     @click="deleteDialogFormVisible = true">删除</el-button>
        </template>
      </tree-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 3, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addDialogFormVisible"
               @close="addCateFormClosed()">
      <el-form label-position="right"
               label-width="80px"
               :model="addFormItem"
               :rules="addFormRule"
               ref="addFormRef">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addFormItem.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="levelOpt"
                       :options="levelList"
                       :props="levelProp"
                       @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addForm('cancel')">取 消</el-button>
        <el-button type="primary"
                   @click="addForm()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑提交分类 -->
    <el-dialog title="编辑分类名"
               :visible.sync="editDialogFormVisible"
               @close="editCateFormClosed()">
      <el-form label-position="right"
               label-width="80px"
               :model="editFormItem"
               :rules="editFormRule"
               ref="editFormRef">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="editFormItem.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="editOpt"
                       :options="levelList"
                       :props="levelProp"
                       @change="editHandleChange"
                       :show-all-levels="showAllLevels"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editForm('cancel')">取 消</el-button>
        <el-button type="primary"
                   @click="editForm()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除分类对话框 -->
    <el-dialog title="删除分类"
               :visible.sync="deleteDialogFormVisible"
               @close="deleteCateFormClosed()">
      <el-form label-position="right"
               label-width="80px">
        <el-form-item label="删除分类">
          <el-cascader v-model="deleteOpt"
                       :options="levelList"
                       :props="levelProp"
                       @change="deleteHandleChange"
                       :show-all-levels="showAllLevels"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="deleted('cancel')">取 消</el-button>
        <el-button type="primary"
                   @click="deleted()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      addDialogFormVisible: false, // 添加分类对话框
      queryInfo: {
        type: 3,
        pagenum: 0, // 数据页码
        pagesize: 1 // 显示数据条数
      },
      total: 0,
      columns: [
        {
          label: '货物名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      addFormItem: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      levelList: [],
      levelOpt: '',
      levelProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      editDialogFormVisible: false,
      showAllLevels: false,
      editFormItem: {},
      editFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editOpt: '',
      editId: 0,
      deleteDialogFormVisible: false,
      deleteId: 0,
      deleteOpt: ''
    }
  },
  methods: {
    // 获取商品列表
    getGoodsList: async function () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.tableData = res.data.result
      this.total = res.data.total
    },
    // 分页每页条数更改事件
    handleSizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 分页跳转页面事件
    handleCurrentChange: function (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getGoodsList()
    },
    // 添加分类表单
    addForm: function (msg) {
      if (msg === 'cancel') return this.addDialogFormVisible = false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addFormItem)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)

        this.getGoodsList()
        this.addDialogFormVisible = false
      })
    },
    // 获取商品级别
    getLevelList: async function () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      this.levelList = res.data
    },
    // 父级分类选择事件
    handleChange: function () {
      if (this.levelOpt.length > 0) {
        this.addFormItem.cat_pid = this.levelOpt[this.levelOpt.length - 1]
        this.addFormItem.cat_level = this.levelOpt.length
      } else {
        this.addFormItem.cat_pid = 0
        this.addFormItem.cat_level = 0
      }
    },
    // 添加分类对话框关闭事件
    addCateFormClosed: function () {
      this.addFormItem.cat_pid = 0
      this.addFormItem.cat_level = 0
      this.$refs.addFormRef.resetFields()
      this.levelOpt = ''
    },
    // 编辑分类对话框关闭事件
    editCateFormClosed: function () {
      this.editId = 0
      this.$refs.editFormRef.resetFields()
      this.editOpt = ''
    },
    // 编辑分类表单事件
    editForm: function (msg) {
      if (msg === 'cancel') return this.editDialogFormVisible = false
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editId}`, this.editFormItem)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogFormVisible = false
      })
    },
    // 编辑分类选择分类事件
    editHandleChange: function () {
      this.editId = this.editOpt[this.editOpt.length - 1]
    },
    // 删除分类对话框关闭事件
    deleteCateFormClosed: function () {
      this.deleteOpt = ''
      this.deleteId = 0
    },
    // 删除分类名选择事件
    deleteHandleChange: function () {
      this.deleteId = this.deleteOpt[this.deleteOpt.length - 1]
    },
    // 删除分类确认删除事件
    deleted: async function (msg) {
      if (msg === 'calcel') return
      const { data: res } = await this.$http.delete(`categories/${this.deleteId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.deleteDialogFormVisible = false
    }
  },
  created () {
    this.getGoodsList()
  },
  watch: {
    addDialogFormVisible (newData, oldData) {
      if (newData) this.getLevelList()
    },
    editDialogFormVisible (newData) {
      if (newData) this.getLevelList()
    },
    deleteDialogFormVisible (newData) {
      if (newData) this.getLevelList()
    }
  }
}
</script>

<style scoped lang="less">
.zk-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
