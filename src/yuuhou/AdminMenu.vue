<!-- <template>
    <div class="admin-menu">
      <h2>🔐 超級使用者功能選單</h2>
      <div class="button-grid">
        <button @click="go('/admin/caregivers')">1. 照顧者後台管理</button>
        <button @click="go('/admin/yuni')">2. Yuni 功能</button>
        <button @click="go('/admin/zonghan')">3. 宗翰 功能</button>
        <button @click="go('/admin/rita1')">4. Rita 功能 A</button>
        <button @click="go('/admin/rita2')">5. Rita 功能 B</button>
        <button @click="go('/admin/steve')">6. Steve 功能</button>
        <button @click="go('/admin/qilin')">7. 麒麟 功能</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const go = (path) => {
    router.push(path)
  }
  </script>
  
  <style scoped>
  .admin-menu {
    max-width: 800px;
    margin: 3rem auto;
    text-align: center;
  }
  
  .button-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .button-grid button {
    padding: 1rem 2rem;
    font-size: 1rem;
    background-color: #0366d6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .button-grid button:hover {
    background-color: #024c9a;
  }
  </style>
   -->