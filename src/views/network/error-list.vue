<template>
  <div class="wrapper">
    <el-form :inline="true" :model="formData" size="small" label-width="100px">
       <el-form-item label="开始时间">
         <el-date-picker
          v-model="formData.startTime"
          type="date"
          value-format="timestamp"
          :picker-options="pickerOptions1"
          placeholder="选择日期">
          </el-date-picker>
       </el-form-item>
       <el-form-item label="结束时间">
         <el-date-picker
          v-model="formData.endTime"
          type="date"
           value-format="timestamp"
           :picker-options="pickerOptions2"
          placeholder="选择日期">
          </el-date-picker>
       </el-form-item>
       <el-form-item label="状态">
         <el-select  v-model="formData.status">
            <el-option v-for="item of options" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
         </el-select>
       </el-form-item>
       <el-button type="primary" size="small" @click="getData">搜索</el-button>
    </el-form>
    <div class="no-data" v-if="!list.length">
       暂无数据
    </div>
    <ul class="list-wrapper">
      <li v-for="item of list" :key="item.id">
        <div class="part1">
          <div>
            <span>
              联系人：{{item.applyName}}
            </span>
             <span>
              联系方式：{{item.applyContact}}
            </span>
             <span>
              提交时间：{{item.applyTime}}
            </span>
          </div>
          <span v-if="item.status==1">
            状态：待处理
          </span>
           <span v-else-if="item.status==2">
             状态：已处理
          </span>
           <span v-else-if="item.status==3">
             状态：已撤销
          </span>
        </div>
        <div class="part2">
          {{item.problemDescribe?item.problemDescribe:'无描述'}}
          <!-- 超管可以看到审核按钮 -->
          <div class="btn-wrapper">
            <el-button size="mini" v-if="item.status ==1" @click="check(item.id)">审核</el-button>
            <el-button v-if="item.status==1" type="primary" size="mini" @click="repeal(item.id)">撤销</el-button>
            <el-button v-if="item.status==2" type="info" size="mini" @click="see(item.handleDescribe)">查看审核意见</el-button>
          </div>

        </div>
      </li>
    </ul>
     <!-- 分页 -->
    <div class="pagination-wrapper" v-if="list.length">
        <el-pagination
          layout="total,sizes, prev, pager, next, jumper"
          background
          :page-sizes="[6, 10, 14, 18]"
          :page-size="limit"
          :total="total"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
    <check-model ref="check" @again="getData"></check-model>
  </div>
</template>

<script>
import moment from 'moment'
import CheckModel from './components/check-model.vue'
const options = [
  { value: "1", label: "待处理" },
  { value: "2", label: "已处理" },
  { value: "3", label: "已撤销" }
];
  export default {
    data() {
      return {
        options,
        formData: {
          startTime:'',
          endTime: '',
          status: ''
        },
        currentPage:1,
        limit: 6,
        list:[],
        pickerOptions1: {
          disabledDate: (time) => {
                if (this.formData.endTime != "") {
                    return time > Date.now() || time> this.formData.endTime
                } else {
                    return time > Date.now();
                }

          }
        },
        pickerOptions2: {
            disabledDate: (time) => {
              return time < this.formData.startTime
            }
        }
      }
    },
    created() {
      this.getData()
    },
    components: {
      CheckModel,
    },
    methods: {
      async getData() {
        let res = await this.$http.get('/OpsDev/networkAudit/queryNetAuditList', {
          params: {
            ...this.formData,
            startTime: this.formData.startTime?moment(this.formData.startTime).format("YYYY-MM-DD"):'',
            endTime:this.formData.endTime?moment(this.formData.endTime).format("YYYY-MM-DD"):'',
            currentPage:this.currentPage,
            limit: this.limit
          }
        })
        let {total, list} = res
        this.total = total
        this.list = list.map(item => {
          return {
            ...item,
            applyTime:moment(item.applyTime).format("YYYY-MM-DD HH:mm")
          }
        })
        console.log(res)
      },
      handleSizeChange(val){
        this.limit = val
        this.getData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.getData()
      },
      see(info) {
        this.$alert(`${info}`, '审核描述', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      },
      async repeal(id) {
        this.$confirm('撤销该报错?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let res = await this.$http.get('/OpsDev/networkAudit/doNetAuditRevoke', {
          params: {
              id
            }
          })

        if(res.status == 'success') {
          this.$message.success('撤销成功')
          this.getData()
        } else {
          this.$message.error('撤销失败，原因'+res.msg)
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },
      check(id) {
        this.$refs.check.show(id)
      }
    },
  }
</script>

<style lang="stylus" scoped>
.wrapper
  margin 0 16px
.el-form
  margin 20px 0
.list-wrapper
  padding 0 20px
  li
    padding-top 8px
    border-bottom 1px solid #ccc
  .part1
    display flex
    flex 1
    justify-content space-between
    margin-bottom 10px
    >div
      span
        margin-right 30px
        color #ccc
  .part2
    margin-bottom 10px
    display flex
    justify-content space-between
    align-items center
    .el-button
      margin-left 20px
.pagination-wrapper
  padding 20px 0
  text-align right
</style>
