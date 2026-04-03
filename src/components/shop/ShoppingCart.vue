<template>
  <div class="shopping-cart">
    <h2>購物車</h2>
    <table>
      <thead>
        <tr>
          <th></th> <!-- 勾選框的列 -->
          <th>商品名稱</th>
          <th>數量</th>
          <th>單價</th>
          <th>總價</th>
          <th>移除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cartItems.length === 0">
          <td colspan="6">購物車是空的！</td>
        </tr>
        <tr v-for="item in cartItems" :key="item.shoppingCart_Item_ID" >
          <td>
            <input type="checkbox" v-model="selectedItems[item.shoppingCart_Item_ID]" />
          </td>
          <td>{{ item.product.productName }}</td>
         
          <td>
            <input 
              type="number" 
              v-model="item.quantity" 
              @change="updateQuantity(item)" 
              min="1"
            />
          </td>
          <td>{{ item.product.productUnitPrice }} 元</td>
          <td>{{ (item.product.productUnitPrice * item.quantity).toFixed(2) }} 元</td>
          <td>
            <button @click="removeCartItem(item)">移除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="total-price">
      <strong>總價: {{ totalPrice().toFixed(2) }} 元</strong>
    </div>

    <div class="button-container">
  <button class="action-button" @click="confirmPurchase">確認購買</button>
  <button class="action-button" @click="$emit('close')">關閉</button>
</div>
  </div>

  <OrderForm
  v-if="showOrderForm"
  :product="selectedProducts"  
  :memberId="authStore.memberId" 
  @close="showOrderForm = false"
/>
</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config'; // 引入 API 基類型
import { useAuthStore } from '@/stores/auth'; // 引入 auth store
import eventBus from '@/stores/bus.js'; // 引入事件總線
import OrderForm from './ShopOrderForm.vue'; // 載入訂單資料填寫組件
import { useRouter } from 'vue-router'; // 引入 useRouter
import   Swal from 'sweetalert2'; // 引入 SweetAlert2

export default {
  components: {
    OrderForm
  },
  setup() {
    const authStore = useAuthStore(); // 使用 auth store
    const cartItems = ref([]); // 用於存儲購物車項目
    const selectedItems = ref({}); // 用於選擇的商品
    const showOrderForm = ref(false); // 控制訂單表單顯示
    const selectedProducts = ref([]); // 暫存用戶選中的商品
    const router = useRouter(); // 獲取 router 實例

    // 獲取所有購物車項目
    const fetchCartItems = async () => {
      if (!authStore.shoppingCartId) {
        console.error('購物車 ID 未定義');
        return;
      }

      try {
        console.log(`${API_BASE_URL}/api/cart-item/shoppingCart/${authStore.shoppingCartId}`); // 檢查取得的請求 URL
        const response = await axios.get(`${API_BASE_URL}/api/cart-item/shoppingCart/${authStore.shoppingCartId}`);
        console.log("獲取的購物車數據:", response.data); // 檢查取得的數據
        cartItems.value = response.data.filter(item => item.quantity > 0 && item.product); // 確保 item 結構正確
        cartItems.value.forEach(item => {
      // selectedItems.value[item.shoppingCart_Item_ID] = false; // 每個項目默認為未選中
    });
      } catch (error) {
        console.error('獲取購物車項目失敗:', error.response ? error.response.data : error);
      }
    };

    // 更新商品數量
    const updateQuantity = async (item) => { 
  if (!authStore.shoppingCartId) {
    console.error('購物車 ID 未定義');
    return;
  }
  
  try {
    console.log("更新:", authStore.shoppingCartId);
    const response = await axios.get(`${API_BASE_URL}/api/cart-item/shoppingCart/${authStore.shoppingCartId}`);
    
    console.log("獲取的購物車數據:", response.data);
    
    // 假設 item 是要更新的 CartItem 對象
    const cartItemToUpdate = response.data.find(cartItem => cartItem.product.productId === item.product.productId);
    
    if (!cartItemToUpdate) {
      console.error('未找到要更新的商品');
      return;
    }

    console.log("要更新的項目 ID:", cartItemToUpdate.shoppingCart_Item_ID); // 確認 ID 是否正確

    // 使用完整資料格式進行更新
    const updatedData = {
        shoppingCart: {
            shoppingCartId: authStore.shoppingCartId // 從 authStore 獲取購物車 ID
        },
        product: {
            productId: cartItemToUpdate.product.productId // 使用找到的 CartItem 的 productId
        },
        quantity: item.quantity // 更新為新的數量
    };

    await axios.put(`${API_BASE_URL}/api/cart-item/${cartItemToUpdate.shoppingCart_Item_ID}`, updatedData); // 傳送完整的資料結構

    console.log("數量更新成功");
    eventBus.emit('cartUpdated'); // 發射事件來告知父組件更新購物車
  } catch (error) {
    console.error('更新數量失敗:', error.response ? error.response.data : error);
  }
};

    // 移除商品
    const removeCartItem = async (item) => { 
  // 確認是否真的要移除商品
  const result = await Swal.fire({
    title: '確定要移除此商品嗎？',
    text: '這個操作無法恢復！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d9534f',
    cancelButtonColor: '#5bc0de',
    confirmButtonText: '是的，移除！',
    cancelButtonText: '取消'
  });

  if (result.isConfirmed) {
    // 用戶確認移除
    if (!authStore.shoppingCartId) {
      console.error('購物車 ID 未定義');
      return;
    }
    
    try {
      console.log("更新:", authStore.shoppingCartId);
      const response = await axios.get(`${API_BASE_URL}/api/cart-item/shoppingCart/${authStore.shoppingCartId}`);
      
      const cartItemToUpdate = response.data.find(cartItem => cartItem.product.productId === item.product.productId);
      
      if (!cartItemToUpdate) {
        console.error('未找到要更新的商品');
        return;
      }

      const updatedData = {
          shoppingCart: {
              shoppingCartId: authStore.shoppingCartId
          },
          product: {
              productId: cartItemToUpdate.product.productId
          },
          quantity: 0 // 更新為新的數量
      };

      await axios.put(`${API_BASE_URL}/api/cart-item/${cartItemToUpdate.shoppingCart_Item_ID}`, updatedData);
      await fetchCartItems(); // 更新購物車列表
      Swal.fire('移除成功', '這個商品已被移除！', 'success'); // 提示用戶移除成功
      eventBus.emit('cartUpdated');
    } catch (error) {
      console.error('更新數量失敗:', error.response ? error.response.data : error);
    }
  }
};

    // 計算總價
    const totalPrice = () => {
      return cartItems.value.reduce((total, item) => {
        return total + (item.product.productUnitPrice * item.quantity);
      }, 0);
    };

    // 確認購買的功能
    const confirmPurchase = () => {
  // 過濾選中的項目
  const purchasedItems = cartItems.value.filter(item => selectedItems.value[item.shoppingCart_Item_ID]);

  if (purchasedItems.length > 0) {
    selectedProducts.value = purchasedItems;
    showOrderForm.value = true;

    // 提示用戶確認購買
    Swal.fire({
      title: '確認購買',
      text: '您確定要進行購買嗎？',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        // 導航到訂單頁面
        const memberId = authStore.memberId;
        router.push({
          name: 'ShopOrderForm',
          query: {
            memberId: memberId,
            products: JSON.stringify(purchasedItems)
          }
        });
      }
    });
  } else {
    Swal.fire('警告', '請選擇至少一個商品進行購買！', 'warning');
  }
};


    onMounted(() => {
      fetchCartItems(); // 在組件掛載時調用
    });

    return {
      cartItems,
      selectedItems,
      updateQuantity,
      removeCartItem,
      totalPrice,
      confirmPurchase,
    };
  },
};
</script>

<style scoped>
.shopping-cart {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

th {
  background-color: #007bff;
  color: white;
}

td {
  background-color: #fff;
}

tr:hover {
  background-color: #f1f1f1; /* 鼠標懸停的行 */
}

button {
  background-color: #28a745; /* 綠色背景 */
  color: white; /* 白色文字 */
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #218838; /* 深綠色 */
}

.total-price {
  margin-top: 20px;
  text-align: right;
  font-size: 1.2rem; /* 提升字體大小 */
  font-weight: bold;
}

.button-container {
  display: flex; /* 使用 Flexbox 來排列按鈕 */

  margin-top: 20px; /* 上方的間距 */
}

.action-button {
  background-color: #28a745; /* 綠色背景 */
  color: white; /* 白色文字 */
  border: none;
  padding: 10px 20px; /* 內邊距 */
  border-radius: 5px; /* 圓角 */
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px; /* 右邊距，增加按鈕間距 */
}

.action-button:last-child {
  margin-right: 0; /* 最後一個按鈕不需要右邊距 */
}

.action-button:hover {
  background-color: #218838; /* 深綠色 */
}
</style>