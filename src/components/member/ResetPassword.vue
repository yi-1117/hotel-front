<template>
  <div class="auth-container">
    <div class="card p-4 shadow auth-card">
      <h3 class="text-center">重設密碼</h3>
      <form @submit.prevent="resetPassword">
        <div class="mb-3">
          <label for="newPassword" class="form-label">新密碼</label>
          <input
            v-model="newPassword"
            id="newPassword"
            type="password"
            class="form-control"
            placeholder="請輸入新密碼"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">提交</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

export default {
  setup() {
    const newPassword = ref("");
    const token = ref("");
    const router = useRouter();

    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      token.value = params.get("token");
    });

    const resetPassword = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/members/password/reset?token=${token.value}`,
          { newPassword: newPassword.value }
        );
        Swal.fire("密碼重設成功", "請使用新密碼登入。", "success").then(() => {
          router.push("/member-center/login");
        });
      } catch (error) {
        Swal.fire(
          "密碼重設失敗",
          error.response?.data?.message || "請再試一次。",
          "error"
        );
      }
    };

    return {
      newPassword,
      resetPassword,
    };
  },
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
