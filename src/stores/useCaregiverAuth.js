import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";
import authApi from "@/api/auth";
import myAxios from "@/plugins/axios";

export const useCaregiverAuth = defineStore("caregiverAuth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const role = ref(localStorage.getItem("role") || null);
  const email = ref(localStorage.getItem("email") || null);
  const photo = ref(localStorage.getItem("photo") || null);
  
  const login = async (emailInput, password) => {
    const { data } = await authApi.login(emailInput, password); // ✅ 呼叫剛剛authApi的login
    setToken(data.token);
  };

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);

    const decoded = jwtDecode(newToken);
    role.value = decoded.role;
    email.value = decoded.sub;

    

    localStorage.setItem("role", decoded.role);
    localStorage.setItem("email", decoded.sub);

    const savedPhoto = localStorage.getItem("photo");
    if (savedPhoto) {
      photo.value = savedPhoto;
    }
  };

  const logout = () => {
    token.value = null;
    role.value = null;
    email.value = null;
    photo.value = null; 
    localStorage.clear();
  };

  const restoreLogin = () => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");
    const savedPhoto = localStorage.getItem("photo"); 

    if (savedToken && savedRole && savedEmail) {
      token.value = savedToken;
      role.value = savedRole;
      email.value = savedEmail;

      if (savedPhoto) {
        photo.value = savedPhoto;
      }
    }

    
  };

  return { token, role, email, photo,login, setToken, logout, restoreLogin };
});