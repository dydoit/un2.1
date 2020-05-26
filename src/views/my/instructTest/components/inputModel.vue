<template>
  <div class="input-model">
    <div class="part1">
      <span>指令参数:</span>
      <div>
        <el-checkbox-group v-model="selectedParams" size="small">
          <el-checkbox v-for="item of params"
            :key="item.paramKey" border
            :label="item"
            :disabled="isCanSelect(item.orderParameterEquipmentVersionList)"
          >
            {{item.paramKey}}
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
            <td>参数范围</td>
            <td>必填</td>
            <td>参数值</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) of selectedParams" :key="index">
            <td >{{item.paramKey}}</td>
            <td >
              <select v-model="item.checkType">
                  <option value="0">无</option>
                  <option value="1">多选</option>
                  <option value="2">固定值</option>
                  <option value="3">数值范围</option>
               </select>
            </td>
            <td>
              <input type="text" v-model="item.paramExtent">
            </td>
            <td>
              {{item.paramNotNull?'是':'否'}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="part3">

    </div>
    <div class="part4">
      可支持的设备版本：{{supportVersions.join(',')}}
    </div>

  </div>
</template>

<script>
// 交集
const intersection  = (arr1, arr2) => {
  return arr1.filter(v => arr2.includes(v))
}
export default {
  data() {
    return {
      params: [
        {
          paramKey: "VMRFPNM",
          paramValue: "",
          paramKeyZh: "",
          paramNotNull: 0,
          checkType: 0, //检验方式
          paramExtent: "", //参数范围
          orderParameterEquipmentVersionList: [
            { id: null, orderParameterId: 548, equipmentVersion: "v03" },
            { id: null, orderParameterId: 548, equipmentVersion: "v04" },
            { id: null, orderParameterId: 548, equipmentVersion: "v05" },
            { id: null, orderParameterId: 548, equipmentVersion: "v06" }
          ] //适用版本
        },
        {
          paramKey: "CT",
          paramValue: "",
          paramKeyZh: "",
          paramNotNull: 0,
          checkType: 0, //检验方式
          paramExtent: "", //参数范围
          orderParameterEquipmentVersionList: [
            { id: null, orderParameterId: 548, equipmentVersion: "v03" },
            { id: null, orderParameterId: 548, equipmentVersion: "v04" }
          ]
        },
        {
          paramKey: "MAXTI",
          paramValue: "",
          paramKeyZh: "",
          paramNotNull: 0,
          checkType: 0, //检验方式
          paramExtent: "", //参数范围
          orderParameterEquipmentVersionList: [
            { id: null, orderParameterId: 548, equipmentVersion: "v03" },
            { id: null, orderParameterId: 548, equipmentVersion: "v04" },
            { id: null, orderParameterId: 548, equipmentVersion: "v05" }
          ]
        },
        {
          paramKey: "TT",
          paramValue: "",
          paramKeyZh: "",
          paramNotNull: 1,
          checkType: 0, //检验方式
          paramExtent: "", //参数范围
          orderParameterEquipmentVersionList: [
            { id: null, orderParameterId: 548, equipmentVersion: "v06" }
          ]
        }
      ],
      selectedParams:[]
    };
  },
  computed: {
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
    }
  },
  methods: {
    isCanSelect(versions) {
      if(!this.supportVersions.length) {
        return false
      }
    }
  },
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
  table
    width 100%
    margin 10px 0
    text-align center
    td
      height 30px
</style>
