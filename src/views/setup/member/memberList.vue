<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <div>
          <el-form-item label="姓名：">
            <el-input placeholder="请填写姓名" v-model="SearchFrom.name" ></el-input>
          </el-form-item>
          <el-form-item label="账号：">
            <el-input  placeholder="请填写OA账号" v-model="SearchFrom.oa" ></el-input>
          </el-form-item>
          <el-form-item label="员工编号：">
            <el-input  placeholder="请填写用户编号" v-model="SearchFrom.employeeid"></el-input>
          </el-form-item>
          <el-form-item label="所属分公司：">
            <el-select   placeholder="请选择"  v-model="SearchFrom.unicomCompany" style="width: 185px">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in companyArr" :key="index"
                        :label="item.dictNameZh"
                        :value="item.dictValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：" >
            <el-select   placeholder="请选择" v-model="SearchFrom.profession"   style="width: 185px;">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in professionList" :key="index"
                        :label="item.dictNameZh"
                        :value="item.dictValue"></el-option>
            </el-select>
          </el-form-item>
          <el-button  class="ep-btn"
                      size="small"
                      type="primary"
                      icon="el-icon-search"
                      @click="searchFun">查询</el-button>
        </div>
      </el-form>
    </div>
    <div class="btn-wapper cl">
      <router-link :to="{ path: 'member-edit', query: { pageType: 1}}" class="fl" v-permission="10040201">
        <el-button type="primary" size="small"><i class="el-icon-circle-plus el-icon--left"></i>新增</el-button>
      </router-link>
    </div>
    <div class="table-wrapper mtable">
      <el-table v-loading="loading" :data="allData.list" border size="small">
        <el-table-column align="center" prop="oa" label="OA账号"></el-table-column>
        <el-table-column align="center" prop="name" label="用户名"></el-table-column>
        <el-table-column align="center" prop="place" label="所属分公司"></el-table-column>
        <el-table-column align="center" prop="profession" label="专业" :formatter="filterProfessionDict"></el-table-column>
        <el-table-column align="center" prop="roleName" label="角色"></el-table-column>
        <el-table-column align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
              v-permission="10040204">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleModify(scope.row)"
              v-permission="10040201">修改</el-button>
            <el-button
              size="mini"
              type="text"
              class="danger"
              @click="handleDelete(scope.$index,scope.row)"
              v-permission="10040202">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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
import {mapGetters} from 'vuex'
  export default{
    data(){
      return{
        loading:false,
        SearchFrom:{
          page:1,
          limit:10,
          name:'',
          oa:'',
          employeeid:'',
          unicomCompany:'',
          profession:'',
        },
        allData:[],
        roleNameData:[],
      }
    },
    computed:{
      ...mapGetters({
        professionList: 'professionList',
        equipmentCompanyArr: 'equipmentCompanyArr',
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr',
        roleMenuList: 'roleMenuList'
      }),
    },
    methods:{
      //所属专业匹配字典字段值
      filterProfessionDict(row, column) {
        if (row.profession != null && this.professionList) {
          for (let i = 0; i < this.professionList.length; i++) {
            if (row.profession == this.professionList[i].dictValue) {
              return this.professionList[i].dictNameZh;
            }
          }
        } else {
          return ''
        }
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
      //获取列表数据
      async getData(){
        this.loading = true
        let res = await this.$http.get('/OpsDev/role/queryUserRole', {
          params:this.SearchFrom
        });
        this.allData = res
        this.loading = false
      },
      //查看详情
      handleDetail(item){
        this.$router.push({path:'member-edit',query:{pageType: 3, oa:item.oa}})
      },
      //编辑
      handleModify(item){
        this.$router.push({path:'member-edit',query:{pageType: 2, oa:item.oa}})
      },
      //删除
      async handleDelete(index,item){
        this.$confirm('确定要删除？','提示',{type: 'warning'})
          .then(() =>{
            this.$http.get('/OpsDev/role/delUserRole',{
              params: {
                oa:item.oa,
                roleid:item.roleid
              }
            })
              .then(res =>{
                if(res.status == 'success'){
                  this.$message.success('删除成功！')
                  this.allData.list.splice(index,1)
                  //下面判断删除到最后一页数据为零条，定位到前一页
                  this.allData.total = this.allData.total - 1
                  if (this.allData.total % 20 == 0 && this.allData.total > 0) {
                    this.SearchFrom.page = this.allData.pageNum;
                  }
                }else if(res.status == 'fail'){
                  this.$message.error(res.msg)
                }
              })
          })
      },
    },
    mounted(){
      this.getData();
    }
  }
</script>
<style lang="stylus" scoped>
  .btn-wapper{
    padding: 0 20px;
    margin: 10px 0;
  }
  .danger{
    color #f56c6c
  }
</style>
