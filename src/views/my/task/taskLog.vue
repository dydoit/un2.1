<template>
  <div class="table-wrapper">
    <el-table :data="logData" style="width: 100%" size="small">
      <el-table-column align="center" label="开始时间" prop="startTime">
      </el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime">
      </el-table-column>
      <el-table-column align="center" label="运行状态" prop="status">
      </el-table-column>
      <el-table-column align="center" label="运行日志">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-search" @click="look(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页 -->
    <div class="pagination-wrapper" v-if="logData.length">
      <el-pagination
        layout="total,sizes, prev, pager, next, jumper"
        background
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 日志详情 -->
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    max-width="50%"
    class="log-wrapper"
    :before-close="handleClose"
    >
      <pre style="max-height:420px; overflow:auto">{{logContent}}</pre>
    </el-dialog>
  </div>
</template>

<script>
const status = {
  '0': '执行中',
  '1': '成功',
  '2': '失败',
  '3': '警告'
}
import moment from 'moment'
export default {
  name: "taskLog",
  data() {
    return {
      logData: [],
      limit: 10,
      total: '',
      loading: true,
      taskId: '',
      logContent: '', //日志内容
      dialogVisible: false
    };
  },
  created() {
    let id = this.$route.params.id;
    this.taskId = id
    this.getLogData();
  },
  methods: {
    async getLogData(limit=this.limit, page=1, id=this.taskId) {
      let res = await this.$http.get("/OpsDev/taskLog/queryTaskLogByTaskId", {
        params: { id, limit, page}
      });
      let {list, total} = res
      this.total = total
      this.logData = list.map(item => {
        return {
          ...item,
          startTime: item.startTime?moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'):'',
          endTime: item.endTime?moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'): '',
          status: status[item.status]
        }
      })
    },
    look({logInfo}) {
      this.logContent = logInfo
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    },
    handleSizeChange(val) {
      this.limit = val
      this.getLogData()
    },
    handleCurrentChange (val) {
      this.getLogData(this.limit, val)
    }
  },

};
</script>

<style lang="stylus" scoped>
.table-wrapper
  padding 0 20px
  margin-top 10px
.pagination-wrapper
  display flex
  flex-direction row-reverse
  margin 20px
.log-wrapper
  overflow auto
</style>
