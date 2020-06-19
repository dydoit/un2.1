<template>
  <div class="input-model">
    <div class="part2">
      <table>
        <thead>
          <tr>
            <td width="10%">参数</td>
            <td width="10%">检验方式</td>
            <td width="45%">参数范围</td>
            <td>必填</td>
            <td>参数值</td>
          </tr>
        </thead>
        <tbody v-if="!params.length">
          <tr class="no-data">
            <td colspan="5">暂无数据</td>
          </tr>
        </tbody>
        <tbody>
          <tr v-for="(item,index) of params" :key="index">
            <td >{{item.paramKey}}</td>
            <td >
               <el-select size="mini" disabled v-model="item.checkType" @change="handleTypeChange(item)">
                 <el-option v-for="val of options" :key="val.value"
                 :label="val.label"
                 :value="val.value"
                 ></el-option>
               </el-select>
            </td>
            <td>
              <template v-if="item.checkType==0">
                <el-input disabled style="width:60%" size="mini" type="text" v-model="item.paramExtent" disabled></el-input>
              </template>
              <template v-else-if="item.checkType==1">
                <el-input disabled size="mini" style="width:60%" type="text"  v-model="item.paramExtent" placeholder="多选值，用逗号隔开"></el-input>
              </template>
              <template v-else-if="item.checkType==2">
                <el-input disabled @blur="setValue(item)" size="mini"  style="width:60%" type="text"  v-model="item.paramExtent" placeholder="请输入固定值"></el-input>
              </template>
               <template v-else-if="item.checkType==3">
                <el-input disabled size="mini" style="width:auto" type="text"  v-model="item.paramExtent[0]"></el-input> ~
                <el-input disabled size="mini" style="width:auto" type="text" v-model="item.paramExtent[1]"></el-input>
              </template>
            </td>
            <td>
              {{item.paramNotNull?'是':'否'}}
            </td>
            <td>
              <template v-if="item.checkType==1">
                <el-select v-model="item.paramValue" style="width:50%" size="mini">
                  <el-option :value="op" v-for="op of item.paramExtent.split(',')" :key="op">{{op}}</el-option>
                </el-select>
              </template>
              <template v-else-if="item.checkType==2">
                <el-input size="mini" disabled style="width:50%" type="text" v-model="item.paramValue"></el-input>
              </template>
              <template v-else>
                <el-input size="mini" style="width:50%" type="text" v-model="item.paramValue"></el-input>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="part3">
       <p class="tip" v-if="instructType==2">
            指令预览：<span>{{filterCode}} {{instructStr}}</span>
       </p>
       <p class="tip" v-if="instructType==1">
            指令预览：<span>{{filterCode2}} {{instructStr2}}</span>
       </p>
    </div>
  </div>
</template>

<script>
// 交集
const intersection  = (arr1, arr2) => {
  return arr1.filter(v => arr2.includes(v))
}
const filterCode = (code) => {
  if(code) {
     return code.replace(/:/g, '').replace(/;/g, '')
  }
}
const options = [
  {value: "0",label: '无'},
  {value: "1",label: '多选'},
  {value: "2",label: '固定值'},
  {value: "3",label: '数值范围'}
]
export default {
  data() {
    return {
      options,
    };
  },
  props: ['instructCode', 'instructType','params','equipmentVersion'],
  computed: {
    filterCode() {
      let code = this.instructCode
      if(code) {
        if(!this.instructStr) {
          return code.replace(/:/g, '').replace(/;/g, '') + ':;'
        }else {
          return code.replace(/:/g, '').replace(/;/g, '') + ':'
        }
      }else {
        return ''
      }

    },
    filterCode2() {
      let code = this.instructCode
      if(code) {
        return code.replace( /\$\{(.*?)\}/g,'').replace(/:/g, '').replace(/;/g, '')
      }
    },
    instructStr2() {
      let str = "";
      let ffarr = this.params.filter(elem => elem.paramValue);
      return ffarr.reduce((last,cur) => {
        return last + cur.paramValue + ' '
      },'')
    },
    instructStr() {
      let str = "";
      let ffarr = this.params.filter(elem => elem.paramValue);
      ffarr.forEach((ff, index) => {
        if (index < ffarr.length - 1) {
          str += `${ff.parameterCode}=${ff.paramValue},`;
        } else {
          str += `${ff.parameterCode}=${ff.paramValue};`;
        }
      });
      return str;
    }
  },
  methods: {
    handleTypeChange(item) {
      item.paramValue = ''
      if(item.checkType == 3) {
        item.paramExtent = [0, 10]
      }else {
        item.paramExtent = ''
      }
    },
    setValue(item) {
      item.paramValue = item.paramExtent
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-data {
  text-align: center;
  color:#ccc;
}
.input-model
  padding: 20px 30px;
  .part1
    display: flex;
    align-items: center;
    padding-bottom 10px
    border-bottom 1px solid #ccc
    span
      margin-right: 20px;
    .el-checkbox
      margin-right 5px
  .part2
    min-height 100px
  table
    width 100%
    margin 10px 0
    text-align center
    td
      height 30px
      input
        border-radius 2px
  .part3
    height 36px
    line-height 36px
    margin 15px 0
    background-color #f5f5f5
</style>
