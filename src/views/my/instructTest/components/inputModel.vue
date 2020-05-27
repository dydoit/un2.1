<template>
  <div class="input-model">
    <div class="part1">
      <span>指令参数:</span>
      <div>
        <el-checkbox-group v-model="selectedParams" size="small">
          <el-checkbox v-for="item of params"
            :key="item.paramKey" border
            :label="item"
            :disabled="item.disabled"
          >
            <i v-if="item.paramNotNull>0" style="margin-right:6px;color:red">*</i>{{item.paramKey}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
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
        <tbody>
          <tr v-for="(item,index) of selectedParams" :key="index">
            <td >{{item.paramKey}}</td>
            <td >
               <el-select size="mini" v-model="item.checkType" @change="handleTypeChange(item)">
                 <el-option v-for="val of options" :key="val.value"
                 :label="val.label"
                 :value="val.value"
                 ></el-option>
               </el-select>
            </td>
            <td>
              <template v-if="item.checkType==0">
                <el-input style="width:60%" size="mini" type="text" v-model="item.paramExtent" disabled></el-input>
              </template>
              <template v-else-if="item.checkType==1">
                <el-input size="mini" style="width:60%" type="text"  v-model="item.paramExtent" placeholder="多选值，用逗号隔开"></el-input>
              </template>
              <template v-else-if="item.checkType==2">
                <el-input @blur="setValue(item)" size="mini"  style="width:60%" type="text"  v-model="item.paramExtent" placeholder="请输入固定值"></el-input>
              </template>
               <template v-else-if="item.checkType==3">
                <el-input size="mini" style="width:auto" type="text"  v-model="item.paramExtent[0]"></el-input> ~
                <el-input size="mini" style="width:auto" type="text" v-model="item.paramExtent[1]"></el-input>
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
    <div class="part4">
      可支持的设备版本：{{supportVersions.join(',')}}
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
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
  {value: 0,label: '无'},
  {value: 1,label: '多选'},
  {value: 2,label: '固定值'},
  {value: 3,label: '数值范围'}
]
export default {
  data() {
    return {
      options,
      instructCode: '',
      params: [],
      selectedParams:[]
    };
  },
  created() {
    let id = this.$route.query.id
    if(id) {
      this.getOrderData(id)
    }
  },
  computed: {
    ...mapGetters({
      instructTypeObj: 'dict/instructTypeObj'
    }),
    supportVersions() {
      let params = this.selectedParams
      if(!params.length) {
        return []
      }
      let midArr = [], arr=[]
      params.forEach((item,index) => {
        if(index == 0) {
          arr = midArr.concat(item.orderParameterEquipmentVersionList.map(v => v.equipmentVersion))
        }else {
          arr = intersection(arr, item.orderParameterEquipmentVersionList.map(v => v.equipmentVersion))
        }
      })
      return arr
    },
    instructType() { // 指令编辑类型
      return this.instructTypeObj[this.equipmentCompany+this.equipmentType]?
      this.instructTypeObj[this.equipmentCompany+this.equipmentType]:'1'
    },
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
      let ffarr = this.selectedParams.filter(elem => elem.paramValue);
      return ffarr.reduce((last,cur) => {
        return last + cur.paramValue + ' '
      },'')
    },
    instructStr() {
      let str = "";
      let ffarr = this.selectedParams.filter(elem => elem.paramValue);
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
  watch: {
    selectedParams(newValue) {
      if(!newValue.length) {
        this.params.forEach(item => {
          item.disabled = false
        })
      }else {
        this.params.forEach(item => {
          let arr = item.orderParameterEquipmentVersionList.map(version => version.equipmentVersion)
          let res = intersection(this.supportVersions, arr)
          if(!res.length) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    }
  },
  methods: {
    async getOrderData(id) {
      let res = await this.$http.get('/OpsDev/order/getOrderById',{
        params:{
          id,
        }
      })
      let {instructCode,equipmentCompany, equipmentType, orderParameterList} = res
      this.instructCode = instructCode
      this.equipmentCompany = equipmentCompany
      this.equipmentType = equipmentType
      this.params = orderParameterList.length? orderParameterList.map(item => {
        return {
          paramKey: item.parameterCode,
          paramValue: "",
          paramKeyZh: item.parameterZh,
          paramNotNull: item.paramNotNull-0,
          disabled: false,
          checkType: 0, //检验方式
          paramExtent: "", //参数范围
          orderParameterEquipmentVersionList: item.orderParameterEquipmentVersionList?item.orderParameterEquipmentVersionList:[]
        }
      }):[]
      console.log(res)
    },
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
