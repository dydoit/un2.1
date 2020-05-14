<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <el-form-item label="所属公司">
          <el-select v-model="SearchFrom.equipmentCity" :disabled="account.roleLevel!=1" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in companyArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业">
          <el-select v-model="SearchFrom.profession" :disabled="account.roleLevel!=1" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in professionList"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂商">
          <el-select v-model="SearchFrom.equipmentCompany" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in equipmentCompanyArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="SearchFrom.equipmentType" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in equipmentTypeArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input v-model="SearchFrom.instructZh"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" size="small" type="primary" @click="searchFun">查询</el-button>
      </el-form>
    </div>
    <div class="btn-wapper">
      <el-button icon="el-icon-circle-plus"
        size="small"
        type="primary"
        @click="add()"
        v-permission="10030201"
        >新增</el-button>
    </div>
    <div class="table-wrapper mtable">
      <el-table class="tablebox"
        ref="table"
        v-loading="loading"
        :data="allData.list"
        row-key="id"
        :expand-row-keys="expands"
        @row-click="clickRow"
        border
        size="small">
        <el-table-column type="expand"  width="20">
          <template slot-scope="props">
            <div class="table-child">
              <el-table :data="props.row.orderAnalysisList" :border="false" size="small">
              <el-table-column align="center" prop="analysisVersion" label="版本" width="150"></el-table-column>
              <el-table-column align="center" prop="analysisDescribe" label="说明"></el-table-column>
              <el-table-column align="center" prop="createrName" label="创建人" width="150"></el-table-column>
              <el-table-column align="center" prop="updateTime" label="最后修改时间" :formatter="dateFormat" width="160"></el-table-column>
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button size="mini"
                      type="text"
                      @click="edit(scope.row)"
                      v-permission="10030202"
                      >修改</el-button>
                  <el-button size="mini"
                      type="text"
                      @click="details(scope.row)"
                      v-permission="10030203"
                      >查看</el-button>
                  <el-button size="mini"
                      type="text"
                      class="denger"
                      @click="del(scope.row,scope.$index)"
                      v-permission="10030204"
                      >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="analysisZh" label="模板名称" width="200"></el-table-column>
        <el-table-column align="center" prop="instructCode" label="适用指令"></el-table-column>
        <el-table-column align="center" prop="analysisDescribe" label="模板功能"></el-table-column>
        <el-table-column align="center" prop="version" label="最新版本" width="120"></el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini"
                type="text"
                @click="addOthder(scope.row)"
                v-permission="10030206"
               >创建新版本</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="SearchFrom.page"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="SearchFrom.limit"
          :total="allData.total"
          @size-change="handleSizeChange"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters } from "vuex";
import {dateFormat} from '@/utiles/dateFormat.js'
  export default {
    data(){
      return{
        loading:false,
        account:'',
        SearchFrom: {
          equipmentCity:'',//	设备所属公司
          profession:'',//	专业
          equipmentCompany:'',//	设备厂商
          equipmentType:'',//	设备类型
          instructCode:'',//	指令模板代码
          instructZh:'',//	指令模板中文名称
          instructType:'',//	指令模板类型
          equipmentVersion:'',//	设备版本号
          instructDescribe:'',//	指令模板功能描述
          instructParameter:'',//	指令模板参数
          developers:'',//	开发人员
          status:'',//	是否共享
          limit:10,//	一页几条
          page:1,//	第几页
        },
        allData:[],
        expands:[],
      }
    },
    computed: {
      ...mapGetters({
        professionList: 'professionList',
        equipmentCompanyArr: 'equipmentCompanyArr',
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr',
        roleMenuList: 'roleMenuList'
      }),
    },
    created(){
        let account = sessionStorage.getItem("OpsDevInfo")
        if(account) {
            account = JSON.parse(account)
            this.account = account
            if(account.roleLevel !=1) {
                this.SearchFrom.equipmentCity = account.orgCode
                this.SearchFrom.profession = account.profession
            }
        }
        this.getData()
    },
    methods:{
      //时间格式化
      dateFormat(row, column){
        return dateFormat(row, column)
      },
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
      //创建新的
      addOthder(item){
        this.$router.push({path:'/my-instruction-temp/temp-manage', query:{pageType:'0',id:item.id}})
      },
      //新增
      add(){
        this.$router.push({path:'/my-instruction-temp/temp-manage', query:{pageType:'1'}})
      },
      //修改
      edit(item){
        this.$router.push({path:'/my-instruction-temp/temp-manage', query:{pageType:'2',id:item.id}})
      },
      //查看详情
      details(item){
        this.$router.push({path:'/my-instruction-temp/temp-details', query:{pageType:'3',id:item.id}})
      },
      //根据搜索条件进行搜索
      searchFun(){
        this.SearchFrom.page = 1
        this.getData();
      },
      //获取表格数据
      async getData(){
        this.loading = true
        let res = await this.$http.get('/OpsDev/orderAnalysis/queryOrderAnalysisForList',{
          params:this.SearchFrom
        })
        this.loading = false
        res.list.map(item =>{
          item.version = item.orderAnalysisList[0].analysisVersion
        })
        this.allData = res
        this.expands.push(this.allData.list[0].id)
      },
      //删除
      del(item,index){
        this.$confirm('确定要删除？','提示',{type: 'warning'})
          .then(() =>{
            this.$http.get('/OpsDev/orderAnalysis/delOrderAnalysis',{
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
      //点击表格行，展开
      clickRow(row, event, column){
        //this.$refs['table'].toggleRowExpansion(row)
        // if (this.expands.indexOf(row.id) < 0) {
        //     this.expands = []
        //     this.expands.push(row.id);
        // } else {
        //     this.expands.remove(row.id);
        // }
        this.expands = []
        this.expands.push(row.id);
      }
    },
  }
</script>

<style lang="stylus" scoped>
.pd20{
  padding 20px
}
.btn-wapper
  margin-bottom 10px
  display flex
  justify-content space-between
.tablebox>>>.el-table__expanded-cell[class*=cell]{
  padding 0px
}
.table-child{
  >>>.el-table th, >>>.el-table tr {
      background-color: #f7f7f9
      cursor: initial;
  }
}
>>>.el-table__row{
  &:hover{
    cursor pointer
    
  }
  &.expanded{
        background: #f1f4f9;
  }
}

</style>
