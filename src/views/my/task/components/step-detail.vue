<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    title="修改步骤"
  >
    <el-form
      :model="copyStepData"
      size="mini"
    >
      <div class="my-item-wrap">
        <el-form-item
          label="所属厂家"
          required
        >
          <el-select v-model="copyStepData.equipmentCompany" disabled>
            <el-option
              v-for="item of equipmentCompanyArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备类型："
          required
        >
          <el-select v-model="copyStepData.equipmentType" disabled>
            <el-option
              v-for="item of equipmentTypeArr"
              :key="item.dictValue"
              :label="item.dictNameZh"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="my-item-wrap">
        <el-form-item
          label="软件版本"
          required
        >
          <el-select v-model="copyStepData.currentVersion"  disabled>
            <el-option
              v-for="(item,index) of venderList"
              :key="index"
              :label="item.version"
              :value="item.version"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="操作类型"
          required
        >
          <el-select v-model="copyStepData.operateType" disabled>
            <el-option
              v-for="item of types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </div>
      <el-form-item
        label="选择模板"
        required
        class="model-wrap"
      >
      <el-input v-model="copyStepData.operateName" disabled></el-input>
      </el-form-item>
      <el-form-item
        label="请选择网元"
        required
      >
        <el-tabs
          v-model="tabVersion"
          type="card"
          @tab-click="handleClick"
        >
        <el-tab-pane v-for="item of netList"
        :key="item.version"
        :label="item.version"
        :name="item.version"
        ></el-tab-pane>
        </el-tabs>
        <div class="nets-wrap">
          <el-checkbox-group v-model="selectedIds">
            <el-checkbox disabled v-for="item of curNetList" :key="item.id" :label="item.id">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <div v-if="parmas.length">
        <p>参数配置：</p>
        <ul class="param-list">
          <li
            v-for="(item,index) of parmas"
            :key="index"
          >
            <label :class="[item.paramNotNull!=0?'required':'']">{{item.paramKey}}</label>
            <span>=</span>
            <el-input
              size="small"
              disabled
              v-model="item.paramValue"
            ></el-input>
          </li>
        </ul>
      </div>
    </el-form>
    <div class="btn-wrapper">
      <el-button
        size="medium"
        @click="cancel"
      >取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
const types = [
  { label: "指令", value: "0" },
  { label: "指令模板", value: "1" },
  { label: "任务模板", value: "2" }
];
export default {
  props: ['stepData'],
  data() {
    return {
      dialogFormVisible: false,
      copyStepData:{},
      tabVersion:'',
      venderList: [],
      types,
      parmas: [],
      netList:[],
      netObj:{},  // 网元版本为key，网元对象数组为value
      selectedIds: []
    };
  },
  computed: {
    ...mapGetters({
      equipmentCompanyArr: "equipmentCompanyArr",
      instructTypeArr: "instructTypeArr", //指令类型
      equipmentTypeArr: "equipmentTypeArr",
      companyArr: "companyArr",
      equipObj: "dict/equipObj",
      equipComObj: "dict/equipCompanyObj"
    }),
    curNetList() {
      return this.netObj[this.tabVersion]
    }
  },
  watch: {
    stepData(newV) {
      this.copyStepData = {...newV}
      this.parmas = this.copyStepData.paramList? JSON.parse(this.copyStepData.paramList):[]
    },
    "copyStepData.networkIds"(newV) {
      this.selectedIds = newV
    },
    "copyStepData.equipmentCompany"() {
      this.getVersion();
    },
    "copyStepData.equipmentType"() {
      this.getVersion();
    },
    "copyStepData.operateId"() {
      this.getNetList()
    },
    "copyStepData.operateType"() {
      this.getNetList()
    }
  },
  methods: {
    show() {
      this.dialogFormVisible = true;
    },
    hide() {
      this.dialogFormVisible = false;
    },
    cancel() {
      this.hide();
    },
    async getVersion() {
      let list = await this.$http.get("/OpsDev/dicts/getVersionByDict", {
        params: {
          company: this.copyStepData.equipmentCompany,
          netType: this.copyStepData.equipmentType
        }
      });
      this.venderList = list;
    },
    async getNetList() {
      if(!this.copyStepData.operateId) {
        return
      }
      let res = await this.$http.get('/OpsDev/taskExamine/getNetDeviceListByTypeId', {
        params: {
          id: this.copyStepData.operateId,
          objectType: this.copyStepData.operateType
        }
      })
      if(res&&res.length) {
        this.netList = res
        this.tabVersion = res[0].version
        this.netObj = res.reduce((last, item) => {
          return {
            ...last,
            [item.version]: item.networkDeviceResult
          }
        }, {})
      }
    },
    handleClick() {
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-item-wrap {
  display: flex;
  justify-content: space-between;

  .el-form-item {
    display: flex;
  }
}

.model-wrap {
  display: flex;

  >>> .el-form-item__content {
    flex: 1;

    .el-select {
      width: 100%;
    }
  }
}

.btn-wrapper {
  text-align: center;

  .el-button {
    margin-right: 10px;
  }
}

.param-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: -30px;

  li {
    display: flex;
    align-items: center;
    width: 28%;
    margin-left: 30px;
    margin-bottom: 12px;

    label {
      min-width: 78px;
      text-align: right;

      &.required:before {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
      }
    }

    span {
      margin: 0 6px;
    }
  }
}

.el-form-item >>> .el-form-item__content {
  clear: both;
}
.el-form-item >>> .el-autocomplete
  display block
.version
  margin-left 20px
  color orange
</style>
