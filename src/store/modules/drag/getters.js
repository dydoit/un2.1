export const variableList = state => state.variableList
export const constantList = state => state.constantList
export const allVarList = state => {
  return [...state.variableList, ...state.constantList]
}
export const currentNodeType = state => state.currentNodeType
export const currentNodeId = state => state.currentNodeId
export const currentNode = state => {
  let currentNodeType = state.currentNodeType
  let currentNodeId = state.currentNodeId
  if(!currentNodeId) {
    return {}
  }
  if(currentNodeType == 'instruct') {
    return state.instructList.filter(item =>item.id === currentNodeId)[0]
  }
  if(currentNodeType == 'http') {
    return state.httpInterfaceList.filter(item =>item.id === currentNodeId)[0]
  }
  if(currentNodeType == 'loop') {
    return state.loopList.filter(item =>item.id === currentNodeId)[0]
  }
  if(currentNodeType == 'edge') {
    return state.linkList.filter(item =>item.id === currentNodeId)[0]
  }
}
export const command = state => state.command
export const linkList = state =>state.linkList
export const instructList = ({instructList}) => {
  return instructList.map(item => {
    return {
      ...item,
      paramsList: JSON.stringify(item.paramsList)
    }
  })
}
export const httpInterfaceList = ({httpInterfaceList}) => {
  return httpInterfaceList.map(item => {
    return {
      ...item,
      parameterList: JSON.stringify(item.parameterList)
    }
  })
}
export const loopList = ({loopList}) => {
  return loopList.map(item => {
    return {
      ...item
    }
  })
}
export const taskParameter = state => {
  return {
    taskId: state.taskId,
    startX: state.startX,
    startY: state.startY,
    startLevel: state.startLevel,
    startId: state.startId,
    endX: state.endX,
    endY: state.endY,
    endLevel: state.endLevel,
    endId: state.endId,
    variableList: JSON.stringify(state.variableList),
    constantList: JSON.stringify(state.constantList)
  }
}
