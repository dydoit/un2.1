<template>
  <div class="wrapper">
    <!-- 脚本详情 -->
    <el-form
      size="small"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="指令代码">
        <el-input
          v-model="instructCode"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="指令模板名称">
        <el-input
          v-model="analysisZh"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="脚本名称："
        required
      >
        <el-input
          placeholder="请输入脚本名称"
          v-model="formData.parserZh"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="功能描述："
        required
      >
        <el-input
          type="textarea"
          rows="4"
          placeholder="请输入描述"
          v-model="formData.parserDescribe"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="版本号："
        required
      >
        <el-input
          v-model="formData.parserVersion"
          disabled
        ></el-input> <span>（示例：V1.0）</span>
      </el-form-item>
      <el-form-item
        label="脚本代码："
        required
      >
        <pre v-html="parserCode"></pre>
      </el-form-item>
      <el-form-item
        label="输出模型："
        required
      >
        <div>
          {{orderDataParserOutputModelDto.modelName}}(模型名称)
          <div>
            <table>
              <thead>
                <tr>
                  <td>出参名称</td>
                  <td>参数类型</td>
                  <td>描述</td>
                </tr>
              </thead>
              <tbody
                v-if="!orderDataParserOutputModelDto.orderDataParserOutputModelDetailsList.length"
                class="no-param"
              >
                <tr>
                  <td colspan="6">暂无参数</td>
                </tr>

              </tbody>
              <tbody v-else>
                <tr
                  v-for="item of orderDataParserOutputModelDto.orderDataParserOutputModelDetailsList"
                  :key="item.id"
                >
                  <td>
                    <div v-text="item.parameterCode">
                    </div>
                  </td>
                  <td class="is-required">
                    <select
                      v-model="item.parameterType"
                      disabled
                    >
                      <option value="0">String</option>
                      <option value="1">List</option>
                      <option value="2">Map</option>
                    </select>
                  </td>
                  <td class="intro">
                    <div v-html="item.parameterDescribe">
                    </div>
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="输入模型："
        required
      >
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
          <tbody v-if="!instructParameter.length">
            <tr class="no-data">
              <td colspan="5">暂无数据</td>
            </tr>
          </tbody>
          <tbody>
            <tr
              v-for="(item,index) of instructParameter"
              :key="index"
            >
              <td>{{item.paramKey}}</td>
              <td>
                <el-select
                  size="mini"
                  disabled
                  v-model="item.checkType"
                >
                  <el-option
                    v-for="val of options"
                    :key="val.value"
                    :label="val.label"
                    :value="val.value"
                  ></el-option>
                </el-select>
              </td>
              <td>
                <template v-if="item.checkType==0">
                  <el-input
                    disabled
                    style="width:60%"
                    size="mini"
                    type="text"
                    v-model="item.paramExtent"
                  ></el-input>
                </template>
                <template v-else-if="item.checkType==1">
                  <el-input
                    disabled
                    size="mini"
                    style="width:60%"
                    type="text"
                    v-model="item.paramExtent"
                    placeholder="多选值，用逗号隔开"
                  ></el-input>
                </template>
                <template v-else-if="item.checkType==2">
                  <el-input
                    disabled
                    size="mini"
                    style="width:60%"
                    type="text"
                    v-model="item.paramExtent"
                    placeholder="请输入固定值"
                  ></el-input>
                </template>
                <template v-else-if="item.checkType==3">
                  <el-input
                    disabled
                    size="mini"
                    style="width:auto"
                    type="text"
                    v-model="item.paramExtent[0]"
                  ></el-input> ~
                  <el-input
                    disabled
                    size="mini"
                    style="width:auto"
                    type="text"
                    v-model="item.paramExtent[1]"
                  ></el-input>
                </template>
              </td>
              <td>
                {{item.paramNotNull?'是':'否'}}
              </td>
              <td>
                <template v-if="item.checkType==1">
                  <el-select
                    v-model="item.paramValue"
                    style="width:50%"
                    size="mini"
                  >
                    <el-option
                      :value="op"
                      v-for="op of item.paramExtent.split(',')"
                      :key="op"
                    >{{op}}</el-option>
                  </el-select>
                </template>
                <template v-else-if="item.checkType==2">
                  <el-input
                    size="mini"
                    disabled
                    style="width:50%"
                    type="text"
                    v-model="item.paramValue"
                  ></el-input>
                </template>
                <template v-else>
                  <el-input
                    size="mini"
                    style="width:50%"
                    type="text"
                    v-model="item.paramValue"
                  ></el-input>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-form-item label="自定义参数：">
        <div v-if="customType==1||customType==2">
          {{customParameter}}
        </div>
        <div v-else>
          无
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
const options = [
  { value: "0", label: "无" },
  { value: "1", label: "多选" },
  { value: "2", label: "固定值" },
  { value: "3", label: "数值范围" }
];
export default {
  data() {
    return {
      options,
      instructCode: "",
      analysisZh: "",
      formData: {
        parserZh: "",
        parserDescribe: "",
        parserVersion: ""
      },
      isSave: false,
      parseId: "",
      parserCode: "",
      orderDataParserOutputModelDto: {
        modelName: "",
        orderDataParserOutputModelDetailsList: []
      },
      instructParameter: [],
      customType: '',
      customParameter: '[]'
    };
  },
  created() {
    let parseId = this.$route.query.parseId;
    if (parseId) {
      this.parseId = parseId;
      this.getData();
    }
  },
  methods: {
    async getData() {
      let res = await this.$http.get(
        "/OpsDev/orderDataParser/getOrderDataParserById",
        {
          params: { id: this.parseId }
        }
      );
      console.log(res);
      let {
        instructCode,
        analysisId,
        parserZh,
        parserDescribe,
        parserVersion,
        parserCode,
        orderDataParserOutputModelDto,
        instructParameter,
        customType,
        customParameter
      } = res;
      if (instructParameter) {
        this.instructParameter = JSON.parse(instructParameter);
      }
      if(customType) {
        this.customType = customType
        this.customParameter = customParameter
      }
      this.instructCode = instructCode;
      this.parserCode = parserCode;
      if (orderDataParserOutputModelDto) {
        this.orderDataParserOutputModelDto = orderDataParserOutputModelDto;
      }
      this.formData = {
        parserZh,
        parserDescribe,
        parserVersion
      };
      this.getModelData(analysisId);
    },
    async getModelData(id) {
      // 获取指令模板信息
      let res = await this.$http.get(
        `/OpsDev/orderAnalysis/getOrderAnalysisById`,
        {
          params: { id }
        }
      );
      if (res) {
        let { analysisZh } = res;
        this.analysisZh = analysisZh;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper {
  margin: 20px 30px;
}

.el-form {
  .el-input, .el-textarea {
    width: 600px;
  }

  pre {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    overflow: auto;
  }
}

table {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;
  font-size: 12px;

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
      width: 50%;
      text-align: left;
    }

    &.handle {
      width: 2em;
    }
  }
}
</style>
