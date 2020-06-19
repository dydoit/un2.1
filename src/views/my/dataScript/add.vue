<template>
  <div class="wrapper">
    <table class="table">
      <tr>
        <td class="lable">
          设备厂家:
        </td>
        <td class="content">
          <span :class="{selected: item.dictValue==selectedComp}" v-for="item of equipmentCompanyArr" :key="item.dictValue" @click="selectedComp=item.dictValue">{{item.dictNameZh}}</span>
        </td>
      </tr>
      <tr>
        <td class="lable">
          设备类型:
        </td>
        <td class="content">
          <span :class="{selected: item.dictValue==selectedEquip}" v-for="item of equipmentTypeArr" :key="item.dictValue" @click="selectedEquip=item.dictValue">{{item.dictNameZh}}</span>
        </td>
      </tr>
      <tr>
        <td class="lable">
          设备版本号:
        </td>
        <td class="content">
          <span :class="{selected: item.version==selectedVersion}" v-for="item of equipmentVersionArr" :key="item.version" @click="selectedVersion=item.version">{{item.version}}</span>
        </td>
      </tr>
      <tr>
        <td class="lable">
          指令：
        </td>
        <td>
          <el-select
                          v-model="selectedInstruId"
                          filterable
                          placeholder="可输入关键词进行模糊搜索"
                          :disabled="!selectedVersion"
                          size="small" style="width:50%">
                          <el-option v-for="item in instructList"
                            :key="item.id"
                            :label="item.name + '----('+ item.code +')'"
                            :value="item.id"></el-option>
                      </el-select>
        </td>
      </tr>
      <tr>
        <td class="lable">
          指令模板：
        </td>
        <td>
          <el-select
                          v-model="selectedInstruModeId"
                          filterable
                          placeholder="可输入关键词进行模糊搜索"
                          :disabled="!selectedInstruId"
                          size="small" style="width:50%">
                          <el-option v-for="item in instructModeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                      </el-select>
        </td>
      </tr>
    </table>
    <el-form size="small" :model="formData" label-width="100px">
      <el-form-item label="脚本名称：" required>
        <el-input placeholder="请输入脚本名称" v-model="formData.parserZh"></el-input>
      </el-form-item>
      <el-form-item label="功能描述：" required>
        <el-input type="textarea" rows="4" placeholder="请输入描述" v-model="formData.parserDescribe"></el-input>
      </el-form-item>
      <el-form-item label="版本号：" required>
        <el-input v-model="formData.parserVersion"></el-input> <span>（示例：V1.0）</span>
      </el-form-item>

    </el-form>
    <div class="btn-wrapper">
        <el-button type="primary" size="medium"  @click="save">保存</el-button>
        <el-button type="success" size="medium" class="btn-green" :disabled="!isSave" @click="goNext">下一步，脚本解析</el-button>
    </div>
  </div>
</template>

<script>
import {mapGetters } from "vuex";
  export default {
    data() {
      return {
        selectedComp:'', // 选中设备厂家
        selectedEquip: '', // 选中设备类型
        selectedVersion: '', //选中设备版本号
        selectedInstruId: '',
        selectedInstruModeId: '',
        equipmentVersionArr:[], //设备版本号集合
        instructList: [], //指令集合
        instructModeList: [],  // 指令模板集合
        formData: {
          parserZh:'',
          parserDescribe:'',
          parserVersion: ''
        },
        isSave: false,
        parseId: '',
      }
    },
    watch: {
      selectedComp(newValue) {
        if(this.selectedEquip) {
          this.getEquipVersions()
        }
      },
      selectedEquip(newValue){
        if(this.selectedComp) {
          this.getEquipVersions()
        }
      },
      selectedVersion(newValue) {
        this.selectedInstruId = ''
        if(!newValue) {
          this.instructList = []
        }else {
          this.getInstructList()
        }
      },
      selectedInstruId(newVal) {
        this.selectedInstruModeId = ''
        if(!newVal) {
          this.instructModeList = []
        }else {
          this.getInstructModeList()
        }
      }
    },
    computed: {
      ...mapGetters({
        professionList: 'professionList',
        equipmentCompanyArr: 'equipmentCompanyArr',
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr',
        roleMenuList: 'roleMenuList'
      }),
    },
    methods: {
      async getEquipVersions() {
        let res = await this.$http.get('/OpsDev/dicts/getVersionByDict', {
          params: {
            company:this.selectedComp,
            netType:this.selectedEquip
          }
        })
        this.equipmentVersionArr = res
      },
      async getInstructList(){
        let res = await this.$http.get('/OpsDev/order/queryOrderForName',{
          params:{
              equipmentCompany:this.selectedComp,//	设备厂商
              equipmentType:this.selectedEquip,//	设备类型
              equipmentVersion:this.selectedVersion
          }
        })
        this.instructList = res
      },
      async getInstructModeList() {
        let res = await this.$http.get('/OpsDev/orderAnalysis/getAnalysisListByOrderId', {
          params: {
            id: this.selectedInstruId
          }
        })
        this.instructModeList = res
      },
      async save() {
        let res = await this.$http.get('/OpsDev/orderDataParser/addOrderDataParser', {
          params: {
              ...this.formData,
              instruId: this.selectedInstruId,
              analysisId: this.selectedInstruModeId
          }
        })
        if(res.status == 'success') {
          this.parseId = res.id
          this.$message.success('保存成功')
          this.isSave = true
        }
      },
      goNext() {
        this.$router.push({path: '/parsing', query: {parseId: this.parseId}})
      }
    },

  }
</script>

<style lang="stylus" scoped>
.wrapper
  margin 20px 30px
table
  width 100%
  margin-bottom 20px
  border-collapse collapse
  td
    height 34px
    border 1px solid #ddd
    &.lable
      width 120px
      background-color #efefef
      text-align center
    &.content
      padding 0 10px
      font-size 13px
      span
        margin-right 6px
        padding 1px 8px
        border 1px solid transparent
        cursor pointer
        color #606266
        &:hover
          color #fb9906
        &.selected
          color #fb9906
          border 1px solid #fb9906
.el-form
  .el-input,.el-textarea
    width 600px
</style>
