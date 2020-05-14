<template>
    <div>
        <div class="network-box">
            <div class="network-content">
                <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="140px">
                    <div class="bxf">
                        <el-form-item class="bxf-li" label="所属公司：" prop="equipmentCity" >
                            <el-select v-model="dataForm.equipmentCity" @change="selectChange" :disabled="isEdit || account.roleLevel!=1">
                            <el-option v-for="(item,index) in companyArr"
                                        :key="index"
                                        :label="item.dictNameZh"
                                        :value="item.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="所属专业：" prop="profession" >
                            <el-select v-model="dataForm.profession" @change="selectChange" :disabled="isEdit || account.roleLevel!=1">
                            <el-option v-for="(item,index) in professionList"
                                        :key="index"
                                        :label="item.dictNameZh"
                                        :value="item.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="设备厂家：" prop="equipmentCompany">
                            <el-select v-model="dataForm.equipmentCompany" @change="selectChange" :disabled="isEdit">
                            <el-option v-for="(item,index) in equipmentCompanyArr"
                                        :key="index"
                                        :label="item.dictNameZh"
                                        :value="item.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="添加方式：" prop="addWay">
                            <el-select v-model="dataForm.addWay" @change="selectChange" :disabled="isEdit">
                            <el-option label="网管托管" value="0"></el-option>
                            <el-option label="网元直连" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="网管系统：" prop="systemType" v-if="dataForm.addWay=='0'">
                            <el-select v-model="dataForm.systemType" @change="selectChange" :disabled="isEdit">
                            <el-option v-for="(item,index) in systeTypeList"
                                        :key="index"
                                        :label="item.dictNameZh"
                                        :value="item.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="设备类型：" prop="equipmentType" v-if="dataForm.addWay=='1'">
                            <el-select v-model="dataForm.equipmentType" @change="selectChange" :disabled="isEdit">
                            <el-option v-for="(item,index) in equipmentTypeArr"
                                        :key="index"
                                        :label="item.dictNameZh"
                                        :value="item.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="设备名称：" prop="equipmentName" v-if="dataForm.addWay=='0'">
                            <el-input v-model="dataForm.equipmentName" @change="selectChange" :disabled="isEdit"></el-input>
                        </el-form-item>
                    </div>
                    <!-- <div class="feedback-tips">如果平台提供的添加方式不满足您的需要，<span @click="showFeedback">点击链接反馈</span>。谢谢您的提示，您的满意是我们努力的动力！</div> -->
                    <div class="netadd-tips">*公用账号将被网络编程平台和已授权的维护人员使用。</div>
                    <div class="bxf">
                        <el-form-item class="bxf-li" label="登录方式：" prop="loginType">
                            <el-select v-model="dataForm.loginType" @change="selectChange" :disabled="isEdit">
                            <el-option label="Telnet" value="1"></el-option>
                            <el-option label="SSH" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="设备IP地址：" prop="ip">
                            <el-input v-model="dataForm.ip" @change="selectChange" :disabled="isEdit"></el-input>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="端口：" prop="port">
                            <el-input v-model="dataForm.port" @change="selectChange" :disabled="isEdit"></el-input>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="公用账号：" prop="account">
                            <el-input v-model="dataForm.account" @change="selectChange"></el-input>
                        </el-form-item>
                        <el-form-item class="bxf-li" label="密码：" prop="password" >
                            <el-input v-model="dataForm.password" type="password" @change="selectChange"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="bxf-btn">
                    <div>
                        <span class="ces-load" v-if="isLoad"><img src="./static/loading.gif" alt="">请稍等.....</span>
                        <span class="ces-tips" :class="[{'green':cesStatus},{'red':!cesStatus}]" v-else>
                            {{resultMsg}}
                        </span>
                    </div>
                    <!-- <span class="ces-btn" @click="adapter" ></span> -->
                    <el-button class="ces-btn" size="medium" @click="adapter" :disabled="loopFlag">获取适配网元</el-button>
                </div>
                <div class="netTable" v-if="cesStatus">
                    <div class="netTable-top">
                        <div class="tit">
                            <p>共查询出<em class="green">{{allCount?allCount:'0'}}</em>个网元设备，其中有<em class="red">{{existCount?existCount:'0'}}</em>个网元设备已导入，请核查清楚后选择导入数据：</p>
                            <div class="tips">（温馨提示：重复网元指检测到该网元已录入在其他网管下。备注中的“<font style="color:red">新增</font>”状态表示该网元新加入到该网管上托管，“<font style="color:red">保留</font>”状态表示更改后该网元仍在该网管下托管，“<font style="color:red">废弃</font>”状态表示更改后原网元已不托管在该网管上）</div>
                        </div>
                        <span class="btn" @click="reTimeFun()">手动刷新</span>
                    </div>
                    <el-table v-loading="loading"
                        ref="multipleTable"
                        :data="allData"
                        @select-all="selectAll"
                        size="small">
                        <el-table-column type="selection" width="50"
                                :selectable="selectable"
                                v-if="netData.deBatchId && netData.deBatchId!=''"></el-table-column>
                        <el-table-column align="center" prop="equipmentType" label="设备类型"></el-table-column>
                        <el-table-column align="center" prop="equipmentName" label="设备名称"></el-table-column>
                        <el-table-column align="center" prop="ip" label="IP地址"></el-table-column>
                        <el-table-column align="center" prop="currentVersion" label="版本号"></el-table-column>
                        <el-table-column align="center" prop="versionAlias" label="补丁"></el-table-column>
                        <el-table-column align="center" prop="drivingState" label="指令驱动状态"></el-table-column>
                        <el-table-column align="center" label="入库状态">
                            <template slot-scope="scope">
                                <span :class="[scope.row.isInsertFlag=='0'?'green':'red']">{{scope.row.isInsertFlag=='0'?'已入库':'未入库'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="重复网元" width="70">
                            <template slot-scope="scope">
                                <span :class="[{'red':scope.row.isRepeat=='1'}]">{{scope.row.isRepeat=='1'?'是':'否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="网元状态">
                            <template slot-scope="scope">
                                <i class="el-icon-success green" v-if="scope.row.status=='适配成功'">{{scope.row.status}}</i>
                                <i v-else-if="scope.row.status=='适配中'"><img src="./static/upload.gif"></i>
                                <i class="red" v-else-if="scope.row.status=='等待适配'">{{scope.row.status}}</i>
                                <i class="el-icon-error red" v-else>{{scope.row.status}}</i>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
                    </el-table>
                    <div class="btn-wapper" v-if="netData.deBatchId && netData.deBatchId!=''">
                        <el-button size="small" type="primary" @click="uploadNet('all')" :disabled="loopFlag">全部导入</el-button>
                        <el-button size="small" type="primary" @click="uploadNet('select')" :disabled="loopFlag">导入已选择</el-button>
                        <el-button size="small" @click="goback" :disabled="loopFlag">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <feedback ref="feedback"></feedback>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import feedback from './components/feedback'
//网元状态
const statusObj = {
        '0':'适配成功',
        '1':'连接失败',
        '2':'删除',
        '3':'无权限登录',
        '4':'适配中',
        '5':'程序报错失败',
        '6':'入库失败',
        '7':'等待适配'
}
//驱动状态
const drivingState = {
        '0':'正常',
        '1':'旧版本驱动',
        '2':'修复失败',
        '3':'无驱动',
}
export default {
    data() {
        return {
            loading:false,
            systeTypeList:[],
            account:'',
            dataForm:{
                equipmentCity:'',//	设备所属分公司
                profession:'',//	所属专业
                equipmentType:'',//	设备类型
                equipmentCompany:'',//	设备厂家
                equipmentName:'',//设备名称
                ip:'',//	IP地址
                port:'',//	设备端口
                loginType:'',//	设备登录方式
                loginOrder:'',//	登录网元信息
                addWay:'',//	添加方式
                systemType:'',//	网管系统类型
                account:'',//账号
                password:'',//密码
                limit:20,//	一页几条
                page:1,//	第几页
            },
            allData:[],
            netData:[],
            allCount:'0', //总共适配网元个数
            existCount:'0', //已导入网元个数
            isEdit:false,//是否允许修改，新增的时候允许修改，更新的时候不允许修改
            cesStatus:false,//适配网元的连接状态
            isLoad:false,//加载过渡
            resultMsg:'',//适配网元时候返回的信息
            SelectNetId:[],//勾选网元列表的id数组
            deviceId:'', //设备id
            batchNumber:'',//批次号
            loopFlag:false,//判断是否定时刷新
            num:0,
            rules:{
                equipmentCity:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                profession:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                equipmentType:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                equipmentCompany:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                addWay:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                systemType:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                equipmentName:[
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
                ],
                loginType:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                ip:[
                    { required: true, message: '请输入ip地址', trigger: 'blur' },
                    { min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                ],
                port: [
                    { required: true, message: '请输入端口', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
                ],
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25个字符', trigger: 'blur'}
                ],
            },

        };
    },
    components:{
        feedback,
    },
    computed:{
        ...mapGetters({
            professionList: 'professionList',
            equipmentCompanyArr: 'equipmentCompanyArr',
            equipmentTypeArr: 'equipmentTypeArr',
            companyArr: 'companyArr',
            companyObj:'dict/companyObj',
            professionObj:'dict/professionObj',
            equipObj: 'dict/equipObj',
        }),
    },
    created() {
        let account = sessionStorage.getItem("OpsDevInfo")
        if(account) {
            account = JSON.parse(account)
            this.account = account
            if(account.roleLevel !=1) {
                this.dataForm.equipmentCity = account.orgCode
                this.dataForm.profession = account.profession
            }
        }
        this.getParam();
    },
    methods: {
        //返回
        goback(){
            this.$router.go(-1)
        },
        //显示反馈弹框
        showFeedback(){
            this.$refs.feedback.feedbackbox = true
        },
        //获取网管系统
        async getSystemType(){
            let res  = await this.$http.get('/OpsDev/dicts/getDictsByType',{
                params:{
                    dictValue:this.dataForm.equipmentCompany,
                    level:3
                }
            })
            this.systeTypeList = res
        },
        // 改变页数
        changePage(page) {
            this.dataForm.page = page;
            this.adapter();
        },
        //如果设备信息发生更改，需要重新适配网元
        selectChange(val){
            this.cesStatus = false
            this.resultMsg = ''
            this.netData = []
        },
        //自动适配网元
        adapter(){
            this.loading = true
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.isLoad = true
                    const config = {
                        headers:{'Content-Type':'application/json'},
                    }
                    if(this.pageType==1){
                        this.$http.get('/OpsDev/netEquip/adapterNetworkDevice',{
                            params:this.dataForm
                        }).then(res =>{
                            this.loading = false
                            this.isLoad = false
                            if(res.status=='success'){
                                this.cesStatus = true
                                this.resultMsg = '获取网元成功!'
                                this.netData = res
                                this.allCount = res.allCount
                                this.existCount = res.existCount
                                if(res.networkDeviceTempList){
                                    res.networkDeviceTempList.map(item =>{
                                        item.equipmentType = this.equipObj[item.equipmentType],
                                        item.status = statusObj[item.status],
                                        item.drivingState = drivingState[item.drivingState]
                                    })
                                }
                                this.allData = res.networkDeviceTempList
                            }else if(res.status=='fail'){
                                this.cesStatus = false
                                this.resultMsg = res.msg
                            }
                        })
                    }else if(this.pageType==2){
                        this.$http.get('/OpsDev/netEquip/adapterNetworkDeviceForUpdate',{
                            params:this.dataForm
                        }).then(res =>{
                            this.loading = false
                            this.isLoad = false
                            if(res.status=='success'){
                                this.cesStatus = true
                                this.resultMsg = '获取网元成功!'
                                this.netData = res
                                this.allCount = res.allCount
                                this.existCount = res.existCount
                                this.networkDeviceTempList(res.networkDeviceTempList)
                            }else if(res.status=='fail'){
                                this.cesStatus = false
                                this.resultMsg = res.msg
                            }
                        })
                    }
                }
            })
        },
        //处理默认勾选
        networkDeviceTempList(dataArr){
            //适配网元列表
            if(dataArr.length>0){
                dataArr.map(item =>{
                    item.equipmentType = this.equipObj[item.equipmentType],
                    item.status = statusObj[item.status],
                    item.drivingState = drivingState[item.drivingState]
                })
            }
            this.allData = dataArr
            this.$nextTick(()=>{
                this.allData.forEach(row => {
                    if(row.isInsertFlag==0){
                        if(row.isRepeat!='1'){
                            this.$refs.multipleTable.toggleRowSelection(row,true);
                            this.SelectNetId.push(row.id)
                        }
                    }
                })
            })
        },
        //已存在的网元不允许勾选操作
        selectable(row, index){
            //console.log('row, index',row, index)
            if(row.isRepeat=='1'){
                return false;//禁用状态
            }else{
                return true;//非禁用状态
            }
        },
        //全选
        selectAll(selection){
            this.SelectNetId = []
            selection.map(item =>{
                this.SelectNetId.push(item.id)
            })
        },
        //监听网页列表当前行的勾选
        handleSelectionChange(selection, row) {
            this.SelectNetId = []
            selection.map(item =>{
                if(item.id == row.id && row.isRepeat=='1'){
                    //this.$message.warning('该网元已存在，确定继续录入？')
                    this.$confirm('该网元已存在，确定继续录入？','提示',{type: 'warning'})
                    .then(() =>{
                        //确定
                        this.SelectNetId.push(item.id)
                    }).catch(() => {
                        //取消
                        this.$refs.multipleTable.toggleRowSelection(row,false);
                    });
                }else{
                    this.SelectNetId.push(item.id)
                }
            })
        },
        //导入网元
        uploadNet(flag){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const config = {
                        headers:{'Content-Type':'application/json'},
                    }
                    if(this.pageType==1){//走新增接口
                        this.$http.post('/OpsDev/netEquip/importNetworkDevice',{
                            networkDevice:this.dataForm,
                            dmDrivingId:this.netData.dmDrivingId,
                            deBatchId:this.netData.deBatchId,
                            flag:flag,
                            networkDeviceTempArr:this.SelectNetId,
                        },config)
                        .then(res  =>{
                            if(res.status=="success"){
                                this.deviceId = res.deviceId
                                this.loopFlag = res.loopFlag
                                this.reTimeFun()
                                if(res.isClearFlag==true){
                                    this.clearNetworkDeviceTemp();
                                }
                                if(res.refreshFlag){
                                    this.netData.deBatchId = res.deBatchId
                                    this.allCount = res.allCount
                                    this.existCount = res.existCount
                                    this.batchNumber = res.batchNumber
                                    this.networkDeviceTempList(res.networkDeviceTempList)
                                }
                            }else if(res.status=='fail'){
                                this.$message.error(res.msg)
                            }
                        })
                    }else if(this.pageType==2){
                        //走修改接口
                        this.$http.post('/OpsDev/netEquip/updateNetworkDevice',{
                            networkDevice:this.dataForm,
                            dmDrivingId:this.netData.dmDrivingId,
                            deBatchId:this.netData.deBatchId,
                            flag:flag,
                            networkDeviceTempArr:this.SelectNetId,
                        },config)
                        .then(res  =>{
                            if(res.status=="success"){
                                this.deviceId = res.deviceId
                                this.loopFlag = res.loopFlag
                                this.reTimeFun()
                                if(res.isClearFlag==true){
                                    this.clearNetworkDeviceTemp();
                                }
                                if(res.refreshFlag){
                                    this.netData.deBatchId = res.deBatchId
                                    this.allCount = res.allCount
                                    this.existCount = res.existCount
                                    this.batchNumber = res.batchNumber
                                    this.networkDeviceTempList(res.networkDeviceTempList)
                                }
                            }else if(res.status=='fail'){
                                this.$message.error(res.msg)
                            }
                        })
                    }
                }
            })
        },
        //手动刷新
        async refresh(){
            //判断是否定时刷新
            if(this.loopFlag){
                let res = await this.$http.get('/OpsDev/netEquip/refreshNetworkDeviceById',{
                    params:{
                        id:this.deviceId, //导入的时候返回来的deviceId
                        batchNumber:this.batchNumber,
                        limit:this.dataForm.limit,
                        page:this.dataForm.page,
                    }
                })
                if(res.status=='success'){
                    this.$message.success('适配完成')
                }else if(res.status=='fail'){
                    this.$message.success(res.msg)
                }
                this.netData = res
                this.allCount = res.allCount
                this.existCount = res.existCount
                this.loopFlag = res.loopFlag
                this.batchNumber = res.batchNumber
                this.networkDeviceTempList(res.networkDeviceTempList)
            }else{
                clearInterval(this.interval)
            }
        },
        //启动定时器调用 refresh方法
        reTimeFun(){
            this.refresh()
            this.interval = setInterval(() =>{
                this.refresh()
            },10000)
        },
        //清除临时表数据
        async clearNetworkDeviceTemp(){
            let res = await this.$http.get('/OpsDev/netEquip/clearNetworkDeviceTemp',{
                params:{
                    deBatchId:this.netData.deBatchId
                }
            })
        },
        //判断是否新增页面、修改页面、查看详情页面
        getParam(){
            this.pageType = this.$route.query.pageType;
            this.instructTempId = this.$route.query.id
            if(this.pageType=='2'){
                this.getQueryData()
                this.isEdit = true
            }
        },
        //
        //跟进id获取网元详情信息
        async getQueryData(){
            let res = await this.$http.get('/OpsDev/netEquip/getNetworkDeviceByIdForUpdate',{
                params:{
                    id:this.$route.query.id
                }
            })
            this.cesStatus = true
            //网元信息
            let info = res.networkDevice
            this.dataForm.id = info.id
            this.dataForm.equipmentCity = info.equipmentCity; //	设备所属分公司
            this.dataForm.profession = info.profession; //	所属专业
            this.dataForm.equipmentType = info.equipmentType; //	设备类型
            this.dataForm.equipmentCompany = info.equipmentCompany; //	设备厂家
            this.dataForm.equipmentName = info.equipmentName; //设备名称
            this.dataForm.ip = info.ip; //	IP地址
            this.dataForm.loginType = info.loginType; //	设备登录方式
            this.dataForm.addWay = info.addWay; //	添加方式
            this.dataForm.systemType = info.systemType; //	网管系统类型
            this.dataForm.account = info.account; //账号
            this.dataForm.password = info.password//密码  
            if(info.port || info.port==0){ //设备端口又可能为null,或者为0,
                this.dataForm.port = info.port.toString(); //	设备端口
            }                   
            this.allCount = res.allCount
            this.existCount = res.existCount
            if(res.networkDeviceTempList){
                this.networkDeviceTempList(res.networkDeviceTempList)
            }          
            this.getSystemType();
        }
    },
    watch:{
        //监听厂家下拉
        'dataForm.equipmentCompany'(val,oldVal){
            if(oldVal != ''){
                this.dataForm.systemType = ''
            }
            this.getSystemType()
        },
    }
};
</script>
<style lang="stylus" scoped>
.network-box{
    padding 20px
    .titleTop{
        display flex
        justify-content flex-start
        align-items center
        margin-bottom 20px
        h3{
            font-size 18px
            font-weight 700
        }
        .titleTop-info{
            margin-left 200px
            span{
                padding 0 20px
            }
        }
    }
    .network-content{
        .bxf{
            display flex
            flex-wrap wrap
            .bxf-li{
                width 33.3%
                &>>>.el-input__inner{
                width 240px
                }
            }

        }
        .feedback-tips{
            margin-bottom 10px
            margin-left 140px
            color #868686
            font-size 12px
            span{
                color #409eff
                &:hover{
                    cursor pointer
                    text-decoration underline
                }
            }
        }
        .netadd-tips{
            font-size 12px
            margin 20px 0 10px 55px
        }
        .bxf-btn{
            display flex
            justify-content center
            align-items center
            flex-direction column
            margin 20px 0
            .ces-tips{
                line-height 24px
                margin-bottom 10px
                display block
            }
            .ces-load{
                display: flex;
                justify-content: center;
                align-items: center;
                color: #666;
                line-height: 24px;
                margin-bottom: 10px;
            }
            .ces-btn{
                padding: 12px 140px;
                border: 1px solid #409EFF;
                color: #ffffff;
                font-size: 14px;
                background: #409EFF;
                border-radius: 3px;
                &:hover {
                    background: #57a7fb;
                    cursor: pointer;
                }
            }
        }
        .netTable {
            border-top 1px solid #ddd
            padding 30px 0
            margin-top 20px
            display inline-block
            width 100%
            .netTable-top{
                display flex
                justify-content space-between
                align-items center
                margin 10px 0 20px
                .tit{
                    p{
                        padding: 0
                    }
                    .tips{
                        color #999
                        font-size: 12px;
                    }
                    em{
                        padding 0 2px
                        font-style normal
                        font-size 16px
                        font-weight bold
                    }
                }
                .btn{
                    font-size 12px
                    padding 0 10px
                    border 1px solid #ddd
                    border-radius 2px
                    &:hover{
                        cursor pointer
                        color #fff
                        background #409EFF
                        border-color #409EFF
                    }
                }
            }
            .btn-wapper{
                margin 30px 0
            }
        }
    }
}
</style>
