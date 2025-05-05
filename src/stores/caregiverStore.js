import { defineStore } from 'pinia'

export const useCaregiverStore = defineStore('caregiver', {
  state: () => ({
    // ⬇️ 對應 API 參數
    filters: {
      serviceCity: '',
      serviceDistrict: '',
      desiredStartTime: '', // ISO 格式字串 e.g. 2025-05-02T10:00:00
      desiredEndTime: '',   // ISO 格式字串
      gender: null,
      nationality: null,
      languages: null,
      hourlyRateMin: null,
      hourlyRateMax: null
    },

    caregivers: [], // API 回傳的搜尋結果
    selectedCaregiver: null // 點進個人頁用
  }),

  actions: {
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    setCaregivers(list) {
      this.caregivers = list
    },
    selectCaregiver(caregiver) {
      this.selectedCaregiver = caregiver
    },
    resetFilters() {
      this.filters = {
        serviceCity: '',
        serviceDistrict: '',
        desiredStartTime: '',
        desiredEndTime: '',
        gender: null,
        nationality: null,
        languages: null,
        hourlyRateMin: null,
        hourlyRateMax: null
      }
    },
    resetAll() {
      this.resetFilters()
      this.caregivers = []
      this.selectedCaregiver = null
    }
  }
})
