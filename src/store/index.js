import Vue from 'vue'
import Vuex from 'vuex'
import dict from './modules/dict'
import drag from './modules/drag'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  modules: {dict, drag},
  state: {
    roleMenuList: [],
    user:{}
  },
  getters: {
    professionList: state => state.dict.professionList,
    equipmentCompanyArr: state => state.dict.equipmentCompanyArr,
    equipmentTypeArr:  state => state.dict.equipmentTypeArr,
    instructTypeArr: state =>state.dict.instructTypeArr,
    companyArr: state => state.dict.companyArr,
    roleMenuList: state => state.roleMenuList,
    user: state => state.user
  },
  mutations: {
    setRoleMenuList(state, arr) {
      state.roleMenuList = arr
    },
    setUser(state, payload) {
      state.user = payload
    }
  },
  plugins: debug ? [createLogger()] : []
})
