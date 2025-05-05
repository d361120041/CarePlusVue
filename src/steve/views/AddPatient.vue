<template>
  <div class="p-6 bg-white shadow rounded overflow-y-auto h-full">
    <h2 class="text-xl font-bold mb-4">新增患者</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- 患者數量限制提示 -->
      <p v-if="patientCount >= 5" class="text-red-500 mb-2">
        已達上限，最多只能新增五位病患。
      </p>

      <div>
        <label class="block font-medium mb-1">姓名</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
          required
        />
      </div>
      <div>
        <label class="block font-medium mb-1">生日</label>
        <input
          v-model="form.birthday"
          type="date"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
          required
        />
      </div>
      <div>
        <label class="block font-medium mb-1">性別</label>
        <select
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
      <div>
        <label class="block font-medium mb-1">緊急聯絡</label>
        <input
          v-model="form.emergencyContact"
          type="text"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        />
      </div>
      <div>
        <label class="block font-medium mb-1">地址</label>
        <input
          v-model="form.address"
          type="text"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        />
      </div>
      <div>
        <label class="block font-medium mb-1">病患詳情</label>
        <textarea
          v-model="form.patientDetail"
          rows="3"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        ></textarea>
      </div>
      <div>
        <label class="block font-medium mb-1">過敏史</label>
        <textarea
          v-model="form.allergies"
          rows="3"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        ></textarea>
      </div>
      <div>
        <label class="block font-medium mb-1">家族病史</label>
        <textarea
          v-model="form.familyHistory"
          rows="3"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        ></textarea>
      </div>
      <div>
        <label class="block font-medium mb-1">目前用藥</label>
        <textarea
          v-model="form.currentMedications"
          rows="3"
          class="w-full border rounded p-2"
          :disabled="patientCount >= 5"
        ></textarea>
      </div>
      <div class="flex space-x-4">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="patientCount >= 5"
        >
          提交
        </button>
        <button
          type="button"
          @click="cancel"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

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

// 載入當前使用者病患數量
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
    alert("已達上限，無法新增更多病患");
    return;
  }
  try {
    await axios.post("/patient/add", form.value);
    alert("新增患者成功");
    router.push("/user-center/patients");
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "新增失敗");
  }
};

const cancel = () => {
  router.push("/user-center/patients");
};
</script>

<style scoped>
/* 讓表單區滿版高度 */
.patients-content {
  height: 100%;
}
</style>
