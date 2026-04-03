<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ '上傳商品照片' }}</h5>
          <button type="button" class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="uploadPhoto">
            <div class="mb-3">
              <label for="productSelect" class="form-label">選擇商品</label>
              <select v-model="selectedProductId" class="form-control" id="productSelect" required>
                <option value="" disabled>選擇商品</option>
                <option v-for="product in products" :key="product.productId" :value="product.productId">
                  {{ product.productName }}
                </option>
              </select>
            </div>
            <div class="mb-3" v-if="isEditing">
              <label class="form-label">商品照片 ID</label>
              <input type="text" class="form-control" v-model="props.photo.productPhotoId" readonly /> <!-- 顯示商品照片 ID -->
            </div>
            <div class="mb-3">
              <label for="productPhotos" class="form-label">選擇新照片 (可選)</label>
              <input type="file" id="productPhotos" class="form-control" @change="handleFileChange" />
              <div v-if="previewUrl">
                <h5>當前照片預覽：</h5>
                <img :src="previewUrl" alt="當前商品照片" class="preview-image" style="width: 100%;" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">{{'上傳' }}</button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

// 接收父組件的 props
const props = defineProps({
  photo: { type: Object, default: null },
  products: { type: Array, required: true },
  onRefresh: { type: Function, required: true },
  isEditing: { type: Boolean, required: true } 
});

const emit = defineEmits(['close']);
const selectedProductId = ref(null);
const previewUrl = ref(''); // 存儲圖片預覽 URL
const selectedFiles = ref([]); // 存儲上傳的文件

// 當模態框掛載時，設置狀態
onMounted(() => {
  if (props.photo) {
    selectedProductId.value = props.photo.product.productId; // 設置商品 ID
    previewUrl.value = 'data:image/jpeg;base64,' + props.photo.productPhoto; // 預覽當前照片
  }
});

// 處理文件變更
const handleFileChange = (event) => {
  const file = event.target.files[0]; // 獲取選擇的文件
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result; // 更新預覽 URL
    };
    reader.readAsDataURL(file); // 將檔案讀取為 Data URL
    selectedFiles.value = [file]; // 儲存選擇的檔案
  } else {
    previewUrl.value = ''; // 若沒有選擇檔案，清空預覽
  }
};

// 上傳照片的函數
const uploadPhoto = async () => {
  if (!selectedProductId.value || selectedFiles.value.length === 0) {
    alert('請選擇商品和照片');
    return;
  }

  const formData = new FormData();
  selectedFiles.value.forEach(file => formData.append('file', file)); // 確保這裡的名稱是 'file'
  formData.append('productId', selectedProductId.value); // 追加產品 ID

  try {
    const response = await axios.post(`${API_BASE_URL}/api/product-photos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      alert('圖片上傳成功');
      emit('refresh'); // 更新列表的函數
      emit('close'); // 關閉模態框
    } else {
      alert('圖片上傳失敗，請檢查伺服器設置或資料格式');
    }
  } catch (error) {
    console.error('上傳圖片失敗:', error);
    alert('上傳圖片失敗，請檢查網路或檔案格式');
  }
};

</script>

<style scoped>
.preview-image {
  max-width: 100%;
  max-height: 300px; /* 限制最大高度 */
  object-fit: contain; /* 讓圖片填滿 */
}
</style>