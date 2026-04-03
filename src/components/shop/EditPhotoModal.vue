<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">編輯商品照片</h5>
          <button type="button" class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updatePhoto" v-if="photo"> <!-- 只有當 photo 存在時才顯示表單 -->
            <div class="mb-3">
              <label class="form-label">商品照片 ID</label>
              <input type="text" class="form-control" v-model="photo.productPhotoId" readonly /> <!-- 只顯示商品照片 ID -->
            </div>
            <div class="mb-3">
              <label class="form-label">當前商品照片</label>
              <img :src="previewUrl" alt="商品照片" class="preview-image" style="width: 100%;" />
            </div>
            <div class="mb-3">
              <label for="newPhoto" class="form-label">選擇新照片 (可選)</label>
              <input type="file" id="newPhoto" class="form-control" @change="handleFileChange" />
            </div>
            <button type="submit" class="btn btn-primary">儲存</button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          </form>
          <div v-else>
            <p>無法編輯：選擇的商品照片未找到。</p> <!-- 提示信息 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const props = defineProps({
photo: { type: Object, required: true },
onRefresh: { type: Function, required: true }
});

const emit = defineEmits(['close']);
const previewUrl = ref('');

// 當模態框掛載時設置預覽圖片
onMounted(() => {
if (props.photo) {
  previewUrl.value = 'data:image/jpeg;base64,' + props.photo.productPhoto;
}
});

// 監聽 props.photo 變化
watch(() => props.photo, (newPhoto) => {
if (newPhoto) {
  previewUrl.value = 'data:image/jpeg;base64,' + newPhoto.productPhoto;
}
});

// 處理文件變更事件
const handleFileChange = (event) => {
const file = event.target.files[0];
if (file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
};

// 更新商品照片的函數
const updatePhoto = async () => {
    const formData = new FormData();

    formData.append('productPhotoId', props.photo.productPhotoId);
    formData.append('productId', props.photo.product.productId); // 新增產品 ID

    const newFile = document.getElementById('newPhoto').files[0];
    if (newFile) {
        formData.append('file', newFile);
    }

    try {
        const response = await axios.put(`${API_BASE_URL}/api/product-photos/update`, formData);

        if (response.status === 200) {
            alert('商品照片更新成功');
            emit('close');
            props.onRefresh();
        } else {
            alert('更新失敗，請檢查伺服器設置或資料格式');
        }
    } catch (error) {
        console.error('更新圖片失敗:', error);
        alert('更新圖片失敗，請檢查網路或檔案格式');
    }
};
</script>

<style scoped>
.preview-image {
max-width: 100%;
max-height: 300px; 
object-fit: contain; 
}
</style>