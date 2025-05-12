<template>
  <div class="wrapper">
    <!-- 進度指示條 -->
    <div class="progress-bar">
      <div class="progress-step">
        <span class="circle">1</span>
        時間類型
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step">
        <span class="circle">2</span>
        被照顧者資訊
      </div>
      <span class="progress-arrow">></span>
      <div class="progress-step active">
        <span class="circle">3</span>
        服務地點
      </div>
    </div>

    <!-- 左右布局 -->
    <div class="container">
      <!-- 左邊區塊 -->
      <div class="main-section">
        <div class="card-section">
          <h3>服務地點及服務項目</h3>

          <!-- 选择医院或居家 -->
          <div class="form-item">
            <label>選擇服務地點</label>
            <div>
              <label>
                <input
                  type="radio"
                  v-model="appointmentStore.appointment.locationType"
                  value="醫院"
                />
                醫院
              </label>
              <label>
                <input
                  type="radio"
                  v-model="appointmentStore.appointment.locationType"
                  value="居家"
                />
                居家
              </label>
            </div>
          </div>

          <!-- 医院地址表单 -->
          <div v-if="appointmentStore.appointment.locationType === '醫院'">
            <div class="form-item">
              <label>醫院名稱 *</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalName"
                required
              />
            </div>
            <div class="form-item">
              <label>醫院地址 *</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalAddress"
                required
              />
            </div>
            <div class="form-item">
              <label>病房類別 *</label>
              <select
                v-model="appointmentStore.appointment.hospitalWardType"
                required
              >
                <option value="一般病房">一般病房</option>
                <option value="急診室">急診室</option>
              </select>
            </div>
            <div class="form-item">
              <label>病房號碼 *</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalWardNumber"
                required
              />
            </div>
            <div class="form-item">
              <label>病床號碼 *</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalBedNumber"
                required
              />
            </div>
            <div class="form-item">
              <label>科别</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalDepartment"
              />
            </div>
            <div class="form-item">
              <label>交通路線或注意事项</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.hospitalTransportNote"
              />
            </div>
          </div>

          <!-- 居家地址表单 -->
          <div v-if="appointmentStore.appointment.locationType === '居家'">
            <div class="form-item">
              <label>居家地址 *</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.homeAddress"
                required
              />
            </div>
            <div class="form-item">
              <label>交通路線或注意事项</label>
              <input
                type="text"
                v-model="appointmentStore.appointment.homeTransportNote"
              />
            </div>
          </div>

          <!-- 下一步按钮 -->
          <button
            class="submit-btn"
            @click="submitForm"
            :disabled="!isFormComplete"
          >
            下一步：確認預約單
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

            <div v-if="appointmentStore.appointment.timeType === 'continuous'">
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
                >{{
                  formatTime(appointmentStore.multi.timeSlots[0]?.startTime)
                }}
              </p>
              <p>
                <strong>每日結束時間：</strong
                >{{ formatTime(appointmentStore.multi.timeSlots[0]?.endTime) }}
              </p>
            </div>

            <div>
              <p>
                <strong>病患：</strong
                >{{ appointmentStore.appointment.patientInfo.name }}
              </p>
              <p>
                <strong>性別：</strong
                >{{ appointmentStore.appointment.patientInfo.gender }}
              </p>
              <p>
                <strong>疾病：</strong
                >{{
                  appointmentStore.appointment.diseaseIds
                    .map((id) => appointmentStore.diseaseMap[id])
                    .join("、")
                }}
                {{ appointmentStore.appointment.diseaseOther }}
              </p>
              <p>
                <strong>身體狀況：</strong
                >{{
                  appointmentStore.appointment.physicalIds
                    .map((id) => appointmentStore.physicalMap[id])
                    .join("、")
                }}
                {{ appointmentStore.appointment.physicalOther }}
              </p>
              <p>
                <strong>服務項目：</strong
                >{{
                  appointmentStore.appointment.serviceIds
                    .map((id) => appointmentStore.serviceMap[id])
                    .join("、")
                }}
                {{ appointmentStore.appointment.serviceOther }}
              </p>
            </div>

            <!-- 显示服务地点 -->
            <div>
              <p>
                <strong>服務地點：</strong
                >{{
                  appointmentStore.appointment.locationType === "醫院"
                    ? "醫院"
                    : "居家"
                }}
              </p>
              <p
                v-if="appointmentStore.appointment.locationType === '醫院'"
              >
                <strong>醫院名稱：</strong
                >{{ appointmentStore.appointment.hospitalName }}<br />
                <strong>醫院地址：</strong
                >{{ appointmentStore.appointment.hospitalAddress }}<br />
                <strong>病房類別：</strong
                >{{ appointmentStore.appointment.hospitalWardType }}<br />
                <strong>病房號：</strong
                >{{ appointmentStore.appointment.hospitalWardNumber }}<br />
                <strong>病床號：</strong
                >{{ appointmentStore.appointment.hospitalBedNumber }}<br />
                <strong>科别：</strong
                >{{ appointmentStore.appointment.hospitalDepartment }}<br />
                <strong>交通路線：</strong
                >{{ appointmentStore.appointment.hospitalTransportNote }}<br />
              </p>
              <p v-if="appointmentStore.appointment.locationType === '居家'">
                <strong>居家地址：</strong
                >{{ appointmentStore.appointment.homeAddress }}<br />
                <strong>交通路線：</strong
                >{{ appointmentStore.appointment.homeTransportNote }}<br />
              </p>
            </div>
          </div>
          <div v-else>
            <p style="color: gray">尚未填写时间信息，请返回上一步完成填写。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppointmentStore } from "@/stores/AppointmentStore";

const appointmentStore = useAppointmentStore();
const router = useRouter();

// // 表单绑定数据
// const form = ref({
//   locationType: appointmentStore.appointment.locationType || "醫院",
//   hospitalName: appointmentStore.appointment.hospitalName || "",
//   hospitalAddress: appointmentStore.appointment.hospitalAddress || "",
//   hospitalWardType: appointmentStore.appointment.hospitalWardType || "",
//   hospitalWardNumber: appointmentStore.appointment.hospitalWardNumber || "",
//   hospitalBedNumber: appointmentStore.appointment.hospitalBedNumber || "",
//   hospitalDepartment: appointmentStore.appointment.hospitalDepartment || "",
//   hospitalTransportNote: appointmentStore.appointment.hospitalTransportNote || "",
//   homeAddress: appointmentStore.appointment.homeAddress || "",
//   homeTransportNote: appointmentStore.appointment.homeTransportNote || "",
// });

// /// 確保即時同步表單數據
// watch(form, (newForm) => {
//   // 同步到 appointmentStore
//   if (newForm.locationType === "醫院") {
//     appointmentStore.appointment.locationType = "醫院";
//     appointmentStore.appointment.hospitalName = newForm.hospitalName;
//     appointmentStore.appointment.hospitalAddress = newForm.hospitalAddress;
//     appointmentStore.appointment.hospitalWardType = newForm.hospitalWardType;
//     appointmentStore.appointment.hospitalWardNumber = newForm.hospitalWardNumber;
//     appointmentStore.appointment.hospitalBedNumber = newForm.hospitalBedNumber;
//     appointmentStore.appointment.hospitalDepartment = newForm.hospitalDepartment;
//     appointmentStore.appointment.hospitalTransportNote = newForm.hospitalTransportNote;
//   } else if (newForm.locationType === "居家") {
//     appointmentStore.appointment.locationType = "居家";
//     appointmentStore.appointment.homeAddress = newForm.homeAddress;
//     appointmentStore.appointment.homeTransportNote = newForm.homeTransportNote;
//   }

//   // 即時保存到 localStorage
//   appointmentStore.saveToLocalStorage();
// }, { deep: true });

/// 計算是否表單已填寫完成
const isFormComplete = computed(() => {
  const appointment = appointmentStore.appointment;
  
  if (appointment.locationType === "醫院") {
    return (
      appointment.hospitalName.trim() !== "" &&
      appointment.hospitalAddress.trim() !== "" &&
      appointment.hospitalWardType.trim() !== "" &&
      appointment.hospitalWardNumber.trim() !== "" &&
      appointment.hospitalBedNumber.trim() !== ""
    );
  } else if (appointment.locationType === "居家") {
    return appointment.homeAddress.trim() !== "";
  }
  return false;
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

/// 提交表單並跳轉到下一頁
const submitForm = () => {
  appointmentStore.saveToLocalStorage();
  router.push({ name: "requestConfirm" });
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
