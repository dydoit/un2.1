<template>
  <div class="wrap">
    <div>
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <el-form-item label="模板名称">
          <el-input v-model="SearchFrom.taskName"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" size="small" type="primary" @click="searchFun">查询</el-button>
      </el-form>
    </div>
    <div class="btn-wapper">
      <el-button icon="el-icon-circle-plus" size="small" type="primary" @click="add" v-permission="10030303">新增</el-button>
    </div>
    <div class="table-wrapper">
      <el-table class="tablebox"
        v-loading="loading"
        ref="table"
        @row-click="clickRow"
        :data="allData.list" border size="small">
        <el-table-column type="expand"  width="20">
          <template slot-scope="props">
            <div class="table-child">
              <el-table :data="props.row.taskTemplateList" size="small">
              <el-table-column align="center" prop="taskVersion" label="版本" width="150"></el-table-column>
              <el-table-column align="center" prop="taskDescribe" label="说明"></el-table-column>
              <el-table-column align="center" prop="createrName" label="创建人"></el-table-column>
              <el-table-column align="center" prop="updateTime" label="最后修改时间" :formatter="dateFormat"></el-table-column>
              <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="edit(scope.row)" v-permission="10030307">修改</el-button>
                  <el-button size="mini" type="text" @click="details(scope.row)" v-permission="10030302">查看</el-button>
                  <el-button size="mini" type="text">共享</el-button>
                  <el-button size="mini" type="text" class="red" @click="del(scope.row)" v-permission="10030305">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="taskName" label="模板名称" width="200"></el-table-column>
        <el-table-column align="center" prop="taskDescribe" label="模板功能"></el-table-column>
        <el-table-column align="center" prop="version" label="最新版本" width="120"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="addOthder(scope.row)" v-permission="10030304">创建新版本</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination small background @current-change="changePage" layout="total,prev, pager, next" prev-text="< 上一页"
                      next-text="下一页 >" :page-size="SearchFrom.limit" :current-page="SearchFrom.page"
                      :total="allData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {dateFormat} from '@/utiles/dateFormat.js'
  export default {
    data(){
      return{
        loading:false,
        SearchFrom: {
          taskName:'',
          limit:20,//	一页几条
          page:1,//	第几页
        },
        allData:[],
      }
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
      // 改变页数
      changePage(page) {
        this.SearchFrom.page = page;
        this.getData();
      },
      //当前模板创建新的版本
      addOthder(item){
        this.$router.push({path:'/my-task-temp/temp-manage', query:{pageType:'0',id:item.id}})
      },
      //新增
      add(){
        this.$router.push({path:'/my-task-temp/temp-manage', query:{pageType:'1'}})
      },
      //修改
      edit(item){
        this.$router.push({path:'/my-task-temp/temp-manage', query:{pageType:'2',id:item.id}})
      },
      //查看详情
      details(item){
        this.$router.push({path:'/my-task-temp/temp-manage', query:{pageType:'3',id:item.id}})
      },
      //删除
      del(item){
        this.$confirm('确定要删除？','提示',{type: 'warning'})
          .then(() =>{
            this.$http.get('/OpsDev/taskTemplate/delTaskTemplate',{
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
      searchFun(){
        this.SearchFrom.page = 1
        this.getData();
      },
      //获取表格数据
      async getData(){
        let res = await this.$http.get('/OpsDev/taskTemplate/queryTaskTemplate',{
          params:this.SearchFrom
        })
        res.list.map(item =>{
          item.version = item.taskTemplateList[0].taskVersion
        })
        this.allData = res
      },
       //点击表格行，展开
      clickRow(row){
        this.$refs['table'].toggleRowExpansion(row)
      }

    },
    mounted(){
      this.getData();
    },
  }
</script>

<style lang="stylus" scoped>
.btn-wapper
  margin-bottom 10px
  display flex
  justify-content space-between
.tablebox>>>.el-table__expanded-cell[class*=cell]{
  padding 0px
}
.table-child{
  >>>.el-table th, >>>.el-table tr {
      background-color: #f8f8f8;
  }
}
.red{
    color red
}
.green{
    color green
}
</style>
