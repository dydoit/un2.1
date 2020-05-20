<template>
  <div class="wrap">
    <el-form
      size="small"
      :model="instructData"
    >
      <div class="my-item-wrapper">
        <el-form-item
          label="设备厂家："
          required
        >
          <el-select v-model="instructData.equipmentCompany" @change="handleChangeCom">
            <el-option
              v-for="item of equipmentCompanyArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item
          label="所属专业："
          required
        >
          <el-select v-model="instructData.profession" @change="handleChangePro" :disabled="user.roleid!=1">
            <el-option
              v-for="item of professionList"
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
          <el-select v-model="instructData.equipmentType" @change="handleChangeType">
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
        <el-input
          v-if="instructType==1"
          :disabled="!instructData.equipmentCompany || !instructData.equipmentType"
          placeholder="请输入指令代码，例如display interface ${type} ${port}"
          v-model="instructData.instructCode"
          @blur="formatt"
        ></el-input>
        <el-input
          v-if="instructType==2"
          key="instructType2"
          placeholder="请输入指令代码，不包含参数，例如DSP SYSRES"
          v-model="instructData.instructCode"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="指令中文名称："
        required
      >
        <el-input
          placeholder="请输入指令中文名称"
          v-model="instructData.instructZh"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="指令类型："
        required
      >
        <div class="radio-group">
          <el-radio
            v-model="instructData.instructType"
            v-for="item of instructTypeArr"
            :key="item.id"
            :label="item.dictValue"
          >{{item.dictNameZh}}</el-radio>
        </div>
      </el-form-item>
      <el-form-item
        label="选择指令适用版本："
        required
      >
        <el-checkbox-group v-model="checkVersionList">
          <el-checkbox
            v-for="(item,index) of venderList"
            :key="index"
            :label="item.version"
            @change="handelChangeParamsVertion"
          ></el-checkbox>
        </el-checkbox-group>
        <router-link to="/" v-if="!venderList.length">暂无网元版本,点击去新增网元</router-link >
      </el-form-item>
      <el-form-item
        label="指令说明："
        required
      >
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="instructData.instructDescribe"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="参数填写：" v-if="instructType==2">
        <table>
          <thead>
            <tr>
              <td>参数</td>
              <td>参数中文名称</td>
              <td>是否必填</td>
              <td>参数描述</td>
              <td>适用版本</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody
            v-if="!params.length"
            class="no-param"
          >
            <tr>
              <td colspan="5">暂无参数</td>
            </tr>

          </tbody>
          <tbody v-else>
            <tr
              v-for="(item,index) of params"
              :key="index"
            >
              <td>
                <div
                  v-text="item.parameterCode"
                  contenteditable="true"
                  @blur="handleName(item, $event)"
                >
                </div>
              </td>
              <td>
                <div
                  contenteditable="true"
                  v-text="item.parameterZh"
                  @blur="handleZh(item, $event)"
                >
                </div>
              </td>
              <td class="is-required">
                <select v-model="item.paramNotNull">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </td>
              <td class="intro">
                <div
                  contenteditable="true"
                  v-html="item.parameterDescribe"
                  @blur="handleIntro(item,$event)"
                >
                </div>
              </td>
              <td style="cursor:pointer" @click="showParamVersion(item)">
                <!-- 请选择参数适用版本 -->
                <p v-for="version of item.list" :key="version">{{version}}</p>
              </td>
              <td class="handle">
                <el-button
                  size="mini"
                  @click="del_param(index)"
                >删除</el-button>
              </td>
            </tr>
          </tbody>

        </table>
        <div class="add-wrapper">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="add_param"
          >添加参数</el-button>
        </div>
      </el-form-item>
      <el-form-item label="参数填写：" v-if="instructType ==1">
        <table>
          <thead>
            <tr>
              <td>参数</td>
              <td>参数中文名称</td>
              <td>是否必填</td>
              <td>参数描述</td>
              <td>适用版本</td>
            </tr>
          </thead>
          <tbody
            v-if="!params.length"
            class="no-param"
          >
            <tr>
              <td colspan="5">暂无参数</td>
            </tr>

          </tbody>
          <tbody v-else>
            <tr
              v-for="(item,index) of params"
              :key="index"
            >
              <td>
                <div
                  v-text="item.parameterCode"
                >
                </div>
              </td>
              <td>
                <div
                  contenteditable="true"
                  v-text="item.parameterZh"
                  @blur="handleZh(item, $event)"
                >
                </div>
              </td>
              <td class="is-required">
                <select v-model="item.paramNotNull">
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </td>
              <td class="intro">
                <div
                  contenteditable="true"
                  v-html="item.parameterDescribe"
                  @blur="handleIntro(item,
                  $event)"
                >
                </div>
              </td>
              <td style="cursor:pointer" @click="showParamVersion(item)">
                <!-- 请选择参数适用版本 -->
                <p v-for="version of item.list" :key="version">{{version}}</p>
              </td>
            </tr>
          </tbody>

        </table>
      </el-form-item>
      <el-form-item>
        <div class="param-see">
          <p class="tip" v-if="instructType==2">
            指令预览：<span>{{filterCode}} {{instructStr}}</span>
          </p>
          <p class="tip" v-if="instructType==1">
            指令预览：<span>{{filterCode2}} {{instructStr2}}</span>
          </p>
          <!-- 参数预览 -->
          <ul class="param-list">
            <li
              v-for="(item,index) of filterParmas"
              :key="index"
            >
              <label :class="[item.paramNotNull!='0'?'required':'']">{{item.parameterCode}}</label>
              <span>=</span>
              <el-input v-model="item.paramVal"></el-input>
            </li>
          </ul>

        </div>

      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!checkVersionList.length||!instructData.equipmentType"
          @click="test_instruct"
        >运行指令</el-button>
        <div class="version-tab">
          <el-radio-group v-model="currentTabVersion">
            <el-radio-button
              v-for="item of versionTabs"
              :key="item"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </div>
        <div
          class="version-bao"
          v-show="currentTabVersion"
        >
          <!-- 指令报文内容 -->
          <p v-if="loading">加载中...</p>
          <pre v-else>
            {{filterReportMsg ? filterReportMsg: '无报文返回'}}
          </pre>

        </div>
        <p>
          <el-checkbox v-model="isRead">
            同意并详细阅读<span
            @click="showAgreement"
            >&lt;&lt;责任说明&gt;&gt;</span>
          </el-checkbox>
        </p>
      </el-form-item>
      <div>
        <el-button
          v-if="!instructId"
          type="primary"
          :disabled="!isRead"
          @click="handleClick"
        >保存</el-button>
        <el-button
          v-if="instructId"
          type="primary"
          :disabled="!isRead"
          @click="handleClick"
        >保存修改</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button v-if="instructId" @click="getUsed">查询指令使用情况</el-button>
      </div>
    </el-form>
    <version-model
      ref="version"
      :vender-list="checkVersionList"
      :company='instructData.equipmentCompany'
      :net-type="instructData.equipmentType"
      @setVersion="get_instruct"
    ></version-model>
    <used-model ref="used" :instruct-used = instructUsed></used-model>
    <param-version-model ref="paramVersionModel"
    :check-version-list="checkVersionList"
    @selectedVersion="setParamsVersion"></param-version-model>
     <!--责任说明弹框-->
    <agreement ref="agreement"></agreement>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {readzl} from '@/utiles/instruct.js'
import VersionModel from "./components/version-model.vue";
import UsedModel from './components/used-model.vue'
import ParamVersionModel from './components/param-version-model.vue'
import agreement from "@/components/agreement";
const filterCode = (code) => {
  if(code) {
     return code.replace(/:/g, '').replace(/;/g, '')
  }
}
export default {
  data() {
    return {
      instructId: "",
      venderList: [], // 适用版本号
      versionTabs: [], // 版本号tab
      checkVersionList: [], // 选中的适用版本数组
      instructData: {
        equipmentCompany: "",
        equipmentType: "",
        profession:'', //所属专业
        instructCode: "",
        instructZh: "",
        instructType: "",
        equipmentVersion: "",
        instructDescribe: "",
        instructParameter: "", //指令参数
        orderParameterList: [], // 参数表大数组对象
        status: 0
      },
      instructUsed: [],
      instrucMessageObj: {}, // 指令报文对象，版本为key
      text: "ac<br>d",
      params: [],
      options: [{ label: "是", value: 1 }, { label: "否", value: 0 }],
      currentTabVersion: "",
      isRead: false,
      loading:true,
      reportObj: {}
    };
  },
  components: {
    VersionModel,
    agreement,
    UsedModel,
    ParamVersionModel
  },
  created() {
    let id = this.$route.query.id;
    this.instructData.profession = this.user.profession
    if (id) {
      this.instructId = id;
      this.get_detail(id);
    }
  },
  computed: {
    ...mapGetters({
      professionList: 'professionList',
      equipmentCompanyArr: "equipmentCompanyArr",
      instructTypeArr: "instructTypeArr", //指令类型
      equipmentTypeArr: "equipmentTypeArr",
      companyArr: "companyArr",
      equipObj: "dict/equipObj",
      equipComObj: "dict/equipCompanyObj",
      user:"user",
      instructTypeObj: 'dict/instructTypeObj'
    }),
    instructType() { // 指令编辑类型
      return this.instructTypeObj[this.instructData.equipmentCompany+this.instructData.equipmentType]?
      this.instructTypeObj[this.instructData.equipmentCompany+this.instructData.equipmentType]:'1'
    },
    filterReportMsg() {
      if(this.currentTabVersion) {
        return this.reportObj[this.currentTabVersion]
      }else {
        return ''
      }
    },
    filterParmas() {
      let arr = [];
      this.params.forEach(elem => {
        if (/^[A-Za-z]+$/.test(elem.parameterCode)) {
          arr.push(elem);
        }
      });
      return arr;
    },
    filterCode() {
      let code = this.instructData.instructCode
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
      let code = this.instructData.instructCode
      if(code) {
        return code.replace( /\$\{(.*?)\}/g,'').replace(/:/g, '').replace(/;/g, '')
      }
    },
    instructStr2() {
      let str = "";
      let ffarr = this.filterParmas.filter(elem => elem.paramVal);
      return ffarr.reduce((last,cur) => {
        return last + cur.paramVal + ' '
      },'')
    },
    instructStr() {
      let str = "";
      let ffarr = this.filterParmas.filter(elem => elem.paramVal);
      ffarr.forEach((ff, index) => {
        if (index < ffarr.length - 1) {
          str += `${ff.parameterCode}=${ff.paramVal},`;
        } else {
          str += `${ff.parameterCode}=${ff.paramVal};`;
        }
      });
      return str;
    }
  },
  watch: {
    instructType() {
      this.instructData.instructCode = ''
      this.params = []
    },
    checkVersionList(newVal) {
      if(!newVal.length) {
        this.params.forEach(param =>{
          param.list = []
        })
      }else {

      }
    }
  },
  methods: {
    handelChangeParamsVertion(val,e) {
      let value = e.target.defaultValue
      if(!val) { // 剔除掉参数表中已选择的版本号
        this.params.forEach(param => {
          let i = param.list.findIndex(version => version==value)
          if(i>-1) {
            param.list.splice(i,1)
          }
        })
      }
    },
    showParamVersion({list,parameterCode}) { // 弹出参数模态框
      if(!this.checkVersionList.length) {
        alert('请先选择指令使用版本')
        return
      }
      this.$refs.paramVersionModel.show(list,parameterCode)
    },
    setParamsVersion({name,versions}) { //设置参数适用版本
      this.params.forEach(param => {
        if(param.parameterCode === name) {
          param.list = versions
        }
      })
    },
    formatt() {
      this.params = readzl(this.instructData.instructCode)
    },
    handleChangeCom() {
      this.getVersion()
    },
    handleChangeType() {
      this.getVersion()
    },
    handleChangePro() {
      this.getVersion()
    },
    async getVersion() {
      this.instructData.equipmentVersion = "";
      this.checkVersionList = [] // 置空选中的版本号
      let list = await this.$http.get("/OpsDev/dicts/getVersionByDict", {
        params: {
          company: this.instructData.equipmentCompany,
          netType: this.instructData.equipmentType,
          profession: this.instructData.profession
        }
      });
      // console.log(list)
      this.venderList = list;
      // 初始化versionTabs
      this.versionTabs = [];
      this.reportObj = {}
      this.currentTabVersion = ''
    },
    test_instruct() {
      // 判断参数一旦必填时必须有值，否则不弹出
      let params = this.filterParmas
      let flag = false
      params.forEach(item => {
        if(item.paramNotNull == 1) {
          if(!item.paramVal) {
            flag = true
            this.$message.error(`
              参数${item.parameterCode}为必填项
            `)
          }
        }
      })
      if(!flag) {
        this.$refs.version.show();
      }

    },
    async get_instruct({selectedVersion: version, selectedNetId,selectedNetName}) {
      this.currentTabVersion = selectedNetName;
      if(this.versionTabs.indexOf(selectedNetName)==-1) {
        this.versionTabs.push(selectedNetName);
      }
      this.handleTest(selectedNetId,selectedNetName)
    },
    async handleTest(selectedNetId,selectedNetName) {
      this.loading = true
      let params = this.filterParmas
      let instructParameter = []
      if(params.length) {
        instructParameter = params.map(item => {
          return {
            paramKey: item.parameterCode,
            paramNotNull: item.paramNotNull,
            paramValue: item.paramVal
          }
        })
      }
      try {
        let res = await this.$http.get('/OpsDev/order/testOrder', {
          params: {
            instructCode: this.instructData.instructCode,
            instructType: this.instructData.instructType,
            netId: selectedNetId,
            instructParameter: JSON.stringify(instructParameter)
          }
        })
        if(res.status == 'success') {
        this.loading = false
        this.$set(this.reportObj, selectedNetName, res.item.reportMsg)
        }else {
          this.loading = false
          this.$message.error(`${res.msg}`)
        }
      }catch(e) {
        console.log(e)
      }

    },
    handleName(item, e) {
      item.parameterCode = e.target.innerText.trim();
    },
    handleZh(item, e) {
      item.parameterZh = e.target.innerText.trim();
    },
    handleIntro(item, e) {
      item.parameterDescribe = e.target.innerHTML;
    },
    add_param() {
      this.params.push({
        parameterCode: "", //参数变量名
        parameterZh: "",
        paramNotNull: 0, // 是否必填
        parameterDescribe: "",
        paramVal: "",
        list:[]
      });
    },
    del_param(i) {
      this.params.splice(i, 1);
    },
    handleClick() {
      if (this.instructId) {
        this.saveMod();
      } else {
        this.saveAdd();
      }
    },
    async get_detail(id) {
      let detail = await this.$http.get("/OpsDev/order/getOrderById", {
        params: { id }
      });
      let { equipmentVersion, orderParameterList, instructParameter } = detail;
      this.instructData = {
        equipmentCompany: detail.equipmentCompany,
        equipmentType: detail.equipmentType,
        profession: detail.profession,
        instructCode: detail.instructCode,
        instructZh: detail.instructZh,
        instructType: detail.instructType,
        equipmentVersion: detail.equipmentVersion,
        instructDescribe: detail.instructDescribe,
        instructParameter: detail.instructParameter, //指令参数
        orderParameterList: detail.orderParameterList, // 参数表大数组对象
        status: detail.status
      };
      this.getVersion() // 调用api请求版本数组
      if (equipmentVersion) {
        this.checkVersionList = equipmentVersion.split(",");
      }
      let paramObj = null;
      if (instructParameter) {
        paramObj = JSON.parse(instructParameter).reduce((last, item) => {
          return {
            ...last,
            [item.paramKey]: item.paramValue
          };
        }, {});
      }
      let params = orderParameterList.map(item => {
        return {
          parameterCode: item.parameterCode,
          parameterZh: item.parameterZh,
          paramNotNull: item.paramNotNull,
          parameterDescribe: item.parameterDescribe,
          paramVal: paramObj ? paramObj[item.parameterCode] : ""
        };
      });
      this.params = params;
    },
    async saveAdd() {
      // 保存指令指令新增
      let res = await this.$http.post("/OpsDev/order/addOrder", {
        ...this.instructData,
        instructCode: filterCode(this.instructData.instructCode),
        equipmentVersion: this.checkVersionList.join(),
        orderParameterList: this.params.map(param => {
          return {
            parameterCode: param.parameterCode,
            parameterZh: param.parameterZh,
            parameterDescribe: param.parameterDescribe,
            paramNotNull: param.paramNotNull
          };
        }),
        instructParameter: JSON.stringify(
          this.filterParmas.map(param => {
            return {
              paramKey: param.parameterCode,
              paramKeyZh: param.parameterZh,
              paramValue: param.paramVal,
              paramNotNull: param.paramNotNull
            };
          })
        )
      });
      if (res.status == "success") {
        this.$message({
          type: "success",
          message: "新增指令成功"
        });
        this.$router.push("/my-instruction/list");
      } else {
        this.$message.error(`${res.msg}`);
      }
    },
    async saveMod() {
      // 保存指令修改
      let res = await this.$http.post("/OpsDev/order/updateOrder", {
        ...this.instructData,
        id: this.instructId,
        equipmentVersion: this.checkVersionList.join(),
        instructParameter: JSON.stringify(
          this.filterParmas.map(param => {
            return {
              paramKey: param.parameterCode,
              paramKeyZh: param.parameterZh,
              paramValue: param.paramVal,
              paramNotNull: param.paramNotNull
            };
          })
        ),
        orderParameterList: this.params.map(param => {
          return {
            parameterCode: param.parameterCode,
            parameterZh: param.parameterZh,
            parameterDescribe: param.parameterDescribe,
            paramNotNull: param.paramNotNull
          };
        })
      });
      if(res.status == 'success') {
        this.$message({
          type: "success",
          message: "指令修改成功"
        });
        this.$router.push("/my-instruction/list");
      }else {
        this.$message.error(`${res.msg}`)
        return
      }

    },
    async getUsed() {
      if(!this.instructUsed.length) {
        let res = await this.$http.get("/OpsDev/order/getOrderUsage", {
          params: {
            id: this.instructId
          }
        })
        if(res) {
          this.instructUsed = res
        }
      }
      this.$refs.used.show()
    },
     //显示责任协议书
    showAgreement() {
      this.$refs.agreement.agreementDialog = true;
    },
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

table {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;

  thead {
    background-color: #ddd;

    td {
      padding: 6px 0;
    }
  }

  .no-param {
    td {
      padding: 6px 0;
    }
  }

  td {
    padding: 2px 4px;
    border: 1px solid #ccc;

    &.is-required {
      width: 9%;
    }

    &.intro {
      width: 35%;
      text-align: left;
    }

    &.handle {
      width: 2em;
    }
  }
}

.add-wrapper {
  text-align: right;
}

.param-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -50px;

  li {
    display: flex;
    width: 28%;
    margin-left: 50px;
    margin-bottom: 12px;

    label {
      width: 100px;
      text-align: right;

      &.required:before {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
      }
    }

    span {
      margin: 0 10px;
    }
  }
}

.tip {
  padding: 10px;
  margin-top: -10px;
  margin-bottom: 15px;
  background-color: #ddd;

  span {
    text-decoration: underline;
    font-weight: bold;
  }
}

.version-tab {
  margin-top: 10px;
}

.version-bao {
  height: 250px;
  background: #ccc;
  overflow auto
}
</style>
