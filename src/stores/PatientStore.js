// stores/PatientStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePatientStore = defineStore('patient', {
  state: () => ({
    myPatients: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyPatients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/patient/my', {
          withCredentials: true
        });
        if (response.status === 200) {
          this.myPatients = response.data;
        } else {
          this.error = `載入病患資料失敗：${response.status} - ${response.data}`;
        }
      } catch (error) {
        this.error = `載入病患資料時發生錯誤：${error.message}`;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getPatientById: (state) => (id) => {
      return state.myPatients.find(patient => patient.patientId === id);
    },
  },
});