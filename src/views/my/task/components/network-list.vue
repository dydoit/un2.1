<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    title="选择网元">
    <el-tabs v-model="activeVersion" type="card" @tab-click="handleClick">
      <el-tab-pane label="版本1" name="first"></el-tab-pane>
      <el-tab-pane label="版本2" name="second"></el-tab-pane>
      <el-tab-pane label="版本3" name="third"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <el-checkbox-group v-model="selectedIds">
        <el-checkbox label="001">
          网元1
        </el-checkbox>
         <el-checkbox label="002">
          网元2
        </el-checkbox>
        <el-checkbox label="003">
          网元3
        </el-checkbox>
         <el-checkbox label="001">
          网元1
        </el-checkbox>
         <el-checkbox label="002">
          网元2
        </el-checkbox>
        <el-checkbox label="003">
          网元3
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btn-wrapper">
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible: false,
        activeVersion: 'first',
        selectedIds: []
      }
    },
    methods: {
      show() {
        this.dialogFormVisible = true
      },
      handleClick() {

      }
    },
  }
</script>

<style lang="stylus" scoped>
.el-checkbox
  margin-bottom 10px
.btn-wrapper
  margin-top 40px
  text-align center
  .el-button
    margin-right 20px
</style>
