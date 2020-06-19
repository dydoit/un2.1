<template>
  <div class="wrapper">
    <!-- 脚本修改 -->
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
        ></el-input>
      </el-form-item>
      <el-form-item
        label="版本号："
        required
      >
        <el-input v-model="formData.parserVersion"></el-input> <span>（示例：V1.0）</span>
      </el-form-item>

    </el-form>
    <div class="btn-wrapper">
      <el-button
        type="primary"
        size="medium"
        @click="save"
      >保存</el-button>
      <el-button
        type="success"
        size="medium"
        class="btn-green"
        :disabled="!isSave"
        @click="goNext"
      >下一步，修改脚本解析</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      instructCode: "",
      analysisZh:'',
      formData: {
        parserZh: "",
        parserDescribe: "",
        parserVersion: ""
      },
      isSave: false,
      parseId: ""
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
        parserVersion
      } = res;
      this.instructCode = instructCode;
      this.formData = {
        parserZh,
        parserDescribe,
        parserVersion
      };
      this.getModelData(analysisId)
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
        let {
          analysisZh,
        } = res;
        this.analysisZh = analysisZh;
      }
    },
    async save() {
      let res = await this.$http.get(
        "/OpsDev/orderDataParser/updateOrderDataParser",
        {
          params: {
            ...this.formData,
            id: this.parseId,
          }
        }
      );
      if (res.status == "success") {
        this.$message.success("保存成功");
        this.isSave = true;
      }else {
        this.$message.error(`${res.msg}`)
      }
    },
    goNext() {
      this.$router.push({ path: "/parsing", query: { parseId: this.parseId } });
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
}
</style>
