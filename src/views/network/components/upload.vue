<template>
    <el-dialog class="uploadbox"
               title="导入"
               :visible.sync="uploadbox"
               :close-on-click-modal="false"
               width="500px">
      <input class="file" @change="getFileUrl($event)" name="upload_file" type="file"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadbox = false">取 消</el-button>
        <el-button size="small" @click="uploadfile" type="primary">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
    data(){
        return{
            uploadbox: false,//控制导入框显示
            file: null,
        }
    },
    methods:{
         //获取模板链接
      getFileUrl(event){
        this.file = event.target.files[0]
      },
      async uploadfile(){
        if (!this.file) {
          this.$message.warning('请上传模板')
        } else {
          this.uploadbox = false;
          this.progressbox = true;//显示上传进度条弹框
          this.pro_status = null;
          const postData = new FormData()
          postData.append('uploadFile', this.file)
          const config = {
            onUploadProgress: (progressEvent) => {
              // 使用本地 progress 事件
              if (progressEvent.lengthComputable) {
                let num = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                this.process = num; // 使用某种 UI 进度条组件会用到的百分比
                if(num==100){
                  this.pro_status="success"
                }
              }
            },
            headers:{'Content-Type':'multipart/form-data'},
            timeout: 2000 * 100,
          }
          axios.post('/OpsDev/netEquip/loadExcel',postData,config).then(res =>{
            if(res.status == 'success'){
              window.setTimeout(() => {
                this.progressbox = false;
              },2000)
              this.$message.success('导入模板成功')
            }else if(res.status == 'fail'){
              this.progressbox = false;
              this.$message.success('导入部分信息不成功！')
              this.resultbox = true;
              this.resultMsg = res.msg;
              this.tipsText = res.counts
            }
            this.getData();
          }).catch((err) => {
            this.progressbox = false;
            this.$message.error('上传模板失败，请重新上传')
          })
        }
      },
    },
    mounted(){

    }
}
</script>
<style lang="stylus" scoped>
.uploadbox {
    >>>.el-dialog__body{
    padding 10px 20px
    }
}
</style>
