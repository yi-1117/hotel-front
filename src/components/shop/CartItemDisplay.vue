<template>
  <div class="shopping-cart-container">
    <ShoppingCart @cartUpdated="fetchCartItems" />
    <div v-if="items.length === 0" class="empty-cart-message">購物車是空的！</div>
    <ul v-else class="cart-items-list">
      <li v-for="item in items" :key="item.product.productId" class="cart-item">
        <span class="item-details">{{ item.product.productName }} - {{ item.quantity }}件</span>
        <input 
          type="number" 
          v-model="item.quantity" 
          min="1" 
          class="quantity-input"
          @change="updateQuantity(item)"
        />
        <button class="remove-button" @click="removeItem(item)">移除</button>
      </li>
    </ul>
  </div>
</template>
<script>
import { useCartStore } from '@/stores/cart'; // 假設您使用 Pinia 或 Vuex 作為狀態管理
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async removeItem(item) {
      const cartStore = useCartStore();
      await cartStore.removeItem(item); // 在 store 中調用移除操作
      // this.$emit('update'); // 觸發事件以通知父組件
    },
    async updateQuantity(item) {
      const cartStore = useCartStore();
      await cartStore.updateQuantity(item); // 在 store 中調用更新數量操作
      // 可以選擇在這裡要不要觸發事件
    },
  },
};
</script>

<style scoped>
.shopping-cart-container {
  max-width: 600px; /* 限制最大寬度 */
  margin: 20px auto; /* 居中 */
  padding: 20px;
  background-color: #ffffff; /* 背景顏色 */
  border-radius: 10px; /* 圓角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  font-family: Arial, sans-serif; /* 設定字體 */
}

.empty-cart-message {
  text-align: center; /* 文字居中 */
  font-size: 1.2em; /* 更大的字體 */
  color: #888; /* 顏色 */
}

.cart-items-list {
  list-style-type: none; /* 移除標號 */
  padding: 0; /* 移除內邊距 */
}

.cart-item {
  display: flex; /* 使用 flexbox 排版 */
  justify-content: space-between; /* 兩端對齊 */
  align-items: center; /* 垂直對齊 */
  padding: 10px;
  border-bottom: 1px solid #eee; /* 下邊框 */
  font-size: 1em; /* 設定正常字體大小 */
  line-height: 1.5; /* 行高稍微高一點 */
}

.item-details {
  flex: 1; /* 擴展以佔用剩餘空間 */
}

.quantity-input {
  width: 60px; /* 設置寬度 */
  padding: 5px; /* 內邊距 */
  border: 1px solid #ccc; /* 邊框 */
  border-radius: 5px; /* 圓角 */
  font-size: 1em; /* 確保輸入框中的字體大小 */
}

.remove-button {
  background-color: #f44336; /* 紅色 */
  color: white;
  border: none;
  border-radius: 5px; /* 圓角 */
  padding: 5px 10px; /* 內邊距 */
  cursor: pointer; /* 游標變為手型 */
  transition: background-color 0.3s; /* 變色過度效果 */
  font-size: 1em; /* 設定正常字體大小 */
}

.remove-button:hover {
  background-color: #d32f2f; /* 深紅色 */
}
</style>