<template>
      <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <div class="main-content">
    <div class="order-management">
      <h2>訂單管理</h2>
      
      <div class="search-section">
        <label for="orderNumber">訂單編號:</label>
        <input type="text" v-model="orderNumber" id="orderNumber" placeholder="請輸入訂單編號" />
        <button @click="fetchOrder">查詢訂單</button>
      </div>
  
      <div v-if="order" class="order-details">
        <h3>訂單詳細資訊</h3>
        <div class="order-info">
          <strong>訂單號:</strong> {{ order.shoppingOrderNumber }} <br>
          <strong>總金額:</strong> {{ order.totalPayment }} 元<br>
          <strong>創建日期:</strong> {{ formatDate(order.createOrderDate) }} <br>
          <strong>訂單狀態:</strong> {{ order.orderStatus }} <br>
        </div>
  
        <div class="order-actions">
          <button 
            v-if="order.orderStatus !== '已取消'" 
            @click="cancelOrder(order.shoppingOrderNumber)"
            class="cancel-button">
            取消訂單
          </button>
        </div>
      </div>
  
      <div v-else-if="fetchError" class="error-message">
        <p>查無此訂單，請檢查訂單編號。</p>
      </div>
    </div>
  </div>
</div>
  </template>

  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { API_BASE_URL } from '@/config';
  import ESidebar from "@/components/admin/ESidebar.vue";
  
  export default {
    name: "OrderManagement",
    components: {
      ESidebar, // 註冊組件
    },
    data() {
      return {
        orderNumber: '',
        order: null,
        fetchError: false
      };
    },
    methods: {
      async fetchOrder() {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/orders/find/${this.orderNumber}`);
          this.order = response.data;
          this.fetchError = false; // 重置查詢錯誤標誌
        } catch (error) {
          console.error("查詢訂單失敗:", error);
          this.order = null; // 清空訂單資料
          this.fetchError = true; // 設置錯誤標誌
        }
      },
      
      async cancelOrder(orderNumber) {
  const result = await Swal.fire({
    title: '確認取消訂單',
    text: "您確定要取消此訂單嗎?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是的，取消訂單',
    cancelButtonText: '取消'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/orders/cancel/${orderNumber}`);
      if (response.status === 204) {
        Swal.fire('訂單已成功取消！');
        
        // 取消成功後，重新查詢訂單以顯示最新狀態
        await this.fetchOrder();
      }
    } catch (error) {
      console.error("取消訂單失敗:", error);
      Swal.fire('取消訂單失敗', '請檢查控制台錯誤信息。', 'error');
    }
  }
},
  
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }
    }
  };
  </script>

  <style>
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
.order-management {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

.search-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-section label {
  margin-right: 10px;
}

.search-section input {
  flex: 1; /* 自適應填充空間 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-section button {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-section button:hover {
  background-color: #45a049;
}

.order-details {
  margin-top: 20px;
}

.order-info {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.order-actions {
  display: flex; /* 使用彈性盒子 */
  justify-content: center; /* 水平置中 */
  margin-top: 20px; /* 上方間距 */
}

.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #f44336; /* 紅色 */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #d32f2f; /* 深紅色 */
}

.error-message {
  color: #f44336; /* 錯誤訊息的紅色 */
  text-align: center;
}
</style>