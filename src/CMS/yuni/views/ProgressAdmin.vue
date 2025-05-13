<template>
  <div class="page-wrapper">
    <div class="card">
      <!-- ────────── 搜尋列 ────────── -->
      <!-- <div class="search-row">
        <input v-model="searchKeyword" @keyup.enter="search" placeholder="輸入關鍵字搜尋使用者或課程" class="search-input" />
        <button @click="search" class="btn btn-primary">搜尋</button>
         <button @click="resetFilters" class="btn btn-secondary">全部進度</button> 
      </div> -->

      <!-- ────────── 表格 ────────── -->
      <div class="table-wrapper">
        <table class="course-table">
          <thead>
            <tr>
              <th class="col-idx">#</th>
              <th>使用者</th>
              <th>課程</th>
              <th>章節</th>
              <th>狀態</th>
              <th>完成</th>
              <th>觀看秒數</th>
              <th class="col-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in paginatedProgresses" :key="p.progressId" :class="{ 'row-hover': editingId !== p.progressId }">
              <template v-if="editingId === p.progressId">
                <td>{{ p.progressId }}</td>
                <!-- <td><input v-model.number="form.userId" type="number" class="input-edit" /></td>
                <td><input v-model.number="form.courseId" type="number" class="input-edit" /></td>
                <td><input v-model.number="form.chapterId" type="number" class="input-edit" /></td> -->
                <td>{{ p.userId?.name || p.userId?.userId }}</td>
<td>{{ p.courseId?.title || p.courseId?.courseId }}</td>
<td>{{ p.chapterId?.title || p.chapterId?.chapterId }}</td>
                <td>
                  <select v-model="form.status" class="input-edit">
                    <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
                  </select>
                </td>
                <td>
                  <select v-model="form.isCompleted" class="input-edit">
                    <option :value="true">✔</option>
                    <option :value="false">✘</option>
                  </select>
                </td>
                <td><input v-model.number="form.lastWatched" type="number" class="input-edit" /></td>
                <td class="action-cell">
                  <button @click="save" class="link green">儲存</button>
                  <button @click="cancel" class="link gray">取消</button>
                </td>
              </template>
              <template v-else>
                <td>{{ p.progressId }}</td>
                <td>{{ p.userId?.userId ?? p.userId }}</td>
                <td>{{ p.courseId?.title ?? `#${p.courseId?.courseId}` }}</td>
                <td>{{ p.chapterId?.title ?? `#${p.chapterId?.chapterId}` }}</td>
                <td>{{ statusLabel(p.status) }}</td>
                <td>{{ p.isCompleted ? '✔' : '✘' }}</td>
                <td>{{ p.lastWatched ?? '-' }}</td>
                <td class="action-cell">
                  <button @click="edit(p)" class="link blue">編輯</button>
                  <button @click="remove(p.progressId)" class="link red">刪除</button>
                </td>
              </template>
            </tr>
            <tr v-if="creating" class="row-creating">
              <td>#</td>
              <td><input v-model.number="form.userId" type="number" class="input-create" placeholder="User" /></td>
              <td><input v-model.number="form.courseId" type="number" class="input-create" placeholder="Course" /></td>
              <td><input v-model.number="form.chapterId" type="number" class="input-create" placeholder="Chapter" /></td>
              <td>
                <select v-model="form.status" class="input-create">
                  <option disabled value="">狀態</option>
                  <option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option>
                </select>
              </td>
              <td>
                <select v-model="form.isCompleted" class="input-create">
                  <option disabled value="">完成?</option>
                  <option :value="true">是</option>
                  <option :value="false">否</option>
                </select>
              </td>
              <td><input v-model.number="form.lastWatched" type="number" class="input-create" /></td>
              <td class="action-cell">
                <button @click="save" class="link green">送出</button>
                <button @click="cancel" class="link gray">取消</button>
              </td>
            </tr>
            <!-- <tr v-else class="row-add" @click="startCreate">
              <td colspan="8">➕ 新增進度</td>
            </tr> -->
          </tbody>
        </table>
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">«</button>
          <button v-for="page in totalPages" :key="page" :class="{ 'active-page': page === currentPage }" @click="goToPage(page)">
            {{ page }}
          </button>
          <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">»</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios.js'

const progresses = ref([])
const searchKeyword = ref('')
const creating = ref(false)
const editingId = ref(null)

const statuses = ['not_started', 'in_progress', 'completed']
const statusLabel = s => ({ not_started: '未開始', in_progress: '進行中', completed: '已完成' }[s] ?? s)

const empty = () => ({ userId: null, courseId: null, chapterId: null, status: 'not_started', isCompleted: false, lastWatched: 0 })
const form = ref(empty())

const fetchAll = async () => {
  const { data } = await api.get('/api/progress')
  progresses.value = data
}
const search = async () => {
  if (!searchKeyword.value) return fetchAll()
  const { data } = await api.get('/api/progress', { params: { keyword: searchKeyword.value } })
  progresses.value = data
}
const save = async () => {
  const payload = { ...form.value }
  if (editingId.value) {
    const { data } = await api.put(`/api/progress/${editingId.value}`, payload)
    const i = progresses.value.findIndex(p => p.progressId === data.progressId)
    if (i !== -1) progresses.value[i] = data
  } else {
    const { data } = await api.post('/api/progress', payload)
    progresses.value.push(data)
  }
  cancel()
}
const remove = async (id) => {
  if (confirm(`確定刪除進度 ${id}？`)) {
    await api.delete(`/api/progress/${id}`)
    progresses.value = progresses.value.filter(p => p.progressId !== id)
  }
}
const edit = p => { editingId.value = p.progressId; creating.value = false; form.value = { ...p, userId: p.userId?.userId ?? p.userId, courseId: p.courseId?.courseId ?? p.courseId, chapterId: p.chapterId?.chapterId ?? p.chapterId } }
const startCreate = () => { creating.value = true; editingId.value = null; form.value = empty() }
const cancel = () => { creating.value = false; editingId.value = null; form.value = empty() }
const resetFilters = () => { searchKeyword.value = ''; fetchAll() }

const pageSize = 80
const currentPage = ref(1)
const paginatedProgresses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return progresses.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(progresses.value.length / pageSize))
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

onMounted(fetchAll)
</script>

<style scoped>
.page-wrapper { padding: 24px; background: #f5f6fa; }
.card { max-width: 1280px; margin: auto; padding: 24px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,.05); }
.search-row { display: flex; gap: 8px; justify-content: center; align-items: center; margin-bottom: 24px; }
.search-input { flex-grow: 1; min-width: 200px; padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 4px; }
.btn { padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: background .2s; }
.btn-primary { background: #2563eb; color: #fff; border: none; }
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary { background: #fff; border: 1px solid #d1d5db; }
.btn-secondary:hover { background: #f3f4f6; }
.table-wrapper { overflow-x: auto; }
.course-table { width: 100%; border-collapse: collapse; }
.course-table thead { background: #f3f4f6; }
.course-table th, .course-table td { padding: 12px; border-top: 1px solid #e5e7eb; text-align: left; }
.row-hover:hover { background: #f9fafb; }
.col-idx { width: 48px; }
.col-action { width: 128px; }
.input-edit, .input-create { width: 100%; padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; }
.row-creating { background: #fef9c3; }
.row-add { background: #f9fafb; cursor: pointer; transition: background .2s; text-align: center; }
.row-add:hover { background: #e0f2fe; text-decoration: underline; }
.link { font-weight: 500; cursor: pointer; background: none; border: none; padding: 0; }
.link.blue { color: #2563eb; }
.link.green { color: #16a34a; }
.link.red { color: #dc2626; }
.link.gray { color: #6b7280; }
.link.blue:hover { color: #1d4ed8; }
.link.green:hover { color: #15803d; }
.link.red:hover { color: #b91c1c; }
.link.gray:hover { color: #4b5563; }
.action-cell { display: flex; gap: 8px; justify-content: flex-start; align-items: center; height: 55px; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 16px 0; }
.pagination button { padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; background-color: #fff; cursor: pointer; }
.pagination button:disabled { cursor: not-allowed; opacity: 0.5; }
.active-page { background-color: #2563eb; color: #fff; }
</style>