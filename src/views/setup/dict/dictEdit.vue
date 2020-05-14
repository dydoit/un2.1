<template>
  <div class="boxfrom">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="130px" style="width:600px">
      <el-form-item label="字典值：" prop="dictValue">
        <el-input placeholder="请填写" v-model="dataForm.dictValue" ></el-input>
      </el-form-item>
      <el-form-item label="字典字段值：" prop="dictName">
        <el-select  v-model="dataForm.dictName" style="width:185px">
          <el-option v-for="(item,index) in DictsAllType" :key="index" :label="item.dictDescribe" :value="item.dictName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典中文名：" prop="dictNameZh">
        <el-input placeholder="请填写" v-model="dataForm.dictNameZh" ></el-input>
      </el-form-item>
      <el-form-item label="字典英文简写：" prop="dictNameEn">
        <el-input placeholder="请填写" v-model="dataForm.dictNameEn" ></el-input>
      </el-form-item>
      <el-form-item label="字典描述：" prop="dictDescribe">
        <el-input type="textarea" :rows="2" placeholder="请输入" v-model="dataForm.dictDescribe" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Subimt" v-if="showbtn">确定</el-button>
        <el-button @click="goback">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'netList',
  data () {
    return {
      DictsAllType:null,
      dataForm:{
        dictValue:'',//字典值
        dictName:'',//	字典字段值
        dictNameZh:'',//	字典中文名
        dictNameEn:'',//	字典英文简写
        dictDescribe:'',//	字典描述
        dictParent:'',//	父级字典项
      },
      rules:{
        dictValue:[
          { required: true, message: '请输入字典值', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
        ],
        dictName:[
          { required: true, message: '请选择字典字段值', trigger: 'blur' },
        ],
        dictNameZh:[
          { required: true, message: '请输入字典中文名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
        ],
        dictNameEn:[
          { required: true, message: '请输入字典英文简写', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
        ],
        dictDescribe:[
          { required: true, message: '请输入字典描述', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300个字符', trigger: 'blur'}
        ],
      },
      showbtn:true,
    }
  },
  methods:{
    //返回
    goback(){
      this.$router.push('/dict-set')
    },
    //提交
    async Subimt(){
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          const paramData = qs.stringify(this.dataForm)
          if(this.pageType==1){
            //新增
            this.$http.post('/OpsDev/dicts/addDicts',{
              params:this.dataForm
            })
              .then(res =>{
                if(res.status=='success'){
                  this.$message.success('新增成功！')
                  this.$router.push('/dict-set')
                }else if(res.status=='fail'){
                  this.$message.error(res.msg)
                }
              })
          }else if(this.pageType==2){
            //修改
            this.$http.get('/OpsDev/dicts/updateDicts',{
              params:this.dataForm
            })
              .then(res =>{
                if(res.status=='success'){
                  this.$message.success('修改成功！')
                  this.$router.push('/dict-set')
                }else if(res.status=='fail'){
                  this.$message.error(res.msg)
                }
              })
          }
        }
      })
    },
    //判断是否新增页面、修改页面、查看详情页面
    getParam(){
      this.pageType = this.$route.query.pageType;
      if(this.pageType==2){
        this.getQueryData()
      }else if(this.pageType==3){
        this.getQueryData()
        this.showbtn = false
      }
    },
    async getQueryData(){
      const dictInfo = await this.$http.get('/OpsDev/dicts/getDictsById',{
            params:{
              id:this.$route.query.id,
            }
        })
      if(dictInfo){
        this.dataForm.id = dictInfo.id;
        this.dataForm.dictValue = dictInfo.dictValue;//字典值
        this.dataForm.dictName = dictInfo.dictName;//	字典字段值
        this.dataForm.dictNameZh = dictInfo.dictNameZh;//	字典中文名
        this.dataForm.dictNameEn = dictInfo.dictNameEn;//	字典英文简写
        this.dataForm.dictDescribe = dictInfo.dictDescribe;//	字典描述
        this.dataForm.dictParent = dictInfo.dictParent;//	父级字典项
      }
    },

  },
  mounted(){
    this.getParam();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .boxfrom{
    padding: 30px 10px;
    background: #fff;
    border-radius: 5px;
  }
</style>
