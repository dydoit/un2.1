import axios from 'axios'
const state = {
  professionList: [], // 专业列表
  equipmentCompanyArr: [], //设备厂商
  equipmentTypeArr: [], //设备类型
  companyArr: [], // 所属公司
  instructTypeArr: [],  // 指令类型
  instructTypeObj: {}, // 指令对象，用来甄别不同类型的指令预览
}
const getters = {
  instructTypeObj(state) {
    return state.instructTypeObj
  },
  equipObj(state) {
    return state.equipmentTypeArr.reduce((last, cur) => {
      return {
        ...last,
        [cur.dictValue]: cur.dictNameZh
      }
    }, {})
  },
  equipCompanyObj(state) {
    return state.equipmentCompanyArr.reduce((last, cur) => {
      return {
        ...last,
        [cur.dictValue]: cur.dictNameZh
      }
    },{})
  },
  professionObj(state) {
    return state.professionList.reduce((last, cur) => {
      return {
        ...last,
        [cur.dictValue]: cur.dictNameZh
      }
    },{})
  },
  companyObj(state) {
    return state.companyArr.reduce((last, cur) => {
      return {
        ...last,
        [cur.dictValue]: cur.dictNameZh
      }
    },{})
  }

}
const mutations = {
  SET_PROFESSION_ARR(state, list) {
    state.professionList = list
  },
  SET_EQUIP_COMP(state, list) {
    state.equipmentCompanyArr = list
  },
  SET_EQUIPTYPE_ARR(state, list) {
    state.equipmentTypeArr = list
  },
  SET_COMPANY_ARR(state, list) {
    state.companyArr = list
  },
  SET_INSTRUCT_TYPE_ARR(state, list) {
    state.instructTypeArr = list
  },
  SET_INSTRUCT_TYPE_OBJ(state, obj) {
    state.instructTypeObj = obj
  }
}

const actions = {
  // 获取专业列表
  async get_profess({commit}) {
    let list  = await axios.get('/OpsDev/dicts/getDictsByType?dictValue=1&level=2')
    commit('SET_PROFESSION_ARR', list)
  },
  async get_equipCom({commit}) {
    let list  = await axios.get('/OpsDev/dicts/getDictsByType?dictValue=2&level=2')
    commit('SET_EQUIP_COMP', list)
  },
  async get_equipType({commit}) {
    let list  = await axios.get('/OpsDev/dicts/getDictsByType?dictValue=3&level=2')
    commit('SET_EQUIPTYPE_ARR', list)
  },
  async get_comp({commit}) {
    let list  = await axios.get('/OpsDev/dicts/getDictsByType?dictValue=4&level=2')
    commit('SET_COMPANY_ARR', list)
  },
  async get_instructType({commit}) {
    let list  = await axios.get('/OpsDev/dicts/getDictsByType?dictValue=5&level=2')
    commit('SET_INSTRUCT_TYPE_ARR', list)
  },
  async get_instructTypeList({commit}) {
    let list = await axios.get('/OpsDev/dicts/getOrderAssembleTypeList')
    let obj = list.reduce((last,cur) => {
      return {
        ...last,
        [cur.equipmentCompany+cur.equipmentType]:cur.type
      }
    },{})
    commit('SET_INSTRUCT_TYPE_OBJ', obj)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
