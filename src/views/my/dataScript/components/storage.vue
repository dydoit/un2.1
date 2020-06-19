<template>
  <el-dialog
    title="请模型仓库中选择"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    top="10vh"
    width="80%"
  >
    <div class="left">
      <el-input
        size="small"
        prefix-icon="el-icon-search"
        placeholder="请输入模型名称"
        v-model="name"
      ></el-input>
      <ul
        class="search-content"
        v-if="modelList.length"
      >
        <li
          :class="[item.id==selectedId?'selected':'']"
          v-for="(item, index) in modelList"
          :key="item.id"
          @click="handleSelect(item)"
        >
          <span class="model-name">{{item.modelName}}</span>
          <span>{{item.createrName?item.createrName:'张三'}}</span>
          <span>{{item.createTime}}</span>
          <i
            class="el-icon-delete"
            @click.stop="del(item.id,index)"
          ></i>
        </li>
      </ul>
      <el-pagination
        small
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        v-show="modelList.length"
        layout="prev, pager, next"
        :total="total"
      >
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
              <div v-text="item.parameterCode">
              </div>
            </td>
            <td class="is-required">
              <select
                v-model="item.parameterType"
                disabled
              >
                <option value="0">String</option>
                <option value="1">List</option>
                <option value="2">Map</option>
              </select>
            </td>
            <td class="intro">
              <div v-html="item.parameterDescribe">
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="btn-group">
        <el-button @click="dialogVisible=false">返回</el-button>
        <el-button
          type="primary"
          @click="used"
        >使用该模型</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import moment from "moment";
export default {
  data() {
    return {
      dialogVisible: false,
      name: "", //模型名称
      modelList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      params: [],
      selectedId: ""
    };
  },
  created() {
    this.debouncedGetName = _.debounce(this.getName, 500);
  },
  watch: {
    name(newName, oldName) {
      this.debouncedGetName(newName);
    }
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    async getName() {
      let res = await this.$http.get(
        "/OpsDev/orderDataParserOutputModel/getDataParserModelListByName",
        {
          params: {
            name: this.name,
            page: this.currentPage,
            limit: this.pageSize
          }
        }
      );
      console.log(res)
      let { list, total } = res;
      console.log(list)
      this.total = total;
      this.modelList =
        list &&
        list.map(item => {
          return {
            ...item,
            createTime: moment(item.createTime).format("YYYY-MM-DD HH:mm")
          };
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getName();
    },
    handleSelect({ orderDataParserOutputModelDetailsList, id }) {
      this.params = orderDataParserOutputModelDetailsList.map(item => {
        return {
          parameterCode: item.parameterCode,
          parameterType: item.parameterType,
          parameterDescribe: item.parameterDescribe
        };
      });
      this.selectedId = id;
    },
    used() {
      this.$emit("used", this.params);
      this.dialogVisible = false;
    },
    del(id,i) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.get(
            "/OpsDev/orderDataParserOutputModel/delOrderDataParserOutputMode",
            {
              params: { id }
            }
          );
          if(res.status=='success') {
            this.modelList.splice(i,1)
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-dialog__wrapper >>> .el-dialog {
  display: flex;
  flex-direction: column;
  height: 560px;

  .el-dialog__body {
    display: flex;
    flex: 1;
    padding: 10px 20px;

    .left {
      width: 400px;
      height: 100%;
      display: flex;
      flex-direction: column;

      .search-content {
        flex: 1;
        margin-top: 4px;
        border: 1px solid #eee;
        border-radius: 6px;

        .no-data {
          text-align: center;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 6px;
          height: 35px;
          border-bottom: 1px solid #ccc;
          cursor: pointer;

          .model-name {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &:hover, &.selected {
            background: #1989fa;
            color: #fff;
          }
        }
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 30px;
      text-align: center;

      .btn-group {
        .el-button {
          margin-left: 50px;
        }
      }
    }
  }
}

.el-pagination {
  text-align: center;
}

table {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;

  thead {
    background-color: #ddd;

    td {
      padding: 6px 0;
    }
  }

  .no-param {
    td {
      padding: 6px 0;
    }
  }

  td {
    padding: 2px 4px;
    border: 1px solid #ccc;

    &.is-required {
      width: 9%;
    }

    &.intro {
      width: 50%;
      text-align: left;
    }
  }
}
</style>
