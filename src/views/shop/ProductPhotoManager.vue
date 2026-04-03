<template>
     <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <div class="table-responsive">
  <div class="container mt-5">
    <h2>商品照片管理</h2>

    <!-- 搜尋框 -->
    <div class="mb-3">
      <label for="search" class="form-label">搜尋商品名稱</label>
      <input
        type="text"
        class="form-control"
        id="search"
        v-model="searchTerm"
        placeholder="輸入商品名稱..."
      />
      <button class="btn btn-primary mt-2" @click="submitSearch">確認</button>
    </div>

    <!-- 商品篩選下拉選單 -->
    <div class="mb-3">
      <label for="categoryFilter" class="form-label">篩選商品類別</label>
      <select v-model="selectedProduct" class="form-control" id="categoryFilter" @change="filterPhotos">
        <option value="">所有商品</option>
        <option v-for="product in products" :key="product.productId" :value="product.productId">
          {{ product.productName }}
        </option>
      </select>
    </div>

    <button class="btn btn-primary mb-3" @click="openUploadModal">上傳商品照片</button>

    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>照片 ID</th>
          <th>商品名稱</th>
          <th>商品照片</th>
          <th>管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="photo in filteredPhotos" :key="photo.productPhotoId">
          <td>{{ photo.productPhotoId }}</td>
          <td>{{ getProductName(photo.product.productId) }}</td>
          <td>
            <img
              :src="'data:image/jpeg;base64,' + photo.productPhoto"
              alt="Product Photo"
              style="width: 300px; height: auto;"
              @error="handleImageError(photo)" />
          </td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editPhoto(photo)">編輯</button>
            <button class="btn btn-danger btn-sm" @click="deletePhoto(photo.productPhotoId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

   
    <!-- 顯示上傳照片的模態框 -->
    <UploadPhotoModal
      v-if="isUploadModalOpen"
      @close="closeUploadModal"
      @refresh="fetchPhotos"
      :products="products" />

    <!-- 顯示編輯照片的模態框 -->
    <EditPhotoModal
      v-if="isEditModalOpen"
      @close="closeEditModal"
      @refresh="fetchPhotos"
      :products="products"
      :photo="photoToEdit" />
  </div>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import UploadPhotoModal from '@/components/shop/UploadPhotoModal.vue';
import EditPhotoModal from '@/components/shop/EditPhotoModal.vue';
import ESidebar from "@/components/admin/ESidebar.vue";

// 響應式數據定義
const products = ref([]);
const productPhotos = ref([]);
const filteredPhotos = ref([]);
const selectedProduct = ref('');
const isUploadModalOpen = ref(false);
const isEditModalOpen = ref(false);
const searchTerm = ref('');
const photoToEdit = ref(null);

// 獲取所有產品的函數
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product`);
    products.value = Array.isArray(response.data) ? response.data : [];
    console.log('獲取的產品:', products.value);
  } catch (error) {
    console.error('獲取產品失敗:', error);
  }
};

// 獲取商品照片的函數
const fetchPhotos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product-photos`);
    productPhotos.value = response.data;
    filteredPhotos.value = [...productPhotos.value];
    console.log('獲取的商品照片:', productPhotos.value);
  } catch (error) {
    console.error('獲取商品照片失敗:', error);
  }
};

// 開啟上傳照片的模態框
const openUploadModal = () => {
  isUploadModalOpen.value = true;
};

// 關閉上傳照片的模態框
const closeUploadModal = () => {
  isUploadModalOpen.value = false;
};

// 開啟編輯照片的模態框
const editPhoto = (photo) => {
  photoToEdit.value = photo;
  isEditModalOpen.value = true;
};

// 關閉編輯照片的模態框
const closeEditModal = () => {
  isEditModalOpen.value = false;
  photoToEdit.value = null; // 清空編輯的照片
};

// 刪除商品照片的函數
const deletePhoto = async (productPhotoId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/product-photos/${productPhotoId}`);
    console.log('刪除照片 ID:', productPhotoId);
    fetchPhotos(); // 刪除後重新加載照片
  } catch (error) {
    console.error('刪除照片失敗:', error);
  }
};

// 獲取產品名稱的函數
const getProductName = (productId) => {
  const product = products.value.find(p => p.productId === productId);
  return product ? product.productName : '未知商品';
};

// 確認搜索框提交
const submitSearch = () => {
  filterPhotos(); // 調用過濾函數
};

// 搜尋過濾照片的函數
const filterPhotos = () => {
  if (!selectedProduct.value && !searchTerm.value) {
    filteredPhotos.value = [...productPhotos.value];
  } else {
    filteredPhotos.value = productPhotos.value.filter(photo => {
      const matchesProduct = selectedProduct.value ? photo.product.productId === selectedProduct.value : true;
      const matchesSearchTerm = getProductName(photo.product.productId).includes(searchTerm.value);
      return matchesProduct && matchesSearchTerm;
    });
  }
};

// 當組件被掛載時，獲取數據
onMounted(() => {
  fetchProducts();
  fetchPhotos();
});
</script>

<style>
.table-responsive {
 width: 100%;/* 根據需要調整高度 */
  overflow-y: auto; /* 啟用垂直滾動 */
}
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
.container {
  max-width: 90%;
}
</style>