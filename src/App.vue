<template>
  <div id="app" v-if="userinfo">
    <Nav :value="userinfo"></Nav>
    <Bread></Bread>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/layout/nav.vue";
import Bread from "@/components/layout/breadcrumb.vue";
export default {
  data() {
    return {
      userinfo: null
    };
  },
  created() {
    this.islogin();
  },
  components: {
    Nav,
    Bread
  },
  methods: {
    async islogin() {
      if (!sessionStorage.getItem("OpsDevInfo")) {
        let hash = window.location.hash
        let hashStr = hash.split('?')[1]
        let hashArr = hashStr? hashStr.split('&') : []
        let params = hashArr.length ? hashArr.reduce((last,cur) => {
          let curArr = cur.split('=')
          return {
            ...last,
            [curArr[0]]: curArr[1]
          }
        },{}) : {}
        let res = await this.$http.get("/OpsDev/login/getSessionUser", {
          params: {
           ...params
          }
        });
        this.userinfo = res;
        let {profession, roleid} = res
        this.$store.commit('setUser', {profession, roleid})
        window.sessionStorage.setItem("OpsDevInfo", JSON.stringify(res));
        window.sessionStorage.setItem('setRoleMenuList', JSON.stringify(res.roleMenuList))
        this.$store.dispatch('dict/get_profess')
        this.$store.dispatch('dict/get_equipCom')
        this.$store.dispatch('dict/get_equipType')
        this.$store.dispatch('dict/get_comp')
        this.$store.dispatch('dict/get_instructType')
        this.$store.commit("setRoleMenuList", res.roleMenuList);
      }else {
         this.$store.dispatch('dict/get_profess')
         this.$store.dispatch('dict/get_equipCom')
         this.$store.dispatch('dict/get_equipType')
         this.$store.dispatch('dict/get_comp')
         this.$store.dispatch('dict/get_instructType')
         this.$store.dispatch('dict/get_instructTypeList')
         this.userinfo = JSON.parse(sessionStorage.getItem("OpsDevInfo"));
         let {profession, roleid} = this.userinfo
         this.$store.commit('setUser', {profession, roleid})
         this.$store.commit("setRoleMenuList", JSON.parse(sessionStorage.getItem("setRoleMenuList")))
         // 请求指令类型

      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
