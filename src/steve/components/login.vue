<!-- vue 內部的標籤 template/script(js/ts)/ style -->

<template>
  <!-- html 結構-->
  <h3>Login</h3>
  <table>
    <tr>
      <td>ID:</td>
      <td>
        <input type="text" name="username" v-model="username" />
      </td>
      <td>
        <span class="error">{{ message }}</span>
      </td>
    </tr>
    <tr>
      <td>PWD</td>
    </tr>
  </table>
</template>

<script lang="ts" setup name="Person">
import { ref, watch } from "vue";
</script>

<style scoped>
/* 外衣 */
</style>
