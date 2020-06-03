<template>
  <el-table :data="list"
   size="mini"
  >
    <!-- 历史版本 -->
    <el-table-column label="版本号" prop="versionNum">

    </el-table-column>
    <el-table-column label="发布者" prop="createrOa">

    </el-table-column>
    <el-table-column label="发布时间" prop="createTime">

    </el-table-column>
    <el-table-column label="版本说明" prop="versionDescribe">

    </el-table-column>
    <el-table-column label="操作" prop="versionDescribe">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        list: [

        ]
      }
    },
    created() {
      this.getHistoryList()
    },
    methods: {
      async getHistoryList() {
        let res = await this.$http.get('/OpsDev/orderAnalysisHistory/getOrderAnalysisHistoryList', {
          params:{
            id: this.$route.query.model_id
          }
        })
        console.log(res)
        this.list = res.list
      },
      handleClick() {

      }
    },
  }
</script>

<style lang="stylus" scoped>
table {
  width: 80%;
  margin 0 auto
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;

  thead {
    background-color: #ddd;

    td {
      padding: 6px 0;
    }
  }
  td {
    padding: 2px 4px;
    border: 1px solid #ccc
  }
}
</style>
