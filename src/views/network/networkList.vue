<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <el-form-item label="所属公司" >
          <el-select v-model="SearchFrom.equipmentCity" :disabled="account.roleLevel!=1" style="width: 180px">
            <el-option label="全部" value></el-option>
            <el-option v-for="(item,index) in companyArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业">
          <el-select v-model="SearchFrom.profession" :disabled="account.roleLevel!=1" style="width: 180px">
            <el-option label="全部" value></el-option>
            <el-option v-for="(item,index) in professionList"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属设备">
          <el-select v-model="SearchFrom.addWay" style="width: 180px">
            <el-option label="全部" value></el-option>
            <el-option label="网管" value="0"></el-option>
            <el-option label="网元" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" v-if="SearchFrom.addWay=='1'">
          <el-select v-model="SearchFrom.equipmentType" style="width: 180px">
            <el-option label="全部" value></el-option>
            <el-option v-for="(item,index) in equipmentTypeArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="SearchFrom.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="SearchFrom.ip"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" size="small" type="primary" @click="searchFun">查询</el-button>
      </el-form>
    </div>
    <div class="btn-wapper">
      <div class="btn-left">
        <el-button size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="add"
        v-permission="10010101" plain>新增</el-button>
        <el-button size="small" @click="$router.push('/home/network/err-list')">我的报错</el-button>
        <!-- <el-button size="small" type="primary" plain icon="el-icon-upload" @click="showUploadbox">导入</el-button>
        <el-button size="small" type="primary" plain icon="el-icon-download">模板下载</el-button> -->
      </div>
    </div>
    <div class="table-wrapper mtable">
      <el-table
        v-loading="loading"
        ref="table"
        :data="allData"
        border
        size="small">
        <el-table-column align="center" prop="equipmentCity" label="所属分公司" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="profession" label="所属专业" width="100"></el-table-column>
        <el-table-column align="center" label="所属设备" width="80">
          <template slot-scope="scope">
            {{scope.row.addWay == 0?'网管':'网元'}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="equipmentType" label="设备类型" width="100"></el-table-column>
        <el-table-column align="center" prop="equipmentName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="ip" label="IP地址"  width="130"></el-table-column>
        <el-table-column align="center" prop="currentVersion" label="版本号"></el-table-column>
        <el-table-column align="center" label="网元状态" width="110">
          <template slot-scope="scope">
            <span :class="[{'green':scope.row.status== '正常'},{'red':scope.row.status=='连接失败'}]">
            {{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="指令驱动状态"  width="110">
          <template slot-scope="scope">
            <el-tag :type="scope.row.typeColor" size="small">
            {{scope.row.drivingState}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="details(scope.row)"
              v-permission="10010108">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="edit(scope.row)"
              v-permission="10010104">修改</el-button>
            <el-button
              size="mini"
              type="text"
              class="danger"
              @click="goError(scope.row)" v-if="scope.row.addWay != 0">报错</el-button>
            <el-button
              size="mini"
              type="text"
              class="danger"
              @click="del(scope.row)"
              v-permission="10010106">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-if="allData.length">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="SearchFrom.page"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="SearchFrom.limit"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
    <uploadbox ref="upload"></uploadbox>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import uploadbox from './components/upload'
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
const typeColor = {
        '0':'success',
        '1':'info',
        '2':'danger',
        '3':'warning',
}
export default {
  data() {
    return {
        loading:false,
        account:'',
        SearchFrom: {
            equipmentCity:'', //设备所属分公司
            profession:'', //所属专业
            equipmentType:'', //设备类型
            equipmentName:'', //设备名称
            addWay:'',//所属设备
            ip:'', //IP地址
            status:'', //网元状态
            drivingState:'', //驱动状态
            limit:10,//	一页几条
            page:1,//	第几页
        },
        allData:[],
        total:0,
        equipmentCityDict:[],
        professionDict:[],
        equipmentTypeDict:[]
    };
  },
  components:{
    uploadbox,
  },
  created() {
    let account = sessionStorage.getItem("OpsDevInfo")
    if(account) {
      this.account = JSON.parse(account)
      if(this.account.roleLevel !=1) {
        this.SearchFrom.equipmentCity = this.account.orgCode
        this.SearchFrom.profession = this.account.profession
      }
    }
    this.getData();
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
      equipComObj: 'dict/equipCompanyObj',
      roleMenuList: 'roleMenuList'
    }),
  },
  methods: {
    //查询
    searchFun(){
      this.SearchFrom.page = 1
      this.getData();
    },
    handleSizeChange(val){
      this.SearchFrom.limit = val
      this.getData()
    },
    // 改变页数
    changePage(page) {
      this.SearchFrom.page = page;
      this.getData();
    },
    //获取表格数据
    async getData(){
      this.loading = true
      let res = await this.$http.get('/OpsDev/netEquip/queryNetworkDevice',{
        params:this.SearchFrom
      })
      this.loading = false
      this.total = res.total
      let arr= []
      res.list.map(item =>{
        item.profession = this.professionObj[item.profession]
        item.equipmentType =item.equipmentType!=''?this.equipObj[item.equipmentType]:'无类型',
        item.equipmentCity = this.companyObj[item.equipmentCity]
        item.status = statusObj[item.status]
        item.typeColor = typeColor[item.drivingState]
        item.drivingState = drivingState[item.drivingState]
        item.currentVersion = item.currentVersion?item.currentVersion:'无版本号'
        arr.push(item)
      })
      this.allData = arr

    },
    //新增
    add(){
      this.$router.push({path:'/home/network/networkAdd', query:{pageType:1}})
    },
    //编辑
    edit(item){
      this.$router.push({path:'/home/network/networkAdd',query:{pageType:2,id:item.id}})
    },
    goError(item){
      this.$router.push({path:'/home/network/networkError',query:{id:item.id}})
    },
    //详情
    details(item){
      this.$router.push({path:'/home/network/networkDetail',query:{id:item.id}})
    },
    //删除
    del(item){
      this.$confirm('确定要删除？','提示',{type: 'warning'})
        .then(() =>{
          this.$http.get('/OpsDev/netEquip/delNetworkDevice',{
            params:{
              id:item.id
            }
          }).then(res =>{
            if(res.status=='success'){
              this.$message.success('删除成功')
              this.getData();
            }else if(res.status=='fail'){
              this.$message.error(res.msg)
            }
          })
        })
    },
    //上传
    showUploadbox(){
      this.$refs.upload.uploadbox = true
    },

  },
  watch:{
    'SearchFrom.addWay'(val){
      if(val!='1'){
        this.SearchFrom.equipmentType = ''
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.btn-wapper{
  margin-bottom 10px
  display flex
  justify-content space-between
}
.tablebox>>>.el-table__expanded-cell[class*=cell]{
  padding 0px
}
.btn-left{
  display flex
  justify-content flex-start
}
.danger{
  color #f56c6c
}
</style>
