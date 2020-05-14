<template>
  <div class="bread-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.meta.parentName" :to="{path: $route.meta.parentPath}">{{$route.meta.parentName}}</el-breadcrumb-item>
      <el-breadcrumb-item >{{$route.meta.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
  }
</script>

<style lang="stylus" scoped>
  .bread-wrapper
    padding 10px 30px
    background #f5f5f5
</style>
