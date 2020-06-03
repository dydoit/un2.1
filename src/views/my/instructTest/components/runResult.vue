<template>
  <div>
    <!-- 运行结果 -->
    <div class="top">
      <el-radio-group
        v-model="isTable"
        size="mini"
      >
        <el-radio-button :label="true">table展示</el-radio-button>
        <el-radio-button :label="false">json展示</el-radio-button>
      </el-radio-group>
      <el-button size="mini" @click="setExam" v-show="type===0">设为示例</el-button>
    </div>
    <div>
      <table v-show="isTable">
        <thead>
          <tr>
            <td>key值</td>
            <td>value值</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of resultTableArr" :key="item.key">
            <td>
              {{item.key}}
            </td>
            <td>
              <span>{{item.value instanceof Object?JSON.stringify(item.value):item.value}}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="res-json" v-show="!isTable">
        {
           <ul >
            <li v-for="(val,key,index) in runResult" :key="index">
              <span>{{key}}</span>:
              <span>{{val instanceof Object?JSON.stringify(val):val}}</span>
            </li>
          </ul>
        }
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type:String,
      require: true
    },
    runResult: {
      type: Object
    },
    type: {
      type:Number
    }
  },
  data() {
    return {
      isTable: true
    };
  },
  computed: {
    resultTableArr() {
      return Object.keys(this.runResult).map(key => {
        return  {
          key,
          value: this.runResult[key]
        }
      })
    }
  },
  methods: {
    async setExam() {
      let res = await this.$http.get('/OpsDev/orderAnalysis/saveAnalysisForExampleResult', {
        params:{
          id: this.id,
          exampleResult: JSON.stringify(this.runResult)
        }
      })
      if(res.status=='success') {
        this.$message.success('设置成功')
      }
    }
  },

};
</script>

<style lang="stylus" scoped>
  .top
    display flex
    .el-button
      margin-left 30px
  .res-json
    margin 10px
    ul
      padding-left 1em
  table
    margin 10px
    width 400px
    text-align: center;
    border: 1px solid #ccc;
    border-collapse: collapse;
    td
      padding: 4px 5px;
      border 1px solid #ccc
</style>
