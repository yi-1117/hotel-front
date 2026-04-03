import { createRouter, createWebHistory } from "vue-router";
import RoomSearch from "../views/frontend/RoomSearch.vue"; // 空房查詢頁面
import RoomTypeList from "@/views/frontend/RoomTypes.vue"; // 房型一覽
import RoomType from "@/views/frontend/RoomType.vue"; // 單一房型
import OrderPreview from "@/views/frontend/OrderPreview.vue";
import RoomTypeSettings from "@/components/room/RoomTypeSettings.vue"; // 後臺管理房型
import { useAuthStore } from "@/stores/auth";
import MemberCenter from "@/views/member/MemberCenter.vue";
import Register from "@/views/member/Register.vue";
import Login from "@/views/member/Login.vue";
import Shop from "@/views/Shop.vue";
import Points from "@/views/Points.vue";
import Home from "@/views/Home.vue";
import ProfileCard from "@/components/member/ProfileCard.vue";
import EditProfile from "@/components/member/EditProfile.vue";
import EditPassword from "@/components/member/EditPassword.vue";
import ForgetPassword from "@/components/member/ForgetPassword.vue";
import ResetPassword from "@/components/member/ResetPassword.vue";
import Swal from "sweetalert2";
import AdminLogin from "@/views/admin/AdminLogin.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import { useEAuthStore } from "@/stores/e_auth";
import AdminEmployee from "@/views/admin/AdminEmployee.vue";
import AdminShop from "@/views/admin/AdminShop.vue";
import AdminBookings from "@/views/admin/AdminBookings.vue";
import AdminRooms from "@/views/admin/AdminRooms.vue";
import AdminHotel from "@/views/admin/AdminHotel.vue";
import AdminMembers from "@/views/admin/AdminMembers.vue";
import ProductCategoryManager from "@/views/shop/ProductCategoryManager.vue";
import ProductManager from "@/views/shop/ProductManager.vue";
import ProductPhotoManager from "@/views/shop/ProductPhotoManager.vue";

import ShoppingCart from "@/components/shop/ShoppingCart.vue";
import ProductDetail from "@/components/shop/ProductDetail.vue";
import ShopOrderForm from "@/components/shop/ShopOrderForm.vue";
import ShoppingOrderCompletion from "@/components/shop/ShoppingOrderCompletion.vue";
import Shopcomplete from "@/views/shop/ShopComplete.vue";
import MemberShoppingOrders from "@/views/shop/MemberShoppingOrders.vue";
import ShoppingOrderManager from "@/views/shop/ShoppingOrderManager.vue";
import LineCallbackView from "@/views/member/LineCallbackView.vue";
import LineBindSuccess from "@/views/member/LineBindSuccess.vue";
import RoomOrderSetting from "@/components/room/RoomOrderSetting.vue";
import MemberOrderHistory from "@/views/frontend/MemberOrderHistory.vue";
import ReviewPage from "@/views/member/ReviewPage.vue"; // 評價頁面

const mainRoutes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { hideNavbar: true }, // 在首頁隱藏 Navbar
  },
  {
    path: "/admin/login",
    component: AdminLogin,
    // meta: { hideFooter: true },
  },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    meta: { requiresEmployeeAuth: true, hideFooter: true },
  },
  {
    path: "/admin/hotel",
    component: AdminHotel,
    meta: {
      requiresEmployeeAuth: true,
      requiresManager: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/members",
    component: AdminMembers,
    meta: { requiresEmployeeAuth: true, hideFooter: true },
  },
  {
    path: "/admin/rooms",
    component: AdminRooms,
    meta: {
      requiresEmployeeAuth: true,
      requiresReservationist: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/bookings",
    component: AdminBookings,

    meta: {
      requiresEmployeeAuth: true,
      requiresReservationist: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/shop",
    component: AdminShop,

    meta: {
      requiresEmployeeAuth: true,
      requiresMerchandiser: true,
      hideFooter: true,
    },
  },

  {
    path: "/admin/employees",
    component: AdminEmployee,
    meta: {
      requiresEmployeeAuth: true,
      requiresManager: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/shop/ProductManager",
    name: "ProductManager",
    component: ProductManager,
    meta: {
      requiresEmployeeAuth: true,
      requiresMerchandiser: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/shop/ShoppingOrderManager",
    name: "ShoppingOrderManager",
    component: ShoppingOrderManager,
    meta: {
      requiresEmployeeAuth: true,
      requiresMerchandiser: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/shop/ProductCategoryManager",
    name: "ProductCategoryManager",
    component: ProductCategoryManager,
    meta: {
      requiresEmployeeAuth: true,
      requiresMerchandiser: true,
      hideFooter: true,
    },
  },

  {
    path: "/admin/shop/ProductPhotoManager",
    name: "ProductPhotoManager",
    component: ProductPhotoManager,
    meta: {
      requiresEmployeeAuth: true,
      requiresMerchandiser: true,
      hideFooter: true,
    },
  },

  //==============================
  {
    path: "/edit-password/:memberId", // 修改密碼頁面
    component: EditPassword, // 顯示修改密碼頁面
    meta: { requiresAuth: true, requiresOwnProfile: true }, // 需要登入
    name: "EditPassword",
    props: true,
  },
  {
    path: "/line-callback",
    name: "LineCallback",
    component: LineCallbackView,
    props: true,
  },
  {
    path: "/line-bind-success",
    name: "LineBindSuccess",
    component: LineBindSuccess,
    props: true,
  },
  {
    path: "/reviewpage/:memberId",
    name: "ReviewPage",
    component: ReviewPage,
    meta: { requiresAuth: true, requiresOwnProfile: true }, // 需要登入
    props: true,
  },
  {
    path: "/profile/:memberId", // 顯示會員資料卡
    component: ProfileCard,
    meta: { requiresAuth: true, requiresOwnProfile: true }, // 需要登入
    name: "ProfileCard",
    props: true,
  },
  {
    path: "/edit-profile/:memberId", // 編輯會員資料
    component: EditProfile,
    meta: { requiresAuth: true, requiresOwnProfile: true }, // 需要登入
    name: "EditProfile",
    props: true,
  },
  {
    path: "/forget-password",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/member-center",
    component: MemberCenter,
    children: [
      { path: "register", component: Register, name: "Register" },
      { path: "login", component: Login, name: "Login" },
    ],
  },

  {
    path: "/room-types",
    name: "Room-types",
    component: RoomTypeList,
  },
  {
    path: "/room-type/:roomTypeId",
    name: "Room-type",
    component: RoomType,
    props: true,
  },

  {
    path: "/room-types-settings",
    name: "room-types-settings",
    component: RoomTypeSettings,
  },
  {
    path: "/room-search",
    name: "room-search",
    component: RoomSearch,
  },
  {
    path: "/order-preview",
    name: "order-preview",
    component: OrderPreview,
  },
  {
    path: "/order-history",
    name: "order-history",
    component: MemberOrderHistory,
  },
  {
    path: "/admin/bookings",
    name: "/room-order-setting",
    component: RoomOrderSetting,
  },
  {
    path: "/shop",
    name: "Shop",
    component: Shop,
  },
  {
    path: "/points",
    name: "Points",
    component: Points,
  },
  {
    path: "/shop/cart", // 購物車的路由路徑
    name: "ShoppingCart", // 路由名稱
    component: ShoppingCart, // 導入的組件
  },
  {
    path: "/shop/product/:productId", // 商品頁的路徑
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/shop/ShopOrderForm",
    name: "ShopOrderForm",
    component: ShopOrderForm,
    props: (route) => ({
      product: JSON.parse(route.query.products || "[]"), // 從查詢字符串中解析 products
      memberId: route.query.memberId, // 從查詢字符串獲取會員 ID
    }),
  },
  {
    path: "/shop/ShoppingOrderCompletion",
    name: "ShoppingOrderCompletion",
    component: ShoppingOrderCompletion, // 確保這個組件已經引入
  },
  {
    path: "/shop/shopcomplete",
    name: "ShoppingCompelete",
    component: Shopcomplete, // 確保這個組件已經引入
  },
  {
    path: "/MemberShoppingOrders",
    name: "MemberShoppingOrders",
    component: MemberShoppingOrders, // 確保這個組件已經引入
  },
];

const mainRouter = createRouter({
  history: createWebHistory(),
  routes: mainRoutes,
});

// 全域導航守衛
mainRouter.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 這邊加個 console.log 來檢查
  console.log("authStore.isLoggedIn:", authStore.isLoggedIn);
  console.log("authStore.memberId:", authStore.memberId);
  console.log("targetMemberId:", to.params.memberId);

  function requireOwnProfile(to, next) {
    const targetMemberId = parseInt(to.params.memberId);
    if (
      authStore.isLoggedIn &&
      targetMemberId !== parseInt(authStore.memberId)
    ) {
      Swal.fire({
        title: "無法訪問",
        text: "您無權訪問其他會員的頁面。",
        icon: "error",
        confirmButtonText: "確定",
      }).then(() => {
        next(`/profile/${authStore.memberId}`); // 轉回自己的 Profile
      });
      return false; // 停止導航
    }
    return true; // 允許導航
  }

  if (!requireOwnProfile(to, next)) return; // 若無法訪問，停止導航

  next(); // 讓導航繼續

  // 檢查會員是否登入
  function requireAuth(next) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn || to.params.memberId === null) {
      Swal.fire({
        title: "需要登入",
        text: "請先登入才能訪問此頁面。",
        icon: "warning",
        confirmButtonText: "確定",
      }).then(() => {
        next("/member-center/login");
      });

      return;
    } else if (
      to.meta.requiresEmployeeAuth &&
      !(eAuthStore.role === "STAFF" || eAuthStore.role === "MANAGER")
    ) {
      return false;
    }
    return true;
  }

  // 會員登入驗證
  if (to.meta.requiresAuth && !requireAuth(next)) return;

  //  檢查是否只能訪問自己的頁面
  if (to.meta.requiresOwnProfile && !requireOwnProfile(to, next)) return;

  //===========================
  const role = eAuthStore.role;

  // 員工登入驗證
  if (to.meta.requiresEmployeeAuth) {
    if (
      !["STAFF", "MANAGER", "RESERVATIONIST", "MERCHANDISER"].includes(role)
    ) {
      Swal.fire({
        title: "需要登入",
        text: "請先登入才能訪問此頁面。",
        icon: "warning",
        confirmButtonText: "確定",
      }).then(() => next("/admin/login"));
      return;
    }
  }

  // 訂房員權限驗證
  if (
    to.meta.requiresReservationist &&
    !["RESERVATIONIST", "MANAGER"].includes(role)
  ) {
    Swal.fire({
      title: "權限不足",
      text: "您沒有房務權限訪問此頁面。",
      icon: "error",
      confirmButtonText: "確定",
    }).then(() => next("/admin/dashboard"));
    return;
  }

  // 商品管理員權限驗證
  if (
    to.meta.requiresMerchandiser &&
    !["MERCHANDISER", "MANAGER"].includes(role)
  ) {
    Swal.fire({
      title: "權限不足",
      text: "您沒有商城權限訪問此頁面。",
      icon: "error",
      confirmButtonText: "確定",
    }).then(() => next("/admin/dashboard"));
    return;
  }

  // 管理員權限驗證
  if (to.meta.requiresManager && role !== "MANAGER") {
    Swal.fire({
      title: "權限不足",
      text: "您沒有主管權限訪問此頁面。",
      icon: "error",
      confirmButtonText: "確定",
    }).then(() => next("/admin/dashboard"));
    return;
  }

  next();
});

export default mainRouter;
