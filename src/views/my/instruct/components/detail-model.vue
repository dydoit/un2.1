<template>
  <el-dialog
    title="指令反馈详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
     width="50%"
  >
    <el-form :inline="true" label-width="100px" size="small">
      <div class="item">
        <el-form-item label="申报人：" required>
          <el-input v-model="formData.applyName" placeholder="请输入姓名" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" required>
          <el-input v-model="formData.applyContact" placeholder="请输入联系方式" disabled></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="设备厂家：" required>

        <el-select v-model="formData.equipmentCompany" disabled>
            <el-option
              v-for="item of equipmentCompanyArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="设备类型：" required>
        <el-select v-model="formData.equipmentType" disabled>
            <el-option
              v-for="item of equipmentTypeArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
      </el-form-item>
      </div>

      <div class="item">
        <el-form-item label="指令名称：" required>
        <el-input style="width:100%" placeholder="请输入指令代码" disabled v-model="formData.instructCode"></el-input>
        </el-form-item>
      </div>
      <div class="item">
         <el-form-item label="指令描述：" required>
          <el-input type="textarea"
        :rows="2" placeholder="请输入指令描述" disabled v-model="formData.problemDescribe"></el-input>
        </el-form-item>
      </div>
      <div class="item">
         <el-form-item label="审核意见：" required>
          <el-input type="textarea"
        :rows="2"  v-model="formData.handleDescribe" disabled></el-input>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters} from "vuex";
  export default {
    data() {
      return {
        dialogVisible: false,
        formData: {
          equipmentCompany: '',
          equipmentType: '',
          instructCode:'',
          applyName: '',
          applyContact: '',
          problemDescribe: ''
        }
      }
    },
    computed: {
       ...mapGetters({
        equipmentCompanyArr: "equipmentCompanyArr",
        equipmentTypeArr: "equipmentTypeArr"
      }),
    },
    methods: {
      show(obj) {
        this.formData = obj
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      },
      async submit() {
        let res  = await this.$http.get('/OpsDev/orderAudit/doOrderAuditSubmit', {
          params: this.formData
        })
        if(res.status == 'success') {
          this.$message.success('提交成功，请耐心等待')
        }else {
          this.$message.error(`${res.msg}`)
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
