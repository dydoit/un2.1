<template>
    <div class="network-detail" v-loading="loading">
        <div class="cod">
            <div class="cod-title">基础属性</div>
            <ul>
                <li class="cod-li"><label>设备名称：</label><span :title="allData.equipmentName">{{allData.equipmentName}}</span></li>
                <li class="cod-li"><label>所属分公司：</label><span :title="allData.equipmentCity">{{allData.equipmentCity}}</span></li>
                <li class="cod-li"><label>所属专业：</label><span :title="allData.profession">{{allData.profession}}</span></li>
                <li class="cod-li"><label>设备厂家：</label><span :title="allData.equipmentCompany">{{allData.equipmentCompany}}</span></li>
                <li class="cod-li"><label>设备类型：</label><span :title="allData.equipmentType">{{allData.equipmentType}}</span></li>
                <!-- <li class="cod-li"><label>设备型号：</label><span>{{allData.dd}}</span></li> -->
            </ul>
        </div>
        <div class="cod">
            <div class="cod-title">登录和状态</div>
            <ul>
                <li class="cod-li"><label>登录方式：</label><span :title="allData.loginType">{{allData.loginType}}</span></li>
                <li class="cod-li"><label>IP地址：</label><span :title="allData.ip">{{allData.ip}}</span></li>
                <li class="cod-li"><label>设备端口：</label><span :title="allData.port">{{allData.port}}</span></li>
                <li class="cod-li"><label>公用账号：</label><span :title="allData.account">{{allData.account}}</span></li>
                <li class="cod-li"><label>版本号：</label><span :title="allData.currentVersion">{{allData.currentVersion}}</span></li>
                <li class="cod-li"><label>补丁：</label><span :title="allData.versionAlias">{{allData.versionAlias}}</span></li>
                <li class="cod-li"><label>网元状态：</label><span :title="allData.status">{{allData.status}}</span></li>
                <li class="cod-li"><label>可用指令：</label><span>&nbsp;</span></li>
                <li class="cod-li"><label>指令驱动状态：</label><span :title="allData.drivingState">{{allData.drivingState}}</span></li>
            </ul>
        </div>
        <div class="cod">
            <div class="cod-title">添加人信息</div>
            <!-- <p class="tips">当前你的编辑权限仅可操作 <em>广东省联通分公司</em>、<em>核心网专业</em> 相应设备范围</p> -->
            <ul>
                <li class="cod-li"><label>添加人：</label><span>{{allData.creator}}</span></li>
                <li class="cod-li"><label>添加时间：</label><span>{{allData.createTime}}</span></li>
                <li class="cod-li"><label>所属分公司：</label><span>{{allData.creatorCompany}}</span></li>
                <li class="cod-li"><label>所属专业：</label><span>{{allData.creatorProfession}}</span></li>
                <li class="cod-li"><label>网元添加方式：</label><span>{{allData.addWay}}</span></li>
            </ul>
        </div>
        <div class="details-btn">
            <el-button type="primary" size="medium" @click="goback">返回上一页</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import moment from 'moment'
//登录方式
const loginTypeObj = {
        '1':'Telnet',
        '2':'SSH',
}
//网元状态
const statusObj = {
        '0':'正常',
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
//添加方式
const addWayObj = {
        '0':'网管托管',
        '1':'网元直连',
}
export default {
    data(){
        return{
            loading:false,
            allData:[],
            tableData:[]
        }
    },
    computed:{
    ...mapGetters({
        companyObj:'dict/companyObj',
        professionObj:'dict/professionObj',
        equipObj: 'dict/equipObj',
        equipComObj: 'dict/equipCompanyObj'
        }),
    },
    created(){
        this.getData()
    },
    methods:{
        //返回
        goback(){
            this.$router.go(-1)
        },
        //获取模板详情数据
        async getData(){
            this.loading = true
            this.allData = []
            this.tableData = []
            let res = await this.$http.get('/OpsDev/netEquip/getNetworkDeviceById',{
                params:{
                    id:this.$route.query.id
                }
            })
            this.loading = false
            let infoData = res.networkDevice
            if(infoData){
                infoData.equipmentCity = this.companyObj[infoData.equipmentCity]
                infoData.profession = this.professionObj[infoData.profession]
                infoData.equipmentType = this.equipObj[infoData.equipmentType]
                infoData.equipmentCompany = this.equipComObj[infoData.equipmentCompany]
                infoData.creatorCompany = this.companyObj[res.creatorCompany]
                infoData.creatorProfession = this.professionObj[res.creatorProfession]
                infoData.loginType = loginTypeObj[infoData.loginType]
                infoData.status = statusObj[infoData.status]
                infoData.drivingState = drivingState[infoData.drivingState]
                infoData.addWay = addWayObj[infoData.addWay]
                infoData.updateTime = infoData.updateTime?moment(infoData.updateTime).format('YYYY-MM-DD HH:mm:ss'):'',
                infoData.createTime = res.createTime?moment(res.createTime).format('YYYY-MM-DD HH:mm:ss'):'',
                infoData.creator = res.creator
                this.allData = infoData
            }
        },
    },

}
</script>
<style lang="stylus" scoped>
.network-detail
    padding 20px
    .title
        font-size 18px
    .cod
        margin 20px
        .cod-title
            font-size: 14px;
            margin-bottom: 20px;
            border: 1px solid #fdb93d;
            border-left: 4px solid #efb922;
            padding-left: 5px;
            display: inline-block;
            padding-right: 10px;
            background: #ffffff;
            color: #ea981e;
            border-radius: 5px;
        .tips{
            color #868686
            margin 10px 0 30px
            em{
                color #333
                font-style normal
            }
        }
        ul
            display flex
            flex-wrap wrap
            &>li.cod-li{
                display:flex;
                justify-content:flex-start;
                width:33.3%;
                align-items:center;
                margin-bottom:20px
                color: #606266;
                label{
                    text-align right
                    width 100px
                }
                span{
                    border: 1px solid #ddd;
                    display: block;
                    height: 30px;
                    line-height: 30px;
                    width: 250px;
                    padding: 0 10px;
                    background: #f6f6f6;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
    .details-btn{
        margin 20px
    }
</style>
