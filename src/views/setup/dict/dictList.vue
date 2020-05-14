<template>
  <div>
    <div class="toolbar">
      <el-form :inline="true" :model="SearchFrom" ref="SearchFrom" label-width="100px" size="small">
        <el-form-item label="字典编码">
          <el-input placeholder="请填写字典编码" v-model="SearchFrom.dictValue"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input placeholder="请填写名称" v-model="SearchFrom.dictName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="SearchFrom.status">
            <el-option label="全部" value></el-option>
            <el-option label="状态1" value="1"></el-option>
            <el-option label="状态2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-button icon="el-icon-search" size="small" type="primary" @click="searchFun">查询</el-button>
      </el-form>
    </div>
    <div class="btn-wapper">
      <el-button icon="el-icon-circle-plus" size="small" type="primary" @click="add">新增</el-button>
    </div>
    <div class="table-wrapper  mtable">
      <el-table v-loading="loading" :data="allData.list" border size="small">
        <el-table-column align="center" prop="dictValue" label="字典编码"></el-table-column>
        <el-table-column align="center" prop="dictName" label="名称"></el-table-column>
        <el-table-column align="center" prop="dicttext" label="说明"></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="info(scope.row)">详情</el-button>
              <el-button
                size="mini"
                type="text"
                @click="edit(scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="text"
                class="danger"
                @click="del(scope.$index,scope.row)">删除</el-button>
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
export default {
  data() {
    return {
        loading:false,
        SearchFrom: {
            dictValue: "",
            dictName: "",
            status: ""
        },
        allData:[
            {
            dictValue:'ddddd',
            dictName:'ddddd',
            dicttext:'ddddd'
            }
        ]
    };
  },
  methods: {
    searchFun() {},
    //add
    add(){
      this.$router.push({path:'/dict-set/dict-edit',query:{pageType:1}})
    },
    edit(item){
      this.$router.push({path:'/dict-set/dict-edit',query:{pageType:2,id:item.id}})
    },
    info(item){
      this.$router.push({path:'/dict-set/dict-edit',query:{pageType:3,id:item.id}})
    },
    del(){},
    //获取列表数据
    async getData(){
      this.loading = true
      let res = await this.$http.get('/OpsDev/dicts/queryDicts', {
        params:this.SearchFrom
      });
      this.allData = res
      this.loading = false
    },
    //查询
    searchFun(){
      this.SearchFrom.page = 1 ;
      this.getData();
    },
    // 改变页数
    changePage(page) {
      this.SearchFrom.page = page;
      this.getData();
    },

  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="stylus" scoped>
.toolbar
  padding 20px
.btn-wapper
  padding 0 20px
  margin-bottom 10px
  display flex
  justify-content space-between
.table-wrapper
  padding 0 20px
</style>
