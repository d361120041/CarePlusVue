<template>
    <div class="container py-4">
      <h2 class="mb-4">我的預約紀錄</h2>
  
      <div v-if="appointments.length === 0" class="alert alert-info">
        尚無預約紀錄。
      </div>
  
      <div v-else>
        <div v-for="appointment in appointments" :key="appointment.id" class="card mb-3 p-3">
          <h5>預約編號：{{ appointment.id }}</h5>
          <p>預約時間：{{ formatDate(appointment.appointmentTime) }}</p>
          <p>狀態：{{ appointment.status }}</p>
          <p>價格：{{ appointment.totalPrice }} 元</p>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const userId = ref(null)
const appointments = ref([])

const fetchAppointments = async () => {
  try {
    const res = await axios.get(`/api/appointment/user/${userId.value}`)
    appointments.value = res.data
  } catch (err) {
    console.error('無法取得預約資料', err)
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}


onMounted(async () => {
  try {
    const res = await axios.get('/user/profile', { withCredentials: true })
    userId.value = res.data.userId
    await fetchAppointments()
  } catch (err) {
    console.error('無法取得使用者資訊', err)
    router.push('/login')
  }
})
</script>

