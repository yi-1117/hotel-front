<template>
  <div class="member-center-form">
    <h3>會員登入</h3>
    <form @submit.prevent="loginMember">
      <div class="mb-3">
        <label for="email" class="form-label">*Email</label>
        <input
          v-model="email"
          class="form-control email-input"
          type="email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">*密碼</label>
        <input
          v-model="password"
          class="form-control password-input"
          type="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-secondary">登入</button>
    </form>

    <!-- <div class="mt-3 text-center">
      <button class="btn btn-success" @click="loginWithLine">
        <font-awesome-icon :icon="['fab', 'line']" class="me-2" />
        登入
      </button>
    </div> -->
    <!-- 返回上一頁的按鈕 -->
    <div class="mt-3 text-center">
      <button @click="goBack" class="btn btn-link">還沒有帳號嗎?註冊</button>
    </div>

    <!-- 忘記密碼按鈕 -->
    <div class="mt-3 text-center">
      <button @click="goToForgetPassword" class="btn btn-link">
        忘記密碼？
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Pinia Store
import { API_BASE_URL } from "@/config";

const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useAuthStore();

// ✅ 抽離共用邏輯：處理登入成功後的行為
const handleLoginSuccess = async (memberId) => {
  try {
    // 儲存登入狀態
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("memberId", memberId);

    // 請求會員詳細資料
    const response = await axios.get(`${API_BASE_URL}/api/members/details/${memberId}`);
    const memberDetails = response.data;

    // 更新 Pinia Store
    authStore.setMemberDetails(memberDetails);
    console.log("🎉 取得的會員資料:", memberDetails);

    // 提示登入成功
    Swal.fire({
      title: "登入成功！",
      text: `歡迎回來，${memberDetails.fullName}！`,
      icon: "success",
      confirmButtonText: "確定",
    });

    // 導向會員中心
    router.replace(`/profile/${memberId}`);
  } catch (error) {
    showLoginError(error);
  }
};

// ✅ 抽離共用邏輯：顯示錯誤訊息
const showLoginError = (error) => {
  console.error("❌ 登入失敗:", error);
  Swal.fire({
    title: "登入失敗",
    text: error.response?.data?.message || "請確認您的帳號密碼是否正確。",
    icon: "error",
    confirmButtonText: "再試一次",
  });
  router.push("login");
};

// ✅ 一般登入方法
const loginMember = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/members/login`, {
      email: email.value,
      password: password.value,
    });

    const { memberId, status, message } = response.data;

    if (!memberId) throw new Error("後端未回傳 memberId");

    // 狀態判斷
    if (status === "error" && message === "Email not verified") {
      Swal.fire({
        title: "登入失敗",
        text: "您的信箱尚未驗證，請先驗證您的信箱。",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    if (status === "INACTIVE") {
      Swal.fire({
        title: "登入失敗",
        text: "您的帳號目前為非活動狀態，請聯絡客服。",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    // ✅ 共用邏輯
    await handleLoginSuccess(memberId);
  } catch (error) {
    showLoginError(error);
  }
};

// ✅ LINE 登入邏輯（重用共用邏輯）
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get("member-id");
  const accessToken = urlParams.get("access-token");

  if (memberId && accessToken) {
    console.log("🔹 從 URL 獲取登入資訊：", { memberId, accessToken });

    // 存入 sessionStorage
    // sessionStorage.setItem("member-id", memberId);
    // sessionStorage.setItem("access-token", accessToken);

    // ✅ 共用邏輯
    await handleLoginSuccess(memberId);

    // 清除 URL 參數
    router.replace(`/profile/${memberId}`);
  }
});

// 返回上一頁
const goBack = () => {
  router.push("/member-center/register");
};

// 忘記密碼
const goToForgetPassword = () => {
  router.push("/forget-password");
};
</script>


<style>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}
</style>
