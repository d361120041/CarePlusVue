<template>
  <div class="container py-4">
    <h2 class="mb-4">我的預約紀錄</h2>

    <div v-if="appointments.length === 0" class="alert alert-info">
      尚無預約紀錄。
    </div>

    <div v-else>
      <div v-for="appointment in appointments" :key="appointment.appointmentId" class="card mb-3 p-3">
        <h5>預約編號：{{ appointment.appointmentId }}</h5>
        <p>預約時間：{{ formatDate(appointment.appointmentTime) }}</p>
        <p>狀態：{{ appointment.status }}</p>
        <p>價格：{{ appointment.totalPrice }} 元</p>

        <!-- 顯示醫院資訊 -->
        <div v-if="appointment.locationType === '醫院'">
          <h6>醫院資訊</h6>
          <p>醫院名稱：{{ appointment.hospitalName }}</p>
          <p>醫院地址：{{ appointment.hospitalAddress }}</p>
          <p>病房類型：{{ appointment.hospitalWardType }}</p>
          <p>病房號碼：{{ appointment.hospitalWardNumber }}</p>
          <p>病床號碼：{{ appointment.hospitalBedNumber }}</p>
          <p>科別：{{ appointment.hospitalDepartment }}</p>
          <p>運送備註：{{ appointment.hospitalTransportNote }}</p>
        </div>

        <!-- 顯示居家資訊 -->
        <div v-else>
          <h6>居家資訊</h6>
          <p>地址：{{ appointment.homeAddress }}</p>
          <p>運送備註：{{ appointment.homeTransportNote }}</p>
        </div>

        <!-- 顯示病患資訊 -->
        <div v-if="appointment.patientId.length > 0">
          <h6>病患資訊</h6>
          <p>病患姓名：{{ appointment.patients[0].name }}</p>
          <p>病患性別：{{ appointment.patients[0].gender === 1 ? '男性' : '女性' }}</p>
        </div>

        <!-- 顯示看護姓名 -->
        <h6>看護姓名：{{ appointment.caregiverName }}</h6>
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

const router = useRouter()

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

