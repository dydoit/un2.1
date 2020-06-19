<template>
  <div class="test-wrap">
    <div class="top">
      <div class="part2">
        <i
          class="iconfont icon-baocun"
          title="保存"
          @click="save"
        ></i>
        <el-cascader
          placeholder="配置运行网元"
          :options="netData"
          :show-all-levels="false"
          @change="handleChange"
          size="mini"
        ></el-cascader>
        <el-button
          size="mini"
          round
          title="非智能运行模式时需要先配置网元"
          :disabled="loading"
          @click="handleGetMessage"
        >获取指令解析结果</el-button>
        <i
          class="iconfont icon-yunhang"
          title="运行解析脚本"
          @click="runPython"
        ></i>
      </div>
    </div>
    <div class="content">
      <div class="content-part1">
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="解析脚本"
            name="first"
          >
            <code-edit
              :value="code"
              @codeChange="handleCodeChange"
              v-if="code"
            ></code-edit>
          </el-tab-pane>
          <el-tab-pane
            label="输出模型"
            name="second"
          >
            <output-model
            ref="output"
            :output-model-name="outputModelName"
            :output-model-detail-list="outputModelDetailList"
            ></output-model>
          </el-tab-pane>
          <el-tab-pane
            label="输入模型"
            name="third"
          >
            <input-model
              ref="input"
              :instruct-code="instructCode"
              :instruct-type="instructType"
              :equipment-version="equipmentVersion"
              :params="params"
            ></input-model>
          </el-tab-pane>
          <el-tab-pane
            label="参数说明"
            name="fourth"
          >
            <param-intro :params="parmasIntro"></param-intro>
          </el-tab-pane>
          <el-tab-pane
            label="自定义参数"
            name="fifth"
          >
            <auto-param ref="autoParam" :custom-parameter="customParameter" :custom-type="customType"></auto-param>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div
        class="content-part2"
        :style="{height: footHeight+'px'}"
      >
        <el-tabs
          v-model="activeTab"
          type="border-card"
          id="el_tabs"
          @tab-click="handleChangeTab"
        >
          <el-tab-pane
            label="报文"
            name="报文"
          >
            <div v-loading="loading">
              <p>
                {{reportMsg}}
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="运行结果"
            name="运行结果"
          >
            <div v-loading="loadingResult">
               {{runResult}}
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="基础属性"
            name="基础属性"
            class="property"
          >
            <p>
              <b>模板名称：</b>
              <span>
                {{modelProperty.analysisZh}}
              </span>
            </p>
             <p>
              <b>模板说明：</b>
              <span>
                {{modelProperty.analysisDescribe}}
              </span>
            </p>
            <p>
              <b>指令预览(原)：</b>
              <span v-if="instructType==2">{{filterCode}}</span>
              <span v-if="instructType==1">{{filterCode2}}</span>
            </p>
            <p>
              <b>适用设备版本(全)：</b>
              <span>
                {{equipmentVersion}}
              </span>
            </p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
const divHeight = 200;
import outputModel from "./components/outputModel.vue";
import inputModel from "./components/inputModel.vue";
import runResult from "./components/runResult.vue";
import paramIntro from "./components/paramIntro.vue";
import codeEdit from "./components/codeEdit.vue";
import autoParam from './components/autoParam.vue'
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      dialogVisible: false,
      runMode: "智能运行",
      options: [
        {
          label: "智能运行",
          value: "智能运行"
        },
        {
          label: "强制网元运行",
          value: "强制网元运行"
        }
      ],
      netData: [],
      activeName: "first",
      footHeight: divHeight,
      prevY: "",
      isCanMove: true,
      activeTab: "报文",
      instructCode: "",
      equipmentCompany: "",
      equipmentType: "",
      params: [],
      code: "", // 解析代码
      netId: "", //网元id
      parmasIntro: [],
      orderId: "", //指令id
      modelId: "", //模板id
      parseId: '', //脚本id
      loading: false,
      loadingResult: false,
      reportMsg: "", //报文
      runResult: {} ,// 运行结果
      modelProperty: {},  // 模板属性
      equipmentVersion: '' , //指令适用设备版本
      outputModelName: '', //输出模型名字
      outputModelDetailList: [], // 输出模型出参详情数组
      customParameter: '' , // 自定义参数
      customType: '', // 自定义参数类型, 默认空字符串
    };
  },
  created() {
    let {parseId} = this.$route.query

    if(parseId) {
      this.parseId = parseId
      this.getParseData(parseId)
    }
  },
  computed: {
     ...mapGetters({
      instructTypeObj: 'dict/instructTypeObj'
    }),
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
    }
  },
  mounted() {
    let div = document.querySelector("#el_tabs > .el-tabs__header");
    div.onmousedown = e => {
      this.prevY = e.clientY;
      this.isCanMove = true;
      document.addEventListener("mousemove", this.move);
      document.onmouseup = e => {
        this.isCanMove = false;
      };
    };
  },
  methods: {
    handleChange(id) {
      this.netId = id[1];
    },
    handleCodeChange(code) {
      this.code = code;
    },
    handleGetMessage() {
      if(this.runMode=='智能运行')  {
        let netTd = this.netData[0].children[0].value
        this.getOrderMessage(netTd)
      }else {
        this.getOrderMessage(this.netTd)
      }
    },
    async getParseData(id) {
      let res = await this.$http.get('/OpsDev/orderDataParser/getOrderDataParserById', {
        params: {id}
      })
      let {instruId, analysisId, parserCode, orderDataParserOutputModelDto,instructParameter,customParameter, customType} = res
      if(instructParameter) {
        this.params = JSON.parse(instructParameter)
      }
      if(customParameter) {
         this.customParameter = customParameter
      }
      if(customType) {
        this.customType = customType
      }
      if (instruId) {
        this.orderId = instruId;
        this.getOrderData(instruId);
      }
      if (analysisId) {
        this.modelId = analysisId;
        this.getNetDeviceListByTypeId(analysisId);
        this.getModelData(analysisId);
      }
      if(parserCode) {
        this.code = parserCode
      }else {
        this.code ="# -*- coding: UTF-8 -*- \n#请在此方法下面编写您的代码 \ndef proc(ne,fb):";
      }
      if(orderDataParserOutputModelDto) {
        this.outputModelName = orderDataParserOutputModelDto.modelName
        this.outputModelDetailList = orderDataParserOutputModelDto.orderDataParserOutputModelDetailsList
      }
      console.log(res)
    },
    async getOrderMessage(id) { //获取报文
      if(!id) {
        this.$message.error('网元不能为空')
        return
      }
      this.loading = true;
      let res = await this.$http.get(
        "/OpsDev/orderAnalysis/testOrderAnalysis",
        {
          params: {
            id: this.modelId,
            netId: id,
            instructParameter: JSON.stringify(this.params), // 带输入模型参数
          }
        }
      );
      this.loading = false;
      if (res.status == "fail") {
        alert(`${res.msg}`);
      } else {
        this.reportMsg = res.result.result;
      }
    },
    async getNetDeviceListByTypeId(id) {
      let res = await this.$http.get(
        "/OpsDev/taskExamine/getNetDeviceListByTypeId",
        {
          params: {
            id,
            objectType: 1
          }
        }
      );
      if (res) {
        this.netData = res.map(item => {
          return {
            label: item.version,
            value: item.version,
            children:
              item.networkDeviceResult &&
              item.networkDeviceResult.map(net => {
                return {
                  id: net.id,
                  label: net.name,
                  value: net.id
                };
              })
          };
        });
      }
    },
    async getModelData(id) { // 获取指令模板信息
      let res = await this.$http.get(
        `/OpsDev/orderAnalysis/getOrderAnalysisById`,
        {
          params: { id }
        }
      );
      console.log(res)
      if (res) {
        let { analysisCode, analysisDescribe,analysisVersion,analysisZh,orderCode,orderAnalysisOutputModelDto} = res;
        this.instructCode = orderCode
        this.modelProperty = {analysisDescribe,analysisVersion,analysisZh}

       }
    },
    async getOrderData(id) {
      let res = await this.$http.get("/OpsDev/order/getOrderById", {
        params: {
          id
        }
      });
      console.log(res)
      let {
        instructCode,
        equipmentCompany,
        equipmentType,
        orderParameterList,
        equipmentVersion
      } = res;
      this.instructCode = instructCode;
      this.equipmentCompany = equipmentCompany;
      this.equipmentType = equipmentType;
      this.equipmentVersion = equipmentVersion //指令支持的全部版本
      this.parmasIntro = orderParameterList.length
        ? orderParameterList.map(item => {
            return {
              paramKey: item.parameterCode,
              paramKeyZh: item.parameterZh,
              paramNotNull: item.paramNotNull - 0,
              parameterDescribe: item.parameterDescribe,
              list: item.orderParameterEquipmentVersionList
                ? item.orderParameterEquipmentVersionList.map(
                    vs => vs.equipmentVersion
                  )
                : []
            };
          })
        : [];
    },
    async runPython() {
      this.activeTab = '运行结果'
      this.loadingResult = true
      let config = {
        transformRequest: [
          function(data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      let res = await this.$http.post(
        "/OpsDev/orderDataParser/testOrderDataParserByIdAndParams",
        {
          id: this.parseId,
          netId: this.netId,
          feedback: this.reportMsg,
          parserCode: this.code,
          instructParameter:'',
          customParameter:'1'
        },
        config
      );
      this.loadingResult = false
      if(res) {
        this.$message.success('执行成功')
        this.runResult = res
      }
    },
    move(e) {
      if (this.isCanMove) {
        let moveLength = e.clientY - this.prevY;
        this.footHeight = this.footHeight - moveLength;
        if (this.footHeight < 80) {
          this.footHeight = 80;
        } else if (this.footHeight > document.body.clientHeight - 200) {
          this.footHeight = document.body.clientHeight - 200;
        } else {
          this.prevY = e.clientY;
        }
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChangeTab() {},
    async save  () { // 保存数据处理脚本
      // 输出模型
      let orderDataParserOutputModelDto = {
        modelName: this.$refs.output.outputData.modelName,
        orderDataParserOutputModelDetailsList: this.$refs.output.params
      }
      // 自定义参数
      let type = this.$refs.autoParam.radio
      let customParameter = type==1?this.$refs.autoParam.paramStr: JSON.stringify(this.$refs.autoParam.params)
      let res = await this.$http.post('/OpsDev/orderDataParser/saveAllParserReport', {
        id: this.parseId,
        parserCode: this.code,
        instructParameter: JSON.stringify(this.params), // 输入模型参数
        orderDataParserOutputModelDto  : orderDataParserOutputModelDto, //输出模型
        customParameter, //自定义参数str
        customType: type // 自定义参数类型， 1是普通，2是json
      })
      console.log(res)
      if(res.status == 'success') {
        this.$message.success('保存成功')
      }
    }
  },
  components: {
    outputModel,
    inputModel,
    runResult,
    paramIntro,
    codeEdit,
    autoParam
  }
};
</script>

<style lang="stylus" scoped>
.test-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;

  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .content-part1 {
      flex: 1;
      overflow: auto;
    }

    .content-part2 {
      overflow: hidden;
      transform: translateZ(0);

      .el-tabs >>> .el-tabs__header {
        cursor: row-resize;
      }
    }

    .el-tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;

      & >>> .el-tabs__content {
        flex: 1;
        overflow: auto;
        padding: 10px;
      }

      & >>> .el-tabs__header {
        margin: 0;
      }

      & >>> .el-tabs__item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
    }
  }

  .part1 {
    display: flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 0 14px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;

    .left {
      > span {
        margin-left: 20px;
        cursor: pointer;

        &.back {
          margin-left: 0;
        }
      }

      .about-group {
        display: inline-block;
        position: relative;
        margin-left: 20px;

        ul {
          display: none;
          position: absolute;
          width: 100px;
          padding-left: 20px;
          top: 100%;
          margin-top: 2px;
          left: -20px;
          line-height: 2;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 2px;
          font-size: 14px;

          li {
            cursor: pointer;
          }
        }
      }
    }

    .el-select {
      width: 120px;
      margin-left: 15px;
    }

    .right {
      span {
        margin-left: 40px;
        font-size: 12px;
      }
    }
  }

  .part2 {
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 14px;
    background: rgba(242, 242, 242, 1);
    .el-button {
      margin-left: 8px;
    }

    >i {
      margin-right: 10px;
      cursor: pointer;
      font-size: 20px;

      &.icon-baocun {
        color: #409eff;
      }

      &.icon-yunhang {
        margin-left: 20px;
        color: #409eff;
      }
    }
  }
}
.property {
  font-size 12px;
  p {
    margin: 6px 0
  }
}
.btn-group {
  margin-top:40px;
  text-align: center;
}
</style>
