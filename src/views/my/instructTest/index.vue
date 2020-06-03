<template>
  <div class="test-wrap">
    <div class="top">
      <div class="part1">
        <div class="left">
          <span class="back">
            <i class="el-icon-back"></i>返回
          </span>
          <el-select
            v-model="runMode"
            placeholder="请选择运行模式"
            size="mini"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="about-group">
            <span>关于</span>
            <ul>
              <li>开发手册</li>
              <li>API手册</li>
              <li>关于Studio</li>
            </ul>
          </div>

        </div>
        <div class="right">
          <span>开发者：张三</span>
          <span>所属公司：广东省分公司</span>
          <span>所属专业：无线网</span>
        </div>
      </div>
      <div class="part2">
        <i
          class="iconfont icon-baocun"
          title="保存"
        ></i>
        <i
          class="iconfont icon-fabu"
          title="发布"
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
          @click="getOrderMessage"
        >获取报文</el-button>
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
            <output-model></output-model>
          </el-tab-pane>
          <el-tab-pane
            label="输入模型"
            name="third"
          >
            <input-model
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
            label="历史版本"
            name="fifth"
          >
            <version-history></version-history>
          </el-tab-pane>
          <el-tab-pane
            label="查看"
            name="six"
            v-if="versionId"
          >
            查看
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
              <el-button size="mini" :disabled="!reportMsg" @click="setExam">设为示例报文</el-button>
              <pre>
                {{reportMsg}}
              </pre>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="运行结果"
            name="运行结果"
          >
            <div v-loading="loadingResult">
               <run-result :type="0" :id="modelId" :run-result="runResult"></run-result>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="示例报文"
            name="示例报文"
          >
            <pre>
              {{examMsg?examMsg:'暂无示例报文'}}
            </pre>
          </el-tab-pane>
          <el-tab-pane
            label="示例运行结果"
            name="示例运行结果"
          >
            <run-result :type="1" :id="modelId" :run-result="runResult"></run-result>
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
              <span v-if="instructType==2">{{filterCode}} {{instructStr}}</span>
              <span v-if="instructType==1">{{filterCode2}} {{instructStr2}}</span>
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
import sampleResult from "./components/sampleResult.vue";
import paramIntro from "./components/paramIntro.vue";
import versionHistory from "./components/versionHistory.vue";
import codeEdit from "./components/codeEdit.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      runMode: "",
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
      code: "",
      netId: "", //网元id
      parmasIntro: [],
      orderId: "", //指令id
      modelId: "", //模板id
      loading: false,
      loadingResult: false,
      reportMsg: "", //报文
      versionId: "", //版本id，用来查看代码
      runResult: {} ,// 运行结果
      examMsg: '', // 示例报文
      examResult: '', //示例结果
      modelProperty: {},  // 模板属性
      equipmentVersion: '' , //指令适用设备版本
      instructParameter: [], // 指令模板自带参数
    };
  },
  created() {
    let id = this.$route.query.id;
    let modelId = this.$route.query.model_id;
    if (id) {
      this.orderId = id;
      this.getOrderData(id);
    }
    if (modelId) {
      this.modelId = modelId;
      this.getNetDeviceListByTypeId(modelId);
      this.getModelData(modelId);
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
    },
    instructStr2() {
      let str = "";
      let ffarr = this.instructParameter.filter(elem => elem.paramValue);
      return ffarr.reduce((last,cur) => {
        return last + cur.paramValue + ' '
      },'')
    },
    instructStr() {
      let str = "";
      let ffarr = this.instructParameter.filter(elem => elem.paramValue);
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
    async setExam() { //设为示例报文
      let res = await this.$http('/OpsDev/orderAnalysis/saveAnalysisForExampleFeedback', {
        params: {
          id: this.modelId,
          exampleFeedback: this.reportMsg
        }
      })
      if(res.status=='success') {
        this.$message.success('设置成功')
        this.examMsg = this.reportMsg
      }
    },
    handleChange(id) {
      this.netId = id[1];
    },
    handleCodeChange(code) {
      this.code = code;
    },
    async getOrderMessage() {
      this.loading = true;
      let res = await this.$http.get(
        "/OpsDev/orderAnalysis/testOrderAnalysis",
        {
          params: {
            id: this.modelId,
            netId: this.netId
          }
        }
      );
      this.loading = false;
      if (res.status == "fail") {
        alert(`${res.msg}`);
      } else {
        this.reportMsg = res.item.reportMsg;
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
        this.netId = res[0].networkDeviceResult[0].id;
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
        let { analysisCode, analysisDescribe,analysisVersion,analysisZh,orderCode} = res;
        this.instructCode = orderCode
        this.modelProperty = {analysisDescribe,analysisVersion,analysisZh}
        if(res.instructParameter){
            this.instructParameter = JSON.parse(res.instructParameter)
          }
        this.code = analysisCode
          ? analysisCode
          : "# -*- coding: UTF-8 -*- \n#请在此方法下面编写您的代码 \ndef proc(ne,fb):";
      } else {
        this.code =
          "# -*- coding: UTF-8 -*- \n#请在此方法下面编写您的代码 \ndef proc(ne,fb):";
      }
    },
    async getOrderData(id) {
      let res = await this.$http.get("/OpsDev/order/getOrderById", {
        params: {
          id
        }
      });
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
      this.params = orderParameterList.length
        ? orderParameterList.map(item => {
            return {
              paramKey: item.parameterCode,
              paramValue: "",
              paramKeyZh: item.parameterZh,
              paramNotNull: item.paramNotNull - 0,
              disabled: false,
              checkType: 0, //检验方式
              paramExtent: "", //参数范围
              orderParameterEquipmentVersionList: item.orderParameterEquipmentVersionList
                ? item.orderParameterEquipmentVersionList
                : []
            };
          })
        : [];
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
        "/OpsDev/orderAnalysis/testOrderAnalysisByIdAndParams",
        {
          id: this.modelId,
          netId: this.netId,
          feedback: this.reportMsg,
          analysisCode: this.code
        },
        config
      );
      this.loadingResult = false
      if(res.status=='success') {
        this.$message.success('执行成功')
        this.runResult = JSON.parse(res.result.result)
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
    handleChangeTab() {}
  },
  components: {
    outputModel,
    inputModel,
    runResult,
    sampleResult,
    paramIntro,
    versionHistory,
    codeEdit
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
</style>
