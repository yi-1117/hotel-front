<template>
  <div class="auth-container">
    <div class="card p-4 shadow auth-card">
      <h3 class="text-center">忘記密碼</h3>
      <form @submit.prevent="submitForgotPassword">
        <div class="mb-3">
          <label for="email" class="form-label">請輸入您的電子郵件</label>
          <input
            v-model="email"
            id="email"
            class="form-control"
            type="email"
            placeholder="請輸入電子郵件"
            required
          />
        </div>
        <button type="submit" class="btn btn-secondary w-100">
          發送重設密碼郵件
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";


 
    const email = ref("");

    const submitForgotPassword = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/members/find-by-email?email=${email.value}`
        );
        const memberId = response.data.memberId;

        await axios.post(
          `${API_BASE_URL}/api/members/password-reset-request?memberId=${memberId}`
        );

        Swal.fire({
          title: "請檢查您的電子郵件",
          text: "您將會收到重設密碼的郵件。",
          icon: "success",
          confirmButtonText: "確定",
        });
      } catch (error) {
        Swal.fire({
          title: "發生錯誤",
          text: error.response?.data?.message || "請確認您的電子郵件是否正確。",
          icon: "error",
          confirmButtonText: "再試一次",
        });
      }
    };

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 改成這樣讓卡片稍微偏上 */
  height: auto;
  padding-top: 50px; /* 設定頂部距離，讓它稍微偏上 */
}

.auth-card {
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
