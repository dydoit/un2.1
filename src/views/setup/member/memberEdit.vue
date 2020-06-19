<template>
  <div class="boxfrom">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="130px" style="width:600px">
      <el-form-item label="姓名：" prop="name" class="elimg" style="width:315px">
        <!--<el-input placeholder="请填写" v-model="dataForm.name" ></el-input>-->
        <input  @click="showUser"
                placeholder="请选择"
                :value="dataForm.name"></input>
        <i class="elimg-icon el-icon-s-custom">
          <!-- <img src="static/images/elimg-icon.png" alt=""> -->
        </i>
      </el-form-item>
      <el-form-item label="角色：" prop="roleid">
        <el-select  v-model="dataForm.roleid" style="width:185px">
          <el-option v-for="(item,index) in roleList"
                     :key="index"
                     :label="item.NAME"
                     :value="item.ROLEID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业：" prop="profession">
        <el-select   placeholder="请选择" v-model="dataForm.profession"   style="width: 185px;">
          <el-option v-for="(item,index) in professionDict" :key="index"
                     :label="item.dictNameZh"
                     :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Subimt" v-if="showbtn">确定</el-button>
        <el-button @click="goback">取消</el-button>
      </el-form-item>
    </el-form>
    <!--选账号弹框-->
    <member ref="memberbox" @parentVal="getVal"></member>
  </div>
</template>
<script>
  import member from './components/member'
  export default{
    data(){
      return{
        roleList:[],//角色
        professionDict:[],//专业
        showbtn:true,
        dataForm:{
          name:'',
          oa:'',
          roleid:'',//角色id
          profession:'',//专业
        },
        rules:{
          name:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
          ],
          roleid:[
            { required: true, message: '请选择角色', trigger: 'blur' },
          ],
          profession:[
            { required: true, message: '请选择专业', trigger: 'blur' },
          ],
        }
      }
    },
    components:{
      member
    },
    methods:{
      //查询角色
      async getQueryAllRole(){
        let res = await this.$http.get('/OpsDev/role/queryAllRole')
        this.roleList = res
      },
      //查询专业
      async getDictsByType(){
        let res = await this.$http.get('/OpsDev/dicts/getDictsByType', {
          params:{
            dictValue: '1',
            level: '2',
          }
        })
        this.professionDict = res
      },
      showUser(){
        this.$refs.memberbox.addFormUser = true
      },
      //选择人
      getVal(val){
        this.dataForm.name = val[0].name
        this.dataForm.oa = val[0].oa
      },
      //提交
      async Subimt(){
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            this.$http.get('/OpsDev/role/saveOrUpdateUserRole',{
              params:this.dataForm
            })
              .then(res =>{
                if(res.status=='success'){
                  this.$message.success('提交成功！');
                  this.$router.push('/home/member-set')
                }else if(res.status=='fail'){
                  this.$message.error(res.msg)
                }
              })
          }
        })
      },
      //判断是否新增页面、修改页面、查看详情页面
      getParam(){
        this.pageType = this.$route.query.pageType;
        if(this.pageType==2){
          this.getLocalStorage()
        }else if(this.pageType==3){
          this.getLocalStorage()
          this.showbtn = false
        }
      },
      async getLocalStorage(){
        const netInfo = await this.$http.get('/OpsDev/role/getUserRoleByOa',{
          params:{
            oa:this.$route.query.oa,
          }
        })
        if(netInfo){
          this.dataForm.oa = this.$route.query.oa;
          this.dataForm.name = netInfo.name;
          this.dataForm.roleid = netInfo.roleid;//	设备名称
          this.dataForm.profession = netInfo.profession;//	设备所属分公司
        }
      },
      //返回
      goback(){
        this.$router.push('/home/member-set')
      }
    },
    mounted(){
      this.getQueryAllRole();
      this.getDictsByType();
      this.getParam();
    }
  }
</script>
<style lang="stylus" scoped>
.boxfrom{
  padding 20px
}
  .elimg input {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 34px;
    line-height: 34px;
    outline: 0;
    padding-left: 14px;
    padding-right: 27px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .elimg .el-form-item__content .elimg-icon {
    position: absolute;
    top: 9px;
    right: 9px;
    color: #ced1d6;
  }
  .elimg .el-form-item__content .elimg-icon img {
    width: 18px;
    height: 18px;
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    font-size:13px;
    color:#d5d8dc;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size:13px;
    color:#d5d8dc;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size:13px;
    color: #d5d8dc;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size:13px;
    color: #d5d8dc;
  }
</style>
