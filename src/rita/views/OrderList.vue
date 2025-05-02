<template>
    <div class="p-6">
      <h1 class="text-xl font-bold">我的預約訂單</h1>
      <ul class="mt-4 grid gap-4">
        <li class="p-4 border rounded" v-for="order in [1,2,3]" :key="order">
          預約編號 #{{ order }} - 狀態：待付款 <router-link :to="`/payment/${order}`" class="text-blue-600">前往付款</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  </script>