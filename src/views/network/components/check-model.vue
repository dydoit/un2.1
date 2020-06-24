<template>
  <el-dialog
    title="网元反馈审核"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
     width="50%"
  >
    <el-form :inline="true" label-width="100px" size="small">
      <div class="item">
         <el-form-item label="审核意见：" required>
          <el-input type="textarea" placeholder="请输入审核意见"
          :rows="4"  v-model="formData.handleDescribe"></el-input>
        </el-form-item>
      </div>
    </el-form>
     <div class="btn-group">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="hide">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { mapGetters} from "vuex";
  export default {
    data() {
      return {
        dialogVisible: false,
        formData: {
          handleDescribe: ''
        }
      }
    },
    methods: {
      show(id) {
        this.id = id
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      async submit() {
        let res = await this.$http.get('/OpsDev/networkAudit/doNetAuditHandle', {
          params: {
            id: this.id,
            ...this.formData
          }
        })
        console.log(res)
        if(res.status == 'success') {
          this.$message.success('提交成功')
          this.$emit('again')
          this.hide()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.net-list
  padding-left 10px
  margin-top 10px
.item
  display flex
  justify-content space-between
  .el-form-item
    width 100%
    display flex
    & >>> .el-form-item__content
      flex 1
      display flex
      .el-input
        flex 1
      .el-select
        flex 1
    .el-input
      width 184px
.btn-group
  text-align center
  .el-button
    margin-right 16px
</style>
