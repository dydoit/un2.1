<template>
    <div v-loading="loading">
        <div class="step-active">
            <el-steps :active="active" align-center finish-status="success">
                <el-step title="提交错误内容"></el-step>
                <el-step title="核对结果"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </div>
        <div class="step-body">
            <div class="step1" v-if="active == 0">
                <div class="title">1.请提交网元错误信息（勾选错误内容）</div>
                <div class="cm">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group class="checkgroup" v-model="checkList" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(item,index) in nets" :label="item" :value="item" :key="index"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="btn"><el-button  size="medium" icon="el-icon-search"  type="primary" @click="checkHandle">智能稽查</el-button></div>
            </div>
            <div class="step2"  v-if="active == 1">
                <div class="title">1.系统稽查结果（对比）</div>
                <div class="cm">
                    <el-table v-loading="loading2" ref="table" border :data="auditResults" size="small">
                    <el-table-column align="center" prop="auditKey" label="关键字"></el-table-column>
                    <el-table-column align="center" prop="auditOldValue" label="原数据"></el-table-column>
                    <el-table-column align="center" label="稽查数据">
                        <template slot-scope="scope">
                            <span :class="{'red':scope.row.auditNewValue != scope.row.auditNewValue}">
                                {{scope.row.auditNewValue}}
                            </span>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
                <div class="title mt3">2.如果系统稽核数据结果，还不能解决您的问题，请简单描述问题并提交给开发团队跟进。</div>
                <div class="cm">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.problemDescribe"></el-input>
                    <div class="red" v-if="problemDescribe">描述问题不能为空</div>
                </div>
                <div class="title mt3">3.联系信息</div>
                <div class="cm">
                    <div class="fmspan">
                        <span>
                        <label>联系人:</label>
                        <div>
                            <el-input size="small" v-model="form.applyName" placeholder="请输入联系人"></el-input>
                            <div class="red"  v-if="applyName">联系人不能为空</div>
                        </div>
                        </span>
                        <span>
                            <label>联系方式:</label>
                            <div>
                                <el-input size="small" v-model="form.applyContact" placeholder="请输入联系方式"></el-input>
                                <div class="red"  v-if="applyContact">联系方式不能为空</div>
                            </div>

                        </span>
                    </div>

                </div>
                <div class="btn">
                    <el-button size="medium" type="primary" @click="doNetAuditUpdate">更新稽核数据结果</el-button>
                    <el-button size="medium" @click="doNetAuditSubmit" plain>系统稽核有误，提交给开发团队</el-button>
                </div>
            </div>
            <div class="step3"  v-if="active == 2">
                <div class="success-text">
                    稽核数据更新完成！
                </div>
                <div class="gotime">
                    <div class="timer">{{count}}</div> 秒后自动跳转到网元列表
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const netOptions=['设备名称','设备类型','驱动状态','所属分公司','版本号','所属专业','补丁号','设备厂家'];
export default {
    data(){
        return{
            loading:false,
            loading2:false,
            active: 0,
            checkAll: false,
            isIndeterminate: false,
            checkList: [],
            nets:netOptions,
            auditResults:[],
            auditId:null,
            form:{
                problemDescribe:'',
                applyName:'',
                applyContact:'',
            },
            problemDescribe:false,
            applyName:false,
            applyContact:false,
            count:"",//倒计时
        }
    },
    mouted(){},
    methods:{
        handleCheckAllChange(val) {
            this.checkList = val ? netOptions: [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.nets.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.nets.length;
        },
        //智能稽查
        async checkHandle(){
            this.loading = true
            let res  = await this.$http.get('/OpsDev/networkAudit/doNetAudit',{
                params:{
                    netId:this.$route.query.id,
                    questions:this.checkList.toString()
                }
            })
            this.loading = false
            if(res.status == 'success'){
               this.$message.success('稽核成功')
                if(res.auditResults){
                    this.auditResults = JSON.parse(res.auditResults)
                }
                this.auditId = res.id
                this.active = 1
            }else if(res.status =='fail'){
                this.$message.error(res.msg)
            }
        },
        //更新稽核数据
        async doNetAuditUpdate(){
            this.loading2 = true
            let res  = await this.$http.get('/OpsDev/networkAudit/doNetAuditUpdate',{
                params:{
                    id:this.auditId,
                }
            })
            this.loading2 = false
            if(res.status == 'success'){
                if(res.auditResults){
                    this.auditResults = JSON.parse(res.auditResults)
                }
            }else if(res.status =='fail'){
                this.$message.error(res.msg)
            }
        },
        //提交问题
        async doNetAuditSubmit(){
            if(this.form.problemDescribe!='' && this.form.applyName!='' && this.form.applyContact!=''){
                this.loading = true
                let res  = await this.$http.get('/OpsDev/networkAudit/doNetAuditSubmit',{
                    params:{
                        id:this.auditId,
                        problemDescribe:this.form.problemDescribe,
                        applyName:this.form.applyName,
                        applyContact:this.form.applyContact,
                    }
                })
                this.loading = false
                if(res.status == 'success'){
                    this.active = 2
                    this.goTime()
                }else if(res.status =='fail'){
                    this.$message.error(res.msg)
                }
            }else{
                if(this.form.problemDescribe == ''){
                    this.problemDescribe = true
                }
                if(this.form.applyName == ''){
                    this.applyName = true
                }
                if(this.form.applyContact==''){
                    this.applyContact = true
                }
            }
        },
        //倒计时跳转页面
        goTime(){
		    const TIME_COUNT = 10;
            if(!this.timer){
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(()=>{
                    if(this.count > 0 && this.count <= TIME_COUNT){
                        this.count--;
                    }else{
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;
                        //跳转的页面写在此处
                        this.$router.push({ path: '/home/network'});
                    }
                },1000)
            }
        },
    },
    watch:{
        "form.problemDescribe"(val){
            if(val==''){
                this.problemDescribe = true
            }else{
                this.problemDescribe = false
            }
        },
        "form.applyName"(val){
            if(val==''){
                this.applyName = true
            }else{
                this.applyName = false
            }
        },
        "form.applyContact"(val){
            if(val==''){
                this.applyContact = true
            }else{
                this.applyContact = false
            }
        },
    }
}
</script>
<style lang="stylus" scoped>
.step-active{
    width 50%
    margin  30px  auto 50px
}
.step-body{
    width 50%
    margin 0  auto 50px
    .title{
        line-height 30px
        margin-bottom 5px
    }
}
.checkgroup{
    display flex
    flex-direction: row;
    flex-wrap: wrap;
    >>>.el-checkbox{
        width 29%
        margin-top 30px
    }
}
.mt3{
    margin-top 30px
}
.btn{
    margin-top 50px
}
.fmspan{
    display flex
    justify-content space-between
    span{
        display flex
        label{
            width: 90px;
            line-height: 32px;
        }
    }
}
.success-text{
    margin-top 50px
    display flex;
    justify-content: center;
    font-size: 22px;
    color: #1e8627;
    font-weight: bold;
}
.red{
    color #f00
}
.gotime{
    display flex
    justify-content: center;
    flex-direction: column;
    text-align: center;
    .timer{
        font-size 80px
        font-family: monospace;
        color: #1d8627;
    }
}
</style>
