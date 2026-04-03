<template>
    <div class="cart-item">
      <img :src="item.images[0]" alt="商品圖片" class="cart-item-image" />
      <div>
        <h4>{{ item.name }}</h4>
        <p>價格: \${{ item.price.toFixed(2) }}</p>
        <p>數量: 
          <input type="number" v-model="localQuantity" @change="updateQuantity" min="1" />
        </p>
        <button @click="removeFromCart">刪除</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    setup(props, { emit }) {
      const localQuantity = ref(props.quantity); // 使用本地狀態來管理數量
  
      // 當 props.quantity 改變時，更新本地狀態
      watch(() => props.quantity, (newQuantity) => {
        localQuantity.value = newQuantity;
      });
  
      const updateQuantity = () => {
        emit('update-quantity', props.item.id, localQuantity.value); // 發送更新事件
      };
  
      const removeFromCart = () => {
        emit('remove-from-cart', props.item.id); // 發送刪除事件
      };
  
      return {
        localQuantity,
        updateQuantity,
        removeFromCart,
      };
    },
  };
  </script>
  
  <style>
  .cart-item {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .cart-item-image {
    max-width: 100px; /* 可以根據需求設置 */
    margin-right: 10px;
  }
  </style>