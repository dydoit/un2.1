export const permission = {
  inserted(el, binding) {
    const {value} = binding
    const setRoleMenuList = sessionStorage.getItem('setRoleMenuList')?JSON.parse(sessionStorage.getItem('setRoleMenuList')):null
    if(setRoleMenuList) {
      const hasPermission = setRoleMenuList.some(role => role.MENU_ID==value)
      if(!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
