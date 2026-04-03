<template>
  <div class="ELoginBackgroundImage" style="height: 815px;padding-top:20px;margin-bottom: -30px;">
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title"><img src="@/assets/pictures/hotellogo.png" alt="Logo" style="width: 30px; height: 30px; margin-right: 10px;" />員工登入</h2>
      <form @submit.prevent="login" class="form-container">
        <!-- 帳號輸入框 -->
        <div class="input-group">
          <label for="email" class="input-label">帳號：</label>
          <input v-model="email" id="email" type="email" placeholder="電子郵件" class="input-field" required />
        </div>
        <!-- 密碼輸入框 -->
        <div class="input-group">
          <label for="password" class="input-label">密碼：</label>
          <input v-model="password" id="password" type="password" placeholder="密碼" class="input-field" required />
        </div>
        <button type="submit" class="btn-primary">登入</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import { ref } from "vue";
import { useEAuthStore } from '@/stores/e_auth';
import { useRouter } from "vue-router";
import axios from "axios";
import { API_BASE_URL } from '@/config.js';


export default {
  setup() {
    const email = ref(""), password = ref(""), errorMessage = ref("");
    const eAuthStore = useEAuthStore(); 
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/employee/login`, {
          email: email.value,
          password: password.value,
        });
        const getEmployee = await axios.get(`${API_BASE_URL}/employee/${response.data.employeeId}`)
        if (response.data.employeeId) {
          // 儲存員工 ID 到 store 和 localStorage
          eAuthStore.setEmployee(
            getEmployee.data.employee
          );
        // 儲存localStorage 以保持登入狀態
        localStorage.setItem("employeeId", response.data.employeeId);
        localStorage.setItem("role",getEmployee.data.employee.role);
          // 跳轉到後台首頁
          router.push("/admin/dashboard");
        } else {
          errorMessage.value = "登入失敗，請檢查帳號密碼";
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || "登入失敗，請稍後再試";
      }
    };

    return { email, password, errorMessage, login };
  },
};
</script>

<style scoped>
/* 背景 */
.ELoginBackgroundImage{
  background-image: url('@/assets/pictures/adminloginbackground.jpg');
  z-index: -1;
}

.login-container {
  display: flex; /* 啟用 flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 35vh;
  margin-top: 150px;
  background: gray;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 330px;
}
.login-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color:black;
  margin-bottom: 20px;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
/* 輸入框樣式 */
.input-field {
  border-radius: 5px; 
}
.input-field:focus {
  border-color: #ff6347;
}
/* 按鈕樣式 - 較為鮮明的顏色 */
.btn-primary {

  font-weight: 600;
}
/* 確保畫面完全置中 */
.h-screen {
  height: 100vh;
}
</style>
