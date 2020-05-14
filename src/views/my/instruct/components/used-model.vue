<template>
  <el-dialog
    title="指令使用情况"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
     width="30%"
  >
    <el-table
      :data="instructUsed"
      style="width: 100%">
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    props: ['instructUsed'],
    methods: {
      show() {
        this.dialogVisible = true
      },
      handleChange({name}) {
        this.selectedNetName = name
      },
      hide() {
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
.net-list
  padding-left 10px
  margin-top 10px
</style>
