<template>
    <div class="p-6">
      <h1 class="text-xl font-bold">填寫時間需求</h1>
      <form class="grid gap-4 mt-4">
        <input type="date" class="border p-2 rounded" />
        <input type="time" class="border p-2 rounded" />
        <router-link to="/request/patient" class="bg-blue-600 text-white px-4 py-2 rounded">下一步</router-link>
      </form>
    </div>
  </template>
  
  <script setup>
  </script>