<template>
  <el-dialog title="请模型仓库中选择"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    top="10vh"
     width="80%">
      <div class="left">
        <el-input size="small" prefix-icon="el-icon-search" placeholder="请输入模型名称" v-model="name"></el-input>
        <ul class="search-content" v-if="modelList.length">
          <li v-for="item of modelList" :key="item.id" @click="handleSelect(item.orderAnalysisOutputModelDetailsList)">
            <span class="model-name">{{item.modelName}}</span>
            <span>{{item.createrName?item.createrName:'张三'}}</span>
            <span>{{item.createTime}}</span>
            <i class="el-icon-delete"></i>
          </li>
        </ul>
        <el-pagination
          small
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          v-show="modelList.length"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <div class="right">
        <table>
          <thead>
            <tr>
              <td>出参名称</td>
              <td>参数类型</td>
              <td>描述</td>
            </tr>
          </thead>
          <tbody
              v-if="!params.length"
              class="no-param"
            >
              <tr>
                <td colspan="3">暂无参数</td>
              </tr>

          </tbody>
          <tbody v-else>
            <tr
              v-for="(item,index) of params"
              :key="index"
            >
               <td>
                  <div
                    v-text="item.parameterCode"
                  >
                  </div>
                </td>
                <td class="is-required">
                  <select v-model="item.parameterType" disabled>
                    <option value="0">String</option>
                    <option value="1">List</option>
                    <option value="2">Map</option>
                  </select>
                </td>
                <td class="intro">
                  <div
                    v-html="item.parameterDescribe"
                  >
                  </div>
                </td>
            </tr>
          </tbody>
        </table>

        <div class="btn-group">
          <el-button>返回</el-button>
          <el-button type="primary">使用该模型</el-button>
        </div>
      </div>
  </el-dialog>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  export default {
    data() {
      return {
        dialogVisible: true,
        name: '' , //模型名称
        modelList: [],
        currentPage: 1,
        pageSize:5,
        total: 0,
        params: []
      }
    },
    created(){
      this.debouncedGetName = _.debounce(this.getName, 500)
    },
    watch: {
      name(newName, oldName) {
        this.debouncedGetName(newName)
      }
    },
    methods: {
      async getName() {
        let res = await this.$http.get('/OpsDev/orderAnalysisOutputModel/getAnalysisModelListByName', {
          params: {
            name:this.name,
            page: this.currentPage,
            limit: this.pageSize
         }
        })
        let {list,total} = res
        this.total = total
        this.modelList = list.map(item => {
          return {
            ...item,
            createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm')
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getName()
      },
      handleSelect(params) {
        this.params = params
      }
    }
  }
</script>

<style lang="stylus" scoped>

.el-dialog__wrapper >>>  .el-dialog
    display flex
    flex-direction column
    height 560px
    .el-dialog__body
      display flex
      flex 1
      padding 10px 20px
      .left
        width 400px
        height 100%
        display flex
        flex-direction column
        .search-content
          flex 1
          margin-top 4px
          border 1px solid #eee
          border-radius 6px
          .no-data
            text-align center
          li
            display flex
            justify-content space-between
            align-items center
            padding 0 6px
            height 35px
            border-bottom 1px solid #ccc
            cursor pointer
            .model-name
              width 100px
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            &:hover
              background #1989fa
              color #fff
      .right
        flex 1
        display flex
        flex-direction column
        justify-content space-between
        margin-left 30px
        text-align center
        .btn-group
          .el-button
            margin-left 50px
.el-pagination
  text-align center
table
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;
  thead
    background-color: #ddd;
    td
      padding: 6px 0;
  .no-param
    td
      padding: 6px 0;
  td
    padding: 2px 4px;
    border: 1px solid #ccc;

    &.is-required
      width: 9%;
    &.intro
      width: 50%;
      text-align: left;
</style>
