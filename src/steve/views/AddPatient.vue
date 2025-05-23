<template>
  <div class="patients-content">
    <div class="form-card">
      <h2 class="text-xl font-bold mb-4">新增家屬</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <p v-if="patientCount >= 5" class="text-red-500 mb-2">
          已達上限，最多只能新增五位病患。
        </p>

        <!-- 姓名 -->
        <div style="margin-bottom: 1rem">
          <label class="block font-medium mb-1">姓名</label>
          <input
            style="margin-left: 96px"
            v-model="form.name"
            type="text"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
            required
          />
        </div>

        <!-- 生日 -->
        <div
          style="
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <label style="width: 80px">生日</label>
          <select
            style="margin-left: 35px"
            v-model="selectedYear"
            class="birth-select"
            :disabled="patientCount >= 5"
          >
            <option value="">年</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <select
            v-model="selectedMonth"
            class="birth-select"
            :disabled="patientCount >= 5"
          >
            <option value="">月</option>
            <option v-for="month in 12" :key="month" :value="month">
              {{ month }}
            </option>
          </select>
          <select
            v-model="selectedDay"
            class="birth-select"
            :disabled="patientCount >= 5"
          >
            <option value="">日</option>
            <option v-for="day in availableDays" :key="day" :value="day">
              {{ day }}
            </option>
          </select>
        </div>

        <!-- 性別 -->
        <div style="margin-bottom: 1rem">
          <label class="block font-medium mb-1">性別</label>
          <select
            style="margin-left: 96px"
            v-model="form.gender"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
            required
          >
            <option value="">請選擇</option>
            <option :value="0">女性</option>
            <option :value="1">男性</option>
          </select>
        </div>

        <!-- 緊急聯絡人 -->
        <div style="margin-bottom: 1rem">
          <label class="block font-medium mb-1">緊急聯絡人電話</label>
          <input
            style="margin-left: 17px"
            v-model="form.emergencyContact"
            type="text"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          />
        </div>

        <!-- 地址 -->
        <div style="margin-bottom: 1rem">
          <label class="block font-medium mb-1">地址</label>
          <input
            v-model="form.address"
            style="margin-left: 96px"
            type="text"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">家屬詳情</label>
          <br />
          <textarea
            style="width: 70%; height: 100px"
            v-model="form.patientDetail"
            rows="3"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          ></textarea>
        </div>

        <div>
          <label class="block font-medium mb-1">過敏史</label>
          <br />
          <textarea
            style="width: 70%; height: 100px"
            v-model="form.allergies"
            rows="3"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          ></textarea>
        </div>

        <div>
          <label class="block font-medium mb-1">家族病史</label>
          <br />
          <textarea
            style="width: 70%; height: 100px"
            v-model="form.familyHistory"
            rows="3"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          ></textarea>
        </div>

        <div>
          <label class="block font-medium mb-1">用藥紀錄</label>
          <br />

          <textarea
            style="width: 70%; height: 100px"
            v-model="form.currentMedications"
            rows="3"
            class="w-full border rounded p-2"
            :disabled="patientCount >= 5"
          ></textarea>
        </div>

        <div class="flex space-x-4">
          <button type="submit" class="btn-fav" :disabled="patientCount >= 5">
            提交
          </button>
          <button type="button" @click="cancel" class="btn-cancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";
import Swal from "sweetalert2";

const router = useRouter();
const form = ref({
  name: "",
  birthday: "",
  gender: "",
  emergencyContact: "",
  address: "",
  patientDetail: "",
  allergies: "",
  familyHistory: "",
  currentMedications: "",
});

const patientCount = ref(0);

// 年月日選單
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);
const selectedYear = ref("");
const selectedMonth = ref("");
const selectedDay = ref("");

const availableDays = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return [];
  const daysInMonth = new Date(
    selectedYear.value,
    selectedMonth.value,
    0
  ).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
});

// 取得目前病患數量
onMounted(async () => {
  try {
    const res = await axios.get("/patient/my");
    patientCount.value = res.data.length;
  } catch {
    patientCount.value = 0;
  }
});

const onSubmit = async () => {
  if (patientCount.value >= 5) {
    await Swal.fire({
      icon: "warning",
      title: "人數限制",
      text: "已達上限，無法新增更多病患",
      confirmButtonColor: "#f6c343",
    });
    return;
  }

  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
    await Swal.fire({
      icon: "warning",
      title: "請完整選擇生日",
      confirmButtonColor: "#f6c343",
    });
    return;
  }

  const monthStr = String(selectedMonth.value).padStart(2, "0");
  const dayStr = String(selectedDay.value).padStart(2, "0");
  form.value.birthday = `${selectedYear.value}-${monthStr}-${dayStr}`;

  const birthdayDate = new Date(form.value.birthday);
  const today = new Date();
  const age =
    today.getFullYear() -
    birthdayDate.getFullYear() -
    (today <
    new Date(
      today.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    )
      ? 1
      : 0);

  if (age < 18) {
    await Swal.fire({
      icon: "warning",
      title: "年齡限制",
      text: "患者必須年滿 18 歲",
      confirmButtonColor: "#f6c343",
    });
    return;
  }

  try {
    await axios.post("/patient/add", form.value);
    await Swal.fire({
      icon: "success",
      title: "新增成功",
      text: "已成功新增患者",
      confirmButtonColor: "#4db6ac",
    });
    router.push("/user-center/patients");
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: "error",
      title: "新增失敗",
      text: err.response?.data || "請稍後再試",
      confirmButtonColor: "#d33",
    });
  }
};

const cancel = () => {
  router.push("/user-center/patients");
};
</script>

<style scoped>
.patients-content {
  min-height: 100vh;
  background-color: #fff8f0;
  padding: 1rem; /* 保留內距，不擠邊 */
}

.form-card {
  background-color: #fff7ed; /* ✅ 柔和米白卡片 */
  padding: 0.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
}

.btn-fav {
  background-color: #ff8c42;
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  border: 2px solid #ff8c42;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-fav:hover {
  background-color: #ffa76b;
  border-color: #ffa76b;
}

.btn-fav:disabled {
  background-color: #ffd9b3;
  border-color: #ffd9b3;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #ccc;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-cancel:hover {
  background-color: #aaa;
}
</style>
