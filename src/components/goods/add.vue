<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 顶部警示条 -->
      <el-alert title="添加商品信息"
                type="info"
                close-text="知道了"
                show-icon
                center>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200"
                :active="activeIndex"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <!-- 嵌套在侧边导航栏外部的大表单 -->
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm"
               label-position="top">
        <!-- 侧边导航栏 -->
        <el-tabs :tab-position="'left'"
                 v-model="tagIndex"
                 :before-leave="beforeTabLeave"
                 @tab-click="tabClick">
          <!-- 导航栏第一条 -->
          <el-tab-pane label="基本信息"
                       name='0'>
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader v-model="ruleForm.goods_cat"
                           :options="tableData"
                           :props="cascaderProps"
                           @change="handleChange"
                           ref="goodsCat"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 导航栏第二条 -->
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item2,i) in item.attr_vals"
                             :key="i"
                             :label="item2"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 导航栏第三条 -->
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 导航栏第四条 -->
          <el-tab-pane label="商品照片"
                       name="3">
            <el-upload :action="uploadUrl"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headerObj"
                       :on-success="uploadSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 导航栏第五条 -->
          <el-tab-pane label="商品内容"
                       name="4">
            <quill-editor v-model="content"
                          ref="myQuillEditor"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @ready="onEditorReady($event)">
            </quill-editor>
            <el-button type="primary"
                       class="addBtn"
                       @click="addFormIncident">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="previewDialogVisible"
               width="50%">
      <img :src="previewUrl"
           class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      tagIndex: '0',
      goodsCat: [],
      tableData: [],
      ruleForm: { pics: [], attars: [] },
      rules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyData: [],
      onlyData: [],
      // 上传图片服务器链接
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片手动绑定请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewUrl: '',
      // 图片对话框显示属性
      previewDialogVisible: false,
      // 富文本编辑器绑定数据
      content: ''
    }
  },
  methods: {
    getGoodsClassify: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.tableData = res.data
    },
    // 级联 -- 选择类型触发事件
    handleChange: function () {
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = this.goodsCat
      }
    },
    // 导航栏跳转触发事件
    beforeTabLeave: function () {
      if (!this.$refs.goodsCat.value) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 导航栏点击触发事件
    tabClick: async function () {
      if (this.tagIndex == 1) {
        const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyData = res.data
      }
      if (this.tagIndex == 2) {
        const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyData = res.data
      }
    },
    // 上传图片事件
    handlePreview: function (file) {
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 移除图片事件
    handleRemove: function (file) {
      const deleteIndex = this.ruleForm.pic.indexOf(file.response.data.tmp_path)
      this.ruleForm.pic.splice(deleteIndex, 1)
    },
    // 图片上传成功事件
    uploadSuccess: function (response) {
      this.ruleForm.pics.push({ pic: response.data.tmp_path })
    },
    // 富文本编辑器事件
    onEditorBlur: function (event) {

    },
    onEditorFocus: function (event) {

    },
    onEditorReady: function (event) {

    },
    addFormIncident: function () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.error('请填完必填项')

        this.manyData.forEach(item => {
          const arr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.ruleForm.attars.push(arr)
        })
        this.onlyData.forEach(item => {
          const arr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.ruleForm.attars.push(arr)
        })
        // form.attars = this.ruleForm.attars
        const form = _.cloneDeep(this.ruleForm)
        form.goods_cat = form.goods_cat.join(',')
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 消除步骤条对绑定对属性类型判断错误
    activeIndex: function () {
      return Number(this.tagIndex)
    },
    catId: function () {
      return this.ruleForm.goods_cat[2]
    }
  },
  created () {
    this.getGoodsClassify()
    this.goodsCat = this.$refs.goodsCat
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
  float: right;
}
</style>

<style>
.ql-editor {
  min-height: 300px;
}
</style>
