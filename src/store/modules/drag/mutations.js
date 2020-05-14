export default {
  clearStore(state) {
    state.taskId = ''
    state.currentNodeId = '',
    state.currentNodeType= 'page'
    state.command= ''   // 画布命令
    state.variableList= [
    ]  //变量列表
    state.constantList= []  //常量列表
    state.startX= ''
    state.startY= ''
    state.startLevel= ''  // 开始节点的index层级
    state.startId= ''
    state.endX= ''
    state.endY= ''
    state.endLevel =  ''  //结束节点的index层级
    state.endId= ''
    state.nodes= []  // 所有节点集合
    state.instructList= []  // 指令节点集
    state.linkList= []  // 连线节点集
    state.httpInterfaceList= []  // http节点集
    state.loopList=[]   // 循环节点集
  },
  initTaskObjFromServer(state, json) {
    let {taskId, taskNodeList,taskParameter,httpInterfaceList,taskNodeLoopList,linkList} = json
    let {constantList, variableList,startX,startY,startLevel,endX,endY,endLevel, startId, endId} = taskParameter
    if(constantList) {
      state.constantList = JSON.parse(constantList)
    }
    if(variableList) {
      state.variableList = JSON.parse(variableList)
    }
    state.startX = startX; state.startY = startY; state.startLevel = startLevel; state.endX = endX; state.endY = endY; state.endLevel = endLevel
    state.startId = startId; state.endId = endId
    if(taskNodeList.length) {
      state.instructList = taskNodeList.map(node =>{
        return {
          id: node.id,
          taskId,
          sign: 'instruct',
          level: node.level-0, // 层级
          nodeName: node.nodeName,
          x: node.x-0,
          y: node.y-0,
          objectType: node.objectType,
          days: node.days,
          times: node.times,
          analysisId: node.analysisId,
          analysisName: node.analysisName,
          orderId: node.orderId,
          orderName: node.orderName,
          orderCode: node.orderCode, // 指令模板对应的指令代码
          orderDescribe: node.orderDescribe, // 指令描述或者指令模板描述
          paramsList: node.paramsList? JSON.parse(node.paramsList): [],
          isUseResult: node.isUseResult,
          resultName: node.resultName
        }
      })
    }
    if(taskNodeLoopList.length) {
      state.loopList = taskNodeLoopList.map(node => {
        return {
          id: node.id,
          taskId,
          sign: 'loop',
          level: node.level-0, // 层级
          nodeName: node.nodeName,
          x: node.x-0,
          y: node.y-0,
          objectType: node.objectType,
          analysisId: node.analysisId,
          analysisName: node.analysisName,
          orderId: node.orderId,
          orderName: node.orderName,
          orderCode: node.orderCode, // 指令模板对应的指令代码
          orderDescribe: node.orderDescribe, // 指令描述或者指令模板描述
          paramsObject: node.paramsObject,
          paramsList: node.paramsList? JSON.parse(node.paramsList): [],
        }
      })
    }
    if(httpInterfaceList.length) {
      state.httpInterfaceList = httpInterfaceList.map(node => {
        return {
          id: node.id,
          taskId,
          sign: 'loop',
          level: node.level-0, // 层级
          interfaceName: node.interfaceName,
          interfaceType: node.interfaceType,
          url: node.url,
          requestType: node.requestType,
          isUseResult: node.isUseResult,
          resultName: node.resultName,
          parameterList: node.parameterList?JSON.parse(node.parameterList): [],
          x: node.x-0,
          y: node.y-0,
        }
      })
    }
    if(linkList.length) {
      state.linkList = linkList.map(link => {
        return {
          id: link.id,
          taskId,
          sign: 'edge',
          level: link.level-0, //线的层级
          sourceAnchor: link.sourceAnchor-0, // 源节点锚点位置
          targetAnchor: link.targetAnchor-0,  // 目标节点锚点位置
          lastNodeId: link.lastNodeId,
          lastNodeType: link.lastNodeType,
          nextNodeId: link.nextNodeId,
          nextNodeType: link.nextNodeType,
          linkName: link.linkName,
          isCheck:link.isCheck, // 0表示默认连线，1表示使用表达式
          leftKey:link.leftKey,
          compareType: link.compareType,
          rightKey: link.rightKey,
          remark: link.remark
        }
      })
    }
  },
  setTaskId(state, id) {
    state.taskId = id
  },
  setNodeType(state, type) {
    state.currentNodeType = type
  },
  setCurrentNodeId(state, id) {
    state.currentNodeId = id
  },
  constAdd(state, payload) {
    state.constantList.push(payload)
  },
  addVar(state, {paramId, paramKey,paramKeyZh}) {
    let index = state.variableList.findIndex(item =>item.paramId==paramId)
    if(index == -1) { // 没有就新增
      state.variableList.push({
        paramId,
        paramKey,
        paramKeyZh,
        paramValue: ''
      })
    }else { // 有就替换
      state.variableList.splice(index, 1, {
        paramId,
        paramKey,
        paramKeyZh,
        paramValue: ''
      })
    }
  },
  varDelete({variableList}, id){
    let index = variableList.findIndex(item => item.paramId === id)
    if(index > -1) {
      variableList.splice(index, 1)
    }
  },
  delConst(state, {paramKey}) {
    if(state.linkList.find(link => link.leftKey == paramKey || link.rightKey == paramKey)) {
      // 说明存在引用，不能删除
      alert('删除失败，有连线引用该常量')
      return
    } else {
      state.constantList = state.constantList.filter(item => item.paramKey!=paramKey)
    }
  },
  updateTask(state, {nodes, edges}){
    if(nodes) {
      // 赋值给nodes集合
     state.nodes = nodes
      // 遍历nodes，找出起始和结束坐标
     const start = nodes.filter(node =>node.sign == 'start')[0]
     const end = nodes.filter(node =>node.sign == 'end')[0]
     state.startX = start? start.x: ''
     state.startLevel = start ? start.index: ''
     state.startY = start? start.y: ''
     state.startId = start?start.id: ''
     state.endX = end? end.x: ''
     state.endY = end? end.y: ''
     state.endLevel = end? end.index: ''
     state.endId = end? end.id: ''
     // 分别找出nodes中instruct、http、loop
     const instructItems = nodes.filter(node => node.sign == 'instruct')
     instructItems.forEach(item => {
       instructUpdate(state, item)
     })
     // http节点
     const httpNodes = nodes.filter(node => node.sign === 'http')
     httpNodes.forEach(item => {
      httpUpdate(state, item)
     })
     // 循环节点
     const loopNodes = nodes.filter(node => node.sign === 'loop')
     loopNodes.forEach(item => loopUpdate(state, item))
    }
    if(edges) {
      edges.forEach(edge => {
        edgeUpdate(state, edge)
      })
    }
  },
  updateCommand(state, name) {
    state.command = name
  },
  handleChangeTask(state, payload) {
    let {sign, id} = payload
    let dataArr = []
    switch(sign) {
      case 'instruct':
        dataArr = state.instructList
       break;
      case 'http':
        dataArr = state.httpInterfaceList
        break
      case 'loop':
        dataArr = state.loopList
        break
      case 'edge':
        dataArr = state.linkList
        break
    }
    let index = dataArr.findIndex(item => item.id == id)
    dataArr.splice(index, 1, payload)
  }
}

function instructUpdate({instructList, taskId}, node) {
  let instruct = instructList.filter(item => item.id===node.id)[0]
  if(!instruct) {
    // 如果不存在就添加
    instructList.push({
      taskId,
      id: node.id,
      sign: 'instruct',
      level: node.index, // 层级
      nodeName: node.label,
      x: node.x,
      y: node.y,
      objectType: '0',
      days: '',
      times: '',
      analysisId: '',
      analysisName: '',
      orderId: '',
      orderName: '',
      orderCode: '', // 指令模板对应的指令代码
      orderDescribe: '', // 指令描述或者指令模板描述
      paramsList: [],
      isUseResult: '0',
      resultName: ''
    })
  }else {
    // 如果有，就替换
    let index = instructList.findIndex(item => item.id === instruct.id)
    let updateInstructItem = {
      ...instruct,
      nodeName: node.label,
      level: node.index,
      x: node.x,
      y: node.y
    }
    instructList.splice(index, 1, updateInstructItem)
  }
}
function edgeUpdate(state, edge) {
  const links = state.linkList
  const nodes = state.nodes
  let index = links.findIndex(link => link.id === edge.id)
  let lastNodeType = nodes.find(node => node.id == edge.source).sign
  let nextNodeType = nodes.find(node => node.id == edge.target).sign
  let linkObj = links[index]
  if(index == -1) {
    links.push({
      id: edge.id,
      taskId: state.taskId,
      level: edge.index, //线的层级
      sourceAnchor: edge.sourceAnchor, // 源节点锚点位置
      targetAnchor: edge.targetAnchor,  // 目标节点锚点位置
      lastNodeId: edge.source,
      lastNodeType: getTypeNum(lastNodeType), // 源节点类型
      nextNodeId: edge.target,
      nextNodeType: getTypeNum(nextNodeType),  // 目标节点类型
      linkName: '线',
      isCheck:'0', // 0表示默认连线，1表示使用表达式
      leftKey:'',
      compareType: '',
      rightKey: '',
      remark: '',
      sign:'edge'
    })
  }else {
    // 如果有，就替换
    let updateLink = {
      ...linkObj,
      sourceAnchor: edge.sourceAnchor,
      targetAnchor: edge.targetAnchor,
      lastNodeType: getTypeNum(lastNodeType),
      nextNodeType: getTypeNum(nextNodeType),
      level: edge.index,
      lastNodeId: edge.source,
      nextNodeId: edge.target,
      label: edge.label
    }
    links.splice(index, 1, updateLink)
  }
}
function httpUpdate({httpInterfaceList, taskId}, node) {
  let httpNode = httpInterfaceList.filter(item =>item.id === node.id)[0]
  if(!httpNode) { // 没有就新增
    httpInterfaceList.push({
      taskId,
      id: node.id,
      sign: 'http',
      level: node.index,
      interfaceName: node.label,
      interfaceType: '1',
      requestType: '1',  // 请求方式get、post, 默认给get
      url: '',
      parameterList: [],
      isUseResult: '0',
      resultName: '' , //返回参数名称
      x: node.x,
      y: node.y
    })
  }else { // 有就替换
    let index = httpInterfaceList.findIndex(http => http.id==node.id)
    httpInterfaceList.splice(index, 1, {
      ...httpNode,
      interfaceName: node.label,
      level: node.index,
      x: node.x,
      y: node.y
    })
  }
}
function loopUpdate({loopList, taskId},node) {
  let loopNode = loopList.filter(item =>item.id === node.id)[0]
  if(!loopNode) {
    loopList.push({
      taskId,
      id: node.id,
      sign: 'loop',
      level: node.index,
      x: node.x,
      y: node.y,
      nodeName: node.label,
      objectType: '0',
      analysisId: '',
      analysisName: '',
      orderId: '',
      orderName: '',
      orderCode: '', // 指令模板对应的指令代码
      orderDescribe: '', // 指令描述或者指令模板描述
      paramsObject: '',// 入参key名
      paramsList: [], //前端要，传给后端时去掉
    })
  }else { // 有就替换
    let index = loopList.findIndex(loop => loop.id==node.id)
    loopList.splice(index, 1, {
      ...loopNode,
      nodeName: node.label,
      level: node.index,
      x: node.x,
      y: node.y
    })
  }
}
function getTypeNum(type) {
  switch(type) {
    case 'start':
      return 1
    case 'end':
      return 2
    case 'http':
      return 3
    case 'loop':
      return 6
    case 'instruct':
      return 5
  }
}
