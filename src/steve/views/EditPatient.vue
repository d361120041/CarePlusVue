<template>
  <div class="edit-patient-container">
    <h2 class="form-title">編輯患者</h2>
    <form @submit.prevent="onSubmit">
      <div class="form-row">
        <label>姓名</label>
        <input
          v-model="form.name"
          style="background-color: white"
          type="text"
          required
        />
      </div>

      <div class="form-row">
        <label>生日</label>
        <div class="birthday-group">
          <select v-model="selectedYear">
            <option value="">年</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <select v-model="selectedMonth">
            <option value="">月</option>
            <option v-for="month in 12" :key="month" :value="month">
              {{ month }}
            </option>
          </select>
          <select v-model="selectedDay">
            <option value="">日</option>
            <option v-for="day in availableDays" :key="day" :value="day">
              {{ day }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <label>性別</label>
        <select v-model="form.gender" required>
          <option value="">請選擇</option>
          <option :value="0">女性</option>
          <option :value="1">男性</option>
        </select>
      </div>

      <div class="form-row">
        <label>緊急聯絡</label>
        <input
          v-model="form.emergencyContact"
          type="text"
          style="background-color: white"
        />
      </div>

      <div class="form-row">
        <label>地址</label>
        <input
          v-model="form.address"
          type="text"
          style="background-color: white"
        />
      </div>

      <div class="form-row">
        <label>病患詳情</label>
        <textarea v-model="form.patientDetail" rows="3" />
      </div>

      <div class="form-row">
        <label>過敏史</label>
        <textarea v-model="form.allergies" rows="3" />
      </div>

      <div class="form-row">
        <label>家族病史</label>
        <textarea v-model="form.familyHistory" rows="3" />
      </div>

      <div class="form-row">
        <label>目前用藥</label>
        <textarea v-model="form.currentMedications" rows="3" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save">儲存修改</button>
        <button type="button" @click="cancel" class="btn-cancel">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/plugins/axios";

const route = useRoute();
const router = useRouter();
const patientId = route.params.id;

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

// const loadPatient = async () => {
//   try {
//     const res = await axios.get(`/patient/${patientId}`);
//     form.value = res.data;

//     // 分解生日為 年月日
//     const birth = new Date(form.value.birthday);
//     selectedYear.value = birth.getFullYear();
//     selectedMonth.value = birth.getMonth() + 1;
//     selectedDay.value = birth.getDate();
//   } catch {
//     alert("讀取失敗");
//     router.push("/user-center/patients");
//   }
// };

// const onSubmit = async () => {
//   // 組合生日
//   if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
//     alert("請完整選擇生日");
//     return;
//   }

//   const monthStr = String(selectedMonth.value).padStart(2, "0");
//   const dayStr = String(selectedDay.value).padStart(2, "0");
//   form.value.birthday = `${selectedYear.value}-${monthStr}-${dayStr}`;

//   // 年齡驗證
//   const birthdayDate = new Date(form.value.birthday);
//   const today = new Date();
//   const age =
//     today.getFullYear() -
//     birthdayDate.getFullYear() -
//     (today <
//     new Date(
//       today.getFullYear(),
//       birthdayDate.getMonth(),
//       birthdayDate.getDate()
//     )
//       ? 1
//       : 0);
//   if (age < 18) {
//     alert("患者必須年滿 18 歲");
//     return;
//   }

//   try {
//     await axios.put(`/patient/update/${patientId}`, form.value);
//     alert("更新成功");
//     router.push("/user-center/patients");
//   } catch (err) {
//     alert(err.response?.data || "更新失敗");
//   }
// };

const loadPatient = async () => {
  try {
    const res = await axios.get(`/patient/${patientId}`);
    form.value = res.data;

    // 分解生日為 年月日
    const birth = new Date(form.value.birthday);
    selectedYear.value = birth.getFullYear();
    selectedMonth.value = birth.getMonth() + 1;
    selectedDay.value = birth.getDate();
  } catch {
    await Swal.fire({
      icon: "error",
      title: "讀取失敗",
      text: "將返回患者列表",
      confirmButtonColor: "#d33",
    });
    router.push("/user-center/patients");
  }
};

const onSubmit = async () => {
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

  // 年齡驗證
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
    await axios.put(`/patient/update/${patientId}`, form.value);
    await Swal.fire({
      icon: "success",
      title: "更新成功",
      text: "已儲存患者資訊",
      confirmButtonColor: "#4db6ac",
    });
    router.push("/user-center/patients");
  } catch (err) {
    await Swal.fire({
      icon: "error",
      title: "更新失敗",
      text: err.response?.data || "請稍後再試",
      confirmButtonColor: "#d33",
    });
  }
};

const cancel = () => {
  router.push("/user-center/patients");
};

onMounted(loadPatient);
</script>

<style scoped>
/* 通用輸入框 & 下拉選單 */
input,
select {
  background-color: #fff8f0;
  border: none;
  outline: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

/* 米白色 textarea */
textarea {
  background-color: white; /* 米白色 */
  border: none;
  outline: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

/* Focus 狀態 */
input:focus,
select:focus {
  background-color: #f7f1e8;
}
textarea:focus {
  background-color: #f0eadd; /* 淡米白 */
}

/* 整體內容高度 */
.patients-content {
  height: 100%;
}

/* 編輯患者容器 */
.edit-patient-container {
  background-color: #fff8f0;
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
}

/* 標題 */
.form-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

/* 單行欄位排版 */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.form-row label {
  width: 100px;
  font-weight: 500;
  margin-right: 1rem;
  text-align: right;
}
.form-row input,
.form-row select {
  flex: 1;
  background-color: #fff8f0;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  outline: none;
  font-size: 1rem;
}
.form-row textarea {
  flex: 1;
  resize: vertical;
  min-height: 80px;
  font-size: 1rem;
}

/* 生日選單 */
.birthday-group {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

/* 按鈕列 */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

/* 儲存按鈕 */
.btn-save {
  background-color: #4db6ac;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-save:hover {
  background-color: #3ba99e;
}

/* 取消按鈕 */
.btn-cancel {
  background-color: #ff9999;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-cancel:hover {
  background-color: #ff6666;
}
</style>
