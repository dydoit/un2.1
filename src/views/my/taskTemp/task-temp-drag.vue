<template>
  <div class="editor">
    <ToolBar ref="toolbar"></ToolBar>
    <div class="editor-content" ref="editor">
      <Pannel ref="itemPannel"></Pannel>
      <context-menu ref="contextmenu"></context-menu>
      <!-- 主画布 -->
      <div id="page" class="canvas"></div>
      <Detail ref="detailpannel" @changeNodeLabel="changeNodeLabel"></Detail>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from "vuex";
  import G6Editor from "@antv/g6-editor";
  import ToolBar from './components/ToolBar.vue'
  import Pannel from './components/Pannel.vue'
  import Detail from './components/DetailPannel.vue'
  import ContextMenu from "./components/ContextMenu.vue"
  const edgeShape = "flow-polyline-round";
  const startColor = '#FA8C16'
  const endColor = '#CD2626'
  const instructColor = '#1890FF'
  const loopColor = '#FFFF00'
  const httpColor = '#722ED1'
  const circleShape = 'flow-circle'
  const rectShape = 'flow-rect'
  const rhombusShape='flow-rhombus'
  const capsuleShape = 'flow-capsule'
  const compareObj = {
    "1": "==",
    "2": ">",
    "3": "<",
    "4": ">=",
    "5": "<=",
    "8": "不包含",
    "7": "包含"
  }
  const filterNode = (sourceArr, targetArr, arr = []) => {
    sourceArr.forEach(source => {
      let targetItems = targetArr.filter(
        targetItem => targetItem.id === source.id
      );
      if (targetItems.length) {
        arr.push(targetItems[0]);
      }
    });
  }
  export default {
    name: 'Drag',
    data() {
      return {
        taskId:'',
        graphData: {},
      }
    },
    beforeRouteLeave(to, from, next){
      this.clearStore()
      next()
    },
    components: {
      ToolBar,
      Pannel,
      Detail,
      ContextMenu
    },
    computed: {
      ...mapGetters({
        linkList: 'drag/linkList',
        instructList: 'drag/instructList',
        httpInterfaceList:'drag/httpInterfaceList',
        taskParameter: 'drag/taskParameter',
        loopList:  'drag/loopList',
        allVarList: 'drag/allVarList'
      })
    },
    created() {
      let id = this.$route.query.id
      if(id) {
        this.taskId = id
        this.setTaskId(id)
        // 查看本地是否有缓存过数据
        let graphDataObj = JSON.parse(window.localStorage.getItem("graphData"));
        let graphData = graphDataObj && graphDataObj[id];
        if(graphData) {
          this.$confirm("是否读取本地保存的草稿", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
          }).then(() =>{
            // 从本地读取草稿数据
            this.initG6EditorFromServer(graphData)
            this.initTaskObjFromServer(graphData)
          }).catch(() => {
            // 去服务器拿数据
            this.getTaskTem(id)
          })
        }else {
          this.getTaskTem(id)
        }

      }
    },
    methods: {
      ...mapMutations({
        updateTask: "drag/updateTask",
        setTaskId: "drag/setTaskId",
        setNodeType: "drag/setNodeType",
        setCurrentNodeId: 'drag/setCurrentNodeId',
        updateCommand: 'drag/updateCommand',
        initTaskObjFromServer: 'drag/initTaskObjFromServer',
        handleChangeTask: 'drag/handleChangeTask',
        addVar: 'drag/addVar',
        varDelete: 'drag/varDelete',
        clearStore: 'drag/clearStore'
      }),
      initG6EditorFromServer(json) {
        // 注意拿回的index,x,y,sourceAnchor,targetAnchor必须都要转成number类型
        let {
          linkList,
          taskParameter,
          httpInterfaceList,
          taskNodeList,
          taskNodeLoopList,
          taskId
        } = json
        let {
          startX,
          startY,
          startLevel,
          startId,
          endX,
          endY,
          endLevel,
          endId
        } = taskParameter;
        let instructNodes = [], httpNodes = [], loopNodes = []
        let edges = linkList.map(link => {
          return {
            id: link.id,
            taskId,
            source: link.lastNodeId,
            target: link.nextNodeId,
            sign: "edge",
            sourceAnchor: Number(link.sourceAnchor), //
            targetAnchor: Number(link.targetAnchor),
            shape: edgeShape,
            index: Number(link.level),
            label: link.leftKey
              ? link.leftKey + compareObj[link.compareType] + link.rightKey
              : ""
            }
        })
        let startNode = startId ? [
            {
              color: startColor,
              id: startId,
              index: Number(startLevel),
              sign: "start",
              shape: circleShape,
              size: "72*72",
              label: "开始",
              x: startX - 0,
              y: startY - 0
            }
        ]: []
        let endNode = endId ? [
            {
              color: endColor,
              id: endId,
              index: endLevel - 0,
              sign: "end",
              shape: circleShape,
              size: "72*72",
              label: "结束",
              x: endX - 0,
              y: endY - 0
            }
          ]: []

        if(taskNodeList.length) {
          instructNodes = taskNodeList.map(item => {
            return {
              id:item.id,
              taskId,
              sign: 'instruct',
              size: '120*48',
              color: '#1890FF',
              shape: rectShape,
              label: item.nodeName,
              index: item.level - 0,
              x: item.x - 0,
              y: item.y - 0
            }
          })
        }
        if(httpInterfaceList.length) {
          httpNodes = httpInterfaceList.map(item => {
            return {
              id:item.id,
              taskId,
              sign: 'http',
              size: '80*48',
              color: '#722ED1',
              shape: capsuleShape,
              label: item.interfaceName,
              index: item.level - 0,
              x: item.x - 0,
              y: item.y - 0
            }
          })
        }
        if(taskNodeLoopList.length){
          loopNodes = taskNodeLoopList.map(item => {
            return {
              id:item.id,
              taskId,
              sign: 'loop',
              size: '80*72',
              color: '#FFFF00',
              shape: rhombusShape,
              label: item.nodeName,
              index: item.level - 0,
              x: item.x - 0,
              y: item.y - 0
            }
          })
        }
        let nodes = [
          ...startNode,
          ...endNode,
          ...instructNodes,
          ...httpNodes,
          ...loopNodes
        ]
        this.graphData = {edges, nodes}
        console.log('画布数据')
        console.log(this.graphData)
        console.log('画布数据')
        this.$nextTick(() => {
          this.initG6Editor();
        })
      },
      async getTaskTem(id) {
        let res = await this.$http.get('/OpsDev/taskTemplate/getTaskTemplateDetailsById', {
          params: {id}
        })
        if(res.taskParameter) {
          this.initG6EditorFromServer(res)
          this.initTaskObjFromServer(res)
        }else {
          this.$nextTick(() => {
            this.initG6Editor();
          });
        }
      },
      initG6Editor() {
        let _this = this
        // G6Editor
        const editor = new G6Editor()
        // editor挂载到Vue
        this.editor = editor
        // Flow
        const Flow = G6Editor.Flow
        // 命令
        const Command = G6Editor.Command
        // 定义Save命令
        Command.registerCommand('save', {
          // 命令是否进入队列，默认是 true
          queue: false,
          // 命令是否可用
          enable(eidtor) {
            return true
          },
          // 正向命令
          execute(eidtor) {
            _this.upload('local')
          },
          // 快捷键：Ctrl+s
          shortcutCodes : [['ctrlKey', 's']]
        })
         // 定义上传命令
        Command.registerCommand("upload", {
          // 命令是否进入队列，默认是 true
          queue: false,
          // 命令是否可用
          enable(eidtor) {
            return true;
          },
          // 正向命令
          execute(eidtor) {
            _this.upload('server');
          }
        });
        // 监听一下命令变化
        editor.on('aftercommandexecute', ev => {
          this.commandChange(ev)
        })
        // 实例化画布右键
        const contextmenu = new G6Editor.Contextmenu({
          container : _this.$refs.contextmenu.$el
        });
        // 主画布
        const page = new G6Editor.Flow({
          graph: {
            container: 'page'
          },
          shortcut:{
            save : true
          },
          noEndEdge : false
        })

        // 设置边样式，内置3种样式
        page.getGraph().edge({
          shape: 'flow-polyline-round'
        })
        // 工具栏
        const toolbar = new G6Editor.Toolbar({
          container: _this.$refs.toolbar.$el
        })
        // 元素面板栏
        const itempannel = new G6Editor.Itempannel({
          container: _this.$refs.itemPannel.$el
        })
        // 详情面板
        const detailpannel = new G6Editor.Detailpannel ({
          container: _this.$refs.detailpannel.$el
        })
        // 组件挂载到Editor
        editor.add(page)
        editor.add(toolbar)
        editor.add(itempannel)
        editor.add(detailpannel)
        editor.add(contextmenu)
        // 设置事件监听
        this.setEventListener()
        // 获取当前page
        const currentPage = editor.getCurrentPage()
        currentPage.read(this.graphData)
        currentPage.on('click', ev => {
          if (!ev.item) {
            this.setNodeType('page')
            this.setCurrentNodeId('')
          }
        })
        // 监听选择变化
        currentPage.on('afteritemselected', ev => {
          let model = ev.item.getModel()
          if(ev.item.isNode) {
            if(model.sign == 'start' || model.sign == 'end') {
              this.setNodeType('page')
              this.setCurrentNodeId('')
              return
            } else if(model.sign == 'http') {
              this.setNodeType('http')
            } else if (model.sign == 'instruct') {
              this.setNodeType('instruct')
            } else if(model.sign == 'loop') {
              this.setNodeType('loop')
            }
            this.setCurrentNodeId(model.id)
          }
          if(ev.item.isEdge) {
            this.setNodeType('edge')
            this.setCurrentNodeId(model.id)
          }
        })
         // 监听图数据变化,及时更新graphData。第一次初始化时不会执行
        currentPage.on("afterchange", ev => {
          this.graphData = currentPage.save();
          this.updateTask(this.graphData);
        });
      },
      changeNodeLabel(val) {
        const editor = this.editor;
        editor.executeCommand(() => {
          const page = editor.getCurrentPage();
          const selectedItems = page.getSelected();
          selectedItems.forEach(item => {
            page.update(item.id, {
              label: val
            });
          });
        });
      },
      commandChange({command}) {
        let {name} = command
        this.updateCommand(name)
        let currentPage = this.editor.getCurrentPage()
        if(name == 'delete') { // 删除命令
          this.setNodeType("page");
          this.setCurrentNodeId('')
        } else {
          if(!currentPage.getSelected().length) {
            this.setNodeType("page");
            this.setCurrentNodeId('')
          }
        }
      },
      setEventListener(){
        const curPage = this.editor.getCurrentPage();
        curPage.on("dragedge:beforeshowanchor", ev => {
          let { source, target } = ev;
          let sourceId = source.id;
          let targetId = target.model.id;
          // 每个节点不能连自身
          if (sourceId === targetId) {
            ev.cancel = true;
          }
          // 起始节点不能作为输入节点
          if (target.model.sign === "start") {
            ev.cancel = true;
          }
          // 结束节点不能作为输出节点
          if (source.model.sign === "end") {
            ev.cancel = true;
          }
        });
      },
      checkVar(name, nodeDataObj) {
        let {resultName: paramKey, id} = nodeDataObj
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
      upload(type){
        let taskId = this.taskId;
        if (this.currentNodeType != "page") {
          let nodeDataObj = this.$refs.detailpannel.nodeDataObj;
          // 保存节点，还要判断节点是否设置了全局变量
          if(nodeDataObj.isUseResult==='1'){
            let name = nodeDataObj.sign=='instruct'?nodeDataObj.nodeName: nodeDataObj.interfaceName
            this.checkVar(name, nodeDataObj)
          }
          if(nodeDataObj.isUseResult === '0') {
              // 这里要调用删除变量的方法
              this.varDelete(nodeDataObj.id)
          }
          this.handleChangeTask(nodeDataObj);
        }
        // 提交前要根据当前画布现有的节点去仓库过滤出真正提交的数据
        let { edges, nodes } = this.graphData;
         // 过滤出线
        let linkList = [];
        if (edges) {
          filterNode(edges, this.linkList, linkList);
        }
        // 过滤出指令节点
        let taskNodeList = [], httpInterfaceList= [], taskNodeLoopList = []
        if(nodes) {
          // 先分别过滤出sign为instruct、http、loop的节点
          let instructNodes = nodes.filter(node =>node.sign === 'instruct')
          let httpNodes = nodes.filter(node => node.sign === 'http')
          let loopNodes = nodes.filter(node =>node.sign === 'loop')
          filterNode(instructNodes, this.instructList, taskNodeList)
          filterNode(httpNodes, this.httpInterfaceList, httpInterfaceList)
          filterNode(loopNodes, this.loopList, taskNodeLoopList)
        }
        let tempDetail = {
          taskId: this.taskId,
          taskParameter: this.taskParameter,
          taskNodeList,
          linkList,
          httpInterfaceList,
          taskNodeLoopList: taskNodeLoopList.map(item =>{
            return {
              ...item,
              paramsList: item.paramsList.length? JSON.stringify(item.paramsList): '[]'
          }})
        }
        if(type=="server") {
         // 提交到后台前先验证
          if (!this.validateData(edges, nodes)) {
            return;
          }
          this.postData(tempDetail)
        }else if(type == 'local') {
          // 保存到本地
          this.saveGraph(tempDetail)
        }
      },
      async postData(tempDetail) {
        let res = await this.$http.post('/OpsDev/taskTemplate/saveOrUpdateTaskTemplateDetails', tempDetail)
        if(res.status == 'success') {
          this.$message({
            type: "success",
            message: `${res.msg}`
          });
        }else if(res.status == 'fail') {
          this.$message.error(`上传失败，${res.msg}`)
        }
      },
      saveGraph(tempDetail) {
        if(tempDetail) {
           window.localStorage.setItem(
            "graphData",
            JSON.stringify({ [tempDetail.taskId]: tempDetail })
            );
           this.$message({
            type: "success",
            message: "草稿保存成功"
          });
        }
      },
      validateData(edges, nodes) {
        if(!edges||!nodes) {
          return
        }
        const sourceIds = edges.map(edge => edge.source);
        const targetIds = edges.map(edge => edge.target);
        // 1. 过滤出开始和结束节点
        const startNodes = nodes.filter(item => item.label == "开始");
        const endNodes = nodes.filter(item => item.label == "结束");
        const otherNodes = nodes.filter(
          item => item.sign !== "start" && item.sign !== "end"
        );
        let isFlag = true
        const ids = otherNodes.map(node => node.id);
        if (startNodes.length !== 1) {
          this.$message.error("开始节点必须有且唯一");
          return false;
        }
        if (endNodes.length != 1) {
          this.$message.error("结束节点必须有且唯一");
          return false;
        }
        // 开始节点必须有出线
        if (!sourceIds.includes(startNodes[0].id)) {
          this.$message.error("开始节点连线错误");
          return false;
        }
        // 结束节点必须有入线
        if (!targetIds.includes(endNodes[0].id)) {
          this.$message.error("结束节点连线错误");
          return false;
        }
        // 遍历除开始结束之外的节点，这些节点必须既有入线也有出线
        ids.forEach(id => {
          if (!sourceIds.includes(id) || !targetIds.includes(id)) {
            this.$message.error("节点连线错误");
            isFlag = false;
          }
        });
        return isFlag;
      }
    },
  }
</script>

<style lang="stylus" scoped>
.editor
  display flex
  flex-direction column
  flex 1
  overflow hidden
.editor-content
  flex 1
  display flex
  overflow: hidden
.canvas
  flex 1
</style>
