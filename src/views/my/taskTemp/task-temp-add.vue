<template>
  <div class="wrap">
    <el-form size="small" :model="taskData" ref="taskData" :rules="rules">
      <div class="my-item-wrapper">
        <el-form-item label="设备厂家:" prop="equipmentCompany">
          <el-select v-model="taskData.equipmentCompany" :disabled="isAddVersionPage" @change="handleChangeCom">
            <el-option
              v-for="item of equipmentCompanyArr"
              :key="item.vendorId"
              :label="item.dictNameZh"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型:" prop="equipmentType">
          <el-select v-model="taskData.equipmentType" :disabled="isAddVersionPage" @change="handleChangeType">
            <el-option
              v-for="item of equipmentTypeArr"
              :key="item.id"
              :label="item.dictNameZh"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用版本:" prop="netVersion">
          <el-select v-model="taskData.netVersion" :disabled="isAddVersionPage">
            <el-option
              v-for="(item,index) in deviceTypes"
              :key="index"
              :label="item.version"
              :value="item.version"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="选择专业:" v-if="roleId=='1'">
        <el-select v-model="taskData.profession" :disabled="pageType==3">
          <el-option v-for="item of professionList" :key="item.dictValue" :value="item.dictValue" :label="item.dictNameZh"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本号:" class="my-item" prop="taskVersion">
        <el-input v-model="taskData.taskVersion" :disabled="pageType==3"></el-input>
        <span class="last-intro c999">示例：(V1.1)</span>
      </el-form-item>
      <el-form-item label="模板名称:" class="my-item-flex" prop="taskName">
        <el-input v-model="taskData.taskName" :disabled="pageType==3"></el-input>
      </el-form-item>
      <el-form-item label="功能说明:" class="my-item-flex" prop="taskDescribe">
        <el-input  type="textarea"
        v-model="taskData.taskDescribe"
        :disabled="pageType==3"
        :rows="4"
        placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="占位" class="my-place">
        <el-button type="primary" @click="saveFun" v-if="pageType!=3">保存</el-button>
        <el-button type="success" :disabled="!isSave" @click="goDrag">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters } from "vuex";
  export default {
    data() {
      return {
        pageType: '',
        roleId: '',
        deviceTypes:[],
        taskTemplateId:'',//任务模板id
        taskData: {
          taskName:'',//	任务模板名
          equipmentCompany:'',//	设备厂商
          equipmentType	:'',//设备类型
          profession: '',
          netVersion:'',//	网元版本号
          taskVersion:'',//	任务版本号
          taskDescribe:'',//	任务描述
        },
        isAddVersionPage: false,
        isSave: false, //是否已经保存
        rules:{
          equipmentCompany:[
            { required: true, message: '请选择', trigger: 'blur' },
          ],
          equipmentType:[
            { required: true, message: '请选择', trigger: 'blur' },
          ],
          netVersion:[
            { required: true, message: '请选择', trigger: 'blur' },
          ],
          taskName:[
            { required: true, message: '请输入模板名称', trigger: 'blur' },
            {min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
          ],
          taskVersion: [
            { required: true, message: '请输入版本号', trigger: 'blur' },
            {min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
          ],
          taskDescribe:[
            { required: true, message: '请输入模板描述', trigger: 'blur' },
            {min: 1, max: 500, message: '长度在 1 到 500个字符', trigger: 'blur'}
          ],

        }
      }
    },
    computed: {
      ...mapGetters([
        "equipmentCompanyArr",
        'equipmentTypeArr',
        'professionList'
      ])
  },
    methods:{
      //获取版本号下拉数据
      async getVersionByDict(){
        let res = await this.$http.get('/OpsDev/dicts/getVersionByDict',{
          params:{
            company:this.taskData.equipmentCompany,
            netType:this.taskData.equipmentType
          }
        })
        this.deviceTypes = res
      },
      //保存
      saveFun(){
        this.$refs['taskData'].validate((valid) => {
            if (valid) {
              if(this.pageType=='0'){
                this.addOldFun() //在当前模板新增新版本
              }else if(this.pageType=='1'){
                this.addFun() //新增新模板
              }else if(this.pageType=='2'){
                this.editFun() //修改模板
              }
            }
        })
      },
      goDrag() {
        if(this.pageType == 3) {
          this.$router.push({
            path: '/my-task-temp/temp-drag',
            query: {
              id: this.taskTemplateId,
              from: 'detail'
            }
          })
        }else {
          this.$router.push({
            path: '/my-task-temp/temp-drag',
            query: {
              id: this.taskTemplateId
            }
          })
        }

      },
      //新增的方法
      async addFun(){
        let res = await this.$http.get('/OpsDev/taskTemplate/addTaskTemplate',{
          params:this.taskData
        })
        if(res.status=='success'){
          this.taskTemplateId = res.id
          this.$message.success('保存成功')
          this.$router.replace({path:'/my-task-temp/temp-manage', query:{pageType:'2',id:res.id}})
          this.isSave = true
        }else if(res.status=='fail'){
          this.$message.error(res.msg)
        }
      },
      //新增新版本的方法
      async addOldFun(){
        let res = await this.$http.get('/OpsDev/taskTemplate/addNewVersionTaskTemplate',{
          params:{
            ...this.taskData,
            taskTemplateId:this.taskTemplateId
          }
        })
        if(res.status=='success'){
          this.taskTemplateId = res.id
          this.$message.success('保存成功')
          this.$router.replace({path:'/my-task-temp/temp-manage', query:{pageType:'2',id:res.id}})
          this.isSave = true
        }else if(res.status=='fail'){
          this.$message.error(res.msg)
        }
      },
      //修改的方法
      async editFun(){
        let res = await this.$http.get('/OpsDev/taskTemplate/updateTaskTemplate',{
          params:{
            ...this.taskData,
            id:this.taskTemplateId
          }
        })
        if(res.status=='success'){
          this.$message.success('保存成功')
          this.isSave = true
        }else if(res.status=='fail'){
          this.$message.error(res.msg)
        }
      },
      handleChangeCom() {
        this.taskData.netVersion = ''
        this.getVersionByDict()
      },
      handleChangeType() {
        this.taskData.netVersion = ''
        this.getVersionByDict()
      },
      //判断是否新增页面、修改页面、查看详情页面
      getParam(){
        this.pageType = this.$route.query.pageType;
        this.taskTemplateId = this.$route.query.id?this.$route.query.id:this.taskTemplateId
        let OpsDevInfo = sessionStorage.getItem('OpsDevInfo')
        if(OpsDevInfo) {
          let roleObj = JSON.parse(OpsDevInfo)
          this.roleId = roleObj.roleid
          if(!this.taskTemplateId) { // id不存在说明是新增
            this.taskData.profession = roleObj.profession
            return
          }
          this.isSave = true;
          this.isAddVersionPage = true
          this.getQueryData()
        }
      },
      //跟进id获取模板详情信息
      async getQueryData(){
        const dataInfo = await this.$http.get('/OpsDev/taskTemplate/getTaskTemplateById',{
          params:{
            id:this.taskTemplateId,
          }
        })
        if(dataInfo){
          this.taskData.equipmentCompany = dataInfo.equipmentCompany; //	设备厂商
          this.taskData.equipmentType = dataInfo.equipmentType; //	设备类型
          this.taskData.netVersion = dataInfo.netVersion; //	网元版本号
          this.taskData.profession = dataInfo.profession // 专业
          if(this.pageType!=0) {
            this.taskData.taskName = dataInfo.taskName; //	任务模板名
            this.taskData.taskVersion	 = dataInfo.taskVersion; //任务版本号
            this.taskData.taskDescribe = dataInfo.taskDescribe; //	任务版本号
          }

        }
      },
    },
    created(){
      this.getParam()
    }
  }
</script>

<style lang="stylus" scoped>
.wrap {
  width: 900px;
  margin-left: 40px;
  padding-bottom 30px
  padding-top: 20px;
}
.my-item-wrapper
  display flex
  justify-content space-between
.el-form-item
  display: flex;
  >>> .el-form-item__label
    width 6em
.my-item
  >>> .el-form-item__content
    width 198px
.my-item-flex
  >>> .el-form-item__content
    flex 1
.my-place
  >>> label
    opacity 0
.last-intro
  position absolute
  right -90px
  top 0
</style>
