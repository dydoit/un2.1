<template>
  <div class="script-wrapper">
    <el-form :inline="true" :model="searchData" ref="searchFrom" label-width="100px" size="small">
      <el-form-item label="所属公司">
        <el-select v-model="searchData.equipmentCity" :disabled="account.roleLevel!=1" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in companyArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="所属专业">
          <el-select v-model="searchData.profession" :disabled="account.roleLevel!=1" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in professionList"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂商">
          <el-select v-model="searchData.equipmentCompany" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in equipmentCompanyArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="searchData.equipmentType" style="width: 180px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in equipmentTypeArr"
                :key="index"
                :label="item.dictNameZh"
                :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="脚本名称">
          <el-input v-model="searchData.instructZh"></el-input>
        </el-form-item>
        <el-button icon="el-icon-search" size="small" type="primary" @click="getData">搜索</el-button>
    </el-form>
     <div class="btn-wrapper">
      <div class="btn-left-wrapper">
        <el-button size="mini"  v-permission="10030407">启动</el-button>
        <el-button size="mini"  v-permission="10030406">禁用</el-button>
        <el-button size="mini" icon="el-icon-circle-plus-outline" @click="$router.push('/home/my-data-script/add')" type="primary" v-permission="10030401">新增</el-button>
      </div>
    </div>
    <ul class="list-wrapper">
      <li v-for="item of list" :key="item.id">
        <div class="content">
          <div>
            <strong>{{item.parserZh}}</strong>
            <span>版本：{{item.parserVersion}}</span>
          </div>
          <p>
            指令预览：{{item.instructCode}}
          </p>
        </div>
        <div class="btn-group">
          <el-button type="text" size="mini" @click="goDetail(item.id)">查看</el-button>
          <el-button type="text" size="mini" @click="goModify(item.id)">修改</el-button>
          <el-button type="text" size="mini" @click="del(item.id)">删除</el-button>
        </div>
      </li>
    </ul>
      <!-- 分页 -->
    <div class="pagination-wrapper" v-if="list.length">
        <el-pagination
          layout="total,sizes, prev, pager, next, jumper"
          background
          :page-sizes="[6, 10, 14, 18]"
          :page-size="limit"
          :total="total"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
  </div>
</template>

<script>
import {mapGetters } from "vuex";
  export default {
    data() {
      return {
        limit:6,
        currentPage:1,
        searchData: {
          equipmentCity:null,
          profession:null,
          equipmentCompany: null,
          equipmentType: null,
          instructZh: null, //脚本名称
        },
        list: []
      }
    },
    created(){
        let account = sessionStorage.getItem("OpsDevInfo")
        if(account) {
            account = JSON.parse(account)
            this.account = account
            if(account.roleLevel !=1) {
                this.searchData.equipmentCity = account.orgCode
                this.searchData.profession = account.profession
            }
        }
        this.getData()
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
    methods: {
      async getData() {
        let res = await this.$http.get('/OpsDev/orderDataParser/queryOrderDataParserForList', {
          params:{
            ...this.searchData,
            limit: this.limit,
            page: this.currentPage
          }
        })
        let {list} =res
        if(list&&list.length) {
          this.total = res.total
          this.list = list
        }
      },
      handleSizeChange(val){
        this.limit = val
        this.getData()
      },
      handleCurrentChange(val){
        this.currentPage = val
        this.getData()
      },
      goModify(id) {
        this.$router.push({path:'/home/my-data-script/modify', query: {parseId: id}})
      },
      goDetail(id) {
        this.$router.push({path:'/home/my-data-script/detail', query: {parseId: id}})
      },
      async del(id) {
        let res = await this.$http.get('/OpsDev/orderDataParser/delOrderDataParser', {
          params: {id}
        })
        if(res.status == 'success') {
          this.$message.success('删除成功')
          this.currentPage = 1
          this.getData()
        } else {
          this.$message.error(`${res.msg}`)
        }
      }
    },
  }
</script>

<style lang="stylus" scoped>
.script-wrapper
  padding 0 30px
.el-form
  margin 16px 0
.list-wrapper
  li
    display flex
    align-items center
    justify-content space-between
    height 78px
    border-bottom 1px solid #ddd
    .content
      flex 1
      margin-right 90px
      div
        display flex
        justify-content space-between
        span
          width 20%
          font-size 12px
        strong
          flex 1
          color #409EFF
      p
        color #bbb
.pagination-wrapper
  padding 20px 0
  text-align right
</style>
