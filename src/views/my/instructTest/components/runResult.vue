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
      <el-button size="mini">设为示例</el-button>
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
          <tr v-for="item of result" :key="item.key">
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
            <li v-for="(val,key,index) in resultJson" :key="index">
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
  data() {
    return {
      isTable: true,
      result: [
        {
          key:'script ',
          value:'测试脚本'
        },
        {
          key: 'command',
          value: '指令'
        },
        {
          key:'equitment',
          value:'华为'
        },
        {
          key: 'outparam',
          value: {
            status: 200,
            msg: 'hello'
          }
        }
      ]
    };
  },
  computed: {
    resultJson() {
      return this.result.reduce((last,cur)=> {
        return {
          ...last,
          [cur.key]: cur.value
        }
      },{})
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
