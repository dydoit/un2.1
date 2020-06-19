<template>
    <div class="instruct-details" v-if="instructDetails" >
        <div class="details-title">
            <span>{{instructDetails.analysisZh}}</span>
            <em>(版本号：{{instructDetails.analysisVersion}})</em>
        </div>
        <div class="details-ins"><i>指令</i>{{instructDetails.instructCode}} ({{instructDetails.analysisZh}})</div>
        <div class="details-cm">
            <h3>指令说明：</h3>
            <div class="details-p"><p>{{instructDetails.instructDescribe}}</p></div>
        </div>
        <div class="details-params">
            <div class="tit">参数变量值：（<i class="red">*</i>为必填项）</div>
            <ul class="param-ul">
                <li v-for="(item,index) of instructDetails.instructParameter" :key="index">
                    <label><i v-if="item.paramNotNull=='1'" class="red">*</i>{{item.paramKey}}</label>
                    <span class="mid">=</span>
                    <el-input size="small" v-model="item.paramValue" :disabled="true"></el-input>
                </li>
            </ul>
        </div>
        <div class="template-view">
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
                <!-- {{instructDetails.instructCode}}:{{filterParameter(instructDetails.instructParameter)}}; -->
                <template v-if="instructType == 2">{{filterCode}}:{{filterParameter}};</template>
                <template v-if="instructType == 1">{{filterCode2}}:{{filterParameter2}};</template>
            </span>
        </div>
        <div class="details-describe">
            <div class="tit">模板功能说明:</div>
            <p>{{instructDetails.analysisDescribe}}</p>
        </div>
        <div class="details-code">
            <div class="tit">解析代码:</div>
            <p>
                <textarea
                    class='reportLog'
                    ref='reportLog'
                    type="textarea"
                    :rows="10"
                    v-model="instructDetails.analysisCode"
                    style="width:100%; height:200px;"
                    readonly></textarea>
            </p>
        </div>
        <div class="details-btn">
            <el-button type="primary" size="medium" @click="goback">返回</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    data(){
        return{
            instructDetails:null,
            instructType:'',
        }
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
        //返回
        goback(){
            this.$router.push('/home/my-instruction-temp')
        },
        //获取模板详情数据
        async getData(){
            this.loading = true
            let res = await this.$http.get('/OpsDev/orderAnalysis/getOrderAnalysisById',{
                params:{
                    id:this.$route.query.id
                }
            })
            this.instructDetails = res
            if(res.instructParameter){
                this.instructDetails.instructParameter = JSON.parse(res.instructParameter)
            }
            this.getOrderById(res.instruId)
            this.getInstructType();
        },
        //获取指令
        async getOrderById(parmaId){
            let res = await this.$http.get('/OpsDev/order/getOrderById',{
                params:{ id:parmaId }
            })
            this.instructDetails = {
                    ...this.instructDetails,
                    instructName:res.instructZh,
                    instructDescribe:res.instructDescribe,
                    instructCode:res.instructCode,
            }

        },
        //
        getInstructType() { // 指令编辑类型
            this.instructType = this.instructTypeObj[this.instructDetails.equipmentCompany+this.instructDetails.equipmentType]?
            this.instructTypeObj[this.instructDetails.equipmentCompany+this.instructDetails.equipmentType]:'1'
        },
    },
    mounted(){
        this.getData()
    },
}
</script>
<style lang="stylus" scoped>
.instruct-details{
    padding 20px
    .details-title{
        span{
            font-size 20px
            font-weight bold
        }
        em{
            font-style normal
            margin-left 15px
            color #999

        }
    }
    .details-ins{
        margin 0 0 5px
        color #666
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
    .details-cm{
        h3{
            font-size 14px
            margin-bottom 5px
            font-weight bold
            color #4c4c4c
            margin-top 15px
        }
        .details-p{
            padding 5px
            background #f0f0f0
            p{
                color #868686
            }
        }

    }
    .details-params{
        margin 20px 0
        .tit{
            font-weight bold
            color #4c4c4c
            margin-bottom 15px
        }
        .param-ul {
            display: flex;
            flex-wrap: wrap;
        }
        .param-ul>li {
            width: 33.3%;
            margin-bottom: 20px;
            display flex
            align-items center
            label{
                width 120px
                text-align right
            }
            .mid{
                padding 0 5px
            }
            .el-input{
                width 180px
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
    .details-describe{
        margin-top 20px
        .tit{
            font-size 14px
            margin-bottom 10px
            font-weight bold
            color #4c4c4c
        }
        p{
            border 1px solid #dddd
            padding 10px
            min-height 100px
        }
    }
    .details-code{
        margin-top 20px
        .tit{
            font-size 14px
            margin-bottom 10px
            font-weight bold
            color #4c4c4c
        }
        textarea{
            border 1px solid #ddd
        }
    }
    .details-btn{
        margin 20px
    }
}
</style>
