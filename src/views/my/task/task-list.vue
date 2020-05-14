<template>
  <div class="wrap">
    <el-form :inline="true" :model="queryData" size="small">
      <el-form-item label="任务名称：">
        <el-input v-model="queryData.taskName"></el-input>
      </el-form-item>
      <el-form-item class="mr" label="专业：">
          <el-select v-model="queryData.profession" :disabled="isDisabled">
            <el-option v-for="(item,index) of professionList" :key="index" :label="item.dictNameZh" :value="item.dictValue"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="queryData.status">
          <el-option
            v-for="(item,index) in status"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button icon="el-icon-search" size="small" type="primary" @click="getData(1)">搜索</el-button>
    </el-form>
     <div class="btn-wrapper">
      <div class="btn-left-wrapper">
        <el-button size="mini" @click="taskStart" v-permission="10030407">启动</el-button>
        <el-button size="mini" @click="taskDisable" v-permission="10030406">禁用</el-button>
        <el-button size="mini" @click="handleRun" v-permission="10030412">执行</el-button>
        <el-button size="mini" icon="el-icon-circle-plus-outline" @click="$router.push('/my-task/manage')" type="primary" v-permission="10030401">新增</el-button>
      </div>
    </div>
    <el-table
      ref="singleTable"
      v-loading="loading"
      border
      :data="tableData"
      highlight-current-row
      class="my_table"
      @current-change="handleCurrentRowChange"
      style="width: 100%">
      <el-table-column
        prop="taskName"
        label="任务名称"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="isCycle"
        label="周期执行"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        align="center"
        >
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="toggleClass(scope.row.status)">{{scope.row.status}}</span>
          </template>
     </el-table-column>
      <el-table-column align="center" prop="lastSuccessRuntime" label="上次运行时间"></el-table-column>
      <el-table-column align="center" prop="nextRuntime" label="下次运行时间"></el-table-column>
      <el-table-column align="center" prop="operation" label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="text"  size="mini" @click="showCron(scope.row,scope.$index)" v-permission="10030418">
                调度
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDetail(scope.row)">详情</el-button>
                <el-button
                size="mini"
                type="text"
                @click="goLog(scope.row)" v-permission="10030415">日志</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleModify(scope.row)" v-permission="10030402">修改</el-button>
              <el-button
                size="mini"
                type="text"
                class="danger"
                @click="handleDelete(scope.row)" v-permission="10030404">删除</el-button>
            </template>
          </el-table-column>
    </el-table>
     <!-- 分页 -->
    <div class="pagination-wrapper" v-if="tableData.length">
        <el-pagination
          layout="total,sizes, prev, pager, next, jumper"
          background
          :page-sizes="[6, 10, 14, 18]"
          :page-size="queryData.limit"
          :total="total"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
    <cron-model ref="cronModel" @changeCycle="changeCycle"></cron-model>
  </div>
</template>

<script>
  import {mapGetters } from "vuex";
  import CronModel from './components/CronModel.vue'
  const status = [
    {label: '全部', value: ''},
    {label: '禁用', value: '0'},
    {label: '结束', value: '1'},
    {label: '等待', value: '2'},
    {label: '执行中', value: '3'},
    {label: '错误', value: '4'}
  ]
  const statusObj = {
  '': '全部',
  '0': '禁用',
  '1': '结束',
  '2':'等待',
  '3':'执行中',
  '4': '错误'
  }
  export default {
    data() {
      return {
        queryData: {
          taskName: '',
          profession: '',
          status: '',
          limit: 6
        },
        status,
        tableData: [],
        isDisabled: false,
        currentRow: null,
        currentPage:1,
        total: 0,
        loading: true
      }
    },
    computed: {
      ...mapGetters({
        professionList: 'professionList',
        professionObj: 'dict/professionObj'
      })
    },
    components: {
      CronModel
    },
    created() {
      this.getData()
    },
    methods: {
      toggleClass(status) {
        switch(status){
          case '错误':
            return 'err'
          case '等待':
            return 'normal'
          case '禁用':
            return 'err'
          case '执行中':
            return 'running'
          case '结束':
            return 'over'
        }
      },
      async getData(page=this.currentPage) {
        this.currentPage = page
        let res = await this.$http.get('/OpsDev/taskExamine/queryTaskExamine', {
          params: {
            ...this.queryData,
            page
          }
        })
        this.total = res.total
        this.tableData = res.list.map(item => {
          return {
            ...item,
            profession: this.professionObj[item.profession],
            status: statusObj[item.status]
          }
        })
        this.loading = false
      },
      async taskStart() {
        if(!this.currentRow) {
          this.$message.error('请先选中一个任务')
          return
        }
        if(this.currentRow.status!='禁用') {
          this.$message.error('只有禁用状态的任务才能点击启动')
          return
        }
        let {id} = this.currentRow
        let res = await this.$http.get('/OpsDev/taskExamine/enableTaskExamine', {
          params: {id}
        })
        if(res == true) {
          this.$message.success('启动成功')
          this.getData()
        } else {
          this.$message.error('启动失败')
        }

      },
      taskDisable() {
        let selectedTask = this.currentRow
        if(!selectedTask) {
          this.$message.error('请先选中一个任务')
          return
        }
        if(selectedTask.status=='禁用') {
          this.$message.error('该任务已经是禁用状态')
          return
        }
        this.$http.get('/OpsDev/taskExamine/unableTaskExamine', {
          params: {
            id: selectedTask.id
          }
        }).then(res => {
          if(res) {
            this.$message.success('禁用成功')
             this.getData();
          }else {
            this.$message.error('禁用失败')
          }
        })
      },
      handleRun(){
        let selectedTask = this.currentRow
        let timer = null
        if(!selectedTask) {
          this.$message.error('请先选中一个任务')
          return
        }
        if(selectedTask.status!=='等待') {
          this.$message.error('该任务不是等待状态')
          return
        }
        this.$http.get('/OpsDev/taskExamine/testTaskExamineExecutor', {
          params: {
            taskId: selectedTask.id
          }
        }).catch(e=> {
          clearTimeout(timer)
          timer = null
          this.$message.error(`${e.msg}`)
        })
        this.$message({
          type: 'success',
          message:'任务已执行'
        })
        this.getData()
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentRowChange(val) {
        this.currentRow = val;
      },
      showCron({taskName,id},index) {
        this.$refs.cronModel.get(id,taskName,index)
      },
      changeCycle() {

      },
      handleDetail({id}){
        this.$router.push({
          path: '/my-task/manage',
          query: {
            id,
            type: 'read'
          }
        })
      },
      goLog({id}){
        this.$router.push({name: 'taskLog', params: {id}})
      },
      handleModify({id}){
        this.$router.push({
          path: '/my-task/manage',
          query: {
            id,
            type: 'modify'
          }
        })

      },
      handleDelete({id}){
        this.$confirm('确定要删除？','提示',{type: 'warning'})
        .then(() => {
          this.$http.get('/OpsDev/taskExamine/delTaskExamine', {
            params: {id}
          }).then(res => {
            if(res.status=='success'){
                this.$message.success('删除成功')
                this.getData();
            }else if(res.status=='fail'){
              this.$message.error(res.msg)
            }
          })
        })
      },
      handleSizeChange(val) {
        this.queryData.limit = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.getData(val)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .el-form-item
    margin-left 10px
    margin-right 30px
  .btn-wrapper
    margin 20px 0
  .danger
    color #f56c6c
  .run-text
    color #008000
  .pagination-wrapper
    display flex
    flex-direction row-reverse
    margin 20px
  .err
    color red
  .normal
    color green
  .running
    color green
  .my_table >>> .el-table__body tr.current-row > td {
    background-color: #00E5EE
  }
</style>
