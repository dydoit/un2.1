<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <div>
          <el-form-item label="用户名">
            <el-input placeholder="请填写" v-model="SearchFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input placeholder="请填写" v-model="SearchFrom.account"></el-input>
          </el-form-item>
          <el-form-item label="系统模块">
            <el-select   placeholder="请选择" v-model="SearchFrom.menuCode" style="width: 185px;">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in menuCodeData" :key="item.id" :label="item.menuName" :value="item.menuCode" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="功能名称">
            <el-select   placeholder="请选择" v-model="SearchFrom.menuName" style="width: 185px;">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in menuNameData"  :key="item.id" :label="item.menuName" :value="item.menuCode" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="开始时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="SearchFrom.startDate" format="yyyy-MM-dd " value-format="yyyy-MM-dd" style="width: 185px;"></el-date-picker>
          </el-form-item>
          <el-form-item  label="结束时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="SearchFrom.endDate" format="yyyy-MM-dd " value-format="yyyy-MM-dd" style="width: 185px;"></el-date-picker>
          </el-form-item>
          <el-button class="ep-btn" size="small" type="primary" icon="el-icon-search" @click="searchFun">查询</el-button>
        </div>
      </el-form>
    </div>
    <div class="table-wrapper mtable">
      <el-table v-loading="loading" :data="allData.list" border size="small">
        <el-table-column align="left" prop="LOG_MSG" label="操作记录"></el-table-column>
        <el-table-column align="left" prop="MENU_NAME" label="操作类型"></el-table-column>
        <el-table-column align="center" prop="IpAddress" label="ip地址" width="150"></el-table-column>
        <el-table-column align="center" prop="USER_NAME" label="操作者" width="80"></el-table-column>
        <el-table-column align="center" prop="CREATE_TIME" label="时间" width="150" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" label="操作" width="50">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="danger"
              @click="del(scope.$index,scope.row)"
              v-permission="10040302">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="page">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="SearchFrom.page"
          :page-sizes="[10, 20, 30, 40, 50]"
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
  import {mapGetters} from 'vuex'
  import { dateFormat } from '@/utiles/dateFormat.js'
  export default{
    data(){
      return{
        loading:false,
        SearchFrom:{
          page:1, //一页
          limit:10,//一页显示10条
          name:'',//姓名
          account:'',//账号
          menuCode:'',//菜单代码
          menuName:'',//菜单名称
          startDate:'',//开始时间
          endDate:'',//结束时间
          flag:'',
        },
        LogTypeData:null,//菜单代码
        menuNameData:null,//菜单名称
        menuCodeData:null,
        allData:[],
        roleNameData:[],
      }
    },
    computed:{
      ...mapGetters({
        roleMenuList: 'roleMenuList'
      }),
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
        this.SearchFrom.page = page
        this.getData();
      },
      //获取列表数据
      async getData(){
        this.loading = true;
        if(this.SearchFrom.menuCode==''){
          this.SearchFrom.flag =0;
        }else if(this.SearchFrom.menuName ==''){
          this.SearchFrom.flag =1;
        }else{
          this.SearchFrom.flag =2;
        }
        let param = JSON.stringify(this.SearchFrom)
        let config ={
          headers: {
            'Content-Type': 'application/json'
          }
        }
        let res = await this.$http.post('/OpsDev/sysLog/getSysLogList',param,config);
        this.allData = res
        this.loading = false
      },
      //获取菜单名称下拉
      async getLogTypeList(){
        let param = JSON.stringify({
          logLevel:'1',
        })
        let config ={
          headers: {
            'Content-Type': 'application/json'
          }
        }
        let res = await this.$http.post('/OpsDev/sysLog/getLogTypeList',param,config)
        this.menuCodeData = res;
      },
      //获取功能名称下拉
      async getLogTypeList2(val){
        let param = JSON.stringify({
          logLevel:2,
          parentMenuCode:val,
        })
        let config ={
          headers: {
            'Content-Type': 'application/json'
          }
        }
        let res = await this.$http.post('/OpsDev/sysLog/getLogTypeList',param,config)
        this.menuNameData = res;
      },
      //删除
      del(index,item){
        this.$confirm('确认要删除？', '提示', {type: 'warning'})
          .then(() =>{
            this.$http.get('/OpsDev/sysLog/deleteSysLogById',{
              params:{
                id:item.ID
              }
            })
              .then(res =>{
                if(res.status == 'success'){
                  this.$message.success('删除成功！');
                  this.getData();
                }else if (res.status == 'fail') {
                  this.$message.error(res.msg)
                }
              })
          })
      },
    },
    mounted(){
      this.getLogTypeList();
      this.getData();
    },
    watch:{
      'SearchFrom.menuCode'(val){
        this.SearchFrom.menuName = ''
        this.getLogTypeList2(val)
      },

    }
  }
</script>
<style lang="stylus" scoped>
  .btn-wapper{
    padding: 0 20px;
    margin: 10px 0;
  }
  .danger{
    color: #f56c6c
  }
</style>
