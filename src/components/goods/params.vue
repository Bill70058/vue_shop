<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告列 -->
      <el-alert title="注意：只允许为第三级分类设置参数"
                type="warning"
                :closable="closable"
                show-icon>
      </el-alert>
      <el-row id="span_top">
        <el-col :span="3">选择分类参数:</el-col>
        <el-col :span="5">
          <el-cascader v-model="goodsOpt"
                       :options="tableData"
                       @change="handleChange"
                       :props="optProp"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName"
               type="card"
               @tab-click="handleClick">

        <!-- 动态参数 -->
        <el-tab-pane label="用户管理"
                     name="many">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">动态参数</el-button>

          <el-table :data="manyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="closeTag(i,scope.row)">{{item}}</el-tag>
                <!-- 新增input -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 新增button -->
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning"
                           class="el-icon-edit"
                           size="mini"
                           @click="editFormIncident(scope.row)">编辑</el-button>
                <el-button type="danger"
                           class="el-icon-delete"
                           size="mini"
                           @click="deleteIncident(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="配置管理"
                     name="only">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">静态属性</el-button>
          <el-table :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="closeTag(i,scope.row)">{{item}}</el-tag>
                <!-- 新增input -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 新增button -->
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning"
                           class="el-icon-edit"
                           size="mini"
                           @click="editFormIncident(scope.row)">编辑</el-button>
                <el-button type="danger"
                           class="el-icon-delete"
                           size="mini"
                           @click="deleteIncident(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性对话框 -->
    <el-dialog :title="'添加' + formText"
               :visible.sync="addDialogVisible"
               @close="closeAddDialog()">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef">
        <el-form-item :label="formText"
                      label-width="80px"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addFormClick('cancel')">取 消</el-button>
        <el-button type="primary"
                   @click="addFormClick()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑事件对话框 -->
    <el-dialog :title="'编辑' + formText"
               :visible.sync="editDialogVisible"
               @close="closeEditDialog()">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef">
        <el-form-item :label="formText"
                      label-width="80px"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editFormClick('cancel')">取 消</el-button>
        <el-button type="primary"
                   @click="editFormClick()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      closable: false,
      goodsOpt: [],
      tableData: [],
      optProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'many',
      goodsList: [],
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      onlyTableData: [],
      manyTableData: [],
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      attr_id: 0
    }
  },
  methods: {
    // 获取分类参数列表
    getOptList: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.tableData = res.data
    },
    // 参数列表及联选择触发事件
    handleChange: function () {
      if (this.goodsOpt.length !== 3) {
        this.onlyTableData = []
        this.manyTableData = []
        return this.goodsOpt = []
      }
      this.getGoodsList()
    },
    // 标签页选择触发事件
    handleClick: function () {
      this.getGoodsList()
    },
    // 获取表格货物信息
    getGoodsList: async function () {
      const { data: res } = await this.$http.get(`categories/${this.optId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 为tag标签格式化vals数组
      // 为新增tag标签添加自定义属性inputVisible，inputValue
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      if (this.activeName === 'only') this.onlyTableData = res.data
      this.manyTableData = res.data
    },
    // 关闭添加属性/参数对话框
    closeAddDialog: function () {
      this.$refs.addFormRef.resetFields()
    },
    // 新增属性/参数确认按钮
    addFormClick: function (msg) {
      if (msg === 'cancel') return this.addDialogVisible = false
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null
        const { data: res } = await this.$http.post(`categories/${this.optId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮
    editFormIncident: async function (goods) {
      this.attr_id = goods.attr_id
      const { data: res } = await this.$http.get(`categories/${this.optId}/attributes/${goods.attr_id}`, { pamars: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭编辑对话框触发事件
    closeEditDialog: function () {
      this.$refs.editFormRef.resetFields()
      this.attr_id = 0
    },
    // 编辑表单确认事件
    editFormClick: function (msg) {
      if (msg === 'cancel') {
        this.$refs.editFormRef.resetFields()
        return this.editDialogVisible = false
      }
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return null
        const { data: res } = await this.$http.put(`categories/${this.optId}/attributes/${this.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },
    // 删除属性/参数按钮事件
    deleteIncident: async function (goodsMsg) {
      const msg = await this.$confirm('此操作将永久删除该属性/参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (msg === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.optId}/attributes/${goodsMsg.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      }
    },
    // 保存对tag对修改方法，此方法在新增/关闭tag事件中都会调用到
    savetTagIncident: async function (row) {
      const { data: res } = await this.$http.put(`categories/${this.optId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 新增tag - input事件
    handleInputConfirm: async function (row) {
      // 判断input是否为空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        this.savetTagIncident(row)
        row.inputValue = ''
        row.inputVisible = false
      }
    },
    // 新增tag - button事件
    showInput: function (row) {
      row.inputVisible = true
      // 页面刷新通过$refs让input框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 关闭tag事件
    closeTag: async function (i, row) {
      row.attr_vals.splice(i, 1)
      this.savetTagIncident(row)
    }
  },
  created () {
    this.getOptList()
  },
  computed: {
    isBtnDisabled: function () {
      if (this.goodsOpt.length !== 3) return true
      return false
    },
    optId: function () {
      if (this.goodsOpt.length === 3) return this.goodsOpt[2]
      return null
    },
    formText: function () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style scoped lang="less">
#span_top {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.el-tabs {
  margin-top: 15px;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
}
</style>
