<template>
    <div class="p-6">
      <h1 class="text-xl font-bold mb-4">看護列表</h1>
      <ul class="grid gap-4">
        <li class="p-4 border rounded" v-for="cg in [1,2,3]" :key="cg">
          看護姓名 {{ cg }} - <router-link :to="`/caregivers/${cg}`">查看</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  </script>