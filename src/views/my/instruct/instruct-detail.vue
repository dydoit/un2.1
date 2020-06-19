<template>
  <div class="wrap">
    <el-form size="small" :model="instructData">
      <div class="my-item-wrapper">
        <el-form-item
          label="设备厂家："
          required
        >
          <el-select v-model="instructData.equipmentCompany" disabled>
            <el-option
              v-for="item of equipmentCompanyArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备类型："
          required
        >
          <el-select v-model="instructData.equipmentType" disabled>
            <el-option
              v-for="item of equipmentTypeArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        label="指令代码："
        required
      >
        <el-input disabled placeholder="请输入指令名称，不包含参数" v-model="instructData.instructCode"></el-input>
      </el-form-item>
      <el-form-item label="指令中文名称：" required>
        <el-input disabled placeholder="请输入指令名称，不包含参数" v-model="instructData.instructZh"></el-input>
      </el-form-item>
      <el-form-item
        label="指令类型："
        required
      >
        <div class="radio-group">
          <el-radio disabled v-model="instructData.instructType" v-for="item of instructTypeArr" :key="item.id" :label="item.dictValue">{{item.dictNameZh}}</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="选择适用版本：" required>
        <el-checkbox-group v-model="checkVersionList">
          <el-checkbox disabled v-for="(item,index) of venderList" :key="index" :label="item.version"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="指令说明：" required>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          disabled
          v-model="instructData.instructDescribe"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="参数填写：">
        <table>
          <thead>
            <tr>
              <td>参数</td>
              <td>参数中文名称(选填)</td>
              <td>是否必填</td>
              <td>参数描述</td>
            </tr>
          </thead>
          <tbody v-if="!paramsTable.length" class="no-param">
            <tr>
              <td colspan="5">暂无参数</td>
            </tr>

          </tbody>
          <tbody v-else>
            <tr v-for="(item,index) of paramsTable" :key="index">
              <td
              >
                <div
                v-text="item.parameterCode">
                </div>
              </td>
              <td>
                <div>
                  {{item.parameterZh}}
                </div>
              </td>
              <td class="is-required">
                <select v-model="item.paramNotNull" disabled>
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </td>
              <td class="intro">
                <div v-html="item.parameterDescribe">
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </el-form-item>
      <el-form-item>
        <div class="param-see">
          <p class="tip">
            指令预览：<span>{{instructData.instructCode}}: {{instructStr?instructStr:';'}}</span>
          </p>
          <ul class="param-list">
            <li v-for="(item,index) of params" :key="index">
              <label :class="[item.paramNotNull!='0'?'required':'']">{{item.parameterCode}}</label>
              <span>=</span>
              <el-input v-model="item.paramVal"></el-input>
            </li>
          </ul>

        </div>

      </el-form-item>
      <el-form-item>
        <p>
           <el-checkbox v-model="isRead" disabled>
            同意并详细阅读<a href="#" target="_blank">&lt;&lt;责任说明&gt;&gt;</a>
          </el-checkbox>
        </p>
      </el-form-item>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {mapGetters } from "vuex"
export default {
  data() {
    return {
      venderList: [], // 适用版本号
      versionTabs: [], // 版本号tab
      checkVersionList:[], // 选中的适用版本数组
      instructData: {
        equipmentCompany: '',
        equipmentType: '',
        instructCode: '',
        instructZh: '',
        instructType: '',
        equipmentVersion: '',
        instructDescribe:'',
        instructParameter: '', //指令参数
        orderParameterList: [], // 参数表大数组对象
      },
      paramsTable: [],
      params:[],
      options: [{ label: "是", value: 1 }, { label: "否", value: 0 }],
      currentTabVersion:'',
      isRead: false
    };
  },
  created() {
    let id = this.$route.query.id
    this.get_detail(id)
  },
  watch: {
      'instructData.equipmentCompany'() {
        this.getVersion()
      },
      'instructData.equipmentType'() {
        this.getVersion()
      }
  },
  computed: {
    ...mapGetters({
        equipmentCompanyArr: 'equipmentCompanyArr',
        instructTypeArr: 'instructTypeArr', //指令类型
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr'
    }),
    instructStr() {
      let str = ''
      let ffarr = this.params.filter(elem => elem.paramVal)
      ffarr.forEach((ff,index) => {
        if(index< ffarr.length-1) {
          str+=`${ff.parameterCode}=${ff.paramVal},`
        }else {
          str+=`${ff.parameterCode}=${ff.paramVal};`
        }
      })
      return str
    }
  },
  methods: {
    async getVersion() {
        let list = await this.$http.get('/OpsDev/dicts/getVersionByDict', {
          params: {
            company:this.instructData.equipmentCompany,
            netType:this.instructData.equipmentType
          }
        })
        this.venderList = list
    },
    async get_detail(id) {
      let detail = await this.$http.get('/OpsDev/order/getOrderById',{
        params: {id}
      })
      // console.log(detail)
      let {equipmentVersion, instructParameter,orderParameterList} = detail
      this.instructData = detail
      this.checkVersionList = equipmentVersion.split(',')
      this.paramsTable = orderParameterList
      if(instructParameter) {
         this.params = JSON.parse(instructParameter).map(item => {
          return {
            parameterCode: item.paramKey,
            paramNotNull: item.paramNotNull,
            paramVal: item.paramValue
          }
      })
      }


    },
    back() {
      this.$router.push('/home/my-instruction/list')
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-item-wrapper {
  display: flex;
  justify-content: space-between;

  .el-form-item {
    display: flex;
  }
}

.el-form-item >>> .el-form-item__content {
  clear: both;
}

table
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse
  line-height 1.5
  thead
    background-color #ddd
    td
      padding 6px 0
  .no-param
    td
      padding 6px 0
  td
    padding 2px 4px
    border: 1px solid #ccc
    &.is-required
      width 9%
    &.intro
      width 35%
      text-align left
    &.handle
      width 2em
.add-wrapper {
  text-align: right;
}
.param-list
  display flex
  flex-wrap wrap
  margin-left -50px
  li
    display flex
    width 28%
    margin-left 50px
    margin-bottom 12px
    label
      width 100px
      text-align right
      &.required:before
        content : '*'
        color: #F56C6C
        margin-right: 4px
    span
      margin 0 10px
.tip
  padding 10px
  margin-top -10px
  margin-bottom 15px
  background-color #ddd
  span
    text-decoration underline
    font-weight bold
</style>
