<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="addFormUser" width="50%"
               :close-on-click-modal="false"
               :show-close="false">
      <el-form :inline="true"  :model="SearchFrom" size="small" label-width="100px">
          <el-form-item label="姓名：">
            <el-input placeholder="请填写姓名" v-model="SearchFrom.name" ></el-input>
          </el-form-item>
          <el-form-item label="OA账号：">
            <el-input  placeholder="请填写OA账号" v-model="SearchFrom.oa" ></el-input>
          </el-form-item>
          <el-form-item label="员工编号：">
            <el-input  placeholder="请填写员工编号" v-model="SearchFrom.employeeid" ></el-input>
          </el-form-item>
          <el-form-item label="分公司：">
            <el-select placeholder="请选择" v-model="SearchFrom.unicomCompany" style="width:185px">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in PlaceListData"
                         :key="item.id"
                         :label="item.unicomCompany"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button class="ep-btn" size="small" type="primary" @click="searchFun">查询</el-button>
          </el-form-item>
      </el-form>
      <template>
        <el-table v-loading="loading"
                  ref="multipleTable"
                  :data="allData.list"
                  size="small"
                  stripe
                  highlight-current-row
                  @selection-change="handleSelectionChange"
                  style="width: 100%"  >
          <el-table-column type="selection" align="center" width="45"></el-table-column>
          <el-table-column prop="name" label="姓名"  align="center"  width="80">
          </el-table-column>
          <el-table-column prop="oa" label="OA账号" align="center">
          </el-table-column>
          <el-table-column prop="place" label="所属分公司" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            @current-change="changePage"
            @prev-click="changePage"
            @next-click="changePage"
            layout="total,prev, pager, next"
            prev-text="< 上一页"
            next-text="下一页 >"
            :page-size="SearchFrom.limit"
            :total="allData.total"
            size="small">
          </el-pagination>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button  size="small" @click="addFormUser = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="adduser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        addFormUser:false,
        SearchFrom: {
          page:1,
          limit:10,
          name:'',
          oa:'',
          employeeid:'',
          unicomCompany:'',
        },
        allData:[],
        loading:false,
        PlaceListData:[],//分公司列表
      }
    },
    methods:{
      //获取分公司
      async getqueryPlaceList(){
        let res = await this.$http.get('/OpsDev/role/queryPlaceList')
        this.PlaceListData = res
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
      //获取列表数据
      async getData(){
        this.loading = true
        let res = await this.$http.get('/OpsDev/role/queryAccountList', {
          params:this.SearchFrom
        });
        this.allData = res
        this.loading = false
      },
      //子组件传给父组件
      adduser(){
        this.$emit('parentVal', this.currentRow)
        this.addFormUser = false;
      },
      //把筛选的结果
      handleSelectionChange(val) {
        this.currentRow = val;
        if(val.length>1){
          this.toggleSelectionPreset(this.currentRow[0]);
        }
      },
      toggleSelectionPreset(rows){
        if (rows) {
          this.$refs.multipleTable.toggleRowSelection(rows);
        }
      },
    },
    mounted(){
      this.getqueryPlaceList();
      this.getData();
    }
  }
</script>
<style lang="stylus" scoped>
  >>>.el-dialog__body{
    padding 10px 20px
  }
</style>
