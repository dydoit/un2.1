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
          <el-select v-model="copyStepData.equipmentCompany" @change="handleChangEquip">
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
          <el-select v-model="copyStepData.equipmentType" @change="handleChangType">
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
          <el-select v-model="copyStepData.equipmentVersion"  @change="handleChangeVersion">
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
          <el-select v-model="copyStepData.operateType"  @change="handleChangeCao">
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
        <el-autocomplete v-model="copyStepData.operateName"
        :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
        :disabled="!modelDatas.length"
        :popper-append-to-body="false"
        @select="handleSelectName" size="mini" width="100%" suffix-icon="el-icon-search">
          <template slot-scope="{ item }">
            <div class="net-list ellipsis" :title="[item.name, item.version].join('||')">
              <span>{{item.name}}</span>
              <span class="version">{{item.version}}</span>
            </div>
          </template>
        </el-autocomplete>
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
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="selectedIds" @change="handleCheckedIdsChange">
            <el-checkbox v-for="item of curNetList" :key="item.id" :label="item.id">
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
              v-model="item.paramValue"
            ></el-input>
          </li>
        </ul>
      </div>
    </el-form>
    <div class="btn-wrapper">
      <el-button
        type="primary"
        size="medium"
        @click="sure"
      >保存</el-button>
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
  props: ['stepData', 'stepIndex'],
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
      modelDatas: [], // 模板数据
      selectedIds: [],
      checkAll: false
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
    curNetList() {
      this.handleCheckedIdsChange(this.selectedIds)
    },
    stepData(newV) {
      this.copyStepData = {...newV, equipmentVersion:newV.currentVersion}
      this.selectedIds = newV.networkIds
      this.parmas = this.copyStepData.paramList? JSON.parse(this.copyStepData.paramList):[]
      this.getVersion();
    },
    "copyStepData.operateId"() {
      this.getNetList()
      this.getHanleModels()
    },
    "copyStepData.operateType"() {
      this.getNetList()
      this.getHanleModels()
    }
  },
  methods: {
    handleChangEquip() { // 厂家改变
      this.copyStepData.equipmentVersion = '' // 置空版本
      this.getVersion();
      this.initOprate()
      this.getHanleModels()
    },
    handleChangType() { //设备类型改变
      this.copyStepData.equipmentVersion = '' // 置空版本
      this.getVersion();
      this.initOprate()
      this.getHanleModels()
    },
    handleChangeVersion() { // 软件版本改变
      this.initOprate()
      this.getHanleModels()
    },
    handleChangeCao() { //操作类型改变
      this.initOprate()
      this.getHanleModels()
    },
    initOprate() {
      this.copyStepData.operateName =''
      this.copyStepData.operateId = ''
      this.parmas = []
      this.netList = []
      this.netObj = {}
      this.modelDatas = []
      this.selectedIds = []
    },
    show() {
      this.dialogFormVisible = true;
    },
    hide() {
      this.dialogFormVisible = false;
    },
    sure() {
      let data = {
        ...this.copyStepData,
        networkIds: this.selectedIds,
        paramList: this.parmas.length?JSON.stringify(this.parmas): ''
      }
      this.$emit('modify', {data, index:this.stepIndex})
      this.hide()
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
    async getHanleModels() {
      if(!this.copyStepData.operateType || !this.copyStepData.equipmentVersion) {
        return
      }
      let res = await this.$http.get('/OpsDev/dicts/getObjectNameByDto', {
        params: {
          objectType: this.copyStepData.objectType,
          company: this.copyStepData.equipmentCompany,
          netType: this.copyStepData.equipmentType,
          objectType: this.copyStepData.operateType,
          curVersion: this.copyStepData.equipmentVersion
        }
      })
      if(res) {
        this.modelDatas = res
      }else {
        this.modelDatas = []
      }
    },
    querySearchAsync(queryString, cb) {
      let modelNames = this.modelDatas;
      let results = queryString
        ? modelNames.filter(this.createStateFilter(queryString))
        : modelNames;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 600 * Math.random());
    },
    createStateFilter(queryString) {
      return item => {
        return item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1;
      };
    },
    handleSelectName(item){
      this.copyStepData.operateName = item.name
      this.copyStepData.operateId = item.id
      this.getModelDetail()
    },
    async getModelDetail() {
      if(!this.copyStepData.operateId) {
        return
      }
      let res = await this.$http.get('/OpsDev/taskExamine/getObjectById',{
        params: {
          id: this.copyStepData.operateId,
          objectType: this.copyStepData.operateType
        }
      })
      let {instructParameter} = res
      if(instructParameter) {
        this.parmas = JSON.parse(instructParameter)
      }
      if(this.copyStepData.operateType =='0') {
        this.copyStepData.operateDescribe = res.instructDescribe
      }else if(this.copyStepData.operateType =='1') {
        this.copyStepData.operateDescribe = res.analysisDescribe
      }else if(this.copyStepData.operateType =='2') {
        this.copyStepData.operateDescribe = res.taskDescribe
      }
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
    handleClick() { // 判断是否全选
      this.handleCheckedIdsChange(this.selectedIds)
    },
    handleCheckAllChange(val) {
      let curIds = this.curNetList.map(net => net.id)
      if(val) {
        let newIds = this.selectedIds.concat(curIds)
        this.selectedIds = [...new Set(newIds)]
      } else {
        this.selectedIds = this.selectedIds.filter(id => !curIds.includes(id))
      }
    },
    handleCheckedIdsChange(ids) {
      this.checkAll = this.curNetList.every(item => ids.includes(item.id))
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
