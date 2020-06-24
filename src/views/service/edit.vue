<template>
  <div class="container">
    <!-- 编辑页面 -->
    <el-form
      size="small"
      :model="formData"
    >
      <el-form-item
        label="应用名称："
        label-width="120px"
        required
      >
        <el-input
          placeholder="请输入应用名称"
          v-model="formData.appName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="应用服务："
        label-width="120px"
        required
      >
        <el-checkbox-group v-model="formData.appService">
          <el-checkbox  label="1">指令</el-checkbox>
          <el-checkbox label="2">指令解析</el-checkbox>
          <el-checkbox label="3">数据处理</el-checkbox>
          <el-checkbox label="4">应用流程</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="使用系统："
        label-width="120px"
        required
      >
        <el-input
          placeholder="请输入"
          v-model="formData.appSysName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="应用场景描述："
        required
        label-width="120px"
      >
        <el-input
          placeholder="请输入"
          type="textarea"
          :rows="3"
          required
          v-model="formData.appDescribe"
        ></el-input>
      </el-form-item>
      <el-form-item label="请求检验方式：">
        <span class="sn">sn</span>
        <a href="http://lbsyun.baidu.com/index.php?title=webapi/appendix" target="_blank">查看sn校验计算方法</a>
      </el-form-item>
    </el-form>
    <el-button @click="submit">提交审核</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        appName: "",
        appDescribe:'',
        appService: [],
        appSysName: ""
      }
    };
  },
  methods: {
    async submit() {
      let res = await this.$http.get('/OpsDev/appInterface/addAppInterface', {
        params: {
          ...this.formData,
          appService: this.formData.appService.join()
        }
      })
      if(res.status=='success') {
        this.$message.success('提交成功')
        this.$router.push('/home/service/list')
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
.container
  width: 90%;
  margin: 10px auto;

  .el-form
    padding-top: 30px;

    .el-input
      width: 300px;
.sn
  margin-left 10px
  margin-right 8px
</style>
