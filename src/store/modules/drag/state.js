export default {
  taskId: '',
  currentNodeId: '',
  currentNodeType: 'page',
  command: '' , // 画布命令
  variableList: [
  ], //变量列表
  constantList: [], //常量列表
  startX: '',
  startY: '',
  startLevel: '', // 开始节点的index层级
  startId: '',
  endX: '',
  endY: '',
  endLevel: '', //结束节点的index层级
  endId: '',
  nodes: [], // 所有节点集合
  instructList: [], // 指令节点集
  linkList: [], // 连线节点集
  httpInterfaceList: [], // http节点集
  loopList:[],  // 循环节点集
}
