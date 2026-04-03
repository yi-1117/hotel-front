<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ category ? '編輯類別' : '新增類別' }}</h5>
            <button type="button" class="close" @click="$emit('close')">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">類別名稱</label>
                <input v-model="categoryName" type="text" class="form-control" id="categoryName" required />
              </div>
              <button type="submit" class="btn btn-primary">{{ category ? '更新' : '創建' }}</button>
              <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch,defineEmits} from 'vue';
  import axios from 'axios';
  import { API_BASE_URL } from '@/config'; // 確保引入 API_BASE_URL
  
  const props = defineProps({
    category: { type: Object, default: null }, // 當前編輯的類別
  });
  const emit = defineEmits(['refresh', 'close']); // 定義需要的 emitted 事件

  const categoryName = ref('');
  
  // 監控category變化以便於填充
  watch(props.category, (newCategory) => {
  if (newCategory) {
    categoryName.value = newCategory.categoryName; // 載入編輯的類別名稱
  } else {
    categoryName.value = ''; // 清空輸入框
  }
}, { immediate: true }); // 設置 immediate: true 來確保初始加載時也同步
  
  // 提交新增或編輯類別
  const submitCategory = async () => {
  const categoryData = { categoryName: categoryName.value }; // 準備數據
  
  try {
    if (props.category) {
      // 若有類別則為編輯
      await axios.put(`${API_BASE_URL}/api/product-categories/update`, {
        productCategoryId: props.category.productCategoryId, // 傳遞編輯的ID
        categoryName: categoryData.categoryName,
      });
    } else {
      // 創建新的類別
      await axios.post(`${API_BASE_URL}/api/product-categories/create`, categoryData);
    }
    
    // 提交後觸發已保存事件
    emit('refresh'); // 觸發刷新商品類別的事件
    emit('close'); // 關閉模態框
  } catch (error) {
    console.error('保存商品類別失敗:', error.message);
  }
};
  </script>
  
  <style>
  .modal {
    background: rgba(0, 0, 0, 0.5);
  }
  .table {
  width: 100%; /* 使表格寬度適應容器 */
  margin-bottom: 1rem; /* 調整表格上下間距 */
  color: #212529; /* 設置表格文字顏色 */
}

.table-bordered {
  border: 1px solid #dee2e6; /* 表格邊框樣式 */
}

.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6; /* 單元格的邊框 */
}

.table th {
  background-color: #f8f9fa; /* 表頭背景顏色 */
  text-align: left; /* 表頭文字左對齊 */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2; /* 隔行的背景顏色 */
}

.btn {
  margin-right: 5px; /* 按鈕之間的間距 */
}
  </style>