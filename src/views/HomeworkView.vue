<template>
  <div class="homework-container">
    <div class="homework-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">作业管理</h1>
      </div>
      <el-button
        type="primary"
        :icon="Plus"
        @click="$router.push('/homework/create')"
      >
        新建作业
      </el-button>
    </div>

    <!-- 查询条件区域 -->
    <el-card class="filter-card">
      <div class="filter-grid">
        <div>
          <label class="filter-label">科目</label>
          <el-select
            v-model="filters.subject"
            placeholder="全部科目"
            style="width: 100%"
          >
            <el-option label="全部科目" value="" />
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="科学" value="科学" />
          </el-select>
        </div>
        
        <div>
          <label class="filter-label">班级</label>
          <el-select
            v-model="filters.grade"
            placeholder="全部班级"
            style="width: 100%"
          >
            <el-option label="全部班级" value="" />
            <el-option label="一年级(1)班" value="一年级(1)班" />
            <el-option label="一年级(2)班" value="一年级(2)班" />
            <el-option label="二年级(1)班" value="二年级(1)班" />
            <el-option label="二年级(2)班" value="二年级(2)班" />
            <el-option label="三年级(1)班" value="三年级(1)班" />
          </el-select>
        </div>
        
        <div>
          <label class="filter-label">状态</label>
          <el-select
            v-model="filters.status"
            placeholder="全部状态"
            style="width: 100%"
          >
            <el-option label="全部状态" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="已完成" value="completed" />
            <el-option label="已逾期" value="overdue" />
            <el-option label="未发布" value="unpublished" />
          </el-select>
        </div>
        
        <div>
          <label class="filter-label">发布时间范围</label>
          <div class="date-range">
            <el-date-picker
              v-model="filters.startDate"
              type="date"
              placeholder="开始日期"
              style="flex: 1"
            />
            <span class="date-separator">至</span>
            <el-date-picker
              v-model="filters.endDate"
              type="date"
              placeholder="结束日期"
              style="flex: 1"
            />
          </div>
        </div>
      </div>
      
      <div class="filter-actions">
        <el-button @click="resetFilters">
          <el-icon><RefreshRight /></el-icon>
          重置
        </el-button>
        <el-button type="primary" @click="applyFilters">
          <el-icon><Search /></el-icon>
          筛选
        </el-button>
      </div>
    </el-card>

    <!-- 作业卡片展示区域 -->
    <div class="homework-grid">
      <div
        v-for="homework in homeworks"
        :key="homework.id"
        class="homework-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="card-title-section">
            <div class="title-row">
              <h3 class="homework-title">{{ homework.title }}</h3>
              <el-tag :type="getStatusTagType(homework.status)">
                {{ getStatusText(homework.status) }}
              </el-tag>
            </div>
            <div class="homework-meta">
              <div class="meta-item">
                <span class="meta-dot"></span>
                <span>{{ homework.subject }}</span>
              </div>
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ homework.class }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ homework.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="task-section">
          <h4 class="task-title">任务列表：</h4>
          <div class="task-list">
            <div
              v-for="(task, index) in homework.tasks"
              :key="index"
              class="task-item"
            >
              <div class="task-dot"></div>
              <span class="task-text">完成 {{ task }}</span>
            </div>
          </div>
        </div>

        <!-- 批改进度 -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">批改进度：</span>
            <span class="progress-value">{{ homework.completionRate }}%</span>
          </div>
          <el-progress
            :percentage="homework.completionRate"
            :color="getProgressColor(homework.completionRate)"
            :show-text="false"
          />
        </div>

        <!-- 操作按钮 */
        <div class="card-actions">
          <template v-for="action in getActionButtons(homework)" :key="action.text">
            <el-button
              :type="action.type"
              size="small"
              @click="action.onClick ? action.onClick() : handleAction(action.text, homework)"
            >
              <el-icon>
                <component :is="action.icon" />
              </el-icon>
              {{ action.text }}
            </el-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <div class="pagination-info">
        显示第 {{ (currentPage - 1) * itemsPerPage + 1 }} 至 
        {{ Math.min(currentPage * itemsPerPage, totalItems) }} 条，共 {{ totalItems }} 条记录
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="itemsPerPage"
        :total="totalItems"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 删除确认对话框 -->
    <DeleteConfirmModal
      v-model="showDeleteModal"
      :title="'删除确认'"
      :message="'确定要删除该作业吗？删除后无法恢复。'"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Plus, RefreshRight, Search, User, Calendar,
  View, Edit, Delete, Check, RefreshCw
} from '@element-plus/icons-vue'
import DeleteConfirmModal from '@/components/Common/DeleteConfirmModal.vue'

const router = useRouter()

// 响应式数据
const currentPage = ref(1)
const itemsPerPage = ref(4)
const showDeleteModal = ref(false)
const homeworkToDelete = ref<string | null>(null)

const filters = reactive({
  subject: '',
  grade: '',
  status: '',
  startDate: '',
  endDate: ''
})

// 模拟作业数据
const homeworks = ref([
  {
    id: '1',
    title: '拼音复习作业',
    subject: '语文',
    class: '一年级(1)班',
    date: '2025-06-03',
    status: 'published',
    tasks: ['完成课本78-79页课后习题', '预习《声母与韵母》一课'],
    completionRate: 75
  },
  {
    id: '2',
    title: '20以内加减法练习',
    subject: '数学',
    class: '一年级(2)班',
    date: '2025-06-02',
    status: 'completed',
    tasks: ['完成《数学练习册》第15-16页', '完成《提高班冲刺题》'],
    completionRate: 100
  },
  {
    id: '3',
    title: '英语单词拼写练习',
    subject: '英语',
    class: '三年级(1)班',
    date: '2025-06-04',
    status: 'unpublished',
    tasks: ['完成26个字母书写练习', '背诵课文《My Family》'],
    completionRate: 0
  },
  {
    id: '4',
    title: '植物观察日记',
    subject: '科学',
    class: '二年级(2)班',
    date: '2025-06-01',
    status: 'overdue',
    tasks: ['观察一种植物的生长过程并记录', '完成《植物的生长》思考题'],
    completionRate: 30
  }
])

// 计算属性
const totalItems = computed(() => homeworks.value.length)

// 方法
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'published': '已发布',
    'completed': '已完成',
    'overdue': '已逾期',
    'unpublished': '未发布'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, any> = {
    'published': 'primary',
    'completed': 'success',
    'overdue': 'warning',
    'unpublished': 'info'
  }
  return typeMap[status] || 'info'
}

const getProgressColor = (rate: number) => {
  if (rate === 100) return '#67c23a'
  if (rate >= 75) return '#409eff'
  if (rate >= 50) return '#e6a23c'
  if (rate > 0) return '#f56c6c'
  return '#909399'
}

const getActionButtons = (homework: any) => {
  const baseButtons = [
    { icon: View, text: '详情', type: 'default' },
    { 
      icon: Check, 
      text: '批改', 
      type: 'success',
      onClick: () => router.push(`/homework/grading/${homework.id}`)
    }
  ]

  if (homework.status === 'unpublished') {
    return [
      { icon: Calendar, text: '发布', type: 'primary' },
      { icon: Edit, text: '编辑', type: 'default' },
      ...baseButtons,
      { 
        icon: Delete, 
        text: '删除', 
        type: 'danger',
        onClick: () => handleDeleteClick(homework.id)
      }
    ]
  }

  if (homework.status === 'overdue') {
    return [
      ...baseButtons,
      { icon: RefreshCw, text: '撤回', type: 'warning' }
    ]
  }

  return baseButtons
}

const handleDeleteClick = (homeworkId: string) => {
  homeworkToDelete.value = homeworkId
  showDeleteModal.value = true
}

const handleDeleteConfirm = () => {
  if (homeworkToDelete.value) {
    console.log('删除作业:', homeworkToDelete.value)
    ElMessage.success('作业删除成功！')
    homeworkToDelete.value = null
  }
}

const handleAction = (action: string, homework: any) => {
  console.log(`执行操作: ${action}`, homework)
}

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof typeof filters] = ''
  })
}

const applyFilters = () => {
  console.log('应用筛选条件:', filters)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<style scoped>
.homework-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-card {
  margin-bottom: 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #6b7280;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.homework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.homework-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.homework-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 16px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.homework-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.homework-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-dot {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
}

.task-section {
  margin-bottom: 16px;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0 0 8px 0;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-text {
  font-size: 14px;
  color: #6b7280;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.progress-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #374151;
}

@media (max-width: 768px) {
  .homework-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>