<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="search"
                    class="input-with-select">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="orderList"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="订单编号"
                         width="380px"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"
                         align="center"></el-table-column>
        <el-table-column label="是否付款"
                         prop="order_pay"
                         align="center">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.order_pay === 1">已付款</el-tag>
            <el-tag type="danger"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send"
                         align="center"></el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time"
                         min-width="120px">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       class="el-icon-edit"
                       size="mini"></el-button>
            <el-button type="success"
                       class="el-icon-location-information"
                       size="mini"
                       @click="showLocaltion(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 3, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in locationMsg"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      dialogVisible: false,
      locationMsg: []
    }
  },
  methods: {
    getOrderList: async function () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange: function (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange: function (newnum) {
      this.queryInfo.pagenum = newnum
      this.getOrderList()
    },
    showLocaltion: async function (row) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.locationMsg = res.data
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
