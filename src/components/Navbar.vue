<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link class="navbar-brand" to="/">
        <img src="@/assets/pictures/hotellogo.png" alt="Logo" style="width: 30px; height: 30px; margin-right: 10px;" />
        {{hotelInfo.hotelName}}
      </router-link>
      <button
        class="navbar-toggler"type="button"data-toggle="collapse"data-target="#navbarNav"
        aria-controls="navbarNav"aria-expanded="false"aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end navItems" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <router-link
              class="nav-link" :to="authStore.isLoggedIn && authStore.memberId
                  ? `/profile/${authStore.memberId}`: '/member-center/login'
              ">個人資訊
            </router-link>
          </li>
          <li v-else class="nav-item">
            <router-link class="nav-link" to="/member-center/login">會員中心</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/room-types">房型一覽</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/room-search">空房查詢</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shop">購物商城</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/points">積分中心</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" :to="adminRoute" @click="checkRoute">後台管理</router-link>
          </li> -->
          <li v-if="authStore.isLoggedIn" class="nav-item ">
            <a class="nav-link" href="#" @click.prevent="logout">會員登出</a>
          </li>
  <!-- 購物車圖標與下拉選單 -->
  <li class="nav-item dropdown" v-if="$route.path.startsWith('/shop')">
  <a class="nav-link dropdown-toggle" href="#" id="shoppingCartDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    <font-awesome-icon :icon="['fas', 'cart-shopping']" />
    <span class="cart-item-count">{{ cartStore.cartItems.length }}</span>
  </a>
  <ul class="dropdown-menu" aria-labelledby="shoppingCartDropdown">
    <CartItemDisplay :items="cartStore.cartItems" @remove="removeFromCart" />
    <li>
      <hr class="dropdown-divider">
    </li>
    <li>
      <a class="dropdown-item" @click="viewCart">查看購物車清單</a>
    </li>
  </ul>
</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed,defineComponent, onMounted ,onBeforeUnmount} from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter,useRoute } from "vue-router";
import { useEAuthStore } from "@/stores/e_auth";

import { useCartStore } from "@/stores/cart";
import CartItemDisplay from "./shop/CartItemDisplay.vue";
import eventBus from '@/stores/bus.js'; // 引入事件總線
import { useHomeStore } from '@/stores/home';

export default defineComponent({


  name: "Navbar",
  components: {
    CartItemDisplay, // 註冊 CartItemDisplay 組件
  },
  setup() {
    const authStore = useAuthStore();
    const EAuthStore = useEAuthStore();
    const router = useRouter();
    const cartStore = useCartStore(); // 使用購物車 store
    const route = useRoute();
    const homeStore = useHomeStore();
    const hotelInfo = computed(() => ({
    hotelName: homeStore.hotelName,
    }));


    const logout = () => {
      authStore.logout();
      EAuthStore.logout();
      router.push("/member-center/login");
    };

    const adminRoute = EAuthStore.isLoggedIn && (EAuthStore.role === "STAFF" || EAuthStore.role === "MANAGER")
      ? "/admin/dashboard"
      : "/admin/login";

    const checkRoute = () => {
      console.log("isLoggedIn:", EAuthStore.isLoggedIn, "role:", EAuthStore.role);
      if (EAuthStore.isLoggedIn && (EAuthStore.role === "STAFF" || EAuthStore.role === "MANAGER")) {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/login");

      }
    };

    // 加載購物車的項目
    const loadCartItems = async () => {
      if (authStore.isLoggedIn) {
        await cartStore.fetchCartItems(); // 每次加載時調用
      }
    };

    const cartUpdatedHandler = () => {
      loadCartItems(); // 當接收到事件時加載購物車項目
    };
    const orderUpdatedHandler = () => {
      loadCartItems(); // 當接收到事件時加載購物車項目
      // 如果需要，這裡可以刷新訂單的數量或更新視圖
      console.log("訂單已更新，更新 UI 或重新加載訂單數據");
      // 你可以在這裡添加更新邏輯
    };

    function viewCart() {
      router.push('/shop/cart'); // 導航到購物車頁面
    }

    // 在組件掛載時獲取購物車資料
    onMounted(() => {
      loadCartItems();
      eventBus.on('cartUpdated', cartUpdatedHandler);
      eventBus.on('orderUpdated', orderUpdatedHandler); // 監聽訂單更新事件
    });

    onBeforeUnmount(() => {
      // 當組件卸載時，取消監聽事件，避免內存泄漏
      eventBus.off('cartUpdated', cartUpdatedHandler); // 取消購物車事件監聽
      eventBus.off('orderUpdated', orderUpdatedHandler); // 取消訂單事件監聽
    });

    // 如果當前頁面是 "/points"，則使用特殊顏色
    const navTextColor = computed(() => {
      return route.path.includes("/points") ? "#004B97" : "black";  // ✅ 使用 route 而非 router
    });
    onMounted(() => {
      homeStore.initializeHotelInfo(); // 在組件掛載後初始化
    });

    return {
      hotelInfo,
      authStore,
      EAuthStore,
      logout,
      adminRoute,
      checkRoute,

      cartStore,
      viewCart,

      navTextColor,

    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
.navbar{
  height:80px;
  background-image: url('@/assets/pictures/NavbarPic.jpg');
  pointer-events: auto; 
  z-index: 1000;
}
.navbar-brand {
  font-family: 'Lora', serif;
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: -200px; /* 向左移動 */
  padding-left: 0;
}
.navItems{
  margin-left: 100px;
  margin-right: -100px;
  font-size: 20px;
}
.navbar-nav .nav-item {
  margin-left: 15px;
  font-family: 'Lora', serif;
  font-weight: bold;
  margin-right: 20px;
}

.ms-auto {
  margin-left: auto !important;
}


.dropdown-menu {
  min-width: 500%; /* 最小寬度 */
  max-width: 1200px; /* 最大寬度 */
}

.dropdown-item {
  padding: 10px 15px; /* 增加內邊距 */
  transition: background-color 0.25s; /* 背景色過渡效果 */
}

.dropdown-item:hover {
  background-color: #f8f9fa; /* 鼠標懸停時的背景色 */
}

.dropdown-divider {
  margin: 5px 0; /* 增加上下邊距 */
}

.navbar-nav .nav-link {
  color: v-bind(navTextColor); /* 使用動態變數 */
  transition: color 0.3s ease-in-out;
}
</style>
