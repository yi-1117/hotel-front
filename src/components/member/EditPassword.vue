<template>
  <div class="edit-password">
    <h2>修改密碼</h2>
    <form @submit.prevent="updatePassword">
      <!-- 舊密碼輸入框 -->
      <div class="mb-3">
        <label for="oldPassword" class="form-label">舊密碼</label>
        <div class="input-group">
          <input
            id="oldPassword"
            :type="oldPasswordVisible ? 'text' : 'password'"
            v-model="oldPassword"
            class="form-control"
            required
          />
          <span class="input-group-text" @click="toggleOldPasswordVisibility">
            <i :class="oldPasswordVisible ? 'bi-eye-slash' : 'bi-eye'"></i>
            <!-- 顯示或隱藏的圖示 -->
          </span>
        </div>
      </div>

      <!-- 新密碼輸入框 -->
      <div class="mb-3">
        <label for="newPassword" class="form-label">新密碼</label>
        <div class="input-group">
          <input
            id="newPassword"
            :type="newPasswordVisible ? 'text' : 'password'"
            v-model="newPassword"
            class="form-control"
            required
          />
          <span class="input-group-text" @click="toggleNewPasswordVisibility">
            <i :class="newPasswordVisible ? 'bi-eye-slash' : 'bi-eye'"></i>
            <!-- 顯示或隱藏的圖示 -->
          </span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">修改密碼</button>
      <button class="btn btn-secondary" @click="goBack">返回</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";
import { useAuthStore } from "@/stores/auth"; // 確保引入你的 Pinia store

const authStore = useAuthStore();
const route = useRoute(); // 取得當前路由資訊
const router = useRouter(); // 用來進行路由導航
// 直接從路由參數獲取 memberId
const memberId = computed(() => authStore.memberId); // 使用登入會員的 ID

const oldPassword = ref<string>("");
const newPassword = ref<string>("");

const oldPasswordVisible = ref<boolean>(false); // 用來控制舊密碼顯示
const newPasswordVisible = ref<boolean>(false); // 用來控制新密碼顯示

// 切換舊密碼顯示狀態
const toggleOldPasswordVisibility = () => {
  oldPasswordVisible.value = !oldPasswordVisible.value;
};

// 切換新密碼顯示狀態
const toggleNewPasswordVisibility = () => {
  newPasswordVisible.value = !newPasswordVisible.value;
};
const goBack = () => {
  router.back();
};

async function updatePassword() {
  if (oldPassword.value === newPassword.value) {
    // 如果舊密碼和新密碼相同，顯示提醒
    Swal.fire({
      title: "錯誤!",
      text: "新密碼不能和舊密碼相同。",
      icon: "warning",
      confirmButtonText: "確認",
    });
    return; // 結束函式，避免送出請求
  }

  try {
    if (!memberId.value) {
      return;
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/members/change-password`,
      {
        memberId: memberId.value,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      }
    );

    // 清空密碼輸入框
    oldPassword.value = "";
    newPassword.value = "";

    // 成功後顯示 SweetAlert
    Swal.fire({
      title: "成功!",
      text: response.data || "密碼修改成功",
      icon: "success",
      confirmButtonText: "確認",
    })
    // .then(() => {
    //   router.push(`/profile/${memberId}`); // 更新成功後跳轉
    // })
    ;
  } catch (error) {
    // 失敗後顯示 SweetAlert
    Swal.fire({
      title: "錯誤!",
      text: error.response?.data.message || "密碼修改失敗",
      icon: "error",
      confirmButtonText: "確認",
    });
  }
}
</script>

<style scoped>
.edit-password {
  max-width: 400px;
  margin: 2rem auto;
}

/* 眼睛圖示 */
.input-group-text {
  cursor: pointer;
}
</style>
