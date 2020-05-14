<template>
    <el-dialog
    class="feedback"
        title="反馈"
        :visible.sync="feedbackbox"
        width="35%"
        :close-on-click-modal="false"
        :show-close="false">
        <el-form :model="feedbackFrom" size="small" label-width="80px">
        <el-form-item label="标题">
            <el-input v-model="feedbackFrom.title"></el-input>
        </el-form-item>
        <el-form-item label="备注">
            <el-input v-model="feedbackFrom.remark"
                    type="textarea"
                    :rows="3">
            </el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button  size="small" @click="feedbackbox = false">取 消</el-button>
            <el-button  size="small" type="primary" @click="feedbackbox = false">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data(){
        return{
            feedbackbox:false,
            feedbackFrom:{
                title:'',
                remark:'',
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
   .feedback>>>.el-dialog__body{
       padding 10px 20px
   }
</style>