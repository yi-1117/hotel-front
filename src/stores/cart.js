import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from '@/config'; // 確保引入 API 基類型
import { useAuthStore } from '@/stores/auth'; // 引入 auth store

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] // 確保初始化為空數組
  }),

  actions: {
    // 從資料庫獲取購物車項目
    async fetchCartItems() {
      const authStore = useAuthStore(); // 使用 auth store
      if (!authStore.shoppingCartId) {
        console.error('購物車 ID 未定義');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart-item/shoppingCart/${authStore.shoppingCartId}`);
        this.cartItems = response.data.filter(item => item.quantity > 0 && item.product);
        console.log("獲取的購物車數據:", this.cartItems);
      } catch (error) {
        console.error('獲取購物車項目失敗:', error.response ? error.response.data : error);
      }
    },

    // 添加商品
    addToCart(item) {
      if (item && item.shoppingCart_Item_ID && item.product && item.product.productId) {
        this.cartItems.push(item); // 添加商品
        console.log("商品已成功添加:", item);
        console.log("當前購物車項目:", this.cartItems);
        this.fetchCartItems(); // 確保立即獲取最新的購物車數據
      } else {
        console.error("添加商品失敗: item 結構不正確", item);
      }
    },



    // 變更商品數量為0(刪除)
    async removeItem(item) {
      console.log("傳入移除的 item:", item);
      if (!item || !item.product || !item.product.productId) {
        console.error('無效的 item 被傳入');
        return;
      }

      await this.fetchCartItems(); // 更新 cartItems 才能接續操作
      console.log("更新前當前購物車項目:", this.cartItems);

      const authStore = useAuthStore(); // 使用 auth store
      if (!authStore.shoppingCartId) {
        console.error('購物車 ID 未定義');
        return;
      }

      console.log("更新:", authStore.shoppingCartId);
      console.log("當前購物車項目:", this.cartItems); // 檢查購物車數據

      const cartItemToUpdate = this.cartItems.find(cartItem => cartItem.product.productId === item.product.productId);

      if (!cartItemToUpdate) {
        console.error('未找到要更新的商品');
        return;
      }

      console.log("找到的商品:", cartItemToUpdate); // 查看具體的 cartItemToUpdate
      console.log("要更新的項目 ID:", cartItemToUpdate.shoppingCart_Item_ID); // 確認 ID 是否正確

      if (!cartItemToUpdate.shoppingCart_Item_ID) {
        console.error('shoppingCart_Item_ID 為 undefined，無法執行更新');
        return;
      }

      try {
        const updatedData = {
          shoppingCart: { shoppingCartId: authStore.shoppingCartId },
          product: { productId: cartItemToUpdate.product.productId },
          quantity: 0 // 更新為新的數量
        };

        const response = await axios.put(`${API_BASE_URL}/api/cart-item/${cartItemToUpdate.shoppingCart_Item_ID}`, updatedData);
        console.log("數量更新成功", response.data);
        await this.fetchCartItems(); // 重新獲取更新後的資料
      } catch (error) {
        console.error('更新數量失敗:', error.response ? error.response.data : error);
      }
    },

    // 更新商品數量
    async updateQuantity(item) {
      this.fetchCartItems()
      console.log("更新前當前購物車項目:", this.cartItems);
      const authStore = useAuthStore(); // 使用 auth store
      if (!authStore.shoppingCartId) {
        console.error('購物車 ID 未定義');
        return;
      }

      console.log("更新:", authStore.shoppingCartId);
      console.log("當前購物車項目:", this.cartItems); // 檢查購物車數據

      const cartItemToUpdate = this.cartItems.find(cartItem => cartItem.product.productId === item.product.productId);

      if (!cartItemToUpdate) {
        console.error('未找到要更新的商品');
        return;
      }

      console.log("找到的商品:", cartItemToUpdate); // 查看具體的 cartItemToUpdate
      console.log("要更新的項目 ID:", cartItemToUpdate.shoppingCart_Item_ID); // 確認 ID 是否正確

      // 確認 shoppingCart_Item_ID 是否效
      if (!cartItemToUpdate.shoppingCart_Item_ID) {
        console.error('shoppingCart_Item_ID 為 undefined，無法執行更新');
        return;
      }

      try {
        const updatedData = {
          shoppingCart: { shoppingCartId: authStore.shoppingCartId }, // 購物車 ID
          product: { productId: cartItemToUpdate.product.productId }, // 產品 ID
          quantity: item.quantity // 更新為新的數量
        };

        const response = await axios.put(`${API_BASE_URL}/api/cart-item/${cartItemToUpdate.shoppingCart_Item_ID}`, updatedData);
        console.log("數量更新成功", response.data);
        await this.fetchCartItems(); // 重新獲取更新後的資料
      } catch (error) {
        console.error('更新數量失敗:', error.response ? error.response.data : error);
      }
    },
  }
});