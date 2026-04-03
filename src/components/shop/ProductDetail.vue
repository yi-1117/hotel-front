<template>
  <div class="product-detail">
    <h3>{{ product.productName }}</h3>
    <!-- 顯示產品圖片 -->
    <img 
      :src="productImage" 
      class="img-fluid product-image" 
      alt="Product Image"  
      v-if="productImage"
    />
    <img 
      src="/images/no-image.jpg" 
      class="img-fluid" 
      alt="Default Product Image"  
      v-else 
    /> <!-- 預設圖片 -->

    <p>{{ product.productDescription }}</p>

    <div class="quantity-selector">
      <label for="quantity">數量:</label>
      <input type="number" v-model="quantity" min="1" :disabled="!authStore.isLoggedIn" />
      <span v-if="!authStore.isLoggedIn" style="color: red;">登入會員才能增加數量</span>
    </div>
    <div class="button">
    <button class="btn btn-primary" @click="addToCart">加入購物車</button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart"; // 引入購物車的store
import { useAuthStore } from "@/stores/auth"; // 引入認證的store
import axios from 'axios';
import { API_BASE_URL } from '@/config'; // 引入 API 基類型
import Swal from 'sweetalert2'; // 引入 SweetAlert2

const route = useRoute(); // 獲取路由信息
const cartStore = useCartStore(); // 使用購物車 store

const productId = route.params.productId; // 從路由中獲取商品 ID
const quantity = ref(1); // 預設數量
const product = ref({ productName: '', productDescription: '', productPhoto: '' ,productId:null}); // 儲存商品資料
const productImage = ref(''); // 儲存商品圖片
const authStore = useAuthStore(); // 使用 authStore

// 獲取商品資料
const fetchProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product/find/${productId}`);
    product.value = response.data; // 將商品數據賦值給 product
    console.log("獲取商品資料", response.data);
  } catch (error) {
    console.error('獲取商品資料失敗:', error);
  }
};

// 獲取產品照片中 ID 最小的照片
const fetchProductImage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/product-photos/${productId}`);
    
    // 假設 response.data 是一個數組，根據 ID 排序並取出第一个項目
    const sortedImages = response.data.sort((a, b) => a.photoId - b.photoId); // 請根據實際欄位名替換 'photoId'
    const item = sortedImages[0]; // 取得 ID 最小的圖片

    // 如果 item 存在，則獲取 productPhoto
    if (item && item.productPhoto) {
      productImage.value = `data:image/jpeg;base64,${item.productPhoto}`; // 設置商品圖片的 Base64 格式
    } else {
      productImage.value = '/images/no-image.jpg'; // 若無圖片設置為預設圖片
    }
  } catch (error) {
    console.error('獲取商品圖片失敗:', error);
    productImage.value = '/images/no-image.jpg'; // 錯誤情況下顯示預設圖片
  }
};

// 添加到購物車
const addToCart = async () => {
  if (!authStore.isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: '請先登入',
      text: '您必須登入才能添加商品到購物車。',
      confirmButtonText: '確認',
    });
    return; // 若未登入，則不繼續執行
  }

  // 構建要發送的數據
  const itemToAdd = {
    shoppingCart: {
      shoppingCartId: authStore.shoppingCartId,
    },
    product: {
      productId: product.value.productId,
    },
    quantity: quantity.value,
  };

  try {
    // 發送 POST 請求到購物車 API
    const response = await axios.post(`${API_BASE_URL}/api/cart-item/add`, itemToAdd);
    console.log('添加成功:', response.data);

    // 確保成功後更新 navbar 中的購物車資料
    await cartStore.fetchCartItems(); // 獲取最新的購物車項目

  } catch (error) {
    console.error('添加商品到購物車失敗:', error);
  }
};

onMounted(() => {
  fetchProduct(); 
  fetchProductImage(); // 獲取商品圖片
});
</script>

<style scoped>
.product-image {
  max-width: 500px; /* 限制最大寬度 */
  max-height:500px; /* 限制最大高度 */
  height: auto; /* 自動調整高度以保持比例 */
}
.responsive-image {
  max-width: 50%; /* 最大寬度100% */
  height: 80%; /* 自動調整高度以保持比例 */
}
.product-detail-container {
  padding: 20px;
}

.product-detail {
  /* max-width: 800px;  */
  text-align: center; /* 文字置中 */
  /* background-color: blue; */
}

.product-image-container {
  display: flex; /* 使用 Flexbox 使圖片和按鈕排列 */
  align-items: center; /* 垂直對齊 */
  margin-bottom: 20px; /* 控制圖片和描述之間的距離 */
}



.button-container {
  display: flex;
  align-items: center; /* 垂直置中按鈕 */
}

.quantity-selector {
  margin-top: 20px; /* 控制數量選擇器與其他元素的距離 */
}
.button{
margin: 20px;
}
</style>