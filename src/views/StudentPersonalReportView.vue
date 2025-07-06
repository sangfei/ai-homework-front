<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>返回</span>
          </button>
          <h1 class="text-xl font-bold text-gray-900">学生个人报告</h1>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">学生个人报告</h2>
        <p class="text-gray-600">学生个人报告功能正在开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
</script>