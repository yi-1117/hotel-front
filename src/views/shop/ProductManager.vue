<template>
    <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <div class="main-content">

      <h2>產品管理</h2>
      <button class="btn btn-primary mb-3" @click="openCreateProductModal">新增產品</button>
  
      <div class="mb-3">
        <label for="categoryFilter" class="form-label">篩選商品類別</label>
        <select v-model="selectedCategory" class="form-control" id="categoryFilter" @change="filterProducts">
  <option value="">所有類別</option> <!-- 這個選項現在可以被選擇，並用空字串表示所有類別 -->
  <option v-for="category in categories" :key="category.productCategoryId" :value="category.productCategoryId">
    {{ category.categoryName }}
  </option>
</select>
      </div>
      
      <table class="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>品牌名稱</th>
            <th>容量 (ml)</th>
            <th>描述</th>
            <th>單位價格</th>
            <th>賣家名稱</th>
            <th>賣家地址</th>
            <th>賣家電話</th>
            <th>庫存數量</th>
            <th>類別名稱</th>
            <th>管理</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.productId">
            <td>{{ product.productId }}</td>
            <td>{{ product.productName }}</td>
            <td>{{ product.brandName }}</td>
            <td>{{ product.capacity }}</td>
            <td>{{ product.productDescription }}</td>
            <td>{{ product.productUnitPrice }} 元</td>
            <td>{{ product.sellerName }}</td>
            <td>{{ product.sellerAddress }}</td>
            <td>{{ product.sellerPhone }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ getCategoryName(product.productCategory.productCategoryId) }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editProduct(product)">編輯</button>
              <button class="btn btn-danger btn-sm" @click="confirmDeleteProduct(product.productId)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <ProductForm 
        v-if="isModalOpen" 
        @close="isModalOpen = false" 
        @refresh="fetchProducts" 
        :product="selectedProduct" 
        :categories="categories" 
      />
    </div>
    </div>
  
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import ProductForm from '@/components/shop/ProductForm.vue'; // 引用產品表單組件
  import Swal from 'sweetalert2';
  import { API_BASE_URL } from '@/config'; // 引入 API_BASE_URL
  import ESidebar from "@/components/admin/ESidebar.vue";
  
  export default {
    components: {
      ProductForm,
      ESidebar, // 註冊組件
    },
    setup() {
      const products = ref([]);
      const categories = ref([]); // 儲存商品類別
      const isModalOpen = ref(false);
      const selectedProduct = ref(null); // 用於編輯的選定產品
      const selectedCategory = ref(null); // 儲存選擇的商品類別
      const filteredProducts = ref([]); // 儲存經過篩選的產品列表
  
      // 獲取所有產品的函數
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/product`);
          products.value = response.data;
          console.log('Fetched products:', products.value); // 確認返回的產品資料
          filteredProducts.value = [...products.value]; // 初始化為所有產品
        } catch (error) {
          console.error('獲取產品失敗:', error);
        }
      };
  
      // 獲取所有商品類別的函數
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/product-categories`); // 使用 API_BASE_URL
          categories.value = response.data; // 假設返回的資料格式正確
          console.log('Fetched categories:', categories.value); // 確認獲取的類別資料
        } catch (error) {
          console.error('獲取商品類別失敗:', error);
        }
      };
  
      // 開啟新增產品的模態框
      const openCreateProductModal = () => {
        selectedProduct.value = null; // 開啟時清空選定產品
        isModalOpen.value = true; // 顯示模態框
      };
  
      // 編輯產品
      const editProduct = (product) => {
        selectedProduct.value = product; // 設置選定的產品以便編輯
        isModalOpen.value = true; // 顯示模態框
      };
  
      // 確認刪除產品
      const confirmDeleteProduct = (id) => {
  Swal.fire({
    title: '確定要刪除這個產品嗎?',
    text: "這個產品將無法恢復！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是的，刪除！',
    cancelButtonText: '取消'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteProduct(id); // 刪除產品
  
      Swal.fire('已刪除！', '產品已成功刪除。', 'success');
    }
  });
};

// 刪除產品
const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/product/delete/${id}`);
    await fetchProducts(); // 
  } catch (error) {
    console.error('刪除產品失敗:', error);
    Swal.fire('錯誤', '刪除產品失敗：' + error.message, 'error'); // 顯示錯誤提示
  }
};
  
      // 根據類別 ID 獲取類別名稱
      const getCategoryName = (categoryId) => {
        const category = categories.value.find(cat => cat.productCategoryId === categoryId); // 根據 ID 獲取類別
        return category ? category.categoryName : '未知類別'; // 返回名稱或默認提示
      };
  
      // 篩選產品
      const filterProducts = () => {
        console.log('Selected Category ID:', selectedCategory.value); // 確認選擇的類別 ID
        if (selectedCategory.value) {
          filteredProducts.value = products.value.filter(product =>
            product.productCategory.productCategoryId === selectedCategory.value // 根據類別過濾
          );
        } else {
          filteredProducts.value = [...products.value]; // 不篩選時顯示所有產品
        }
  
        console.log('Filtered Products:', filteredProducts.value); // 確認過濾後的產品
      };
  
      // 當組件掛載時獲取資料
      onMounted(() => {
        fetchProducts(); // 頁面加載時獲取產品資料
        fetchCategories(); // 頁面加載時獲取商品類別
      });
  
      return {
        products,
        categories,
        isModalOpen,
        openCreateProductModal,
        editProduct,
        confirmDeleteProduct,
        deleteProduct,
        fetchProducts,
        fetchCategories,
        selectedProduct,
        filterProducts, // 將 filterProducts 加入返回的對象
        getCategoryName,
        selectedCategory,
        filteredProducts, // 返回經過篩選的產品列表
      };
    },
  };
  </script>
  
  <style>
.admin-container {
    display: flex;
    height: 100vh;
    background-color: white;
}

.main-content {
    padding: 20px; /* 增加內邊距 */
    flex: 1;
    margin-left: 0; /* 移除上面的負邊距 */
}

.table {
    width: 100%; /* 修改為100%以適應容器 */
    border-collapse: collapse; /* 把邊框合併成一個 */
}

.table th, .table td {
    padding: 15px 20px; /* 增加內邊距 */
    text-align: left; /* 文字左對齊 */
    border: 1px solid #dee2e6; /* 使用柔和的邊框顏色 */
}

.table th {
    background-color: #f8f9fa; /* 標題背景顏色 */
    font-weight: bold; /* 字體加粗 */
    font-size: 1.1rem; /* 增加字體大小 */
    color: #343a40; /* 文字顏色 */
}

.table tbody tr {
    transition: background-color 0.3s; /* 過渡效果 */
}

.table tbody tr:hover {
    background-color: #e9ecef; /* 鼠標懸停時的背景顏色 */
}

.table td {
    font-size: 1rem; /* 字體大小 */
}

.table td:last-child {
    text-align: center; /* 最後一列的操作按鈕居中 */
}

/* 按鈕樣式 */
.table .btn {
    margin: 0 5px; /* 按鈕之間的邊距 */
}

.table .btn-warning {
    background-color: #ffc107; /* 編輯按鈕顏色 */
}

.table .btn-danger {
    background-color: #dc3545; /* 刪除按鈕顏色 */
}

/* 確保按鈕有hover效果 */
.table .btn:hover {
    opacity: 0.9; /* 鼠標懸停時稍微改變透明度 */
}
  </style>