<template>
  <div class="detailpannel">
    <!-- 变量列表 -->
    <div class="item" v-if="currentNodeType=='page'">
      <h4>变量设置</h4>
      <div class="table-list">
        <p>任务变量列表：</p>
        <el-table
          :data="variableList"
          border
          size="mini"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column
            fixed
            prop="paramKeyZh"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="paramKey"
            label="变量名称"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="table-list">
        <p>常量列表：<span @click="delRow">选中删除</span><span @click="showAdd">添加+</span></p>
        <el-table
          :data="constantList"
          highlight-current-row
          @current-change="handleCurrentChange"
          border
          size="mini"
          style="width: 100%"
          max-height="250"
        >
          <el-table-column
            fixed
            prop="paramKeyZh"
            label="中文名称"
          >
          </el-table-column>
          <el-table-column
            prop="paramKey"
            label="常量名"
          >
          </el-table-column>
          <el-table-column
            prop="paramValue"
            label="常量值"
          >
          </el-table-column>
        </el-table>
      </div>
      <var-model ref="model"></var-model>
    </div>
    <!-- 指令节点 -->
    <div class="item" v-if="currentNodeType=='instruct'">
      <h4>普通节点设置</h4>
      <el-form
        :model="nodeDataObj"
        size="mini"
        label-width="80px"
        :rules="nodeRules"
      >
        <el-form-item
          label="节点名称"
          prop="nodeName"
        >
          <el-input
            placeholder="请输入内容"
            v-model="nodeDataObj.nodeName"
            clearable
          ></el-input>
        </el-form-item>
        <p class="radio-wrap">
          <el-radio
            v-model="nodeDataObj.objectType"
            @change="toggleInstrucType"
            label="0"
          >指令</el-radio>
          <el-radio
            v-model="nodeDataObj.objectType"
            label="1"
            @change="toggleInstrucType"
          >指令模板</el-radio>
          <el-radio
            v-model="nodeDataObj.objectType"
            label="2"
            @change="toggleInstrucType"
          >结果对比</el-radio>
        </p>
        <div
          class="contrast"
          v-if="nodeDataObj.objectType=='2'"
        >
        <span class="required"></span> 对比<el-input
            size="mini"
            v-model="nodeDataObj.days"
            oninput = "value=value.replace(/[^\d]/g,'')"
          ></el-input>天前，
          <span class="required"></span>
          <el-select
            size="mini"
            v-model="nodeDataObj.times"
          >
            <el-option
              v-for="item in consOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          执行结果
        </div>
        <el-form-item
          class="auto-container"
          prop="orderName"
          v-show="nodeDataObj.objectType==='0'||nodeDataObj.objectType==='2'"
          label="指令代码"
        >
          <el-autocomplete
            v-model="nodeDataObj.orderName"
            :fetch-suggestions="querySearchAsyncOrder"
            placeholder="请输入内容"
            @select="handleSelectOrder"
            width="100%"
            suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
              <div class="net-list ellipsis">
                <span>{{item.name}}</span>
                <span class="version">{{item.version}}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!-- 指令模板 -->
        <el-form-item
          class="auto-container"
          prop="analysisName"
          v-show="nodeDataObj.objectType==='1'"
          label="指令模板"
        >
          <el-autocomplete
            v-model="nodeDataObj.analysisName"
            :fetch-suggestions="querySearchAsyncAnalys"
            placeholder="请输入内容"
            @select="handleSelectAnalysis"
            width="100%"
            suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
              <div class="net-list ellipsis">
                <span>{{item.name}}</span>
                <span class="version">{{item.version}}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <div
          class="param-wrapper"
          v-if="nodeDataObj.paramsList.length"
        >
          <label class="required">参数配置:</label>
          <ul class="param-list">
            <li
              v-for="item of nodeDataObj.paramsList"
              :key="item.paramKey"
            >
              <label :class="[item.paramNotNull==1?'required':'']">
                {{item.paramKey}}
              </label>
              <span class="equal">=</span>
              <el-input
                size="mini"
                v-model="item.paramValue"
                :disabled="item.constantFlag==1"
              ></el-input>
            </li>
          </ul>
        </div>
        <div class="is-set-global">
            <el-checkbox
              v-model="nodeDataObj.isUseResult"
              true-label="1"
              false-label="0"
              v-if="nodeDataObj.objectType!=2"
              :disabled="nodeDataObj.objectType=='2'"
            >将返回值设为全局变量</el-checkbox>
            <el-input
              size="mini"
              placeholder="请输入变量名称"
              v-if="nodeDataObj.isUseResult==1"
              v-model="nodeDataObj.resultName"
            ></el-input>
        </div>
      </el-form>
      <div v-if="nodeDataObj.objectType==='0' || nodeDataObj.objectType === '2'">
        <div class="preview code-preview" v-show="codePreview">
          指令预览：
          <p>{{codePreview}}</p>

        </div>
        <div class="preview" v-show="nodeDataObj.orderDescribe">
          指令描述：
          <p>
            {{nodeDataObj.orderDescribe}}
          </p>
        </div>
      </div>
      <!-- 指令模板预览内容 -->
      <div v-if="nodeDataObj.objectType === '1'">
        <div class="preview code-preview" v-show="codePreview">
          指令预览：<p>{{codePreview}}</p>
        </div>
        <div class="preview" v-show="codePreview&&nodeDataObj.orderDescribe">
          指令模板描述：
          <p>
            {{nodeDataObj.orderDescribe}}
          </p>
        </div>
      </div>
    </div>
    <!-- 接口节点设置 -->
    <div class="item" v-if="currentNodeType=='http'">
      <h4>接口节点设置</h4>
      <el-form
        :model="nodeDataObj"
        size="mini"
        label-width="80px"
        :rules="httpRules"
      >
        <el-form-item
        prop="interfaceName"
        label="接口名称">
          <el-input v-model="nodeDataObj.interfaceName" clearable></el-input>
        </el-form-item>
        <el-form-item
        class="select-item"
        label="接口类型"
        prop="interfaceType"
        >
        <el-select
           v-model="nodeDataObj.interfaceType"
           placeholder="请选择接口方式">
           <el-option
           v-for="item of interfaceTypes"
           :key="item.value"
           :value="item.value"
           :label="item.label"
           ></el-option>
         </el-select>
        </el-form-item>
        <el-form-item
          prop="url"
          label="url">
            <el-input v-model="nodeDataObj.url" clearable></el-input>
        </el-form-item>
        <el-form-item
          prop="requestType"
          label="请求方式">
          <el-radio v-model="nodeDataObj.requestType" label="1">get</el-radio>
          <el-radio v-model="nodeDataObj.requestType" label="2">post</el-radio>
        </el-form-item>
        <el-form-item label="参数配置" class="parameter-wrapper">
          <div class="add-wrap">
            <ul>
              <li class="param-item" v-for="(item, index) of nodeDataObj.parameterList" :key="index">
                <div>
                  <label>Key</label>
                  <el-input size="mini" v-model="item.paramKey"></el-input>
                </div>
                <div>
                  <label>value</label>
                  <el-input size="mini" v-model="item.paramValue"></el-input>
                </div>
              </li>
            </ul>
            <el-button type="text" size="mini" @click="addParam">添加参数+</el-button>
          </div>
        </el-form-item>
        <div class="btn-wrap">
          <el-button plain size="small" @click="testApi">测试接口</el-button>
        </div>
        <div class="is-set-global">
            <el-checkbox
              v-model="nodeDataObj.isUseResult"
              true-label="1"
              false-label="0"
            >将返回值设为全局变量</el-checkbox>
            <el-input
              size="mini"
              v-model="nodeDataObj.resultName"
              v-if="nodeDataObj.isUseResult==1"
              placeholder="请输入变量名称"
            ></el-input>
        </div>
      </el-form>
    </div>
    <!-- 循环节点 -->
    <div class="item" v-if="currentNodeType=='loop'">
      <h4>循环节点设置</h4>
      <el-form :model="nodeDataObj"
        size="mini"
        label-width="80px"
        :rules="loopRules">
        <el-form-item prop="nodeName" label="节点名称">
          <el-input v-model="nodeDataObj.nodeName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <p class="radio-wrap">
          <el-radio
            v-model="nodeDataObj.objectType"
            label="0"
            @change="toggleLoopType"
          >指令</el-radio>
          <el-radio
            v-model="nodeDataObj.objectType"
            @change="toggleLoopType"
            label="1"
          >指令模板</el-radio>
        </p>
        <el-form-item
          class="auto-container"
          prop="orderName"
          v-show="nodeDataObj.objectType==='0'"
          label="指令名称"
        >
          <el-autocomplete
            v-model="nodeDataObj.orderName"
            :fetch-suggestions="querySearchAsyncOrder"
            placeholder="请输入内容"
            @select="handleSelectLoopOrder"
            width="100%"
            suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
              <div class="net-list ellipsis">
                <span>{{item.name}}</span>
                <span class="version">{{item.version}}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!-- 循环节点指令模板 -->
        <el-form-item class="auto-container"
          prop="analysisName"
          v-show="nodeDataObj.objectType==='1'"
          label="指令模板"
        >
          <el-autocomplete
            v-model="nodeDataObj.analysisName"
            :fetch-suggestions="querySearchAsyncAnalys"
            placeholder="请输入内容"
            @select="handleSelectLoopAnalysis"
            width="100%"
            suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
              <div class="net-list ellipsis">
                <span>{{item.name}}</span>
                <span class="version">{{item.version}}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="入参" prop="paramsObject" class="select-item">
          <el-select v-model="nodeDataObj.paramsObject">
            <el-option v-for="item of allVarList"
            :key="item.paramKey"
            :label="item.paramKey"
            :value="item.paramKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <div
          class="param-wrapper"
          v-if="nodeDataObj.paramsList.length"
        >
          <label class="required">参数配置:</label>
          <ul class="param-list">
            <li
              v-for="item of nodeDataObj.paramsList"
              :key="item.paramKey"
            >
              <label :class="[item.paramNotNull==1?'required':'']">
                {{item.paramKey}}
              </label>
              <span class="equal">=</span>
              <el-input
                size="mini"
                disabled
                v-model="item.paramValue"
              ></el-input>
            </li>
          </ul>
         </div>
      </el-form>
      <div v-if="nodeDataObj.objectType==='0'">
        <div class="preview code-preview" v-show="codePreview">
          指令预览：<p :title="codePreview">{{codePreview}}</p>
        </div>
        <div class="preview" v-show="nodeDataObj.orderDescribe">
          指令描述：
          <p>
            {{nodeDataObj.orderDescribe}}
          </p>
        </div>
      </div>
      <!-- 指令模板预览内容 -->
      <div v-if="nodeDataObj.objectType === '1'">
        <div class="preview code-preview" v-show="codePreview">
          指令预览：<p :title="codePreview">{{codePreview}}</p>
        </div>
        <div class="preview" v-show="codePreview&&nodeDataObj.orderDescribe">
          指令模板描述：
          <p>
            {{nodeDataObj.orderDescribe}}
          </p>
        </div>
      </div>
    </div>
    <!-- 连线节点 -->
    <div class="item" v-if="currentNodeType=='edge'">
      <h4>连线属性设置</h4>
      <el-form :model="nodeDataObj"
        size="mini"
        label-width="80px"
        :rules="edgeRules"
      >
        <el-form-item label="连线名称" prop="linkName">
          <el-input v-model="nodeDataObj.linkName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="link-type">
            <el-radio @change="handleChangeCheck" v-model="nodeDataObj.isCheck" label="0">默认连线</el-radio>
            <el-radio @change="handleChangeCheck" v-model="nodeDataObj.isCheck" label="1">使用简单表达式</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="左值" v-if="nodeDataObj.isCheck==1" prop="leftKey">
          <el-autocomplete
            v-model="nodeDataObj.leftKey"
            :fetch-suggestions="querySearchLeftVar"
             placeholder="请选择任务变量"
             @select="handleSelectLeftKey"
             size="mini"
             width="100%"
             suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
                <div :title="item.paramKey">
                  <span>{{item.paramKey}}</span>
                </div>
              </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="" v-if="nodeDataObj.isCheck==1" prop="compareType">
           <el-select size="mini" v-model="nodeDataObj.compareType">
              <el-option v-for="item of compareOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="右值" v-if="nodeDataObj.isCheck==1" prop="rightKey">
          <el-autocomplete
            v-model="nodeDataObj.rightKey"
            :fetch-suggestions="querySearchRightVar"
             placeholder="请选择任务变量"
             @select="handleSelectRightKey"
             size="mini"
             width="100%"
             suffix-icon="el-icon-search"
          >
            <template slot-scope="{ item }">
                <div :title="item.paramKey">
                  <span>{{item.paramKey}}</span>
                </div>
              </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="描述">
          <el-input  type="textarea"
          v-model="nodeDataObj.remark"
          :rows="2"
          placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState} from "vuex";
import VarModel from "./VarModel.vue";
const options = [
  {
    label: "第1次",
    value: "0"
  },
  {
    label: "最后1次",
    value: "1"
  },
  {
    label: "随机1次",
    value: "2"
  }
];
const compareOptions = [
        {
          value: "2",
          label: ">"
        },
        {
          value: "1",
          label: "=="
        },
        {
          value: "3",
          label: "<"
        },
        {
          value: '4',
          label: ">="
        },
        {
          value: '5',
          label: '<='
        },
        {
          value: "8",
          label: "不包含"
        },
        {
          value: "7",
          label: "包含"
        }
]
export default {
  data() {
    return {
      currentRow: "",
      instructList: [], // 指令列表
      insructTempList: [], // 指令模板列表
      compareOptions,
      interfaceTypes: [
        {
          label: 'http',
          value: '1'
        },
        {
          label: 'https',
          value:'2'
        }
      ],
      consOptions: options,
      nodeDataObj: {
        nodeName: "",
        objectType: "0",
        days: "", //对比多少天前
        times: "", // 第几次结果对比
        analysisId: "", //指令模板id
        analysisName: "", //指令模板名称
        orderId: "", // 指令名称id
        orderName: "", // 指令名称
        orderDescribe: '', // 指令描述
        paramsList: [], // 参数列表
        isUseResult: "", //是否把返回值设为全局变量，值为0或者1,
        resultName: '', //设为全局变量变量名
        // 下面是接口节点的属性
        interfaceName: '', //接口名称
        interfaceType: '1', //接口类型
        url: '', //接口地址
        requestType: '1', // 请求方式
        parameterList: [],
        // 循环节点
        paramsObject: '', // 入参key名
        // 连线节点
        linkName: '', //连线名称
        isCheck: '0' , //是否使用表达式
        remark:'', //描述
        compareType: '',
        leftKey: '',
        rightKey: ''
      },
      nodeRules: {
        orderName: [{ required: true, message: "请选择指令" }],
        nodeName: [{ required: true, message: "请输入名称" }],
      },
      httpRules: {
        interfaceName:[{ required: true, message: "请输入名称" }],
        url:[{ required: true, message: "请输入接口地址" }],
        interfaceType:[{ required: true}],
      },
      loopRules: {
        nodeName: [{ required: true, message: "请输入名称" }],
        orderName: [{ required: true, message: "请选择指令" }],
        paramsObject: [{ required: true, message: "请选择入参名" }],
      },
      edgeRules: {
        linkName: [{ required: true, message: "请输入名称" }]
      }
    };
  },
  components: {
    VarModel
  },
  created() {
    let id = this.$route.query.id;
    this.getOrderData(id);
    this.getOrderTempData(id);
  },
  watch: {
    "nodeDataObj.objectType"(newV) {
      if(newV == 1) {
        if(this.currentNodeType == 'instruct') {
            this.nodeRules = {
              analysisName: [{ required: true, message: "请选择指令模板" }],
              nodeName: [{ required: true, message: "请输入名称" }],
            }
        }
        if(this.currentNodeType == 'loop') {
          this.loopRules = {
             nodeName: [{ required: true, message: "请输入名称" }],
             analysisName:[{ required: true, message: "请选择指令模板" }],
             paramsObject: [{ required: true, message: "请选择入参名" }],
          }
        }
      }
      if(newV == 0) {
        if(this.currentNodeType == 'instruct') {
          this.nodeRules = {
              orderName: [{ required: true, message: "请选择指令" }],
              nodeName: [{ required: true, message: "请输入名称" }],
          }
        }
        if(this.currentNodeType == 'loop') {
          this.loopRules = {
             nodeName: [{ required: true, message: "请输入名称" }],
             orderName: [{ required: true, message: "请选择指令" }],
             paramsObject: [{ required: true, message: "请选择入参名" }],
          }
        }
      }
      if(newV == 2) {
        this.nodeRules = {
          orderName: [{ required: true, message: "请选择指令" }],
          nodeName: [{ required: true, message: "请输入名称" }],
        }
      }
    },
    "nodeDataObj.nodeName"(v) {
      if (this.currentNodeType == "instruct"|| this.currentNodeType == 'loop') {
        this.$emit("changeNodeLabel", v);
      }
    },
    "nodeDataObj.interfaceName"(v) {
      if (this.currentNodeType == "http") {
       this.$emit("changeNodeLabel", v);
      }
    },
    currentNodeId(newV, oldV) { //监测面板当前节点id，变化则要保存数据到store
      if(oldV) { // 保存上一个节点
       if(this.command != 'delete') {
         if(this.nodeDataObj.isUseResult=='1'){
            let name = this.nodeDataObj.sign=='instruct'?this.nodeDataObj.nodeName: this.nodeDataObj.interfaceName
            this.checkVar(name, oldV)
         }
         if(this.nodeDataObj.isUseResult == '0') {
            // 这里要调用删除变量的方法
            this.varDelete(oldV)
         }
       }
       this.handleChangeTask(this.nodeDataObj)
      }
      if(newV) {
        this.nodeDataObj = this.currentNode
      }

    },
    edgeLabel(v) {
      if(this.currentNodeType == "edge") {
       this.$emit("changeNodeLabel", v);
      }
    }
  },
  computed: {
    ...mapGetters({
      variableList: "drag/variableList",
      constantList: "drag/constantList",
      allVarList: 'drag/allVarList',
      currentNodeType: 'drag/currentNodeType',
      currentNodeId: 'drag/currentNodeId',
      currentNode: 'drag/currentNode',
      command: 'drag/command'
    }),
    edgeLabel() {
      let compareTypeArr = this.compareOptions.filter(option => option.value==this.nodeDataObj.compareType)
      let compareType = compareTypeArr.length?compareTypeArr[0].label: ''
      return this.nodeDataObj.leftKey+compareType+this.nodeDataObj.rightKey
    },
    codePreview() {
      let list = this.nodeDataObj.paramsList.filter(item => item.paramValue)
      let code = ''
      if(this.nodeDataObj.objectType == '1') {
        code = this.nodeDataObj.orderCode
      }else if(this.nodeDataObj.objectType==='0'||this.nodeDataObj.objectType=='2'){
        code = this.nodeDataObj.orderName
      }
      if(!code) {
        return ''
      }
      if(!list.length) {
        code += ':;'
      }else {
        code += ':'
        list.forEach((param,index) => {
          if(index < list.length-1) {
            code += `${param.paramKey}=${param.paramValue},`
          }else {
            code += `${param.paramKey}=${param.paramValue};`
          }
        })
      }
      return code
    }
  },
  methods: {
    ...mapMutations({
      delConst: "drag/delConst",
      handleChangeTask: 'drag/handleChangeTask',
      addVar: 'drag/addVar',
      varDelete: 'drag/varDelete'
    }),
    handleChangeCheck(c) {
     if(c == 0) {
       this.nodeDataObj.leftKey = ''
       this.nodeDataObj.compareType = ''
       this.nodeDataObj.rightKey = ''
       this.edgeRules = {
         linkName: [{ required: true, message: "请输入名称" }]
       }
     }else if(c == 1) {
       this.edgeRules = {
         linkName: [{ required: true, message: "请输入名称" }],
         leftKey: [{ required: true, message: "请选择左键值" }],
         compareType: [{ required: true, message: "" }],
         rightKey: [{ required: true, message: "请选择右键值" }]
       }
     }
    },
    toggleInstrucType() {
      // console.log('测试变化')
      let type  = this.nodeDataObj.objectType
      if(type == '0'|| type == '2') {
        // 此时如果orderId不存在，应该置空parmaList
        if(!this.nodeDataObj.orderId) {
          this.nodeDataObj.orderName = ''
          this.nodeDataObj.paramsList = []
        }else { // 如果存在，应该调用查询paramList的方法
          this.getOrderParams(this.nodeDataObj.orderId)
        }
      }else if(type=='1') {
        // 此时如果analysisId不存在，应该置空parmaList
        if(!this.nodeDataObj.analysisId){
          this.nodeDataObj.analysisName = ''
          this.nodeDataObj.paramsList = []
        }else {
          this.getAnalysisParams(this.nodeDataObj.analysisId)
        }
      }
    },
    toggleLoopType(){
      let type  = this.nodeDataObj.objectType
      // 首先要清空入参名
      this.nodeDataObj.paramsObject = ''
      if(type=='0') {
        // 此时如果orderId不存在，应该置空parmaList
        if(!this.nodeDataObj.orderId) {
          this.nodeDataObj.orderName = ''
          this.nodeDataObj.paramsList = []
        }else { // 如果存在，应该调用查询paramList的方法
          this.getLoopParams(this.nodeDataObj.orderId)
        }
      }else if(type == '1') {
         // 此时如果analysisId不存在，应该置空parmaList
        if(!this.nodeDataObj.analysisId){
          this.nodeDataObj.analysisName = ''
          this.nodeDataObj.paramsList = []
        }else {
          this.getLoopAnalysParams(this.nodeDataObj.analysisId)
        }
      }
    },
    checkVar(name,id) {
      let {resultName: paramKey} = this.nodeDataObj
      if(!paramKey) {
        this.$message.error(`请填写${name}节点的全局变量名`)
        return
      }
      let filterList = this.allVarList.filter(item =>item.paramId !== id)
      if(filterList.find(item =>item.paramKey == paramKey)) {
        this.$message.error(`变量名${paramKey}已存在，不能重名`)
        return
      }else {
        this.addVar({paramId:id,paramKey, paramKeyZh: name, paramValue: ''})
      }
    },
    async getOrderData(id) {
      let res = await this.$http.get(
        "/OpsDev/taskTemplate/getOrderByTemplateId",
        {
          params: { id, objectType: "0" }
        }
      );
      if (res) {
        this.instructList = res;
      }
    },
    async getOrderTempData(id) {
      let res = await this.$http.get(
        "/OpsDev/taskTemplate/getOrderByTemplateId",
        {
          params: { id, objectType: "1" }
        }
      );
      this.insructTempList = res;
    },
    showAdd() {
      this.$refs.model.show();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    delRow() {
      if (!this.currentRow) {
        alert("请点击选中要删除的行");
        return;
      }
      this.delConst(this.currentRow);
    },
    querySearchAsyncOrder(queryString, cb) {
      let instructList = this.instructList;
      let results = queryString
        ? instructList.filter(this.createFilter(queryString))
        : instructList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 600 * Math.random());
    },
    querySearchAsyncAnalys(queryString, cb) {
      let insructTempList = this.insructTempList;
      let results = queryString
        ? insructTempList.filter(this.createFilter(queryString))
        : insructTempList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 600 * Math.random());
    },
    querySearchLeftVar(queryString, cb) {
      let results = queryString? this.allVarList.filter(this.createVarFilter(queryString)): this.allVarList
      cb(results)
    },
    querySearchRightVar(queryString, cb) {
      let list = this.allVarList.filter(item => item.paramKey!== this.nodeDataObj.leftKey)
      let results = queryString? list.filter(this.createVarFilter(queryString)): list
      cb(results)
    },
    createVarFilter(queryString) {
      return item => {
        return item.paramKey.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectLeftKey(item) {
      this.nodeDataObj.leftKey = item.paramKey
    },
    handleSelectRightKey(item) {
      this.nodeDataObj.rightKey = item.paramKey
    },
    createFilter(queryString) {
      return item => {
        return item.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1;
      };
    },
    handleSelectOrder(item) {
      this.nodeDataObj.orderName = item.name;
      this.nodeDataObj.orderId = item.id;
      this.getOrderParams(item.id);
    },
    handleSelectAnalysis(item) {
      this.nodeDataObj.analysisName = item.name;
      this.nodeDataObj.analysisId = item.id;
      this.getAnalysisParams(item.id);
    },
    handleSelectLoopOrder(item) {
      this.nodeDataObj.orderName = item.name;
      this.nodeDataObj.orderId = item.id;
      this.getLoopParams(item.id);
    },
    handleSelectLoopAnalysis(item) {
      this.nodeDataObj.analysisName = item.name;
      this.nodeDataObj.analysisId = item.id;
      this.getLoopAnalysParams(item.id)
    },
    //循环节点的参数不一样
    async getLoopParams(id) {
      let res = await this.$http.get("/OpsDev/order/getOrderById", {
        params: { id }
      });
      let { instructParameter,instructDescribe } = res;
      console.log(instructParameter)
      if (instructParameter) {
        this.nodeDataObj.paramsList = JSON.parse(instructParameter).map(param => {
          if(param.constantFlag==1) {
            return {
              paramKey:param.paramKey,
              paramValue:param.paramValue,
              paramNotNull:param.paramNotNull,
              paramKeyZh: param.paramKeyZh
            }
          }else {
            return {
              paramKey:param.paramKey,
              paramValue: `outputParam[x].${param.paramKey}`,
              paramNotNull:param.paramNotNull,
              paramKeyZh: param.paramKeyZh
            }
          }

        });
      }
      this.nodeDataObj.orderDescribe = instructDescribe
    },
    async getLoopAnalysParams(id) {
      let res = await this.$http.get(
        "/OpsDev/taskTemplate/getOrderAnalysisById",
        {
          params: { id }
        }
      )
      // console.log(res)
      let { instructParameter , analysisDescribe, orderCode} = res;
      console.log(instructParameter)
      if(instructParameter) {
        this.nodeDataObj.paramsList = JSON.parse(instructParameter).map(param => {
          if(param.constantFlag == 1) {
            return {
              ...param
            }
          }else {
            return {
              paramKey:param.paramKey,
              paramValue: `outputParam[x].${param.paramKey}`,
              paramNotNull:param.paramNotNull,
              constantFlag: param.constantFlag
            }
          }
        })
      }
      this.nodeDataObj.orderCode = orderCode
      this.nodeDataObj.orderDescribe = analysisDescribe // 指令模板描述
    },
    async getOrderParams(id) {
      let res = await this.$http.get("/OpsDev/order/getOrderById", {
        params: { id }
      });
      console.log(res)
      let { instructParameter , instructDescribe} = res;
      if (instructParameter) {
        this.nodeDataObj.paramsList = JSON.parse(instructParameter);
      }
      this.nodeDataObj.orderDescribe = instructDescribe
    },
    async getAnalysisParams(id) {
      let res = await this.$http.get(
        "/OpsDev/taskTemplate/getOrderAnalysisById",
        {
          params: { id }
        }
      );
      // console.log(res)
      let { instructParameter , analysisDescribe, orderCode} = res;
      this.nodeDataObj.paramsList = instructParameter
        ? JSON.parse(instructParameter)
        : [];
      this.nodeDataObj.orderCode = orderCode
      this.nodeDataObj.orderDescribe = analysisDescribe // 指令模板描述
    },
    addParam(){
      this.nodeDataObj.parameterList.push({
        paramKey: '',
        paramValue: ''
      })
    },
    testApi(){}
  }
};
</script>

<style lang="stylus" scoped>
.detailpannel {
  width: 310px;
  background: #F7F9FB;
  border-left: 1px solid #E6E9ED;
  overflow: auto;
}
.required::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
.item {
  padding: 0 6px;

  h4 {
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
  }

  .radio-wrap {
    margin-bottom: 14px;
    text-align: center;
  }
}

.table-list {
  margin-bottom: 30px;

  p {
    margin-bottom: 6px;
    font-size: 12px;

    span {
      float: right;
      margin-right: 5px;
      margin-left: 5px;
      cursor: pointer;
      color: #409eff;
    }
  }
}

.auto-container >>> .el-autocomplete {
  width: 100%;
}

.contrast {
  margin-bottom: 10px;
  font-size: 14px;
  text-align: right;
  color: #606266;

  .el-input {
    width: 50px;
  }

  .el-select {
    width: 90px;
  }
}

.version {
  margin-left: 20px;
  color: orange;
}

// 参数列表样式
.param-wrapper {
  >label.required {
    display: inline-block;
    width: 78px;
    padding-right: 12px;
    text-align: right;
    color: #606266;

    &::before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
}

.param-list {
  li {
    display: flex;
    align-items: center;
    font-size: 13px;
    margin: 10px 0;

    .equal {
      margin: 0 4px;
    }

    .el-input {
      width: 206px;
    }

    label {
      flex: 1;
      text-align: right;

      &.required::before {
        content: '*';
        color: #F56C6C;
        margin-right: 2px;
      }
    }
  }
}

.is-set-global {
  margin-left: 4px;

  .el-checkbox {
    margin-bottom: 10px;
  }
}
// 接口节点样式
.select-item
  .el-select
    width 216px
.parameter-wrapper >>> .el-form-item__content
  clear both
.add-wrap
  margin-left -80px
  text-align right
  .param-item
    display flex
    justify-content space-between
    margin-bottom 10px
    font-size 13px
    label
      margin-right 10px
    .el-input
      width 100px
.btn-wrap
  margin-bottom 10px
  .el-button--small
    width 100%
.link-type
  display flex
  .el-radio
    margin-right 10px
.code-preview
  p
    overflow hidden
    text-overflow:ellipsis;
    white-space: nowrap;
.preview
  font-size 14px
  color #606266
  p
    padding-left 14px
    color #000
</style>
