<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ product ? '編輯產品' : '新增產品' }}</h5>
          <button type="button" class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitProduct">
            <div class="mb-3">
              <label for="productName" class="form-label">產品名稱</label>
              <input v-model="productData.productName" type="text" class="form-control" id="productName" required />
            </div>
            <!-- <div class="mb-3">
              <label for="sku" class="form-label">SKU</label>
              <input v-model="productData.sku" type="text" class="form-control" id="sku" required />
            </div> -->
            <div class="mb-3">
              <label for="brandName" class="form-label">品牌名稱</label>
              <input v-model="productData.brandName" type="text" class="form-control" id="brandName" required />
            </div>
            <div class="mb-3">
              <label for="productUnitPrice" class="form-label">單位價格</label>
              <input v-model="productData.productUnitPrice" type="number" class="form-control" id="productUnitPrice" required />
            </div>
            <!-- <div class="mb-3">
              <label for="discount" class="form-label">折扣</label>
              <input v-model="productData.discount" type="number" class="form-control" id="discount" />
            </div> -->
            <div class="mb-3">
              <label for="productDescription" class="form-label">描述</label>
              <textarea v-model="productData.productDescription" class="form-control" id="productDescription" required></textarea>
            </div>
            <div class="mb-3">
              <label for="capacity" class="form-label">容量 (毫升)</label>
              <input v-model="productData.capacity" type="number" class="form-control" id="capacity" required />
            </div>
            <div class="mb-3">
              <label for="stockQuantity" class="form-label">庫存數量</label>
              <input v-model="productData.stockQuantity" type="number" class="form-control" id="stockQuantity" required />
            </div>
            <div class="mb-3">
              <label for="sellerName" class="form-label">廠商名稱</label>
              <input v-model="productData.sellerName" type="text" class="form-control" id="sellerName" required />
            </div>
            <div class="mb-3">
              <label for="sellerPhone" class="form-label">廠商電話</label>
              <input v-model="productData.sellerPhone" type="text" class="form-control" id="sellerPhone" required />
            </div>
            <div class="mb-3">
              <label for="sellerEmail" class="form-label">廠商電郵</label>
              <input v-model="productData.sellerEmail" type="email" class="form-control" id="sellerEmail" required />
            </div>
            <div class="mb-3">
              <label for="sellerAddress" class="form-label">廠商地址</label>
              <input v-model="productData.sellerAddress" type="text" class="form-control" id="sellerAddress" required />
            </div>
            <div class="mb-3">
              <label for="productCategoryId" class="form-label">商品類別</label>
              <select v-model="productData.productCategoryId" class="form-control" id="productCategoryId" required>
                <option value="" disabled>選擇商品類別</option>
                <option v-for="category in categories" :key="category.productCategoryId" :value="category.productCategoryId">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">{{ product ? '更新' : '新增產品' }}</button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const props = defineProps({
  product: { type: Object, default: null },
});

const emit = defineEmits(['refresh', 'close']);
const productData = ref({
  productName: '',
  sku: '',
  brandName: '',
  productUnitPrice: null,
  discount: null,
  productDescription: '',
  capacity: null,
  stockQuantity: null,
  sellerName: '',
  sellerPhone: '',
  sellerEmail: '',
  sellerAddress: '',
  productCategoryId: null,
});

const categories = ref([]);

// 請求以獲取商品類別
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product-categories`);
    categories.value = response.data;
    console.log('Fetched categories:', categories.value); // 檢查返回的類別資料
  } catch (error) {
    console.error('獲取商品類別失敗:', error);
  }
};

// 當組件掛載時呼叫以獲取類別資料
onMounted(() => {
  fetchCategories();
});

// 監控 props.product 的變化，以填充表單
watch(props.product, (newProduct) => {
  if (newProduct) {
    Object.assign(productData.value, newProduct);
    productData.value.productCategoryId = newProduct.productCategory?.productCategoryId || null; // 確保設置為正確的類別 ID
  } else {
    // 清空資料
    productData.value = {
      productName: '',
      sku: '',
      brandName: '',
      productUnitPrice: null,
      discount: null,
      productDescription: '',
      capacity: null,
      stockQuantity: null,
      sellerName: '',
      sellerPhone: '',
      sellerEmail: '',
      sellerAddress: '',
      productCategoryId: null,
    };
  }
}, { immediate: true });

// 提交產品資料
const submitProduct = async () => {
  try {
    const payload = {
      productCategoryId: productData.value.productCategoryId, // 確保使用來自表單的商品類別 ID
      ...productData.value,
    };

    console.log('Submitting product:', payload); // 輸出將要提交的資料

    if (props.product) {
      // 更新已有產品
      await axios.put(`${API_BASE_URL}/api/product/update`, payload);
      console.log('Product updated successfully.');
    } else {
      // 創建新產品
      await axios.post(`${API_BASE_URL}/api/product/create`, payload);
      console.log('New product created successfully.');
    }

    emit('refresh'); // 刷新事件
    emit('close'); // 關閉模態框
  } catch (error) {
    console.error('保存產品失敗:', error);
    alert('保存產品失敗，請檢查控制台以獲取更多信息。');
  }
};
</script>

<style>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>