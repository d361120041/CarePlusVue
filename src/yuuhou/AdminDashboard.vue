<template>
    <div class="admin-dashboard">
      <h2>超級使用者後台 - 照顧者管理</h2>
  
      <table class="caregiver-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>Email</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caregiver in caregivers" :key="caregiver.caregiverId">
            <td>{{ caregiver.caregiverName }}</td>
            <td>{{ caregiver.email }}</td>
            <td>{{ caregiver.status }}</td>
          </tr>
        </tbody>
      </table>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/plugins/axios' // 你自己專案的 axios.js
  import { useAuth } from '@/stores/useAuth'
  
  const caregivers = ref([])
  const authStore = useAuth()
  
  // 一進來頁面就去後端拿資料
  onMounted(async () => {
    try {
      const response = await axios.get('/api/caregivers', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      caregivers.value = response.data
    } catch (error) {
      console.error('取得照顧者資料失敗', error)
    }
  })
  </script>
  
  <style scoped>
  .admin-dashboard {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .caregiver-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .caregiver-table th, .caregiver-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  .caregiver-table th {
    background-color: #007bff;
    color: white;
  }
  </style>
  