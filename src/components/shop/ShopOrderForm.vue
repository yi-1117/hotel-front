<template>
  <div class="order-form container">
    <h2 class="mb-4">填寫訂單資料</h2>
    
    <div>
      <h3>選中商品:</h3>
      <ul class="list-group mb-3">
        <li v-for="item in product" :key="item.product.productId" class="list-group-item">
          {{ item.product.productName }} - 數量: {{ item.quantity }}
        </li>
      </ul>
    </div>
    
    <form @submit.prevent="submitOrder">
      <div class="mb-3">
        <label class="form-label">收件人名字:</label>
        <input type="text" v-model="orderData.shopperFirstName" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">收件人姓:</label>
        <input type="text" v-model="orderData.shopperLastName" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">收件人電話:</label>
        <input type="tel" v-model="orderData.shopperPhone" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">收件人電子郵件:</label>
        <input type="email" v-model="orderData.shopperEmail" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">收件人地址:</label>
        <input type="text" v-model="orderData.shopperAddress" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">本次訂單使用積分:</label>
        <div class="input-group">
          <input type="number" v-model.number="orderData.pointsToUse" class="form-control" min="0" />
          <span class="input-group-text">(目前個人積分: {{ currentPoints }})</span>
        </div> 
      </div>
      
      <button type="submit" class="btn btn-primary">確認訂單</button>
    </form>
  </div>
</template>
  
  <script>
  import { ref,onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router'; // 引入 useRouter
  import { API_BASE_URL } from '@/config'; // 引入 API 基類型
  import eventBus from '@/stores/bus.js'; // 引入事件總線
  
  export default {
    props: {
      product: {
        type: Array,
        required: true
      },
      memberId: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const route = useRoute(); // 獲取當前路由
      const router = useRouter(); // 獲取 router 實例
  console.log("接收到的產品:", props.product); // 檢查是否捕獲到產品
  const products = JSON.parse(route.query.products || "[]"); // 解析產品
  const orderData = ref({
    shopperFirstName: '',
    shopperLastName: '',
    shopperPhone: '',
    shopperEmail: '',
    shopperAddress: '',
    pointsToUse: 0
  });
  
  const submitOrder = async () => {
    const orderPayload = {
        memberId: parseInt(props.memberId, 10),
        selectedProductIds: props.product.map(item => item.product.productId),
        shopperFirstName: orderData.value.shopperFirstName,
        shopperLastName: orderData.value.shopperLastName,
        shopperPhone: parseInt(orderData.value.shopperPhone, 10),
        shopperEmail: orderData.value.shopperEmail,
        shopperAddress: orderData.value.shopperAddress,
        pointsToUse: orderData.value.pointsToUse
    };

    try {
        const response = await axios.post(`${API_BASE_URL}/api/orders/create`, orderPayload);
        console.log("訂單創建成功:", response.data);

        // 獲取 shopping details
        const shoppingDetails = response.data.shoppingDetails; // 確保取回的購物明細

        const productsWithNames = await Promise.all(shoppingDetails.map(async (detail) => {
            // 使用 shoppingDetail ID 獲取產品 ID
            const shoppingDetailResponse = await axios.get(`${API_BASE_URL}/api/shoppingDetailController/${detail.shoppingDetailId}`);
            const productId = shoppingDetailResponse.data.productId; // 獲取 product_id
            console.log(shoppingDetailResponse);
            // 使用 product ID 獲取產品名稱
            const productResponse = await axios.get(`${API_BASE_URL}/api/product/find/${productId}`);
            return {
                shoppingDetailId: detail.shoppingDetailId,
                productId: productResponse.data.productId,
                productName: productResponse.data.productName, // 獲取產品名稱
                quantity: detail.quantity // 獲取數量
            };
        }));

        // 導航到訂單完成頁面，推送完整的產品資訊
        router.push({
            name: 'ShoppingOrderCompletion',
            query: {
                orderNumber: response.data.shoppingOrderNumber,
                purchaseItems: JSON.stringify(productsWithNames), // 傳遞所有產品資訊
                firstName: orderData.value.shopperFirstName,
                lastName: orderData.value.shopperLastName,
                phone: orderData.value.shopperPhone,
                email: orderData.value.shopperEmail,
                address: orderData.value.shopperAddress
            }
        });

        eventBus.emit('orderUpdated'); // 通知已更新的事件

    } catch (error) {
        console.error("訂單創建失敗:", error.response ? error.response.data : error);
    }
};
      
    const currentPoints = ref(0); // 新增變量用於儲存當前點數

// 獲取會員點數
const fetchPoints = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/points/get/${props.memberId}`); // 使用會員 ID 獲取點數
    console.log(response.data);
    currentPoints.value = response.data.success; // 假設 API 返回的數據中有 points 欄位

  } catch (error) {
    console.error("獲取會員點數失敗:", error.response ? error.response.data : error);
  }
};
  
onMounted(() => {
      fetchPoints(); // 在組件掛載時調用
    });
      return {
        orderData,
        submitOrder,
        currentPoints
      };
    }
  };
  </script>
  
  <style scoped>
.order-form {
    padding: 20px;
    background-color: #f8f9fa; /* 淺灰色背景 */
    border-radius: 10px; /* 圓角邊框 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 增加陰影效果 */
}
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin: 5px 0;
  }
  
  input {
    margin-bottom: 10px;
  }
  </style>