<template>
  <div class="instruction wrap">
    <el-form :inline="true" :model="queryData" size="small" label-width="6em">
      <el-form-item label="厂家:" >
          <el-select v-model="queryData.equipmentCompany">
            <el-option v-for="item of equipmentCompanyArr" :key="item.dictValue" :label="item.dictNameZh" :value="item.dictValue"></el-option>
          </el-select>

      </el-form-item>
      <el-form-item label="设备类型:">
          <el-select v-model="queryData.equipmentType">
            <el-option v-for="item of equipmentTypeArr" :key="item.dictValue" :label="item.dictNameZh" :value="item.dictValue"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="软件版本:">
          <el-select v-model="queryData.equipmentVersion">
            <el-option v-for="(item, index) of venderList" :key="index" :label="item.version" :value="item.version"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="设备名称:">
        <el-input v-model="queryData.instructZh" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="指令代码:">
        <el-input v-model="queryData.instructCode" placeholder="请输入指令代码"></el-input>
      </el-form-item>
      <el-button class="btn-search" icon="el-icon-search" size="small" type="primary" @click="getData(1)">搜索</el-button>
    </el-form>
    <p class="add-p-wrapper">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="$router.push('/my-instruction/instruct-manage')" v-permission="10030101">新增指令</el-button>
    </p>
    <div class="content">
      <div v-show="!tableData.length" class="no-data">
        暂无数据
      </div>
      <div class="item" v-for="(item, index) of tableData" :key="index" @click="goDetail(item)">
        <dl>
          <dt>{{item.instructZh}}</dt>
          <dd>{{item.instructDescribe}}</dd>
          <dd>
            <span>设备类型：{{item.equipmentType}}</span>
            <span>厂家：{{item.equipComp}}</span>
            <span>软件版本：{{item.equipmentVersion}}</span>
          </dd>
        </dl>
        <div class="btn-group">
          <el-button size="small" type="text" @click.stop="goEdit(item.id)" v-permission="10030102">编辑</el-button>
          <el-button size="small" type="text" @click.stop="del(item.id,index)" v-permission="10030104">删除</el-button>
        </div>
      </div>
       <!-- 分页 -->
      <div class="pagination-wrapper" v-if="tableData.length">
        <el-pagination
          layout="total,sizes, prev, pager, next, jumper"
          background
          :page-sizes="[6, 10, 14, 18]"
          :page-size="queryData.limit"
          :total="total"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters } from "vuex";
  export default {
    name:'instructList',
    data() {
      return {
        venderList: [],
        currentPage: 1,
        total: 0,
        queryData: {
          equipmentCompany: '',       // 厂家
          equipmentType: '',      // 设备类型
          equipmentVersion: '', // 软件版本
          instructZh: '', // 设备名称
          instructCode: '', // 指令代码
          limit: 6
        },
        tableData:[{

        }]
      }
    },
    created() {
      this.getData()
    },
    computed: {
      ...mapGetters({
        professionList: 'professionList',
        equipmentCompanyArr: 'equipmentCompanyArr',
        instructTypeArr: 'instructTypeArr',
        equipmentTypeArr: 'equipmentTypeArr',
        companyArr: 'companyArr',
        equipObj: 'dict/equipObj',
        equipComObj: 'dict/equipCompanyObj',
        roleMenuList: 'roleMenuList'
      })
    },
    watch: {
      'queryData.equipmentCompany'() {
        this.getVersion()
      },
      'queryData.equipmentType'() {
        this.getVersion()
      }
    },
    methods: {
      async getData(page=this.currentPage) {
        let listData = await this.$http.get('/OpsDev/order/queryOrderForList', {
          params: {
            ...this.queryData,
            page
          }
        })
        this.total = listData.total
        this.tableData = listData.list.map(item => {
          return {
            id: item.id,
            instructZh: item.instructZh,
            instructDescribe: item.instructDescribe,
            equipmentType: this.equipObj[item.equipmentType],
            equipComp: this.equipComObj[item.equipmentCompany],
            equipmentVersion: item.equipmentVersion
          }
        })
      },
      async getVersion() {
        this.queryData.equipmentVersion = ''
        let list = await this.$http.get('/OpsDev/dicts/getVersionByDict', {
          params: {
            company:this.queryData.equipmentCompany,
            netType:this.queryData.equipmentType
          }
        })
        this.venderList = list
      },
      del(id,index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=> {
          let res = await this.$http.get('/OpsDev/order/delOrder', {
            params: {id}
          })
          if(res.status == 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData()
          } else if(res.status == 'fail') {
            this.$message.error(`${res.msg},删除失败`)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      goDetail({id}) {
          this.$router.push({path: '/my-instruction/detail', query: {
            id
          }})
      },
      goEdit(id) {
        this.$router.push({
          path: '/home/my-instruction/instruct-manage',
          query: {id}
        })
      },
      handleSizeChange(val){
        this.queryData.limit = val
        this.getData()
      },
      handleCurrentChange(val){
        this.getData(val)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .add-p-wrapper
    margin-bottom 30px
  .el-form--inline .el-form-item
    margin-right 40px
  .el-form-item >>> .el-form-item__content
    width 199px
  .btn-search
    margin-left 15px
  .no-data
    line-height 2
    color #ccc
    text-align center
  .item
    display flex
    align-items center
    min-height 90px
    padding 5px 10px
    border-bottom 1px solid #ddd
    cursor pointer
    &:hover
      background #f5f5f5
    dl
      flex 1
      line-height 1.8
      dt
        font-size 14px
        color #000
      dd
        font-size 12px
        color #666
        span
          margin-right 14px
    .btn-group
      width 200px
 .pagination-wrapper
    display flex
    flex-direction row-reverse
    margin 20px
</style>
