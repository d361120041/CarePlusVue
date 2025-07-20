<template>
  <div class="edit-modal" v-if="show">
    <h3>編輯照服員資料</h3>

    <!-- 頭像區塊 -->
    <div class="avatar-section">
      <div class="avatar-wrapper" @click="triggerFileInput">
        <img :src="photoPreviewUrl" alt="目前大頭貼" class="avatar" />
        <div class="avatar-overlay">點擊更換</div>
        <input type="file" ref="fileInput" @change="handlePhotoUpload" accept="image/*" style="display:none" />
      </div>
    </div>

    <label>姓名：</label>
    <input v-model="caregiver.caregiverName" placeholder="姓名" />

    <label>性別：</label>
    <select v-model="caregiver.gender">
      <option value="男">男</option>
      <option value="女">女</option>
    </select>

    <label>生日：</label>
    <input type="date" v-model="formattedBirthday" />

    <label>Email (不可修改)：</label>
    <input v-model="caregiver.email" disabled />

    <label>密碼 (不可修改)：</label>
    <input type="password" :value="hiddenPassword" disabled />

    <label>電話：</label>
    <input v-model="caregiver.phone" placeholder="電話" />

    <label>國籍：</label>
    <input v-model="caregiver.nationality" placeholder="國籍" />

    <label>語言：</label>
    <input v-model="caregiver.languages" placeholder="語言" />

    <label>年資：</label>
    <input type="number" v-model="caregiver.yearOfExperience" min="0" />

    <label>服務城市：</label>
    <input v-model="caregiver.serviceCity" placeholder="服務城市" />

    <label>服務地區：</label>
    <input v-model="caregiver.serviceDistrict" placeholder="服務地區" />

    <label>自我介紹：</label>
    <textarea v-model="caregiver.description" placeholder="自我介紹"></textarea>

    <label>每小時費率：</label>
    <input type="number" v-model="caregiver.hourlyRate" step="0.01" />

    <label>半日費率：</label>
    <input type="number" v-model="caregiver.halfDayRate" step="0.01" />

    <label>全日費率：</label>
    <input type="number" v-model="caregiver.fullDayRate" step="0.01" />

    <div class="buttons">
      <button @click="saveCaregiver">儲存變更</button>
      <button @click="close">取消</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";

const props = defineProps({
  caregiver: Object,
  show: Boolean,
});

const emits = defineEmits(["update", "close"]);
const photoFile = ref(null);
const photoPreviewUrl = ref("");

// 初始化生日和隱藏密碼
const formattedBirthday = ref("");
const hiddenPassword = ref("********");

onMounted(() => {
  // 預設載入大頭貼
  if (props.caregiver.photo) {
    photoPreviewUrl.value = `data:image/jpeg;base64,${props.caregiver.photo}`;
  }
  if (props.caregiver.birthday) {
    formattedBirthday.value = new Date(props.caregiver.birthday).toISOString().slice(0, 10);
  }
  if (props.caregiver.password) {
    hiddenPassword.value = "********";
  }
});

const saveCaregiver = () => {
  // 確保 email 和 password 不會被誤修改
  props.caregiver.email = props.caregiver.email;
  props.caregiver.password = props.caregiver.password;

  // 將生日轉回 Date 格式
  props.caregiver.birthday = new Date(formattedBirthday.value);

  // 處理圖片上傳
  if (photoFile.value) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1]; // 去掉 base64 前綴
      props.caregiver.photo = base64Data;
      photoPreviewUrl.value = `data:image/jpeg;base64,${base64Data}`;
      emits("update", { ...props.caregiver });
    };
    reader.readAsDataURL(photoFile.value);
  } else {
    emits("update", { ...props.caregiver });
  }
};

const handlePhotoUpload = (event) => {
  photoFile.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    photoPreviewUrl.value = reader.result;
  };
  reader.readAsDataURL(photoFile.value);
};

const triggerFileInput = () => {
  const fileInput = document.querySelector("input[type='file']");
  if (fileInput) fileInput.click();
};

const close = () => {
  emits("close");
};
</script>

<style scoped>
.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f9f9f9;
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 999;
  width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid #ddd;
  transition: border-color 0.3s ease;
}

.avatar-wrapper:hover {
  border-color: #007bff;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 123, 255, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  border-radius: 50%;
  transition: opacity 0.3s;
  font-weight: bold;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

label {
  margin-top: 15px;
  display: block;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px 15px;
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
  background-color: #f4faff;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

button {
  flex-grow: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  color: white;
  font-weight: bold;
}

button:first-child {
  background-color: #40c057;
}

button:last-child {
  background-color: #fa5252;
}

button:first-child:hover {
  background-color: #37b24d;
  box-shadow: 0 4px 12px rgba(55, 178, 77, 0.3);
}

button:last-child:hover {
  background-color: #f03e3e;
  box-shadow: 0 4px 12px rgba(240, 62, 62, 0.3);
}

</style>
