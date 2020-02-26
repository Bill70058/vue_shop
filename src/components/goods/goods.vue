<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 头部添加商品区 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchIncident()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary"
                     @click="add()">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="tableData"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称"
                         width="550px"></el-table-column>
        <el-table-column prop="goods_price"
                         label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight"
                         label="商品重量"></el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间">
          <!-- 通过在main定义的全局过滤器格式化时间 -->
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="el-icon-edit"
                       type="primary"
                       size="mini"></el-button>
            <el-button class="el-icon-delete"
                       type="danger"
                       size="mini"
                       @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页模块 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 3, 5, 10]"
                     :page-size="queryInfo.pagesize"
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
      tableData: [],
      total: 0,
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      }
    }
  },
  methods: {
    // 获取表格数据
    getTableData: async function () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      this.tableData = res.data.goods
    },
    // 分页 -- 表格显示条目改变触发事件
    handleSizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize
      this.getTableData()
    },
    // 分页 -- 表格显示页改变触发事件
    handleCurrentChange: function (newpage) {
      this.queryInfo.pagenum = newpage
      this.getTableData()
    },
    // 搜索
    searchIncident: function () {
      console.log(this.queryInfo)
      this.getTableData()
    },
    // 删除货品
    deleteGoods: function (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) {
          this.$message({
            type: 'danger',
            message: '删除失败!'
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    add: function () {
      this.$router.push('goods/add')
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style lang="less" scope>
.el-pagination,
.el-table {
  margin-top: 15px;
}
</style>
