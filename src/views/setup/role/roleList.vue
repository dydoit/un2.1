<template>
  <div>
    <div class="btn-wapper cl">
      <router-link :to="{ path: 'role-edit', query: { pageType: 1}}" class="fl" v-permission="10040101">
        <el-button type="primary" size="small"><i class="el-icon-circle-plus el-icon--left"></i>新增</el-button>
      </router-link>
    </div>
    <div class="table-wrapper mtable">
      <el-table v-loading="loading" :data="allData.list" border size="small">
        <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
              v-permission="10040104">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleModify(scope.row)"
              v-permission="10040102">修改</el-button>
            <el-button
              size="mini"
              type="text"
              class="danger"
              @click="handleDelete(scope.row)"
              v-permission="10040103">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        allData:[],
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
      //获取列表数据
      async getData(){
        this.loading = true
        let res = await this.$http.get('/OpsDev/role/queryAllRoleList');
        this.allData = res
        this.loading = false
      },
      //查看详情
      handleDetail(item){
        this.$router.push({path:'role-edit',query:{pageType: 3, id:item.roleid}})
      },
      //编辑
      handleModify(item){
        this.$router.push({path:'role-edit',query:{pageType: 2, id:item.roleid}})
      },
      //删除
      handleDelete(item){
        this.$confirm('确认要删除？', '提示', {type: 'warning'})
          .then(() =>{
            this.$http.get('/OpsDev/role/delRole',{
              params:{
                roleid: item.roleid
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
      this.getData()
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
