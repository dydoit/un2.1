<template>
  <div class="boxfrom">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="130px" style="width:600px">
      <el-form-item label="角色名称：" prop="name" style="width:315px">
        <el-input placeholder="请填写" v-model="dataForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="角色级别：" prop="roleLevel">
        <el-select  v-model="dataForm.roleLevel" style="width:185px">
          <el-option v-for="(item,index) in roleLevelList"
                     :key="index"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" style="width:315px">
        <el-input type="textarea" :rows="2" v-model="dataForm.remark" ></el-input>
      </el-form-item>
    </el-form>
    <div class="role">
      <h3>角色权限列表</h3>
      <div class="rolemd-tree cl">
        <el-tree
          v-loading="loading"
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          auto-expand-parent
          :default-expanded-keys="idArr"
          :default-checked-keys="defaultCheck"
          @check="handleNodeClick"
          :props="defaultProps">
        </el-tree>
      </div>
    </div>
      <div class="ft-btn">
      <el-button size="small" type="primary" @click="save" v-if="showbtn">确定</el-button>
      <el-button size="small" @click="goback" >取消</el-button>
      </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        loading:false,
        pageType:'',
        dataForm:{
          name:'',
          roleLevel:'',
          remark:'',
          authorize:'',
        },
        roleLevelList:[
          {label:'超级管理员',value:1},
          {label:'地市专业管理员',value:2},
          {label:'专业开发人员',value:4},
          {label:'普通人员',value:5},
          {label:'游客',value:6},
        ],
        rules:{
          name:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
          ],
          roleLevel:[
            { required: true, message: '请选择角色级别', trigger: 'blur' },
          ],
        },
        treeData:null,
        idArr:[],//存放展开的id数组，默认展开二级
        defaultCheck:[],//存放默认勾选
        authorize:[],
        authorizeList:[],
        defaultProps: {
          children: 'menuTree',
          label:  'name',
        },
        showbtn:true,
      }
    },
    methods:{
      //获取权限树结构
      async getMenuTreeListByRoleid(){
        let res = await this.$http.get('/OpsDev/role/queryMenuTreeList')
        this.treeData = res
      },
      //当复选框被点击的时候触发
      handleNodeClick(data, checked){
        this.authorize = []
        this.authorize = checked.halfCheckedKeys.concat(checked.checkedKeys)
      },
      //保存
      async save(){
        this.dataForm.authorize = this.authorize.join(',')
        if(this.pageType == 1){
          let res = await this.$http.get('/OpsDev/role/addRole',{
            params:this.dataForm
          })
          if(res.status =='success'){
            this.$message.success('新增成功！')
            this.$router.push('/role-set')
          }else if(res.status =='fail'){
            this.$message.error(res.msg)
          }
        }else if(this.pageType == 2){
          let res = await this.$http.get('/OpsDev/role/updateRole',{
            params:this.dataForm
          })
          if(res.status =='success'){
            this.$message.success('修改成功！')
            this.$router.push('/role-set')
          }else if(res.status =='fail'){
            this.$message.error(res.msg)
          }
        }
      },
      //判断是否新增页面、修改页面、查看详情页面
      getParam(){
        this.pageType = this.$route.query.pageType;
        if(this.pageType==2){
          this.getDetail()
        }else if(this.pageType==3){
          this.getDetail()
          this.showbtn = false
        }
      },
      //查询角色详情
      async getDetail(){
        this.loading = true;
        let res = await this.$http.get('/OpsDev/role/getRoleDetail', {
          params:{
            roleid:this.$route.query.id
          }
        })
        this.dataForm.roleid = res.roleid
        this.dataForm.name = res.name;
        this.dataForm.roleLevel= res.roleLevel;
        this.dataForm.remark= res.remark;
        this.authorizeList = res.authorize;
        var _arr = []
        this.authorizeList.forEach(item =>{
          this.authorize.push(item.authorize)
          if(item.type == 4){
            _arr.push(item.authorize.toString())
          }
        })
        this.idArr = this.defaultCheck = _arr
        this.loading = false;
      },
      goback(){
        this.$router.push('/role-set')
      },
    },
    mounted(){
      this.getMenuTreeListByRoleid();
      this.getParam();
    }
  }
</script>
<style lang="stylus" scope>
.boxfrom{
  padding 20px
}
  .role{
    padding-left:40px;
    h3{ margin-left: 90px }
    .rolemd-tree{
      margin: 10px 88px;
      .el-tree{
        background: #f9f9f9;
      }
    }
  }
  .ft-btn{
    margin: 20px 0 20px 128px;
  }
</style>
