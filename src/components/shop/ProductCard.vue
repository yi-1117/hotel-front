<template>
  <div class="product-card">
    <img 
      :src="product.images && product.images.length > 0 ? product.images[0] : 'default-image.jpg'" 
      alt="商品圖片" 
      class="product-image" 
    />
    <h3>{{ product.productName }}</h3>
    <p class="product-price">價格: {{ product.productUnitPrice.toFixed(2) }} 元</p>
    
    <!-- 了解更多的按鈕 -->
    <router-link :to="product.productId ? '/shop/product/' + product.productId : '#'" class="info-button">
      <font-awesome-icon :icon="['fas', 'arrow-right']" /> 了解更多
    </router-link>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    // 在組件掛載時打印產品信息
    console.log('Product data:', this.product);
  },
};
</script>


<style>
.product-card {
  border: 1px solid #ddd;
  border-radius: 10px; 
  padding: 15px; 
  text-align: center; 
  transition: transform 0.2s, box-shadow 0.2s; 
  background-color: #ffffff; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  margin: 10px; /* 產品卡片之間的間距 */
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
}

.product-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px; 
}

h3 {
  font-size: 1.2em; 
  color: #333; 
  margin: 10px 0; 
}

.product-price {
  font-size: 1em; 
  color: #007bff; /* 使用藍色顯示價格 */
  margin: 5px 0; 
}

.info-button {
  display: inline-block; 
  padding: 10px 15px; 
  border: none; 
  border-radius: 5px; 
  background-color: #007bff; 
  color: white; 
  text-decoration: none; 
  font-size: 1em; 
  transition: background-color 0.3s; 
}

.info-button:hover {
  background-color: #0056b3; /* 深藍色 */
}
</style>