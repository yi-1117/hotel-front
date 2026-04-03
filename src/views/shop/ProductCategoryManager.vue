<template>
  <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <div class="main-content">
      <h2>商品類別管理</h2>
      <button class="btn btn-primary mb-3" @click="openCreateCategoryModal">新增類別</button>
      
      <table class="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>類別名稱</th>
            <th>管理</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.productCategoryId }}</td>
            <td>{{ category.categoryName }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editCategory(category)">編輯</button>
              <button class="btn btn-danger btn-sm" @click="confirmDeleteCategory(category.productCategoryId)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 用於新增或編輯類別的模態框 -->
      <ProductCategoryForm 
        v-if="isModalOpen" 
        @close="isModalOpen = false" 
        @refresh="fetchCategories"
        :category="selectedCategory" 
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductCategoryForm from '@/components/shop/ProductCategoryForm.vue'; // 需要創建的表單組件
import Swal from 'sweetalert2';
import { API_BASE_URL } from '@/config'; // 引入 API_BASE_URL
import ESidebar from "@/components/admin/ESidebar.vue";

export default {
  components: {
    ProductCategoryForm,
    ESidebar, // 註冊組件
  },
  setup() {
    const categories = ref([]);
    const isModalOpen = ref(false);
    const selectedCategory = ref(null); // 用於編輯的選定類別

    // 獲取商品類別的函數
    const fetchCategories = async () => {
      try {
        // const requestData = { categoryName: categoryName.value }; // 查詢的類別名初始為空
        const response = await axios.get(`${API_BASE_URL}/api/product-categories`);
        categories.value = response.data; // 假設返回的資料格式正確
      } catch (error) {
        console.error('獲取商品類別失敗:', error);
      }
    };

    // 開啟新增類別的模態框
    const openCreateCategoryModal = () => {
      selectedCategory.value = null; // 開啟時清空選定類別
      isModalOpen.value = true; // 顯示模態框
    };

    // 編輯類別
    const editCategory = (category) => {
      selectedCategory.value = category; // 設置選定的類別以便編輯
      isModalOpen.value = true; // 顯示模態框
    };

    // 確認刪除類別
    const confirmDeleteCategory = (id) => {
  if (!id) {
    console.error('無效的商品類別 ID:', id);
    return; // 提前返回，避免进一步的错误
  }
  
  Swal.fire({
    title: '確定要刪除這個類別嗎?',
    text: "這個類別將無法恢復！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是的，刪除！',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteCategory(id); // 刪除類別
      Swal.fire('已刪除！', '類別已成功刪除。', 'success'); // 提示刪除成功
    }
  });
};

    // 刪除類別
    const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/product-categories/delete/${categoryId}`);
    console.log('刪除響應:', response);
    await fetchCategories(); // 刷新類別列表
  } catch (error) {
    console.error('刪除商品類別失敗:', error.response ? error.response.data : error);
    Swal.fire('刪除失敗！', '請稍後重試。', 'error'); // 提示删除失败
  }
};

    onMounted(() => {
      fetchCategories(); // 確保取商品類別數據
    });
  // fetchProducts(); // 確保取產品數據
  // console.log('Products:', products.value); // 檢查產品資料
// 加載商品類別

    return {
      categories,
      isModalOpen,
      openCreateCategoryModal,
      editCategory,
      confirmDeleteCategory,
      deleteCategory,
      fetchCategories,
      selectedCategory,
    };
  },
};
</script>

<style>
.admin-container {
    display: flex;
    height: 100vh;
    background-color: #f8f9fa; /* 淺灰色背景 */
}

.main-content {
    padding: 20px; /* 增加內邊距 */
    flex: 1;
    margin-left: 0; /* 移除上面的負邊距 */
    background-color: #ffffff; /* 白色背景讓主要內容區更顯眼 */
    border-radius: 5px; /* 圓角邊框 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 盒子陰影效果 */
}

.table {
    width: 100%; /* 確保表格寬度適合容器 */
    border: 1px solid #dee2e6; /* 整個表格的邊框 */
    border-collapse: collapse; /* 確保邊框不重疊 */
}

.table th {
    background-color: #007bff; /* 標題背景顏色 */
    color: white; /* 字體顏色 */
    padding: 12px; /* 調整內邊距 */
}

.table th, .table td {
  border: 1px solid #dee2e6; /* 每個單元格的邊框 */
  padding: 12px; /* 調整單元格內邊距 */
}

.table td {
    padding: 12px; /* 調整內邊距 */
}

.table tbody tr:hover {
    background-color: #e9ecef; /* 鼠標懸停時的背景顏色 */
}

.table td:last-child {
    text-align: center; /* 最後一列的操作按鈕居中 */
}
</style>