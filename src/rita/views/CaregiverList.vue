<template>
  <div class="container">
    <div class="filter-section">
      <div>
        <label for="city">服務縣市：</label>
        <select id="city" v-model="filters.city">
          <option value="">選擇縣市</option>
          <option value="taipei">台北市</option>
          <option value="new-taipei">新北市</option>
          <option value="taoyuan">桃園市</option>
          <option value="taichung">台中市</option>
          <option value="tainan">台南市</option>
          <option value="kaohsiung">高雄市</option>
        </select>
      </div>
      <div>
        <label for="district">地區：</label>
        <select id="district" v-model="filters.district">
          <option value="">選擇地區</option>
          <option value="zhongshan">中山區</option>
          <option value="songshan">松山區</option>
          <option value="datong">大同區</option>
          <option value="zhongzheng">中正區</option>
        </select>
      </div>
      <div>
        <label for="service">服務項目：</label>
        <select id="service" v-model="filters.service">
          <option value="">選擇服務</option>
          <option value="daily-care">生活照護</option>
          <option value="medical-care">醫療照護</option>
          <option value="rehabilitation">復健支持</option>
          <option value="housekeeping">家務協助</option>
        </select>
      </div>
      <div>
        <label for="time">時間：</label>
        <select id="time" v-model="filters.time">
          <option value="">選擇時間</option>
          <option value="morning">上午</option>
          <option value="afternoon">下午</option>
          <option value="evening">晚上</option>
          <option value="full-day">全天</option>
        </select>
      </div>
    </div>
    <div class="header">
      <h1>護理結果，目前共{{ caregivers.length }}位護理員</h1>
      <select v-model="sortOption">
        <option value="price">價格排序</option>
        <option value="rating">評分排序</option>
      </select>
    </div>
    <div class="caregiver-grid">
      <div class="caregiver-card" v-for="caregiver in filteredCaregivers" :key="caregiver.id">
        <img class="caregiver-image" :src="caregiver.image" :alt="`Caregiver ${caregiver.id}`">
        <div class="caregiver-info">
          <h3>{{ caregiver.name }}</h3>
          <div class="caregiver-tags">
            <span v-for="(tag, index) in caregiver.tags" :key="index">{{ tag }}</span>
          </div>
          <p class="caregiver-desc">{{ caregiver.description }}</p>
          <p class="caregiver-price">服務費用每小時 ${{ caregiver.pricePerHour }}（共 ${{ caregiver.totalPriceMin }}）— ${{ caregiver.totalPriceMax }}</p>
          <p class="caregiver-rating">{{ caregiver.rating }} <span>{{ caregiver.ratingStars }}</span>（{{ caregiver.reviews }}個評價）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaregiverList',
  data() {
    return {
      filters: {
        city: '',
        district: '',
        service: '',
        time: ''
      },
      sortOption: 'price',
      caregivers: [
        {
          id: 1,
          name: '張小姐',
          image: 'https://www.photolibrary.jp/mhd1/img569/450-20180213122214.jpg',
          tags: ['熱心', '耐心'],
          description: '熱心！耐心！負責！生活工作',
          pricePerHour: 300,
          totalPriceMin: 2600,
          totalPriceMax: 3300,
          rating: 5.0,
          ratingStars: '★★★★★',
          reviews: 2
        },
        {
          id: 2,
          name: '李小姐',
          image: 'https://plus.unsplash.com/premium_photo-1661700176531-c8bd4603030f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          tags: ['交談技巧', '耐心'],
          description: '交談技巧、服務態度優良',
          pricePerHour: 250,
          totalPriceMin: 2300,
          totalPriceMax: 3000,
          rating: 5.0,
          ratingStars: '★★★★★',
          reviews: 7
        },
        {
          id: 3,
          name: '王小姐',
          image: 'https://images.pexels.com/photos/9893526/pexels-photo-9893526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          tags: ['專業護理', '醫療照護'],
          description: '專業護理，提供醫療照護需求',
          pricePerHour: 400,
          totalPriceMin: 2200,
          totalPriceMax: 3200,
          rating: 0.0,
          ratingStars: '☆☆☆☆☆',
          reviews: 0
        },
        {
          id: 4,
          name: '陳小姐',
          image: 'https://www.photolibrary.jp/mhd3/img283/450-20130312112600103849.jpg',
          tags: ['護理保健', '餵食'],
          description: '專業護理，提供醫療照護需求',
          pricePerHour: 400,
          totalPriceMin: 2200,
          totalPriceMax: 3200,
          rating: 0.0,
          ratingStars: '☆☆☆☆☆',
          reviews: 0
        },
        {
          id: 5,
          name: '秋小姐',
          image: 'https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8',
          tags: ['專業護理', '醫療照護'],
          description: '專業護理，提供醫療照護需求',
          pricePerHour: 400,
          totalPriceMin: 2200,
          totalPriceMax: 3200,
          rating: 0.0,
          ratingStars: '☆☆☆☆☆',
          reviews: 0
        },
        {
          id: 6,
          name: '菜小姐',
          image: 'https://plus.unsplash.com/premium_photo-1661740529633-ab79e4c1d5cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8',
          tags: ['專業護理', '醫療照護'],
          description: '專業護理，提供醫療照護需求',
          pricePerHour: 400,
          totalPriceMin: 2200,
          totalPriceMax: 3200,
          rating: 0.0,
          ratingStars: '☆☆☆☆☆',
          reviews: 0
        }
      ]
    };
  },
  computed: {
    filteredCaregivers() {
      let filtered = [...this.caregivers];
      
      // 簡單的篩選邏輯（可根據實際需求擴展）
      if (this.filters.city) {
        filtered = filtered.filter(caregiver => caregiver.city === this.filters.city);
      }
      if (this.filters.district) {
        filtered = filtered.filter(caregiver => caregiver.district === this.filters.district);
      }
      if (this.filters.service) {
        filtered = filtered.filter(caregiver => caregiver.service === this.filters.service);
      }
      if (this.filters.time) {
        filtered = filtered.filter(caregiver => caregiver.time === this.filters.time);
      }

      // 排序邏輯
      if (this.sortOption === 'price') {
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
      } else if (this.sortOption === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #F5F5DC; /* 米白背景 */
  margin: 0;
  padding: 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.filter-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}
.filter-section label {
  font-size: 14px;
  color: #4DB6AC;
  margin-right: 5px;
}
.filter-section select {
  padding: 5px;
  border: 1px solid #4DB6AC;
  border-radius: 5px;
  color: #4DB6AC;
  background-color: #F5F5DC;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h1 {
  color: #4DB6AC; /* 藍綠色標題 */
  font-size: 24px;
  margin: 0;
}
.header select {
  padding: 5px;
  border: 1px solid #4DB6AC;
  border-radius: 5px;
  color: #4DB6AC;
}
.caregiver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.caregiver-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}
.caregiver-card:hover {
  transform: translateY(-5px);
}
.caregiver-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.caregiver-info {
  padding: 15px;
}
.caregiver-info h3 {
  margin: 0;
  font-size: 18px;
  color: #4DB6AC;
}
.caregiver-tags {
  margin: 10px 0;
}
.caregiver-tags span {
  background-color: #4DB6AC;
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 5px;
}
.caregiver-desc {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}
.caregiver-price {
  font-size: 16px;
  font-weight: bold;
  color: #4DB6AC;
}
.caregiver-rating {
  font-size: 14px;
  color: #FF6F61;
}
.caregiver-rating span {
  color: #FFD700;
}
</style>