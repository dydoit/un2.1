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
      >
        <el-input
          placeholder="请输入应用名称"
          v-model="formData.appName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="应用服务："
        label-width="120px"
      >
        <el-checkbox-group v-model="formData.appService">
          <el-checkbox label="复选框 A"></el-checkbox>
          <el-checkbox label="复选框 B"></el-checkbox>
          <el-checkbox label="复选框 C"></el-checkbox>
          <el-checkbox
            label="禁用"
            disabled
          ></el-checkbox>
          <el-checkbox
            label="选中且禁用"
            disabled
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="使用系统："
        label-width="120px"
      >
        <el-input
          placeholder="请输入"
          v-model="formData.appSysName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="应用场景描述："
        label-width="120px"
      >
        <el-input
          placeholder="请输入"
          type="textarea"
          :rows="3"
          
          v-model="formData.appSysName"
        ></el-input>
      </el-form-item>
      <el-form-item label="请求检验方式：">
        <span class="sn">sn</span>
        <a href="javascript:;">查看sn校验计算方法</a>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        appName: "",
        appService: [],
        appSysName: ""
      }
    };
  }
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
</style>
