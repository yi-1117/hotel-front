<template>
   
    <div class="orders-container">
      <h2 class="title">我的訂單</h2>
  
      <div class="date-filter">
        <label for="startDate">開始日期:</label>
        <input type="date" id="startDate" v-model="startDate" />
        <label for="endDate">結束日期:</label>
        <input type="date" id="endDate" v-model="endDate" />
        <button @click="filterOrders">篩選訂單</button>
      </div>
  
      <div class="filters-container">
  <div class="status-filter">
    <label for="status">訂單狀態:</label>
    <select v-model="statusFilter" id="status">
      <option value="">所有</option>
      <option value="待付款">待付款</option>
      <option value="已付款">已付款</option>
      <option value="已取消">已取消</option>
    </select>
  </div>

  <div class="per-page">
    <span>每頁顯示:</span>
    <select v-model="perPage" @change="changePage(1)">
      <option value="10">10 筆</option>
      <option value="20">20 筆</option>
      <option value="30">30 筆</option>
    </select>
  </div>
  <div class="pagination">
      <label for="page-select">頁數:</label>
      <select id="page-select" v-model="currentPage">
        <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
      </select>
    </div>
</div>
      <div v-if="filteredOrders.length">
        <h3>您的訂單:</h3>
        <ul>
          <li v-for="order in filteredOrders" :key="order.shoppingOrderId" class="order-item">
            <div class="order-summary" @click="toggleDetails(order.shoppingOrderId)">
              <strong>訂單號:</strong> {{ order.shoppingOrderNumber || '未提供' }} <br>
              <strong>總金額:</strong> {{ order.totalPayment }} 元<br>
              <strong>使用積分:</strong> {{ order.usedPoints }} 點<br>
              <strong>創建日期:</strong> {{ formatDate(order.createOrderDate) }} <br>
              <strong>訂單狀態:</strong> {{ order.orderStatus }} <br>
            </div>
  
            <div v-if="order.showDetails" class="order-details">
              <h4>訂單詳情:</h4>
              <ul>
                <li v-for="detail in order.shoppingDetails" :key="detail.shoppingDetailId">
                商品名稱: {{ productNames[detail.shoppingDetailId] || '正在獲取...' }} - 數量: {{ detail.quantity }} - 總金額: {{ detail.totalAmount }}
              </li>
              </ul>
            </div>
  
            <div class="order-actions">
              <button v-if="order.orderStatus === '待付款'" @click.stop="makePayment(order)" class="payment-button">立即付款</button>
              <button v-if="order.orderStatus !== '已取消'" @click.stop="cancelOrder(order.shoppingOrderNumber)" class="cancel-button">取消訂單</button>
            </div>
            <hr/>
          </li>
        </ul>
  </div>
      
  
      <div v-else>
        <p>尚未找到訂單。</p>
      </div>
    </div>

  </template>
  
  <script>
import { useAuthStore } from '@/stores/auth'; 
import { API_BASE_URL } from '@/config'; 
import axios from 'axios';
import Swal from 'sweetalert2'; 

export default {
  name: "MemberShoppingOrders",
  data() {
    return {
      orders: [],
      startDate: '',
      endDate: '',
      perPage: 10,
      currentPage: 1,
      statusFilter: '', // 增加狀態過濾
      productNames: {}
    };
  },
  computed: {
    filteredOrders() {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      
      // 过滤订单状态和日期
      let filtered = this.orders.filter(order => {
        const orderDate = new Date(order.createOrderDate);
        const statusMatch = this.statusFilter ? order.orderStatus === this.statusFilter : true;
        
        return statusMatch 
               && (!this.startDate || orderDate >= startDate) 
               && (!this.endDate || orderDate <= endDate);
      });
      
      // 提供分页功能
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.orders.length / this.perPage);
    }
  },
  methods: {
    async fetchMemberOrders() {
      const authStore = useAuthStore();
  
      if (authStore.isLoggedIn) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/orders/findmemberorder/${authStore.memberId}`);
          this.orders = response.data.map(order => ({ 
            ...order, 
            showDetails: false 
          }));
        } catch (error) {
          console.error("獲取訂單失敗:", error);
          this.orders = []; 
        }
      } else {
        alert("請先登入!");
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    toggleDetails(orderId) {
      const order = this.orders.find(o => o.shoppingOrderId === orderId);
      if (order) {
        order.showDetails = !order.showDetails;
      }
    },
    async makePayment(order) {
      const result = await Swal.fire({
        title: '確認付款',
        text: "您確定要支付此訂單嗎?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，付款',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        try {
          const paymentData = {
            shoppingOrderNumber: order.shoppingOrderNumber,
          };
          const response = await axios.post(`${API_BASE_URL}/api/ezpay/pay`, paymentData);
          const paymentHtml = response.data;
          const formContainer = document.createElement('div');
          formContainer.innerHTML = paymentHtml;
          document.body.appendChild(formContainer);
          document.getElementById('allPayAPIForm').submit();
        } catch (error) {
          console.error("支付請求失敗:", error);
          Swal.fire('支付請求失敗', '請檢查控制台錯誤信息。', 'error');
        }
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
            this.fetchMemberOrders();
          }
        } catch (error) {
          console.error("取消訂單失敗:", error);
          Swal.fire('取消訂單失敗', '請檢查控制台錯誤信息。', 'error');
        }
      }
    },
    async loadProductNames() {
      for (const order of this.orders) {
        for (const detail of order.shoppingDetails) {
          if (!this.productNames[detail.shoppingDetailId]) {
            try {
              const response = await axios.get(`${API_BASE_URL}/api/shoppingDetailController/${detail.shoppingDetailId}`);
              this.productNames[detail.shoppingDetailId] = response.data.productName;
            } catch (error) {
              console.error(`獲取商品名稱失敗（ID: ${detail.shoppingDetailId}）:`, error);
            }
          }
        }
      }
    },
    changePage(page) {
      this.currentPage = page;
    }
  },
  async mounted() {
    await this.fetchMemberOrders(); 
    await this.loadProductNames();
  }
};
</script>
  
  <style scoped>
  .orders-container {
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    color: #333;
  }
  
  .date-filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center; /* 垂直居中 */
  }
  
  .date-filter label {
    margin-right: 5px;
  }
  
  .date-filter input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px; /* 添加間距 */
  }
  
  .order-item {
    background: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #eee;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .order-summary {
    padding: 10px;
    cursor: pointer;
  }
  
  .order-item:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .order-actions {
    margin-top: 10px;
  }
  
  .payment-button, .cancel-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .payment-button {
    background-color: #4CAF50; /* 綠色 */
    color: white;
  }
  
  .payment-button:hover {
    background-color: #45a049; /* 深綠色 */
  }
  
  .cancel-button {
    background-color: #f44336; /* 紅色 */
    color: white;
  }
  
  .cancel-button:hover {
    background-color: #d32f2f; /* 深紅色 */
  }
  
  .order-details {
    margin-top: 10px;
    padding: 10px;
    background: #e9ecef;
    border-radius: 5px;
  }
  .pagination button {
  padding: 5px 10px;
  margin: 2px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #333;
  color: white;
}
.filters-container {
  display: flex; /* 使用彈性佈局 */
  align-items: center; /* 垂直置中 */
  margin-bottom: 20px; /* 下方間距 */
}

.status-filter, .per-page {
  margin-right: 20px; /* 兩者之間的間距 */
}

.status-filter label, .per-page span {
  margin-right: 5px; /* 標籤和下拉選單之間的間距 */
}

.status-filter select, .per-page select {
  padding: 5px; /* 選單的內間距 */
  border: 1px solid #ccc; /* 邊框樣式 */
  border-radius: 5px; /* 圓角 */
}
  </style>