<template>
    <div class="edit-service">
      <h2>📍 服務地區與收費設定</h2>
      <form @submit.prevent="handleSave">
        <div>
          <label>服務縣市：</label>
          <input v-model="caregiver.serviceCity" />
        </div>
        <div>
          <label>服務區域：</label>
          <input v-model="caregiver.serviceDistrict" />
        </div>
        <div>
          <label>每小時收費：</label>
          <input v-model.number="caregiver.hourlyRate" type="number" />
        </div>
        <div>
          <label>半天收費：</label>
          <input v-model.number="caregiver.halfDayRate" type="number" />
        </div>
        <div>
          <label>全天收費：</label>
          <input v-model.number="caregiver.fullDayRate" type="number" />
        </div>
        <button type="submit">儲存設定</button>
      </form>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/plugins/axios'
  
  const caregiver = ref({})
  const message = ref('')
  
  onMounted(async () => {
    const res = await axios.get('/api/caregivers/me')
    caregiver.value = res.data
  })
  
  const handleSave = async () => {
    try {
      await axios.put(`/api/caregivers/${caregiver.value.caregiverId}`, caregiver.value)
      message.value = '✅ 更新成功！'
    } catch (err) {
      message.value = '❌ 更新失敗'
    }
  }
  </script>
  
  <style scoped>
  .edit-service {
    max-width: 600px;
    margin: 2rem auto;
  }
  .message {
    margin-top: 1rem;
    color: green;
  }
  </style>
  