<template>
    <div class="p-6">
      <h1 class="text-xl font-bold">被照顧者資料</h1>
      <form class="grid gap-4 mt-4">
        <input type="text" placeholder="姓名" class="border p-2 rounded" />
        <input type="number" placeholder="年齡" class="border p-2 rounded" />
        <textarea placeholder="病史 / 需求" class="border p-2 rounded"></textarea>
        <router-link to="/request/location" class="bg-blue-600 text-white px-4 py-2 rounded">下一步</router-link>
      </form>
    </div>
  </template>
  
  <script setup>
  </script>