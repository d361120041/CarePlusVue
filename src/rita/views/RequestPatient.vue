<template>
  <div class="wrapper">
    <!-- 進度指示條 -->
    <div class="progress-bar">
      <div class="progress-step">
        <span class="circle">1</span>
        時間類型
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step active">
        <span class="circle">2</span>
        被照顧者資訊
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step">
        <span class="circle">3</span>
        服務地點
      </div>
    </div>

    <!-- 左右布局 -->
    <div class="container">
      <!-- 左邊區塊 -->
      <div class="main-section">
        <div class="card-section">
          <h3>被照顧者資訊</h3>
          <div class="form-item">
            <label>選擇被照顧者</label>
            <select
              v-model="appointmentStore.appointment.patientId"
              required
              @change="updatePatientInfo"
            >
              <option value="" disabled>請選擇被照顧者</option>
              <option
                v-for="patient in patients"
                :key="patient.patientId"
                :value="patient.patientId"
              >
                {{ patient.name }}
              </option>
            </select>
          </div>
           <!-- 疾病 -->
           <div class="form-item">
            <label>疾病 (可複選)</label>
            <div class="checkbox-group">
              <label
                v-for="(name, id) in appointmentStore.diseaseMap"
                :key="id"
              >
                <input
                  type="checkbox"
                  :value="parseInt(id)"
                   @change="updatePatientInfo"
                  v-model="appointmentStore.appointment.diseaseIds"
                />
                {{ name }}
              </label>
            </div>
            <input
              type="text"
              v-model="appointmentStore.appointment.diseaseOther"
              placeholder="其他疾病補充"
            />
          </div>

          <!-- 身體狀況 -->
          <div class="form-item">
            <label>身體狀況 (可複選)</label>
            <div class="checkbox-group">
              <label
                v-for="(name, id) in appointmentStore.physicalMap"
                :key="id"
              >
                <input
                  type="checkbox"
                  :value="parseInt(id)"
                  @change="updatePatientInfo"
                  v-model="appointmentStore.appointment.physicalIds"
                />
                {{ name }}
              </label>
            </div>
            <input
              type="text"
              v-model="appointmentStore.appointment.physicalOther"
              placeholder="其他身體狀況補充"
            />
          </div>

          <!-- 服務項目 -->
          <div class="form-item">
            <label>服務項目 (可複選)</label>
            <div class="checkbox-group">
              <label
                v-for="(name, id) in appointmentStore.serviceMap"
                :key="id"
              >
                <input
                  type="checkbox"
                  :value="parseInt(id)"
                   @change="updatePatientInfo"
                  v-model="appointmentStore.appointment.serviceIds"
                />
                {{ name }}
              </label>
            </div>
            <input
              type="text"
              v-model="appointmentStore.appointment.serviceOther"
              placeholder="其他服務補充"
            />
          </div>
            <button
              class="submit-btn"
              @click="submitForm"
              :disabled="!isFormComplete"
            >
              下一步：確認服務地點
            </button>
          </div>
        </div>

        <!-- 右邊區塊 -->
        <div class="sidebar">
          <div class="card-section">
            <h3>您的需求資訊</h3>
            <div v-if="appointmentStore.appointment.timeType">
              <p>
                <strong>時間類型：</strong
                >{{
                  appointmentStore.appointment.timeType === "continuous"
                    ? "連續時間"
                    : "多時段預訂"
                }}
              </p>
              <div
                v-if="appointmentStore.appointment.timeType === 'continuous'"
              >
                <p>
                  <strong>服務開始：</strong
                  >{{ formatDateTime(appointmentStore.continuous.startTime) }}
                </p>
                <p>
                  <strong>服務結束：</strong
                  >{{ formatDateTime(appointmentStore.continuous.endTime) }}
                </p>
              </div>
              <div v-else>
                <p>
                  <strong>服務開始日期：</strong
                  >{{ formatDate(appointmentStore.multi.startDate) }}
                </p>
                <p>
                  <strong>服務結束日期：</strong
                  >{{ formatDate(appointmentStore.multi.endDate) }}
                </p>
                <p>
                  <strong>每日開始時間：</strong
                  >{{ formatTime(appointmentStore.multi.dailyStartTime) }}
                </p>
                <p>
                  <strong>每日結束時間：</strong
                  >{{ formatTime(appointmentStore.multi.dailyEndTime) }}
                </p>
              </div>
              <div v-if="appointmentStore.appointment.patientInfo.name">
                <p>
                  <strong>被照顧者：</strong
                  >{{
                    appointmentStore.appointment.patientInfo.name || "未選擇"
                  }}
                </p>
                <p>
                  <strong>性別：</strong
                  >{{
                    appointmentStore.appointment.patientInfo.gender || "未提供"
                  }}
                </p>
              </div>
              <div></div>
              <div>
                <p>
                  <strong>疾病：</strong>{{ selectedDiseaseNames.join("、") }}
                  {{ appointmentStore.appointment.diseaseOther }}
                </p>
                <p>
                  <strong>身體狀況：</strong
                  >{{ selectedPhysicalNames.join("、") }}
                  {{ appointmentStore.appointment.physicalOther }}
                </p>
                <p>
                  <strong>服務項目：</strong
                  >{{ selectedServiceNames.join("、") }} {{ appointmentStore.appointment.serviceOther }}
                </p>
              </div>
            </div>
            <div v-else>
              <p style="color: gray">
                尚未填寫時間資訊，請返回上一步完成填寫。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import { usePatientStore } from "@/stores/PatientStore";

const appointmentStore = useAppointmentStore();
const patientStore = usePatientStore();
const router = useRouter();

const form = ref({
  patientId: "",
  diseases: [],
  diseaseOther: "",
  physicalConditions: [],
  physicalOther: "",
  services: [],
  serviceOther: "",
});

// 確保選項名稱列表是數組
const selectedDiseaseNames = computed(() => {
  return (appointmentStore.appointment.diseaseIds || []).map(
    (id) => appointmentStore.diseaseMap[id] || "未知"
  );
});

const selectedPhysicalNames = computed(() => {
  return (appointmentStore.appointment.physicalIds || []).map(
    (id) => appointmentStore.physicalMap[id] || "未知"
  );
});

const selectedServiceNames = computed(() => {
  return (appointmentStore.appointment.serviceIds || []).map(
    (id) => appointmentStore.serviceMap[id] || "未知"
  );
});

// 取得病患資料
const patients = computed(() => patientStore.myPatients);

onMounted(async () => {
  try {
    await patientStore.fetchMyPatients();
    if (patientStore.myPatients.length > 0) {
      console.log("回來的病患資料：", patientStore.myPatients);
      // 設置初始 patientInfo，如果 patientId 已選擇
      if (appointmentStore.appointment.patientId) {
        const selectedPatient = patientStore.myPatients.find(
          (p) => p.patientId === Number(appointmentStore.appointment.patientId)
        );
        if (selectedPatient) {
          appointmentStore.setPatientInfo(selectedPatient);
        }
      }
    }
  } catch (error) {
    console.error("載入病患資料錯誤：", error);
  }
});


// 計算表單是否完整
const isFormComplete = computed(() => {
  const appointment = appointmentStore.appointment;
  return (
    appointment.patientId &&
    appointment.diseaseIds.length > 0 &&
    appointment.physicalIds.length > 0 &&
    appointment.serviceIds.length > 0
  );
});


// 格式化日期和時間
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 格式化僅日期
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 格式化僅時間
const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

// 提交表單並跳轉到下一頁
const submitForm = () => {
  const appointment = appointmentStore.appointment;
  
  if (!appointment.patientId) return; // 確保選擇了病患

  // 確認至少選了一項疾病、身體狀況和服務項目
  if (
    appointment.diseaseIds.length === 0 ||
    appointment.physicalIds.length === 0 ||
    appointment.serviceIds.length === 0
  ) {
    console.warn("請確保已選擇至少一項疾病、身體狀況和服務項目");
    return;
  }

  console.log("提交表單：", appointment);
  router.push("/request/location"); // 跳轉到服務地點頁面
};

// 当选择病患时，更新病患信息到 AppointmentStore
const updatePatientInfo = () => {
  const selectedPatient = patients.value.find(
    (patient) => patient.patientId === Number(appointmentStore.appointment.patientId)
  );

  if (selectedPatient) {
    appointmentStore.setPatientInfo({
      patientId: selectedPatient.patientId || null,
      name: selectedPatient.name || "",
      gender: selectedPatient.gender === 1 ? "男" : "女",
    });

    console.log("病患資訊已設定：", selectedPatient);
  }
};

// 更新基本選項
const updateBasicDetails = () => {
  appointmentStore.setBasicDetails({
    diseases: form.value.diseaseIds,
    physicalConditions: form.value.physicalIds,
    services: form.value.serviceIds,
  });
};
</script>

<style scoped>
/* ============================== */
/* 全局樣式                       */
/* ============================== */
body {
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ============================== */
/* 進度條樣式                    */
/* ============================== */
.progress-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-left: 30px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #d1d5db;
}

.progress-step.active {
  color: #60a5fa;
}

.progress-step .circle {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #d1d5db;
}

.progress-step.active .circle {
  border-color: #60a5fa;
  color: #60a5fa;
}

.progress-arrow {
  color: #d1d5db;
  font-size: 1.25rem;
}

/* ============================== */
/* 布局容器樣式                  */
/* ============================== */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.main-section {
  flex: 1;
  min-width: 600px;
}

.card-section {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 60px 30px;
}

.sidebar {
  flex: 0 0 300px;
  min-width: 280px;
}

.sidebar h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.sidebar h3::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><path d="M12 5.67v15.56m-7.78-7.78h15.56"/></svg>')
    no-repeat center;
  background-size: 24px;
}

.sidebar p {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0.5rem 0;
}

.main-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

/* ============================== */
/* 表單元素樣式                  */
/* ============================== */
.form-item {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-item label {
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
}

.form-item input:not([type="radio"]):not([type="checkbox"]) {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  color: #4b5563;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.form-item input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* ============================== */
/* 按鈕樣式                      */
/* ============================== */
.submit-btn {
  display: block;
  margin: 2rem auto 0;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 5px;
  background-color: #4db6ac;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #3a9d93;
}

.submit-btn:disabled {
  background-color: #d1d5db;
}
</style>
