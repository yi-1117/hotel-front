<template>
    <div class="shop-complete">
      <h2>訂單完成</h2>
      <p>感謝您的訂購，您的訂單已成功完成。</p>
      <button @click="goToShop">返回商店</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios'; // 需要使用 axios
  import { API_BASE_URL } from '@/config'; // 引入你的 API 基本URL
  
  export default {
    setup() {
      const route = useRoute(); // 獲取當前路由
      const router = useRouter(); // 獲取 router 實例
      const orderNumber = route.query.orderNumber; // 獲取傳遞過來的訂單編號
      console.log(orderNumber)
  
      const handleOrderStatusUpdate = async () => {
    try {
        // 調用更新訂單狀態的 API
        const response = await axios.post(`${API_BASE_URL}/api/ezpay/shopcomplete`, {
            shoppingOrderNumber: orderNumber // 將訂單號作為請求體的一部分傳遞
        });

        console.log(response.data); // 打印響應數據
    } catch (error) {
        console.error('更新訂單狀態失敗:', error.response ? error.response.data : error);
        alert('更新訂單狀態失敗，請重試。');
    }
};
  
      const goToShop = () => {
        router.push('/shop'); // 導航到商店頁面
      };
  
      // 在組件掛載時更新訂單狀態
      onMounted(() => {
        handleOrderStatusUpdate(); // 更新訂單狀態
      });
  
      return {
        goToShop
      };
    }
  };
  </script>
  
  <style scoped>
  .shop-complete {
    padding: 20px;
    text-align: center;
  }
  </style>