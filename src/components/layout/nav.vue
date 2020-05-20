<template>
  <div class="head">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/network" v-if="handleShow(1001)">网元管理</el-menu-item>
      <el-submenu index="/my" v-if="handleShow(1003)">
        <template slot="title">我的</template>
        <el-menu-item index="/home/my-instruction" v-if="handleShow(100301)">
         我的指令
        </el-menu-item>
        <el-menu-item index="/home/my-instruction-temp" v-if="handleShow(100302)">
         我的指令模板
        </el-menu-item>
        <el-menu-item index="/home/my-task-temp" v-if="handleShow(100302)">
         我的任务模板
        </el-menu-item>
        <el-menu-item index="/home/my-task" v-if="handleShow(100304)">
         我的任务
        </el-menu-item>
      </el-submenu>
      <el-submenu index="/setup" v-if="handleShow(1004)">
        <template slot="title">系统设置</template>
        <el-menu-item index="/role-set" v-if="user.roleid==1">角色管理</el-menu-item>
        <el-menu-item index="/member-set" v-if="handleShow(100402)">用户管理</el-menu-item>
        <el-menu-item index="/log-set" v-if="handleShow(100403)">日志管理</el-menu-item>
        <!-- <el-menu-item index="/dict-set">字典项</el-menu-item> -->
      </el-submenu>
    </el-menu>
    <div class="user-wrapper" v-if="value">
      <p>
        <span>所在公司：{{companyObj[value.orgCode]}}</span>
        <span>所属专业：{{professionObj[value.profession]}}</span>
      </p>
      <div>
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link user-avator">
            <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
            <i class="name">{{value.name}}</i>
            <i class="el-icon-arrow-down icondown"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    name: 'Nav',
    props:['value'],
    data() {
      return {
        activeIndex: '/',
      };
    },
    created() {
      this.activeIndex = this.$route.meta.parentPath
    },
    computed:{
      ...mapGetters({
        companyObj:'dict/companyObj',
        professionObj:'dict/professionObj',
        roleMenuList: 'roleMenuList',
        user: 'user'
      }),
    },
    watch: {
      "$route.meta"(newV) {
        this.activeIndex = newV.parentPath
      }
    },
    methods: {
      //退出登录
      async logout(){
        let res = await this.$http.get('/OpsDev/login/logout')
        if(res.reurl!=undefined && res.reurl!=null) {
          sessionStorage.removeItem('OpsDevInfo')
          window.location.href = res.reurl
        }
      },
      //导航二级菜单下拉
      handleSelect(key, keyPath) {
        this.$router.push(key)
      },
      handleShow(num) {
        return this.roleMenuList.find(item => item.MENU_ID == num)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  >>>.el-menu.el-menu--horizontal
    border-bottom none
  .head
    display flex
    justify-content space-between
    background-color rgb(84, 92, 100)
  .user-wrapper
    display flex
    align-items center
    color #fff
    p
      margin-right 30px
      span
        margin-left 16px
    .el-avatar
      vertical-align middle
      margin-right 4px
    div
      padding-right 10px
      >>>.el-dropdown
        cursor pointer
        .user-avator
          color #fff
        .icondown
          color: #fff;
          margin-left: 2px;
          transition: transform .3s;
        &:hover .icondown
          transform: rotate(180deg)

</style>
