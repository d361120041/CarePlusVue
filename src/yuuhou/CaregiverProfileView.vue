<template>
  <div class="profile-container">
    <h2>📝 編輯個人資料</h2>

    <div class="avatar-section">
      <div class="avatar-wrapper" @click="triggerFileInput">
        <img v-if="photoPreviewUrl !== null" :src="photoPreviewUrl" class="avatar" @click.stop="() => console.log('📝 預覽圖片:', photoPreviewUrl.value)" />

        <input type="file" ref="fileInput" @change="handlePhotoUpload" accept="image/*" style="display:none" />
    </div>

      <div class="upload-container">
        <div class="upload-button" @click.stop>
          <button @click="triggerFileInput" type="button">選擇大頭貼</button>
        </div>
        
        <!-- ✅ 上傳成功訊息，只顯示在這裡 -->
        <div v-if="uploadMessage" class="upload-success">{{ uploadMessage }}</div>
      </div>
    </div>
   

    <form @submit.prevent="handleSubmit">
      <div><label>姓名：</label><input v-model="form.caregiverName" required /></div>
      <div><label>性別：</label>
        <select v-model="form.gender" required>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div><label>生日：</label><input v-model="form.birthday" type="date" required /></div>
      <div><label>電話：</label><input v-model="form.phone" maxlength="10" required /></div>
      <div><label>國籍：</label>
        <select v-model="form.nationality">
          <option value="中華民國">中華民國</option>
          <option value="其他">其他</option>
        </select>
        <input v-if="form.nationality === '其他'" v-model="form.customNationality" placeholder="請輸入國籍" />
      </div>
      <div><label>語言：</label>
        <select v-model="form.languages">
          <option value="中文">中文</option>
          <option value="英文">英文</option>
        </select>
      </div>
      <div><label>年資：</label><input v-model.number="form.yearOfExperience" type="number" min="0" /></div>
      <div><label>自我介紹：</label><textarea v-model="form.description" rows="3"></textarea></div>
      <button type="submit">儲存變更</button>
    </form>

    <!-- ✅ 只顯示資料儲存的成功或失敗訊息 -->
    <div v-if="saveMessage" class="message">{{ saveMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useCaregiverAuth } from "@/stores/useCaregiverAuth"; 

const caregiverAuth = useCaregiverAuth();

const form = ref({
  caregiverName: '', gender: '男', birthday: '', phone: '',
  nationality: '中華民國', customNationality: '',
  languages: '中文', yearOfExperience: 0, description: ''
})

const photoPreviewUrl = ref(null);
const uploadMessage = ref('')
const saveMessage = ref('')
onMounted(() => {
  // **確保只在初次載入時設定**
  if (caregiverAuth.photo && caregiverAuth.photo.startsWith("data:image")) {
    console.log("📝 初始化 photoPreviewUrl:", caregiverAuth.photo);
    photoPreviewUrl.value = caregiverAuth.photo;
  }
});
// ✅ 讓點擊圖片也能觸發檔案選擇
// ✅ **修改**: 確保是觸發 ref 而不是創建新 input
const triggerFileInput = () => {
  console.log("📝 觸發檔案選擇"); // **確認**
  const fileInput = document.querySelector("input[type='file']");
  if (fileInput) {
    fileInput.click();
  }
};



// ✅ 處理照片上傳
// ✅ **修改**: 正確處理 JSON 回應
// ✅ **修改**: 確保重新讀取已上傳的照片
// ✅ **正確解析 Blob 為 JSON**
// ✅ **正確解析 Blob 為 JSON**
// ✅ **強制解析 Blob 為 JSON**
// ✅ **強制解析 Blob 為 JSON**
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  console.log("📝 開始上傳檔案:", file);
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem("token");
    console.log("📝 取得 token:", token); 

    const response = await axios.post("/api/caregivers/photo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',  // **強制設定為 Blob**
    });

    // ✅ **手動解析 Blob 為 JSON**
    const jsonResponse = await response.data.text();
    const jsonData = JSON.parse(jsonResponse);
    console.log("📝 手動解析後端回應:", jsonData);

    if (jsonData && jsonData.photo) {
      const base64Photo = jsonData.photo;
      console.log("📝 設定 photoPreviewUrl:", base64Photo);
      
      // ✅ **正確設定預覽圖片**
      photoPreviewUrl.value = base64Photo;
      uploadMessage.value = '✅ 上傳成功';

      // ✅ **同步 Pinia 狀態**
      caregiverAuth.photo = base64Photo;
      localStorage.setItem("photo", base64Photo);  // **同步 localStorage**
    }

  } catch (err) {
    console.error("❌ 上傳失敗", err);
    uploadMessage.value = '❌ 上傳大頭貼失敗';
  }
};


// ✅ 正確獲取個人資料，包括照片
// ✅ **修改**: 確保 photo 是正確的 base64 字串
// ✅ **確認**: 確保不覆蓋新圖片
// ✅ **新增**: 同步 Pinia 狀態
const fetchProfile = async () => {
  try {
    const { data } = await axios.get('/api/caregivers/me');
    form.value = { ...data };
    console.log("📝 載入個人資料:", data);
// ✅ **同步 Pinia 狀態**
// ✅ **避免覆蓋新上傳的圖片**
if (data.photo && data.photo.startsWith("data:image")) {
    if (!photoPreviewUrl.value || photoPreviewUrl.value === caregiverAuth.photo) {
        photoPreviewUrl.value = data.photo;
        console.log("📝 設定 photoPreviewUrl (from profile):", data.photo);
    }

    if (!caregiverAuth.photo || caregiverAuth.photo === photoPreviewUrl.value) {
        caregiverAuth.photo = data.photo;
        localStorage.setItem("photo", data.photo);  // ✅ **同步 localStorage**
    }
}

  } catch (err) {
    console.error("❌ 無法載入個人資料", err);
    saveMessage.value = '⚠️ 無法載入個人資料';
  }
};






// ✅ 處理照片上傳
// ✅ 處理照片上傳


// ✅ 處理表單儲存
const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    // 🛠️ 準備要發送的資料
    const payload = {
      caregiverName: form.value.caregiverName || "",
      gender: form.value.gender || "男",
      birthday: form.value.birthday || "",
      phone: form.value.phone || "",
      nationality: form.value.nationality === "其他" ? form.value.customNationality || "" : form.value.nationality,
      languages: form.value.languages || "中文",
      yearOfExperience: form.value.yearOfExperience || 0,
      description: form.value.description || ""
    };

    // ✅ 送出請求
    await axios.put('/api/caregivers/me', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    saveMessage.value = '✅ 資料更新成功！';
  } catch (err) {
    console.error("❌ 資料儲存失敗", err);
    saveMessage.value = '❌ 資料儲存失敗';
  }
}


onMounted(fetchProfile);
</script>



<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}


/* ✅ 讓預覽和按鈕分開 */
.avatar-wrapper {
  width: 150px;
  height: 150px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  cursor: pointer;
  margin-bottom: 10px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}


/* ✅ 圖片樣式 */



.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.2s;
}



.avatar-wrapper:hover .avatar-overlay {
  opacity: 0.5;
}

.avatar-section input[type="file"] {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.message {
  margin-top: 1rem;
  color: green;
}

.upload-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ✅ 中心化上傳按鈕 */
.upload-button {
  background-color: #007bff;
  color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: bold;
}

.upload-button button:hover {
  text-decoration: underline;
}

.upload-success {
  background-color: #28a745;
  color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
