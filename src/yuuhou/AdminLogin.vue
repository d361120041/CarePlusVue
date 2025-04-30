<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/useAuth'
import axios from '@/plugins/axios'
import { jwtDecode } from 'jwt-decode'  // ✅ 加這行，解析 JWT token

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuth()

const login = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.token

    authStore.login(token)
    localStorage.setItem('token', token)

    const decoded = jwtDecode(token)  // ✅ 解析token
    const role = decoded.role

    if (role === 'ADMIN') {
      alert('✅ 登入成功！轉跳管理者後台')
      router.push('/admin/dashboard')
    } else if (role === 'CAREGIVER') {
      alert('✅ 登入成功！轉跳照顧者後台')
      router.push('/caregiver')
    } else {
      alert('❌ 未知角色，請聯絡管理員')
      router.push('/login')
    }
  } catch (error) {
    console.error(error)
    alert('❌ 帳號或密碼錯誤')
  }
}

// ✅ 註冊
const goRegister = () => {
  router.push('/register')  // ✅ 註冊頁應該是 /register，不是 /caregiverRegister
}

// ✅ 忘記密碼
const goForgot = () => {
  router.push('/forgot')    // ✅ 忘記密碼頁是 /forgot
}
</script>
