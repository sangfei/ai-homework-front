<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="400px"
    :before-close="handleClose"
    align-center
  >
    <div class="modal-content">
      <div class="icon-container">
        <el-icon class="warning-icon" size="48">
          <WarningFilled />
        </el-icon>
      </div>
      <p class="message">{{ message }}</p>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ cancelText }}</el-button>
        <el-button type="danger" @click="handleConfirm">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '删除确认',
  message: '确定要删除该作业吗？删除后无法恢复。',
  confirmText: '确认删除',
  cancelText: '取消'
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}

const handleClose = () => {
  emit('cancel')
  visible.value = false
}
</script>

<style scoped>
.modal-content {
  text-align: center;
  padding: 20px 0;
}

.icon-container {
  margin-bottom: 16px;
}

.warning-icon {
  color: #f56c6c;
}

.message {
  font-size: 16px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>