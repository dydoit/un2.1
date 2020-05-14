<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    class="dialog-wrapper">
    <h4>调度任务配置</h4>
    <el-form :model="form" :rules="rules" ref="">
      <div class="top-form">
        <el-form-item label="调度任务名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" value-format="timestamp" type="date" placeholder="开始日期" :picker-options="pickerOptionsStart">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" value-format="timestamp" placeholder="结束日期" :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
      </div>
      <cron v-if="showCronBox" v-model="form.cronExpression"></cron>
      <span style="color: #E6A23C; font-size: 12px;">表达式从左到右（用空格隔开）：秒 分 小时 日 月份 星期中的日期 年份</span>
      <el-form-item label="表达式：">
        <el-input v-model="form.cronExpression" auto-complete="off">
          <el-button slot="append" v-if="!showCronBox" icon="el-icon-arrow-up" @click="showCronBox = true" title="打开图形配置"></el-button>
          <el-button slot="append" v-else icon="el-icon-arrow-down" @click="showCronBox = false" title="关闭图形配置"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Cron from "@/components/cron/cron.vue";
export default {
  name: "CronModel",
  data() {
    return {
      rowNum: '',
      taskName:'',
      taskId: '',
      subType: 'add',
      form: {
        name: '',
        cronExpression: "0 0 0 * * ? *",
        startTime: '',
        endTime: ''
      },
      showCronBox: true,
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: "请输入调度任务名称" }],
        startTime: [{required:true, message: '请选择开始时间'}],
        endTime: [{required:true, message:'请选结束时间'}]
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {
        disabledDate:(time) => {
          return time< this.form.startTime
        }
      }
    };
  },
  components: {
    Cron
  },
  methods: {
    get(id, name, num) {
      if(this.taskId!=id) {
        this.taskId = id
        this.taskName = name
        this.rowNum = num
        this.getData(id)
      } else {
        this.show()
      }
    },
    async getData(id) {
      let res = await this.$http.get('/OpsDev/schedule/getScheduleByTaskId', {
        params: {
          taskId: id
        }
      })
      if(!!res) { // 表示设置过调度任务
        this.subType="modify"
        this.form = {
          name: res.name,
          cronExpression: res.cronExpression,
          startTime: res.startTime,
          endTime: res.endTime
        }
      }else {
        this.subType="add"
        this.form = {
          name: this.taskName,
          cronExpression: "0 0 0 * * ? *",
          startTime: '',
          endTime: ''
        }
      }
      this.show()
    },
    hide() {
      this.dialogFormVisible = false;
    },
    show() {
      this.dialogFormVisible = true;
    },
    sure() {
      if(this.subType=="add") {
        this.sub()
      }else if(this.subType=='modify') {
        this.modify()
      }
    },
    async sub() {
      let res = await this.$http.get('/OpsDev/schedule/addSchedule', {
        params:{
          taskId: this.taskId,
          name: this.taskName,
          cronExpression: this.form.cronExpression,
          startTime: this.form.startTime,
          endTime: this.form.endTime
        }
      })
      if(res.status=='success') {
        this.$message({
          type:'success',
          message: '提交成功'
        })
        this.subType = 'modify'
        this.hide()
        this.$emit('changeCycle', this.rowNum)
      }else {
        this.$message.error(`${res.msg}`)
      }
    },
    async modify() {
      let res = await this.$http.get('/OpsDev/schedule/updateSchedule', {
        params:{
          taskId: this.taskId,
          name: this.taskName,
          cronExpression: this.form.cronExpression,
          startTime: this.form.startTime,
          endTime: this.form.endTime
        }
      })
      if(res.status == 'success') {
        this.$message({
          type:'success',
          message: '修改成功'
        })
        this.hide()
      }else {
        this.$message.error('修改失败')
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.top-form {
  display: flex;
  justify-content: space-around;
}

.dialog-wrapper >>> {
  .el-dialog__header {
    padding-top: 0;
    padding-bottom: 0;

    .el-dialog__headerbtn {
      top: 0;
      right: 5px;
    }
  }
}
</style>
