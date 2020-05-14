<template>
  <div>
    <div class="instruct-box">
      <div class="instruct-content">
        <el-form size="small" :model="dataform" ref="dataform" :rules="rules" :label-position="labelPosition" label-width="80px">
          <div class="form-row1" style="margin-bottom:20px" v-if="pageType=='1'">
                <div class="item">
                  <div class="label">设备厂家:</div>
                  <div class="sp">
                    <span v-for="(item,index) in equipmentCompanyArr"
                    :key="index"
                    :class="{cur:selectform.equipmentCompany == item.dictValue}" @click="handleTabs1(item)">{{item.dictNameZh}}</span>
                  </div>
                </div> 
                <div class="item">
                  <div class="label">设备类型:</div>
                  <div class="sp">
                    <span v-for="(item,index) in equipmentTypeArr" 
                    :key="index" 
                    :class="{cur:selectform.equipmentType == item.dictValue}" @click="handleTabs2(item)">{{item.dictNameZh}}</span> 
                    </div>
                </div> 
                <div class="item">
                  <div class="label">版本号:</div>
                  <div class="sp">
                    <span  v-for="(item,index) in equipmentVersionArr" 
                    :key="index" 
                    :class="{cur:selectform.equipmentVersion == item.version}" @click="handleTabs3(item)">{{item.version}}</span> 
                  </div>
                </div>
                <div class="item">
                  <div class="label">指令:</div>
                  <div class="sp">
                    <el-select
                        v-model="dataform.instruId"
                        filterable
                        placeholder="可输入关键词进行模糊搜索"
                        :loading="loading"
                        :disabled="isDisabled"
                        size="small" style="width:50%">
                        <el-option v-for="item in instructList"
                          :key="item.id"
                          :label="item.name + '----('+ item.code +')'"
                          :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>                
          </div>
          <div class="form-row2">
            <el-form-item label="指令:" v-if="pageType=='0'||pageType=='2'">
              <el-input v-model="dataform.orderCode" :disabled="isDisabled" style="width:50%"></el-input>
            </el-form-item>
            <!-- <el-form-item label="选择指令:" prop="instruId" style="display:none">
              <el-select
                      v-model="dataform.instruId"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="可输入关键词进行模糊搜索"
                      :remote-method="remoteMethod"
                      :loading="loading"
                      :disabled="isDisabled"
                      size="small" style="width:50%">
                      <el-option v-for="item in instructList"
                        :key="item.id"
                        :label="item.name + '----('+ item.code +')'"
                        :value="item.id"></el-option>
              </el-select>
              <el-button size="small"
                  type="primary"
                  style="margin-left:20px"
                  @click="drawer = true"
                  icon="el-icon-view"
                  v-if="!isDisabled"
                  plain>选择可用指令</el-button>
            </el-form-item> -->
            <el-form-item label="模板名称:" prop="analysisZh">
              <el-input v-model="dataform.analysisZh" style="width:50%"></el-input>
              <span class="f-right" v-if="instructCode"><i>指令</i>{{instructCode}}</span>
            </el-form-item>
            <el-form-item label="功能说明:" prop="analysisDescribe">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="dataform.analysisDescribe"
                style="width:50%">
              </el-input>
            </el-form-item>
            <el-form-item label="版本号:"  prop="analysisVersion">
              <el-input v-model="dataform.analysisVersion" style="width:300px"></el-input>
              <span class="c999">（示例：V1.0）</span>
            </el-form-item>
            <el-form-item label="参数变量值:" >
              <div class="params-list">
                  <el-form-item v-for="(domain, index) in dataform.instructParameter"
                      :label="domain.paramKey +'：'"
                      :key="domain.paramId"
                      :prop="'instructParameter.' + index + '.paramValue'"
                      :rules="{required: domain.paramNotNull=='1', message: '不能为空', trigger: 'blur' }">
                      <el-input v-model="domain.paramValue" :disabled="domain.isCheck" style="width:50%"></el-input>
                      <el-checkbox v-model="domain.isCheck" @change="changeCheck">设为常量</el-checkbox>
                  </el-form-item>
              </div>
              <div class="template-view" v-if="instructCode">
                <span class="template-view-title">
                  指令预览：
                  <el-tooltip
                    class="template-view-tips"
                    effect="dark"
                    content="针对华为设备指令规则：指令与参数之间需用冒号“：”命令结束必须要分号“；”参数与输入的值之间有等号“=”。"
                    placement="top-start">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <span>
                  <template v-if="instructType == 2">{{filterCode}}:{{filterParameter}};</template>
                  <template v-if="instructType == 1">{{filterCode2}}:{{filterParameter2}};</template>
                </span>
              </div>
            </el-form-item>
            <p class="read">
              <el-checkbox v-model="isRead"></el-checkbox>
              同意并详细阅读
              <em @click="showAgreement">&lt;&lt;责任说明&gt;&gt;</em>
            </p>
            <div class="btn-wrapper">
              <el-button type="primary" size="medium" :disabled="!isRead" @click="saveFun">保存</el-button>
              <el-button type="success" size="medium" class="btn-green" :disabled="!isSave" @click="toNext">下一步，指令解析</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <!--指令筛选框-->
    <el-drawer
      title="选择指令"
      :visible.sync="drawer"
      :direction="direction"
      @opened="openDrawer"
      size="650px">
      <div class="demo-drawer__content">
        <el-form :inline="true" :model="selectform" size="small" label-width="100px">
          <el-form-item label="设备厂家:">
                <el-select v-model="selectform.equipmentCompany">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(item,index) in equipmentCompanyArr"
                    :key="index"
                    :label="item.dictNameZh"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类型:">
                <el-select v-model="selectform.equipmentType">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(item,index) in equipmentTypeArr"
                    :key="index"
                    :label="item.dictNameZh"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="版本号:">
                <el-select v-model="selectform.equipmentVersion">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="(item,index) in equipmentVersionArr"
                    :key="index"
                    :label="item.version"
                    :value="item.version"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-button icon="el-icon-search" size="small" type="primary" @click="getqueryOrderForName">查询</el-button>
              </el-form-item>
        </el-form>
        <div class="infimite-box" ref="infimite">
          <el-radio-group v-model="instructRadio" class="m-scroll infinite-list" :style="{height:ScrollHeight +'px'}">
            <el-radio v-for="item in instructList" :key="item.id" :label="item.id">{{item.name}}----({{item.code}})</el-radio>
          </el-radio-group>
        </div>
        <div class="demo-drawer__footer">
          <el-button @click="drawer=false;instructRadio=''">取 消</el-button>
          <el-button type="primary" @click="sureDrawer">确 定</el-button>
        </div>
      </div>
    </el-drawer>
    <!--责任说明弹框-->
    <agreement ref="agreement"></agreement>
  </div>
</template>
<script>
import {mapGetters } from "vuex";
import agreement from "@/components/agreement";
export default {
  data() {
    return {
      instructType:'',
      equipmentCompany:'',
      equipmentType:'',
      equipmentVersion:'',
      equipmentVersionArr:[],
      instructTempId:'',//指令模板id
      instructList:[],//指令下拉列表
      instructCodeText:'',//输入模糊指令关键值
      instructCode:'',//指令名称
      labelPosition: "top",
      dataform: {
        instruId:'',//	所属指令ID
        analysisZh:'',//	解析模板名称
        analysisDescribe:'',//	解析模板描述
        analysisVersion:'',//	版本号
        instructParameter	:[],//指令参数
        codeType:'0',//	代码类型
      },
      pageType:'',
      tabnum:'',
      tabnum2:'',
      tabnum3:'',
      isDisabled:false,//是否能编辑
      isRead: true, //是否已同意协议
      isSave: false, //是否已经保存
      loading: false,
      isCheck:false,
      rules:{
        instruId:[
          { required: true, message: '请选择指令', trigger: 'blur' },
        ],
        analysisZh:[
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          {min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
        ],
        analysisDescribe:[
          { required: true, message: '请输入模板描述', trigger: 'blur' },
          {min: 1, max: 500, message: '长度在 1 到 500个字符', trigger: 'blur'}
        ],
        analysisVersion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          {min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
        ],
      },
      drawer: false,
      direction: 'rtl',
      selectform:{
        equipmentCompany:'',//	设备厂商
        equipmentType:'',//	设备类型
        equipmentVersion:'',
        instructCode:''
      },
      count:100,
      instructRadio:'',
      ScrollHeight:0,
    };
  },
  components: {
    agreement
  },
  computed: {
      ...mapGetters({
        professionList: 'professionList',
        equipmentCompanyArr: 'equipmentCompanyArr',
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr',
        instructTypeObj: 'dict/instructTypeObj'
      }),
      //指令预览处理
      filterCode() { 
        return this.instructCode
      },
      //指令预览处理
      filterParameter(){
        let str = ''
        let arr = this.dataform.instructParameter.filter(item =>item.paramValue);
        arr.map((item,index) =>{
          if(index < arr.length-1){
            str += item.paramKey +'='+'"'+item.paramValue+'"'+','
          }else{
            str += item.paramKey +'='+'"'+item.paramValue+'"'
          }
        })
        return str
      },
      //指令预览处理
      filterCode2() {
        let code = this.instructCode
        if(code) {
          return code.replace( /\$\{(.*?)\}/g,'').replace(/:/g, '').replace(/;/g, '')
        }
      },
      //指令预览处理
      filterParameter2() {    
        let str = "";
        let ffarr = this.dataform.instructParameter.filter(elem => elem.paramValue);
        return ffarr.reduce((last,cur) => {
          return last + cur.paramValue + ' '
        },'')
      },
  },
  methods: {
    //指令条件筛选
    handleTabs1(item,index){
      this.selectform.equipmentCompany = item.dictValue
      this.selectform.equipmentVersion = ''
      this.getVersionByDict();
      this.dataform.instruId = ''
    },
    handleTabs2(item,index){
      this.selectform.equipmentType = item.dictValue
      this.selectform.equipmentVersion = ''
      this.getVersionByDict();
      this.dataform.instruId = ''
    },
    handleTabs3(item,index){
      this.selectform.equipmentVersion = item.version
      this.dataform.instruId = ''    
    },
    //
    getInstructType() { 
      console.log('this.dataform',this.dataform)
      this.instructType = this.instructTypeObj[this.dataform.equipmentCompany+this.dataform.equipmentType]?
      this.instructTypeObj[this.dataform.equipmentCompany+this.dataform.equipmentType]:'1'
    },
    //指令筛选框
    openDrawer(){
      this.ScrollHeight = this.$refs.infimite.offsetHeight
    },
    sureDrawer(){
      this.dataform.instruId = this.instructRadio
      this.drawer = false
    },
    //下拉远程搜索
    remoteMethod(query) {
        this.instructCodeText = query
        this.getqueryOrderForName()
    },
    //下一步，解析h指令
    toNext() {
      this.$router.push({path:'/my-instruction-temp/parsing',query:{pageType: 2,id:this.instructTempId}})
    },
    //显示责任协议书
    showAgreement() {
      this.$refs.agreement.agreementDialog = true;
    },
    //获取版本号下拉数据
    async getVersionByDict(){
      let res = await this.$http.get('/OpsDev/dicts/getVersionByDict',{
        params:{
          company:this.selectform.equipmentCompany,
          netType:this.selectform.equipmentType
        }
      })
      this.equipmentVersionArr = res
    },
    //获取指令下拉数据
    async getqueryOrderForName(){
      this.loading = true;
      let res = await this.$http.get('/OpsDev/order/queryOrderForName',{
        params:{
            equipmentCompany:this.selectform.equipmentCompany,//	设备厂商
            equipmentType:this.selectform.equipmentType,//	设备类型
            equipmentVersion:this.selectform.equipmentVersion,
            instructCode:this.selectform.instructCode
        }
      })
      this.instructList = res
      this.loading = false;
    },
    //获取指令、参数变量
    async getOrderById(){
      let res = await this.$http.get('/OpsDev/order/getOrderById',{
        params:{ id:this.dataform.instruId }
      })
      this.instructCode =  res.instructCode
      if(this.pageType=='0'|| this.pageType=='1'){
        this.dataform.equipmentCompany = res.equipmentCompany
        this.dataform.equipmentType = res.equipmentType
        if(res.instructParameter) {
          let instructParameter	 = JSON.parse(res.instructParameter); //指令参数
          this.dataform.instructParameter = instructParameter
          this.dataform.instructParameter.forEach(item =>{
            item.constantFlag = '0'
          })
        }
      }
      this.getInstructType();
    },
    //保存
    saveFun(){
      this.$refs['dataform'].validate((valid) => {
          if (valid) {
            if(this.pageType=='0'){
              this.addNewFun() //在当前模板新增新版本
            }else if(this.pageType=='1'){
              this.addFun() //新增新模板
            }else if(this.pageType=='2'){
              this.editFun() //修改模板
            }
          }
      })
    },
    //新增的方法
    async addFun(){
      let config ={
            transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
      let params = {
          instruId:this.dataform.instruId,//	所属指令ID
          analysisZh:this.dataform.analysisZh,//	解析模板名称
          analysisDescribe:this.dataform.analysisDescribe,//	解析模板描述
          analysisVersion:this.dataform.analysisVersion,//	版本号
          instructParameter	:JSON.stringify(this.dataform.instructParameter),//指令参数
          codeType:this.dataform.codeType,//	代码类型
      }
      let res = await this.$http.post('/OpsDev/orderAnalysis/addOrderAnalysis',params,config)
      if(res.status=='success'){
        this.$message.success('保存成功')
        this.instructTempId = res.id
        this.pageType = 2
        this.isSave = true
      }else if(res.status=='fail'){
        this.$message.error(res.msg)
      }
    },
    //新增新版本的方法
    async addNewFun(){
      let config ={
            transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
      let params = {
          instruId:this.dataform.instruId,//	所属指令ID
          analysisZh:this.dataform.analysisZh,//	解析模板名称
          analysisDescribe:this.dataform.analysisDescribe,//	解析模板描述
          analysisVersion:this.dataform.analysisVersion,//	版本号
          instructParameter	:JSON.stringify(this.dataform.instructParameter),//指令参数
          codeType:this.dataform.codeType,//	代码类型
          orderTemplateId:this.instructTempId,//指令模板的id
      }
      let res = await this.$http.post('/OpsDev/orderAnalysis/addNewVersionOrderAnalysis',params,config)
      if(res.status=='success'){
        this.$message.success('保存成功')
        this.instructTempId = res.id
        this.pageType = 2
        this.isSave = true
      }else if(res.status=='fail'){
        this.$message.error(res.msg)
      }
    },
    //修改的方法
    async editFun(){
      this.dataform.instructParameter.forEach(item =>{//移出参数对象里面的勾选属性
        delete item.isCheck
      })
      let config ={
            transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }
      let params = {
          id:this.instructTempId,//模板id
          instruId:this.dataform.instruId,//	所属指令ID
          analysisZh:this.dataform.analysisZh,//	解析模板名称
          analysisDescribe:this.dataform.analysisDescribe,//	解析模板描述
          analysisVersion:this.dataform.analysisVersion,//	版本号
          instructParameter	:JSON.stringify(this.dataform.instructParameter),//指令参数
          codeType:this.dataform.codeType,//	代码类型
          orderTemplateId:this.instructTempId,//指令模板的id
      }
      let res = await this.$http.post('/OpsDev/orderAnalysis/updateOrderAnalysis',params,config)
      if(res.status=='success'){
        this.$message.success('保存成功')
        this.isSave = true
      }else if(res.status=='fail'){
        this.$message.error(res.msg)
      }
    },
    //监听参数变量值是否勾选为常量
    changeCheck(val){
      this.dataform.instructParameter.forEach(item =>{
        if(item.isCheck){
          item.constantFlag = '1'
        }else{
          item.constantFlag = '0'
        }
      })
    },
    
    //判断是否新增页面、修改页面、查看详情页面
    getParam(){
      this.pageType = this.$route.query.pageType;
      this.instructTempId = this.$route.query.id
      if(this.pageType=='0'||this.pageType=='2'){
        this.getQueryData()
        this.isSave = true;
        this.isDisabled = true
      }
    },
    //根据id获取模板详情信息
    async getQueryData(){
      const res = await this.$http.get('/OpsDev/orderAnalysis/getOrderAnalysisById',{
        params:{
          id:this.$route.query.id,
        }
      })
      if(res){
        this.dataform = res
        if(this.pageType=='2'){
          if(res.instructParameter) {
            let instructParameter = JSON.parse(res.instructParameter); //指令参数
            this.dataform.instructParameter = []
            instructParameter.forEach(item =>{
              if(item.constantFlag=='0'){
                item.isCheck= false
              }else if(item.constantFlag=='1'){
                item.isCheck = true
              }
            })
            this.dataform.instructParameter = instructParameter
          }
          this.getInstructType();
        }
        
      }
    },   
  },
  mounted() {
    this.getParam();
  },
  watch:{
    //监听指令下拉
    'dataform.instruId'(val){
      this.getOrderById();
    },
    //
    'isRead'(val){
      if(val){
        this.isSave = true
      }else{
        this.isSave = false
      }
    },
    //监听设备厂家
    'selectform.equipmentCompany'(val){
      this.getVersionByDict();
      this.getqueryOrderForName()
    },
    'selectform.equipmentType'(val){
      this.getVersionByDict();
      this.getqueryOrderForName()
    },
    'selectform.equipmentVersion'(val){
      this.getqueryOrderForName()
    },
  }

};
</script>
<style lang="stylus" scoped>
.instruct-box {
  padding: 20px;
  .titleTop {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    h3 {
      font-size: 18px;
      font-weight: 700;
    }
    .titleTop-info {
      margin-left: 200px;
      span {
        padding: 0 20px;
      }
    }
  }
  .instruct-content {
    .sl-box{
      border 1px solid #ddd
      border-bottom none
      margin-bottom 20px
      .sl-title{
        font-size: 16px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding: 5px 0;
        background: #f7f7f7;
      }
      .sl{
        .sl-wrap{
          position: relative;
          _zoom: 1;
          line-height: 26px;
          border-bottom: 1px solid #ddd;
          display flex
          justify-content flex-start
          .sl-key{
            width: 100px;
            padding-left: 10px;
            white-space: nowrap;
            overflow: hidden;
            background: #f7f7f7
            color #606266
            display flex
            align-items center
          }
          .sl-value{
            flex: 1;
            padding: 10px;
            .sl-list{
              span{
                padding 0px 10px
                color #606266
                font-size 12px
                display inline-block
                border 2px solid #fff
                &:hover{
                  color red
                  cursor pointer
                }
                &.cur{
                  color: #f4b971;
                  border: 2px solid #f4b971;
                }
              }
            }
          }
        }
      }
    }
    .form-row1 {
      .div-select {
        display: flex;
        justify-content: flex-start;
      }
      .div-res {
      }
      >>>.el-form-item {
        width: 33.3%;
        display: inline-block;
        margin-bottom: 10px;
        .el-form-item__label {
          float: left;
          padding-right: 10px;
        }
      }
      .item{
        border: 1px solid #ddd;
        display: flex;
        justify-content: flex-start;
        margin-bottom: -1px;
        color: #606266;
        .label{
            width: 120px;
            text-align: center;
            background: #efefef;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sp{
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          line-height: 24px;
          padding: 5px;
          span{
            padding:0 8px
            border 1px solid #fff
            &:hover{
              cursor pointer
              color #fb9906
            }
            &.cur{
              color #fb9906
              border 1px solid #fb9906
            }
          }
        }
      }
    }
    .form-row2 {
      >>>.el-form-item {
        margin-bottom: 10px;
      }
      >>>.el-form--label-top .el-form-item__label {
        padding: 0px;
      }
      .f-right {
        margin-left: 15px;
        i {
          margin-right: 5px;
          font-style: normal;
          background: #f78c09;
          padding: 0 5px;
          border-radius: 5px;
          color: #fff;
          font-size: 12px;
        }
      }
    }
    .param-ul {
      display: flex;
      flex-wrap: wrap;
    }
    .param-ul>li {
      width: 33.3%;
      margin-bottom: 20px;
      .li-fl {
      }
      .li-fr {
        >>>.el-checkbox {
          margin-left: 5px;
          .el-checkbox__label {
            padding-left: 2px;
          }
        }
      }
    }
    .params-list{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        >>>.el-form-item {
          width: 33.3%;
          display: inline-block;
          margin-bottom: 10px;
          .el-form-item__label {
              float: left;
              padding-right: 10px;
              width: 25%;
              text-align: right;
          }
        }
        >>>.el-form-item__content{
          display flex
        }
        >>>.el-checkbox {
          margin-left: 5px;
          .el-checkbox__label {
            padding-left: 2px;
          }
        }
    }
    .template-view {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f0f0f0;
      padding: 10px;
      .template-view-title {
        position: relative;
        .template-view-tips {
          position: absolute;
          right: 5px;
          top: -3px;
        }
      }
    }
    .read {
      margin: 50px 0 15px;
      text-align: center;
      >>>.el-checkbox {
        margin-right: 0;
        em {
          color: #409EFF;
          font-style normal
        }
      }
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .btn-wrapper {
      text-align: center;
      button {
        margin-right: 20px;
        &.btn-green {
        }
      }
    }
  }
}
>>>.el-drawer__header{
  margin-bottom: 15px;
}
>>>.el-drawer__body{
    padding:0 20px 20px;
}
.demo-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.demo-drawer__footer {
    display: flex;
}
.demo-drawer__footer button {
    flex: 1;
}
.infimite-box{
    flex 1
    margin-bottom 20px
    width 100%
}
.infinite-list {
    overflow hidden
    overflow-y scroll
    width 100%
    >>>.el-radio{
      margin 20px
      display flex
    }
}
</style>
