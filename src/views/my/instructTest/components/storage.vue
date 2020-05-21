<template>
  <el-dialog title="请模型仓库中选择"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    top="10vh"
     width="80%">
      <div class="left"></div>
      <div class="right">

      </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: true
      }
    },
  }
</script>

<style lang="stylus" scoped>

.el-dialog__wrapper >>>  .el-dialog
    display flex
    justify-content space-between
    height 500px
    .left
      width 100px
      height 100%
      background #ccc
</style>
