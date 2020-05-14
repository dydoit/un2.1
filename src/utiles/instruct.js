const reg =  /\$\{(.*?)\}/g
export const readzl = (str) => {
  if(typeof(str)!=='string') {
    throw '不是个字符串'
    return false
  }
  let arr = []
  while(true) {
    if(reg.exec(str)!=null) {
      arr.push(RegExp.$1)
    }else{
      break
    }
  }
  return [...new Set(arr)].map(item => ({parameterCode:item, paramVa: '',paramNotNull:'0',parameterDescribe:''}))
}
