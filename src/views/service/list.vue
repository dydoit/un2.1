<template>
  <div class="service-wrapper">
    <el-button type="primary" @click="$router.push('/home/service/add')">创建应用</el-button>
    <el-table :data="tableData" size="mini">
      <el-table-column
        prop="appName"
        label="应用名称"
        align="center"
      >
      </el-table-column>
       <el-table-column
        prop="appAk"
        label="应用ak"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createrName"
        label="创建人"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="appSysName"
        label="应用系统"
        align="center"
      >
      </el-table-column>
       <el-table-column
        prop="appDescribe"
        label="应用场景"
        align="center"
      >
      </el-table-column>
       <el-table-column
        prop="auditOpinion"
        label="备注"
        align="center"
      >
      </el-table-column>
      <el-table-column align="center" prop="status" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
     </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [

        ]
      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        let res = await this.$http.get('/OpsDev/appInterface/queryAppInterface')
        if(res.list) {
          let {list} = res
          this.tableData = list
        }

      }
    },
  }
</script>

<style lang="stylus" scoped>
.service-wrapper
  width 90%
  margin 0 auto
  > .el-button
      margin-top 50px
      margin-bottom 15px
</style>
