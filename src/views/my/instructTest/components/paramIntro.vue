<template>
  <table>
    <!-- 参数说明 -->
    <thead>
      <tr>
        <td>参数</td>
        <td>参数中文名称</td>
        <td>参数是否必选</td>
        <td>参数描述</td>
        <td>适用版本</td>
      </tr>
    </thead>
    <tbody v-if="!params.length">
      <tr class="no-data">
        <td colspan="6">暂无参数</td>
      </tr>
    </tbody>
    <tbody>
      <tr
        v-for="(item,index) of params"
        :key="index"
      >
        <td>
          <div
            v-text="item.paramKey"
          >
          </div>
        </td>
        <td>
          <div v-text="item.paramKeyZh">

          </div>
        </td>
        <td class="is-required">
          <select v-model="item.paramNotNull" disabled>
                  <option value=1>是</option>
                  <option value=0>否</option>
          </select>
        </td>
        <td class="intro">
          <div
            contenteditable="false"
            v-html="item.parameterDescribe"
          >
          </div>
        </td>
        <td style="cursor:pointer">
                <!-- 请选择参数适用版本 -->
           <p v-for="version of item.list" :key="version">{{version}}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["params"]
};
</script>

<style lang="stylus" scoped>
.no-data {
  text-align: center;
  color:#ccc;
}
table {
  width: 100%;
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

  .no-param {
    td {
      padding: 6px 0;
    }
  }

  td {
    padding: 2px 4px;
    border: 1px solid #ccc;

    &.is-required {
      width: 9%;
    }

    &.intro {
      width: 35%;
      text-align: left;
    }
  }
}
</style>
