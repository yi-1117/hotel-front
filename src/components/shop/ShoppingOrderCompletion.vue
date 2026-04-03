<template>
  <div class="order-completion container">
    <h2 class="text-center mb-4">訂單完成</h2>
    <p class="text-center">感謝您的訂購！</p>
    <p class="text-center">訂單編號: <strong>{{ orderNumber }}</strong></p>
    
    <div class="card mb-4">
      <div class="card-header">
        <h3 class="mb-0">購買資訊</h3>
      </div>
      <div class="card-body">
        <ul class="list-group">
          <li v-for="item in purchaseItems" :key="item.productId" class="list-group-item">
            {{ item.productName }} - 數量: {{ item.quantity }}
          </li>
        </ul>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h3 class="mb-0">寄件人資訊</h3>
      </div>
      <div class="card-body">
        <p>名字: {{ shopperInfo.firstName }}</p>
        <p>姓: {{ shopperInfo.lastName }}</p>
        <p>電話: {{ shopperInfo.phone }}</p>
        <p>電子郵件: {{ shopperInfo.email }}</p>
        <p>地址: {{ shopperInfo.address }}</p>
      </div>
    </div>

    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-secondary" @click="goToShop">稍後付款</button>
      <button class="btn btn-primary" @click="payNow">立即付款</button>
    </div>
  </div>
</template>
  
  <script>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios'; // 確保導入 axios
  import { API_BASE_URL } from '@/config'; // 引入 API 基類型
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const orderNumber = route.query.orderNumber; // 從路由獲取訂單編號
      const purchaseItems = route.query.purchaseItems ? JSON.parse(route.query.purchaseItems) : [];
      const shopperInfo = {
        firstName: route.query.firstName || '',
        lastName: route.query.lastName || '',
        phone: route.query.phone || '',
        email: route.query.email || '',
        address: route.query.address || ''
      };
      console.log(purchaseItems);
      const goToShop = () => {
        router.push('/shop'); // 導航到購物車或商店頁面
      };
  
      
      const payNow = async () => {
    const paymentData = {
        shoppingOrderNumber: orderNumber // 當前的訂單編號
    };
    
    try {
        const response = await axios.post(`${API_BASE_URL}/api/ezpay/pay`, paymentData);
        
        // 獲得支付表單的 HTML 字符串
        const paymentHtml = response.data; 
        
        // 創建一個容器並將表單插入到頁面中
        const formContainer = document.createElement('div');
        formContainer.innerHTML = paymentHtml; // 插入接收到的表單 HTML
        
        // 將表單添加到 DOM
        document.body.appendChild(formContainer); 
        
        // 自動提交表單
        document.getElementById('allPayAPIForm').submit(); // 提交表單
    } catch (error) {
        console.error('支付請求失敗:', error.response ? error.response.data : error);
        alert('發生錯誤，無法處理付款請求。');
    }
};

  
      return {
        orderNumber,
        purchaseItems,
        shopperInfo,
        goToShop,
        payNow
      };
    }
  };
  </script>
  
  <style scoped>
  .order-completion {
  padding: 20px;
  background-color: #f8f9fa; /* 淺灰色背景 */
  border-radius: 10px; /* 圓角邊框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 增加陰影效果 */
}
  </style>