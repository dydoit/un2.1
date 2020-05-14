<template>
  <div class="wrap">
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      v-if="handleType=='add'||handleType=='modify'"
      @click="addStep"
      v-permission="10030408"
    >
      新增任务步骤
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="操作类型"
        width="130"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ operateNameObj[scope.row.operateType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="指令/模板选择"
        width="160"
      >
        <template slot-scope="scope">
          <p>{{scope.row.operateName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="解释"
        width="200"
      >
        <template slot-scope="scope">
          <p>{{scope.row.operateDescribe}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="绑定网元(数量)"
        width="120"
      >
        <template slot-scope="scope">
          <p>
            <span
              class="net-num"
            >共{{scope.row.networkIds.length}}个</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="handleType=='add'||handleType=='modify'">
            <el-button
            size="mini"
            @click="top(scope.$index, scope.row)"
          >置顶</el-button>
          <el-button
            size="mini"
            @click="moveUp(scope.$index, scope.row)"
          >上移</el-button>
          <el-button
            size="mini"
            @click="moveDown(scope.$index, scope.row)"
          >下移</el-button>
          <el-button
            size="mini"
            @click="modify(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
          </div>
          <div v-if="handleType=='read'">
            <el-button size="mini" @click="handleSee(scope.$index, scope.row)" type="primary">
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <task-step ref="stepModel" @step="addItem"></task-step>
    <step-detail ref="stepDetail" :step-data="clickItem"></step-detail>
    <step-modify ref="modifyModel" :step-data="clickItem" :step-index="clickIndex" @modify="modItem"></step-modify>
    <el-button type="primary" @click="save" v-if="handleType=='add'||handleType=='modify'" v-permission="10030408">保存</el-button>
    <el-button type="default" @click="reback">返回</el-button>
  </div>
</template>

<script>
import TaskStep from "./components/task-step.vue";
import stepModify from './components/step-modify.vue'
import stepDetail from './components/step-detail.vue'
const operateNameObj = {
  '0': '指令',
  "1": '指令模板',
  "2": '任务模板'
}
export default {
  data() {
    return {
      handleType: 'add',
      taskId: '',
      operateNameObj,
      clickItem: {},
      clickIndex: '',
      tableData: [
      ]
    };
  },
  created() {
    let id = this.$route.query.id
    let type=this.$route.query.type
    if(id) {
      this.taskId = id
      this.getStepData(id)
      if(type) {
        this.handleType = type
      }
    }
  },
  methods: {
    async getStepData(id) {
      let res = await this.$http.get('/OpsDev/taskExamine/getTaskStepListById', {
        params: {id}
      })
      this.tableData = res.map(item => {
        return {
          taskId: item.taskId,
          equipmentCompany: item.equipmentCompany,
          equipmentType: item.equipmentType,
          currentVersion:item.currentVersion,
          networkIds:item.networkIds?item.networkIds.split(','): [],
          operateDescribe: item.operateDescribe,
          operateId: item.operateId,
          operateName: item.operateName,
          operateType: item.operateType,
          paramList: item.paramList
        }
      })
    },
    addItem(item) {
      this.tableData.push(item)
    },
    handleDelete(index, row) {
      this.tableData.splice(index,1)
    },
    handleSee(i, item) {
       this.clickItem = item
       this.$refs.stepDetail.show()
    },
    top(i, item) {
      this.tableData.splice(i, 1);
      this.tableData.unshift(item)
    },
    moveUp(i, item) {
      if (i == 0) {
        return;
      }
      this.tableData.splice(i - 1, 2, item, this.tableData[i - 1]);
    },
    moveDown(i, item) {
      if (i == this.tableData.length - 1) {
        return;
      }
      this.tableData.splice(i, 2, this.tableData[i + 1], item);
    },
    modify(index, item) {
      this.clickItem = item
      this.clickIndex = index
      this.$refs.modifyModel.show()
    },
    modItem({data, index}) {
      this.tableData.splice(index,1,data)
    },
    addStep() {
      this.$refs.stepModel.show();
    },
    save() {
      let data = this.tableData.map((item, index) => {
        return {
          ...item,
          sort: index,
          networkIds: item.networkIds.join(','),
          taskId: this.taskId
        }
      })
      this.$http.post('/OpsDev/taskExamine/addTaskStep', data).then(res => {
        if(res.status == 'success') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }else {
          this.$message.error(`${res.msg}`)
        }
      }).catch(console.log)
    },
    reback() { // 返回上一步
      this.$router.push({
          path: '/my-task/manage',
          query: {
            id: this.taskId,
            type: 'modify'
          }
      })
    }
  },
  components: {
    TaskStep,
    stepModify,
    stepDetail
  }
};
</script>

<style lang="stylus" scoped>
.net-num {
  cursor: pointer;
}

.btn-wrapper {
  margin: 20px 0;
  text-align: center;

  .el-button {
    margin-right: 20px;
  }
}
</style>
