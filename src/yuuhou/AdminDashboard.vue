<template>
  <div class="admin-dashboard">
    <h2>照服員管理</h2>

    <!-- 🔍 搜尋框 -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchKeyword" 
        placeholder="🔍 搜尋姓名、Email、電話、性別 或生日"
        class="search-input"
      />
      <button @click="searchCaregivers" class="search-button">搜尋</button>
    </div>

    <div class="card-container">
      <div class="caregiver-card" v-for="caregiver in filteredCaregivers" :key="caregiver.caregiverId">
        <div class="card-left">
          <img 
            :src="caregiver.photo ? `data:image/jpeg;base64,${caregiver.photo}` : '/default-avatar.jpg'" 
            alt="大頭貼" 
            class="avatar" 
          />
          <div class="caregiver-info">
            <h3>{{ caregiver.caregiverName }}</h3>
            <div class="caregiver-details">
              <span class="detail-item email">📧 {{ caregiver.email }}</span>
              <span class="detail-item phone">📞 {{ caregiver.phone }}</span>
              <span class="detail-item birthday">🎂 {{ formatBirthday(caregiver.birthday) }}</span>
              <span class="detail-item gender">👫 {{ caregiver.gender }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="card-actions">
          <button @click="editCaregiver(caregiver)" class="edit-button">📝 編輯</button>
          <button @click="deleteCaregiver(caregiver.caregiverId)" class="delete-button">🗑️ 刪除</button>
        </div>
      </div>
    </div>

    <!-- 使用編輯組件 -->
    <EditCaregiver
      v-if="isEditing"
      :caregiver="currentCaregiver"
      :show="isEditing"
      @update="saveCaregiver"
      @close="cancelEdit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/plugins/axios";
import { useCaregiverAuth } from "@/stores/useCaregiverAuth";
import EditCaregiver from "@/yuuhou/EditCaregiver.vue";

const caregivers = ref([]);
const isEditing = ref(false);
const currentCaregiver = ref({});
const searchKeyword = ref("");
const authStore = useCaregiverAuth();

onMounted(async () => {
  try {
    const response = await axios.get("/admin/caregivers", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    caregivers.value = response.data;
  } catch (error) {
    console.error("取得照顧者資料失敗", error);
  }
});

// ✅ 動態過濾搜尋結果
const filteredCaregivers = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();
  if (!keyword) return caregivers.value;

  return caregivers.value.filter((caregiver) => {
    const nameMatch = caregiver.caregiverName.toLowerCase().includes(keyword);
    const emailMatch = caregiver.email.toLowerCase().includes(keyword);
    const phoneMatch = caregiver.phone && caregiver.phone.includes(keyword);
    const genderMatch = caregiver.gender && caregiver.gender.includes(keyword);
    const birthdayMatch = caregiver.birthday && caregiver.birthday.includes(keyword);
    return nameMatch || emailMatch || phoneMatch || genderMatch || birthdayMatch;
  });
});

const searchCaregivers = () => {
  searchKeyword.value = searchKeyword.value.trim();
};

const formatBirthday = (birthday) => {
  if (!birthday) return "未設定";
  const date = new Date(birthday);
  return date.toISOString().slice(0, 10);
};

const editCaregiver = (caregiver) => {
  currentCaregiver.value = { ...caregiver };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  currentCaregiver.value = {};
};

const saveCaregiver = async (updatedCaregiver) => {
  try {
    await axios.put(`/admin/caregivers/${updatedCaregiver.caregiverId}`, updatedCaregiver, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    const index = caregivers.value.findIndex(c => c.caregiverId === updatedCaregiver.caregiverId);
    if (index !== -1) {
      caregivers.value[index] = updatedCaregiver;
    }
    alert("✅ 照顧者資料已成功更新！");
    isEditing.value = false;
  } catch (error) {
    console.error("儲存照顧者資料失敗", error);
    alert("❌ 無法儲存變更！");
  }
};

const deleteCaregiver = async (id) => {
  if (confirm("確定要刪除這位照顧者嗎？")) {
    try {
      await axios.delete(`/admin/caregivers/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      caregivers.value = caregivers.value.filter(c => c.caregiverId !== id);
      alert("✅ 照顧者已成功刪除！");
    } catch (error) {
      console.error("刪除照顧者失敗", error);
      alert("❌ 刪除失敗！");
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.search-input {
  width: 600px;
  padding: 0.75rem;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-button:hover {
  background-color: #0056b3;
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.caregiver-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 90px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.caregiver-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-left {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.caregiver-info {
  margin-left: 15px;
  flex-grow: 1;
}

.caregiver-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  margin-top: 5px;
}

.detail-item {
  white-space: nowrap;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.edit-button,
.delete-button {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
  min-width: 80px;
  text-align: center;
}

.edit-button {
  background-color: #40c057;
  color: white;
}

.delete-button {
  background-color: #fa5252;
  color: white;
}

.edit-button:hover {
  background-color: #37b24d;
}

.delete-button:hover {
  background-color: #f03e3e;
}

</style>
