// stores/auth.js
import { defineStore } from "pinia";
import { API_BASE_URL } from '@/config'; // 引入 API 基類型
import axios from "axios"; // 確保正確導入 axios
import { useCartStore } from '@/stores/cart'; // 引入購物車 store


export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    memberId: null,
    shoppingCartId: null,

  }),
  actions: {
    async initializeAuth() {
      const savedMemberId = localStorage.getItem("memberId");
      this.isLoggedIn = !!savedMemberId;
      this.memberId = savedMemberId;

      // 獲取會員的購物車 ID
      if (this.isLoggedIn) {
        await this.fetchShoppingCartId(savedMemberId); // 獲取購物車 ID
        const cartStore = useCartStore(); // 引用購物車 store
        await cartStore.fetchCartItems(); // 獲取購物車資料
      }

    },

    async fetchShoppingCartId(memberId) {
      console.log(memberId);
      console.log(`${API_BASE_URL}/api/shopping-cart/find/${memberId}`)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/shopping-cart/find/${memberId}`);
        console.log(response.data);
        this.shoppingCartId = response.data.shoppingCartId; // 獲取購物車 ID

      } catch (error) {
        console.error("獲取購物車 ID 失敗:", error);
      }
    },

    setMemberDetails(memberDetails) {
      console.log("會員詳細資料", memberDetails);
      this.memberDetails = memberDetails;
      this.memberId = memberDetails.memberId;
      this.shoppingCartId = memberDetails.shoppingCartId; // 設置會員的購物車 I
      this.isLoggedIn = true; 
      localStorage.setItem("authStore", JSON.stringify(this.$state)); // 存入 localStorage
      // 儲存到 LocalStorage 以便持久化
      localStorage.setItem("memberId", memberDetails.memberId);
      localStorage.setItem("memberName", memberDetails.fullName);
      localStorage.setItem("isLoggedIn",true);
      console.log("會員名稱: ", localStorage.getItem("memberName"));


      const cartStore = useCartStore(); // 引用購物車 store
      cartStore.fetchCartItems(); // 獲取最新的購物車資料

      console.log("isLoggedIn: ", this.isLoggedIn);

    },
   

    logout() {
      this.isLoggedIn = false;
      this.memberId = null;
      localStorage.removeItem("memberId");
      this.shoppingCartId = null; // 清空購物車 ID
      localStorage.removeItem("memberName");
    },
  },
});
