<!-- AdminDashboard.vue -->
<template>
  <div class="admin-container">
    <!-- 側邊導航欄 -->
    <div class="sidebar">
      <div class="sidebar-logo">
        <h3>後台系統</h3>
      </div>
      <p class="welcome">
        <i class="fa-solid fa-user-tie" style="margin-right: 11px;"></i>{{ labelrole }} 員編: {{ eauthStore.employeeId }}
      </p>
      <ul class="sidebar-links">
        <li><router-link to="/admin/dashboard"><i class="fa-solid fa-gauge" style="margin-right: 10px;"></i>儀表板</router-link></li>
        <li><router-link to="/admin/members"><i class="fa-solid fa-user" style="margin-right: 12px;"></i>會員管理</router-link></li>
        <li><router-link to="/admin/rooms"><i class="fa-solid fa-bed" style="margin-right: 7px;"></i>房型管理</router-link></li>
        <li><router-link to="/admin/bookings"><i class="fa-regular fa-file" style="margin-right: 13px;"></i>訂單管理</router-link></li>
        
        <!-- 商城管理 -->
        <li @click="toggleShopMenu" style="cursor: pointer;">
          <router-link to=""><i class="fa-solid fa-shop" style="margin-right: 8px;"></i>商城管理</router-link>
        </li>
        <ul v-if="isShopExpanded" class="submenu">
          <li><router-link to="/admin/shop/ProductCategoryManager"><i class="fa-solid fa-list" style="margin-right: 8px;"></i>商品類別管理</router-link></li>
          <li><router-link to="/admin/shop/ProductManager"><i class="fa-solid fa-box" style="margin-right: 8px;"></i>商品管理</router-link></li>
          <li><router-link to="/admin/shop/ProductPhotoManager"><i class="fa-solid fa-image" style="margin-right: 8px;"></i>商品照片管理</router-link></li>
          <li><router-link to="/admin/shop/ShoppingOrderManager"><i class="fa-solid fa-receipt" style="margin-right: 8px;"></i>商品訂單管理</router-link></li>
        </ul>

        <li><router-link to="/admin/employees"><i class="fa-solid fa-address-card" style="margin-right: 9px;"></i>員工管理</router-link></li>
        <li><router-link to="/admin/hotel"><i class="fa-solid fa-address-card" style="margin-right: 9px;"></i>飯店管理</router-link></li>
        <li><button @click="logout">登出</button></li>
      </ul>
    </div>
<!-- 主要內容區域  不能刪 會跑版-->
<div class="main-content"></div>
</div>
</template>

<script>
import { useRouter } from "vue-router";
import { useEAuthStore } from '@/stores/e_auth';
import { ref } from "vue";

export default {
  setup() {
    const eauthStore = useEAuthStore();
    const router = useRouter();
    
    // 狀態變數來控制子項目的顯示
    const isShopExpanded = ref(false);
    
    const toggleShopMenu = () => {
      isShopExpanded.value = !isShopExpanded.value; // 切換展開狀態
    };

    // 登出功能
    const role = localStorage.getItem("role");
    const logout = () => {
      eauthStore.logout();
      router.push("/admin/login");
    };
    
    let labelrole=ref("");

    const getRoleLabel=(role)=> {
        const statusMapping = {
            STAFF: " 一般員工",
            RESERVATIONIST: "飯店訂房專員",
            MERCHANDISER: "商品管理專員",
            MANAGER: "部門主管",
        };
        return statusMapping[role] || "無狀態";
    }
    labelrole = getRoleLabel(role);
    return { 
      eauthStore, 
      logout, 
      role, 
      labelrole,
      isShopExpanded,
      toggleShopMenu,
      labelrole,
    };
  },
};
</script>
<style scoped>
.submenu {
  list-style-type: none; /* 移除列表項目前的點 */
  padding-left: 20px; /* 取消左邊距 */
  margin-top: 10px; /* 添加與父項的間距 */
}
    /* 設定整體容器 */
.admin-container {
        
        display: flex;
        height: 100vh;
        height: 100vh; /* 讓 admin-container 填滿視窗 */
}
.welcome-container{
        display: flex; /* 啟用 Flexbox 排版 */
        align-items: center; /* 讓圖標和文字垂直置中對齊 */
        gap: 3px; /* 增加圖標和文字之間的間距 */
}
/* 側邊欄樣式 */
.sidebar {
        width: 230px;
        background-color: #2d3a3f;
        color: white;
        padding-top: 20px;
        height: 100%;
        background-image: url("@/assets/pictures/sideBarPic.jpg");
        }

.sidebar-logo {
        text-align: center;
        margin-bottom: 30px;
        }

.sidebar-logo h2 {
        font-size: 24px;
        font-weight: bold;
}
.sidebar-links {
        list-style: none;
        padding-left: 0;
}
.sidebar-links li {
        margin: 20px 0;
        padding-left: 10px; /* 調整這裡 */
}
.sidebar-links a {
        color: white;
        text-decoration: none;
        display: block;
        padding: 10px;
        transition: 0.3s ease;
}
.sidebar-links a:hover {
        background-color:rgb(39, 40, 39);
}
.welcome{
        padding-left: 20px;
        letter-spacing: 0.5px;
}
/* 主要內容區域 */
.main-content {
        margin-left: 20px;
        padding: 20px;
        flex: 1;
}
.header h1 {
        font-size: 28px;
        font-weight: bold;
}
</style>