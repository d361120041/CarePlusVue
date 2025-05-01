<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">管理患者</h2>

    <!-- 新增 / 編輯 表單 -->
    <form @submit.prevent="onSubmit" class="mb-6 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium mb-1">姓名</label>
          <input
            type="text"
            v-model="form.name"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label class="block font-medium mb-1">生日</label>
          <input
            type="date"
            v-model="form.birthday"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label class="block font-medium mb-1">性別</label>
          <select
            v-model="form.gender"
            class="w-full border rounded p-2"
            required
          >
            <option value="">請選擇</option>
            <option :value="0">女性</option>
            <option :value="1">男性</option>
          </select>
        </div>
        <div>
          <label class="block font-medium mb-1">緊急聯絡</label>
          <input
            v-model="form.emergencyContact"
            type="text"
            class="w-full border rounded p-2"
          />
        </div>
        <div class="col-span-2">
          <label class="block font-medium mb-1">地址</label>
          <input
            v-model="form.address"
            type="text"
            class="w-full border rounded p-2"
          />
        </div>
        <div class="col-span-2">
          <label class="block font-medium mb-1">病患詳情</label>
          <textarea
            v-model="form.patientDetail"
            rows="2"
            class="w-full border rounded p-2"
          ></textarea>
        </div>
        <div class="col-span-2">
          <label class="block font-medium mb-1">過敏史</label>
          <textarea
            v-model="form.allergies"
            rows="2"
            class="w-full border rounded p-2"
          ></textarea>
        </div>
        <div class="col-span-2">
          <label class="block font-medium mb-1">家族病史</label>
          <textarea
            v-model="form.familyHistory"
            rows="2"
            class="w-full border rounded p-2"
          ></textarea>
        </div>
        <div class="col-span-2">
          <label class="block font-medium mb-1">目前用藥</label>
          <textarea
            v-model="form.currentMedications"
            rows="2"
            class="w-full border rounded p-2"
          ></textarea>
        </div>
      </div>

      <div class="flex space-x-4">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ isEditing ? "更新病患" : "新增病患" }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="cancelEdit"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          取消
        </button>
      </div>
    </form>

    <!-- 病患列表 -->
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="px-4 py-2 border">姓名</th>
          <th class="px-4 py-2 border">生日</th>
          <th class="px-4 py-2 border">性別</th>
          <th class="px-4 py-2 border">緊急聯絡</th>
          <th class="px-4 py-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in patients" :key="p.patientId" class="hover:bg-gray-50">
          <td class="px-4 py-2 border">{{ p.name }}</td>
          <td class="px-4 py-2 border">{{ formatDate(p.birthday) }}</td>
          <td class="px-4 py-2 border">
            {{ p.gender === 1 ? "男性" : "女性" }}
          </td>
          <td class="px-4 py-2 border">{{ p.emergencyContact }}</td>
          <td class="px-4 py-2 border space-x-2">
            <button
              @click="editPatient(p)"
              class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              編輯
            </button>
            <button
              @click="deletePatient(p.patientId)"
              class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              刪除
            </button>
          </td>
        </tr>
        <tr v-if="patients.length === 0">
          <td colspan="5" class="px-4 py-2 text-center text-gray-500">
            目前沒有任何病患
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";

const patients = ref([]);
const isEditing = ref(false);
const form = ref({
  name: "",
  birthday: "",
  gender: "",
  patientDetail: "",
  emergencyContact: "",
  address: "",
  allergies: "",
  familyHistory: "",
  currentMedications: "",
  vaccinationHistory: "",
  lifestyleAndRiskFactors: "",
});
let editId = null;

const fetchPatients = async () => {
  try {
    const res = await axios.get("/patient/my");
    patients.value = res.data;
  } catch (err) {
    console.error("載入病患列表錯誤：", err);
    alert("無法取得病患列表，請稍後再試");
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const onSubmit = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/patient/update/${editId}`, form.value);
      alert("病患資料已更新");
    } else {
      await axios.post("/patient/add", form.value);
      alert("新增病患成功");
    }
    resetForm();
    fetchPatients();
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "操作失敗");
  }
};

const editPatient = (p) => {
  isEditing.value = true;
  editId = p.patientId;
  form.value = {
    name: p.name,
    birthday: p.birthday,
    gender: p.gender,
    patientDetail: p.patientDetail,
    emergencyContact: p.emergencyContact,
    address: p.address,
    allergies: p.allergies,
    familyHistory: p.familyHistory,
    currentMedications: p.currentMedications,
    vaccinationHistory: p.vaccinationHistory,
    lifestyleAndRiskFactors: p.lifestyleAndRiskFactors,
  };
};

const deletePatient = async (id) => {
  if (!confirm("確定要刪除此病患？")) return;
  try {
    await axios.delete(`/patient/delete/${id}`);
    alert("刪除成功");
    if (isEditing.value && editId === id) resetForm();
    fetchPatients();
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "刪除失敗");
  }
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  isEditing.value = false;
  editId = null;
  form.value = {
    name: "",
    birthday: "",
    gender: "",
    patientDetail: "",
    emergencyContact: "",
    address: "",
    allergies: "",
    familyHistory: "",
    currentMedications: "",
    vaccinationHistory: "",
    lifestyleAndRiskFactors: "",
  };
};

onMounted(fetchPatients);
</script>

<style scoped>
/* 如需微調可在此加入 */
</style>
