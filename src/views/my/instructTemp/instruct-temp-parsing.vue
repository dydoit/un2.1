<template>
    <div class="code-main m-sroll">
        <div class="codebody" :style="{height: codebodyHeight+'px'}">
            <div class="code-centent">
                <div class="code-fl" :style="{width: topLW}">
                    <div class="codetop">
                        <div class="code-title"><span class="title">Python</span>
                        <el-button size="mini" icon="el-icon-arrow-left" @click="returnBack">返回</el-button>
                        <el-button size="mini" type="primary" @click="save">保存</el-button>
                        <el-button size="mini" type="primary" plain @click="goback">取消</el-button>
                        </div>
                        <div class="code_btn">
                            <el-button class="runbtn blue"
                                icon="el-icon-caret-right"
                                type="primary"
                                size="small"
                                :disabled="loading2"
                                @click="runPython">
                                RUN
                            </el-button>
                        </div>
                    </div>
                    <div class="codemirrorbox" :style="{height: topHeight+'px'}">
                        <codemirror
                            ref="codebox"
                            v-if="analysisCode"
                            :value="analysisCode"
                            @input="getVal"
                            @language-change="getLanguage">
                        </codemirror>
                    </div>

                </div>
                <div class="code-fr" :style="{width: topRW}">
                    <div class="inst-sidebar">
                            <el-tabs size="small"
                            v-model="activeName"
                            type="border-card">
                                <el-tab-pane label="指定网元" name="first">
                                    <div class="inst-cm" :style="{height: (topHeight-30)+'px'}">
                                    <div v-for="(vItem,index) in netList" :key=index class="inst-item">
                                        <div>{{vItem.version}}</div>
                                        <el-checkbox v-for="(netItem,key) in vItem.networkDeviceResult"
                                                    v-model="netItem.checked"
                                                    :key="key"
                                                    @change="changeCheck(netItem)"
                                                    :value="netItem.id">{{netItem.name}}</el-checkbox>
                                    </div>
                                    </div>
                                    <div class="inst-btn">
                                        <el-button type="primary"
                                            size="mini"
                                            :disabled="loading1"
                                            @click="testOrderAnalysis">
                                            获取报文
                                        </el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="API组件" name="second"><center style="margin-top:20px">暂无内容！</center></el-tab-pane>
                                <el-tab-pane label="模板信息" name="third">
                                    <div class="instruct-details" :style="{height: topHeight+'px'}">
                                        <ul v-if="instructDetails">
                                            <li class="p1"><em>开发人员：</em><span>{{instructDetails.createrName}}</span></li>
                                            <li class="p1"><em>模板名称：</em><span>{{instructDetails.analysisZh}}</span></li>
                                            <li class="p1"><em>模板说明：</em><span>{{instructDetails.analysisDescribe}}</span></li>
                                            <li class="p1"><em>适用版本：</em><span>{{instructDetails.analysisVersion}}</span></li>
                                            <li class="p1"><em>指令代码：</em><span>{{instructDetails.orderCode}}</span></li>
                                            <li class="p1"><em>指令预览：</em>
                                            <span>
                                                <template v-if="instructType == 2">{{filterCode}}:{{filterParameter}};</template>
                                                <template v-if="instructType == 1">{{filterCode2}}:{{filterParameter2}};</template>
                                            </span>
                                            </li>
                                        </ul>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                    </div>
                </div>
            </div>
            <div class="code-bottom" :style="{height: footHeight+'px'}">
                <div class="code-resizer"></div>
                <div class="code-bottom-tabs">
                <span v-for="(item,index) in tabs"
                        :key="index"
                        :class="{on: index== tabNum}"
                        @click="tabfun(index)">{{item}}</span>
                <i class="clearResult el-icon-delete" @click="removeRes">清空</i>
                </div>
                <div class="code-result" :style="{height: footH2+'px'}">
                <div class="codeitem" v-show="tabNum == 0">
                    <div class="instruct-textarea" v-loading="loading1">
                    <textarea ref="scrollBottom" v-model="reportMsg" readonly></textarea>
                    </div>
                </div>
                <div class="codeitem" v-show="tabNum == 1">
                    <div class="instruct-textarea" v-loading="loading2">
                    <textarea ref="scrollBottom" v-html="RunResult" readonly> </textarea>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import codemirror from './components/codemirror/codemirror.vue'
import { mapGetters } from "vuex";
export default {
    data(){
        return{
            instructType:'',
            loading1:false,
            loading2:false,
            analysisData:[],
            instructDetails:null,
            feedback:'',//返回的报文
            analysisCode:'', //代码
            activeName: 'first',
            netid:'',//选中的网元id
            netList:[],
            tabs:['报文','运行结果'],
            tabNum:0,
            reportMsg:'', //报文
            RunResult:'', //运行结果
            topLW:'75%' ,
            topRW:'25%',
            codebodyHeight:document.body.clientHeight-94,
            topHeight: document.body.clientHeight-330,
            footHeight: 200,
            footH2:165,
            preY: 0,
        }
    },
    components:{
        codemirror
    },
    computed:{
        ...mapGetters({
            equipmentCompanyArr: 'equipmentCompanyArr',
            equipmentTypeArr: 'equipmentTypeArr',
            instructTypeObj: 'dict/instructTypeObj'
        }),
        
        //指令预览处理
        filterCode() { 
            return this.instructDetails.orderCode
        },
        //指令预览处理
        filterParameter(){
            let str = ''
            let arr = this.instructDetails.instructParameter.filter(item =>item.paramValue);
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
            let code = this.instructDetails.orderCode
            if(code) {
            return code.replace( /\$\{(.*?)\}/g,'').replace(/:/g, '').replace(/;/g, '')
            }
        },
        //指令预览处理
        filterParameter2() {    
            let str = "";
            let ffarr = this.instructDetails.instructParameter.filter(elem => elem.paramValue);
            return ffarr.reduce((last,cur) => {
            return last + cur.paramValue + ' '
            },'')
        },
    },
    methods:{
        //返回列表
        goback(){
            this.$router.push('/my-instruction-temp')
        },
        //tab切换
        tabfun(index) {
            this.tabNum = index;
        },
        
        //获取指令模板详情信息
        async getData(){
            let res = await this.$http.get('/OpsDev/orderAnalysis/getOrderAnalysisById',{
                params:{
                id:this.$route.query.id,
                }
            })    
            this.instructDetails = res       
            if(res.instructParameter){
                this.instructDetails.instructParameter = JSON.parse(res.instructParameter)
            }
            if(res.analysisCode){
                this.analysisCode = res.analysisCode
            }else{
                this.analysisCode = "# -*- coding: UTF-8 -*- \n#请在此方法下面编写您的代码 \ndef proc(ne,fb):"
            }
            this.codeVal = this.analysisCode                      
            this.getInstructType()
        },
        //
        getInstructType() { // 指令编辑类型
            this.instructType = this.instructTypeObj[this.instructDetails.equipmentCompany+this.instructDetails.equipmentType]?
            this.instructTypeObj[this.instructDetails.equipmentCompany+this.instructDetails.equipmentType]:'1'
        },
        //根据版本号查询网元
        async getNetDeviceListByTypeId(){
            let res = await this.$http.get('/OpsDev/taskExamine/getNetDeviceListByTypeId',{
                params:{
                    id:this.$route.query.id,
                    objectType:1
                }
            })
            res.map(item =>{
                item.networkDeviceResult.map(child =>{
                    child.checked = false
                })
            })
            this.netList = res
        },
        //指定网元勾选，（单选）
        changeCheck(obj){
            this.feedback = ''
            if(obj.checked){ // 如没有这属性，就在获取全部的数据的自己造这个属性进去   
            this.netid = obj.id    
                this.netList.map(item =>{
                    item.networkDeviceResult.map(child =>{
                        child.checked = false
                        if(obj.id == child.id){
                            child.checked = true
                        }
                    })
                })
            }else{ // 取消选中 ，就要删除已经勾选的项
                this.netid = ''
            }
        },
        //根据网元版本号，获取指令模板的报文
        async testOrderAnalysis(){
            this.tabNum = 0
            this.loading1 = true
            let res  = await this.$http.get('/OpsDev/orderAnalysis/testOrderAnalysis',{
                params:{
                    id:this.$route.query.id,
                    netId:this.netid,
                }
            })
            this.loading1 = false
            if(res.status=='success'){
                if(res.item.status=='success'){
                    this.reportMsg =  res.item.reportMsg
                    this.feedback = res.item.reportMsg
                }else if(res.item.status=='fail'){
                    this.$message.error(res.item.reportMsg)
                    this.reportMsg =  res.item.reportMsg
                }
            }else{
                this.$message.error('无法获取报文！')
            }

        },
        //绑定子组件数据
        getVal(data){
            this.codeVal = data;
            this.isWebRun = true;
        },
        getLanguage(val){
            console.log('language',val)
        },
        //返回上一页
        returnBack(){
            this.$router.push({path:'/my-instruction-temp/temp-manage',query:{pageType: 2,id:this.$route.query.id}})
        },
        //保存
        async save(){
            let res = await this.$http.get('/OpsDev/orderAnalysis/saveAnalysisReport',{
                params:{
                    id:this.$route.query.id,
                    analysisCode:this.codeVal
                }
            })
            if(res.status=='success'){
                this.$message.success('保存成功')
            }else if(res.status == 'fail'){
                this.$message.error(res.msg)
            }
        },
        //运行
        async runPython(){
            this.tabNum = 1
            this.loading2 = true
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
            let params ={
                    id:this.$route.query.id,
                    netId:this.netid,
                    feedback:this.feedback,
                    analysisCode:this.codeVal,
            }
            let res = await this.$http.post('/OpsDev/orderAnalysis/testOrderAnalysisByIdAndParams',params,config)
            this.loading2 = false
            if(res.status=='success'){
                this.$message.success('执行成功')
                if(this.RunResult==''){
                    if(res.result.error==''){
                        this.RunResult = res.result.result
                    }else{
                        this.RunResult = res.result.error +'\r'+ res.result.result
                    }
                }else{
                    if(res.result.error==''){
                        this.RunResult = this.RunResult +'\r'+ res.result.result
                    }else{
                        this.RunResult = this.RunResult +'\r'+ res.result.error +'\r'+ res.result.result
                    }
                }

            }else if(res.status=='fail'){
                this.$message.error(res.msg)
                if(this.RunResult==''){
                    this.RunResult = res.msg
                }else{
                    this.RunResult = this.RunResult +'\r'+ res.msg
                }
            }
        },
        //清除运行结果
        removeRes(){
            if(this.tabNum==0){
                this.reportMsg=''
            }else if(this.tabNum ==1){
                this.RunResult = '';
            }
        },
        //滚动到底部方法
        scrollToBottom() {
            this.$nextTick(() => {
            let scrollBottom = this.$refs.scrollBottom
            scrollBottom.scrollTop = scrollBottom.scrollHeight // 滚动高度
            })
        },
        ctrlMouseDown(e) {
            let el = e.target || e.srcElement
            if( el.className.indexOf('code-resizer') < 0) {
            return
            }
            this.preY = e.clientY
        },
        ctrlMouseMove(e) {
            const nowY = e.clientY
            if (this.preY <= 0) {
            return
            }
            e.preventDefault()
            this.footHeight -= nowY - this.preY
            if (this.footHeight < 50) {
            this.footHeight = 50
            } else if (this.footHeight > document.body.clientHeight - 100) {
            this.footHeight = document.body.clientHeight - 100
            } else {
            this.preY = nowY
            }
            this.topHeight = this.codebodyHeight - this.footHeight - 36
            this.footH2 = this.footHeight - 33
        },
        ctrlMouseUp(e) {
            this.preY = 0
        },
    },
    //每次页面渲染完之后滚动条在最底部
    updated() {
        this.scrollToBottom();
    },
    created(){
        window.onmousedown = this.ctrlMouseDown
        window.onmousemove = this.ctrlMouseMove
        window.onmouseup = this.ctrlMouseUp
        this.getData();
        this.getNetDeviceListByTypeId();
    }
}
</script>
<style lang="stylus" scoped>
>>>.el-dialog__body{
    padding:10px 20px
}
.m-sroll{
    ::-webkit-scrollbar {
        width: 5px;
        height: 8px;
        background-color: #e8e8e8;
    }
    ::-webkit-scrollbar-thumb {
        border-radius:5px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: rgba(0, 0, 0, .3)
    }
}
.code-main{
}
.code-top{
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 20px;
}
.codebody{
    display:flex;
    flex-direction: column;
    overflow: hidden;
}
.code-centent{
    display flex
    justify-content flex-start
    flex 1
    .code-fl{
        display: flex;
        flex-direction: column;
        .codetop{
            display:flex;
            justify-content:space-between;
            align-items :center;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            box-shadow: 0px 2px 5px inset #e5e5e5;
            background: #f6f7fa;
            .code-title{
                font-size: 14px;
                height: 34px;
                line-height: 34px;
                padding-left: 15px;
                .title{
                    margin-right 20px
                }
            }
        }
        .runbtn{
            padding: 6px 8px;
            font-size: 12px;
            margin-right:8px
            background-color: #6ff37f;
            border-color: #898989;
            color: #000;
            >>>span{
                margin-left:0px;
            }
            &:hover{
                background-color:#41e655;
            }
        }
        .codemirrorbox{

        }
    }
    .code-fr{
        display flex
        flex-direction column
        .inst-sidebar{
            width: 100%;
            height: 100%;
            >>>.el-tabs__item{
                height 34px
                line-height 34px
            }
            >>>.el-tabs--border-card{
                height 100%
            }
            >>>.el-tabs__content{
                padding 0
            }
            .inst-cm{
                overflow-y scroll
            }
            .inst-item{
                padding 10px 0 5px 15px
                display flex
                flex-direction column
            }
            .inst-btn{
                text-align: center;
                padding: 2px 0;
                display: block;
                background: #f6f7fa;
                border-top:1px solid #ddd
            }
        }
        .instruct-details{
            padding:10px;
            overflow-y scroll
            &>ul{
                li{
                    display:inline-block;
                    width:100%;
                    color: #555;
                &.p1>em{
                    float: left;
                    width: 22%;
                    font-style: normal;
                    text-align: right;
                    margin-right: 2px;
                }
                &.p1>span{
                    float: left;
                    width: 77%;
                }
                &.p2>em{
                    display: block;
                    width:100%;
                    font-style: normal;
                }
                &.p2>span{
                    display: block;
                    width:100%;
                    font-style: normal;
                }
                }
            }
        }
    }

}
.code-resizer{
    height: 4px;
    background: #e6e6e6;
    cursor: row-resize;
    border-top: 1px solid #ccc;

}
.code-bottom{
    .code-bottom-tabs{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #ccc;
        background: #f6f7fa;
        position: relative;
        span{
            color: #333;
            padding: 4px 10px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            width: 80px;
            text-align: center;
            cursor: pointer;
            margin-left:-1px;
            font-size: 12px;
            &.on{
                color: #1684f6;
            }
        }
        .clearResult{
            position: absolute;
            right: 18px;
            font-size: 12px;
            border: 1px solid #c1c1c1;
            padding: 2px 4px;
            background: #eaeaea;
            color: #333;
            &:hover{
            cursor: pointer;
            color: #2870f3;
            border: 1px solid #2870f3;
            }
        }
    }
    .instruct-textarea{
        width 100%
        height 100%
        display flex
        textarea{
            border none
            padding 10px
            flex 1
            font-size 13px
            line-height 18px
            outline none
        }
    }
    .code-result{
        // overflow-y: scroll;
        .codeitem{
            height: 100%;
        }
    }
}
>>>.el-checkbox+.el-checkbox {
    margin-left: 0
}
</style>
