<template>
  <table>
    <!-- 历史版本 -->
    <thead>
      <tr>
        <td>版本号</td>
        <td>发布者</td>
        <td>发布时间</td>
        <td>版本说明</td>
        <td>操作</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of list" :key="item.version">
        <td>{{item.version}}</td>
        <td width="10%">{{item.author}}</td>
        <td width="20%">{{item.pubDate}}</td>
        <td>
          {{item.description}}
        </td>
        <td width="10%">
          <el-button type="text">查看代码</el-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    data() {
      return {
        list: [
          {
            version: 'v1.2',
            author: '张三',
            pubDate: '2020-02-30',
            description: '版本说明'
          },
          {
            version: 'v1.1',
            author: '张三',
            pubDate: '2020-02-30',
            description: '版本说明'
          },
          {
            version: 'v1.0',
            author: '张三',
            pubDate: '2020-02-30',
            description: '版本说明'
          }
        ]
      }
    },
  }
</script>

<style lang="stylus" scoped>
table {
  width: 80%;
  margin 0 auto
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  line-height: 1.5;

  thead {
    background-color: #ddd;

    td {
      padding: 6px 0;
    }
  }
  td {
    padding: 2px 4px;
    border: 1px solid #ccc
  }
}
</style>
