<template>
  <div class="bg-container"></div>
  <!-- 背景圖片 -->

  <div class="container">
    <!-- 顯示歡迎訊息或提示 -->
    <div v-if="!formType" class="welcome-message text-center my-5">
      <h3>歡迎來到會員中心</h3>
    </div>

    <!-- 按鈕區域，顯示註冊和登入按鈕 -->
    <nav v-if="!formType" class="d-flex justify-content-center my-5">
      <button
        @click="setFormType('register')"
        class="btn btn-primary btn-lg mx-3 d-flex align-items-center"
      >
        <font-awesome-icon icon="user-plus" class="me-2" /> 註冊
      </button>
      <button
        @click="setFormType('login')"
        class="btn btn-outline-secondary btn-lg mx-3 d-flex align-items-center"
      >
        <font-awesome-icon icon="sign-in-alt" class="me-2" /> 登入
      </button>
    </nav>

    <!-- 內容區域 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const formType = ref(null); // 預設為 null，表示顯示歡迎訊息
const route = useRoute();
const router = useRouter();

// 初始化根據路由設置 formType
const updateFormType = () => {
  const path = route.path;
  if (path.includes("/member-center/register")) {
    formType.value = "register";
  } else if (path.includes("/member-center/login")) {
    formType.value = "login";
  } else {
    formType.value = null; // 顯示歡迎頁面
  }
};

// 監聽路由變動，當路徑變更時更新 formType
watch(() => route.path, updateFormType);

// 設定 formType 並導航到相對應頁面
const setFormType = (type) => {
  formType.value = type;
  if (type === "register") {
    router.push("/member-center/register");
  } else if (type === "login") {
    router.push("/member-center/login");
  }
};

onMounted(() => {
  updateFormType(); // 初始化時設置 formType
});
</script>

<style scoped>
/* 讓 .container 置中 */
.container {
  max-width: 500px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9); /* 白色帶透明度的背景 */
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 15vh auto; /* 讓卡片稍微往下移動 */
  
}
.bg-container {
  position: fixed; /* 固定背景 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/images/memberpic2.jpg"); /* 替換成你的圖片路徑 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1; /* 確保背景不會遮擋內容 */
}

/* 讓滑鼠懸停時有更強的浮動效果 */
.container:hover {
  transform: translateY(-5px); /* 當滑鼠懸停時容器稍微上浮 */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3); /* 增加陰影強度 */
}

/* 設置歡迎訊息的樣式 */
.welcome-message h3 {
  font-size: 2rem;
  color: #007bff;
  animation: fadeIn 1s ease-out;
}

/* 按鈕區域的間距 */
nav {
  margin-top: 50px;
}
.content{
  width: 100%;
}

/* 按鈕樣式 */
.btn {
  font-size: 18px;
  padding: 12px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 增加陰影 */
}

/* 登入按鈕的外觀 */
.btn-outline-secondary {
  background-color: #f8f9fa;
  border: 2px solid #6c757d;
  color: #6c757d;
}

/* 註冊按鈕的外觀 */
.btn-primary {
  background-color: #007bff;
  border: 2px solid #007bff;
  color: white;
}

/* 按鈕懸停效果 */
.btn:hover {
  transform: translateY(-3px); /* 更強的懸停效果 */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); /* 更深的陰影 */
}

/* SweetAlert2 自訂樣式 */
.swal2-popup {
  border-radius: 10px !important;
}
.image-container {
  text-align: center; /* 讓圖片居中 */
  margin: 20px 0;
}

.large-image {
  width: 100%; /* 讓圖片寬度適應容器 */
  height: auto; /* 高度自動調整以保持比例 */
  max-width: 100%; /* 限制圖片的最大寬度 */
}

/* 動畫效果：淡入 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
