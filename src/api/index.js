import axios from 'axios'
// 添加响应拦截器
axios.interceptors.response.use((res) =>{
  if(res.data.status === 302) {
    sessionStorage.removeItem('OpsDevInfo')
    sessionStorage.removeItem('setRoleMenuList')
    window.location.href = res.data.url
  }
  if(res.data.status === 499) {
    alert('您无权限操作此项')
  }
  return res.data
})
export default axios
