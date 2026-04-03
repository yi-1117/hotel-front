<template>
  <div class="member-center-form">
    <h3>會員註冊</h3>
    <form v-if="!showDetailsForm" @submit.prevent="nextStep">
      <!-- Email 欄位與發送驗證碼按鈕 -->
      <div class="mb-3">
        <label for="email" class="form-label">
          <font-awesome-icon :icon="['far', 'envelope']" class="me-2" /> *Email
        </label>
        <div class="input-group">
          <input
            v-model="email"
            id="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': emailInvalid && emailTouched }"
            required
            placeholder="請輸入您的 Email"
            @input="handleEmailInputAndReset"
          />

          <button
            type="button"
            class="btn btn-secondary ms-2"
            @click="sendVerificationEmail"
            :disabled="
              emailInvalid ||
              isVerificationCodeSent ||
              countdown > 0 ||
              isVerified
            "
          >
            {{
              isVerified
                ? "已驗證"
                : countdown > 0
                ? `重新獲取 (${countdown}s)`
                : "發送驗證碼"
            }}
          </button>
        </div>

        <!-- 顯示錯誤訊息 -->
        <div
          v-if="emailInvalid && emailTouched"
          class="invalid-feedback d-block"
        >
          請輸入有效的電子郵件地址。
        </div>
      </div>

      <!-- 驗證碼輸入欄位 -->
      <div v-if="!isVerified && isVerificationCodeSent" class="mb-3">
        <label for="code" class="form-label">驗證碼</label>
        <input
          v-model="code"
          id="code"
          type="text"
          class="form-control"
          required
          placeholder="請輸入收到的驗證碼"
        />
        <button class="btn btn-secondary btn-sm mt-2" @click="verifyEmailCode">
          確認驗證碼
        </button>
        <div v-if="verificationStatus !== null" class="mt-2">
          <i
            v-if="verificationStatus === true"
            class="bi bi-check-circle-fill text-success"
          ></i>
          <i
            v-if="verificationStatus === false"
            class="bi bi-x-circle-fill text-danger"
          ></i>
        </div>
      </div>

      <!-- 密碼欄位，加入顯示與隱藏密碼的功能 -->
      <div class="mb-3">
        <label for="password" class="form-label"
          ><font-awesome-icon :icon="['fas', 'key']" class="me-2" />
          *密碼</label
        >
        <div class="input-group">
          <input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            id="password"
            class="form-control"
            required
            placeholder="請輸入您的密碼"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePasswordVisibility"
          >
            <i :class="passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>

      <!-- 確認密碼欄位，加入顯示與隱藏密碼的功能 -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">
          <font-awesome-icon :icon="['fas', 'key']" class="me-2" />
          *確認密碼
        </label>

        <div class="input-group">
          <input
            v-model="confirmPassword"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            id="confirmPassword"
            class="form-control"
            required
            placeholder="請再次輸入您的密碼"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="toggleConfirmPasswordVisibility"
          >
            <i
              :class="confirmPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"
            ></i>
          </button>
        </div>

        <!-- 顯示密碼不一致錯誤訊息 -->
        <p
          v-if="password !== confirmPassword && confirmPassword"
          class="text-danger mt-1"
        >
          密碼與確認密碼不一致
        </p>
      </div>

      <!-- 進入下一步的按鈕 -->
      <div class="step-buttons">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="!isPasswordValid"
          @click="nextStep"
        >
          {{ isPasswordValid ? "下一步" : "請完成密碼設定" }}
        </button>
      </div>
    </form>

    <!-- 詳細資料表單，只有在密碼驗證後顯示 -->
    <form v-if="showDetailsForm" @submit.prevent="submitDetails">
      <div class="mb-3">
        <label for="fullName" class="form-label">
          <font-awesome-icon :icon="['fas', 'user']" class="me-2" /> *姓名
        </label>

        <input
          v-model="details.fullName"
          id="fullName"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="gender" class="form-label">
          <font-awesome-icon :icon="['fas', 'venus-mars']" /> *性別
        </label>
        <select
          v-model="details.gender"
          id="gender"
          class="form-select"
          required
        >
          <option value="Male">男</option>
          <option value="Female">女</option>
          <option value="Other">其他</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="dateOfBirth" class="form-label">*出生日期</label>
        <input
          v-model="details.dateOfBirth"
          id="dateOfBirth"
          type="date"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="phoneNumber" class="form-label">
          <font-awesome-icon :icon="['fas', 'phone']" /> *電話號碼
        </label>

        <input
          v-model="details.phoneNumber"
          id="phoneNumber"
          type="tel"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <!-- 城市選擇 -->
        <label for="city">選擇城市：</label>
        <select v-model="selectedCity" @change="onCityChange">
          <option value="" disabled>請選擇城市</option>
          <option
            v-for="city in citiesList"
            :key="city.CityName"
            :value="city.CityName"
          >
            {{ city.CityName }}
          </option>
        </select>

        <!-- 區域選擇 -->
        <label for="area">選擇區域：</label>
        <select v-model="selectedArea">
          <option value="" disabled>請選擇區域</option>
          <option
            v-for="area in filteredAreas"
            :key="area.ZipCode"
            :value="area.AreaName"
          >
            {{ area.AreaName }}
          </option>
        </select>

        <!-- 自訂詳細地址 -->
        <label for="customAddress">*詳細地址：</label>
        <input
          v-model="details.address"
          id="customAddress"
          type="text"
          class="form-control"
          required
          placeholder="請輸入詳細地址"
        />
      </div>

      <div class="mb-3">
        <label for="nationality" class="form-label">國籍</label>
        <select
          v-model="details.nationality"
          id="nationality"
          class="form-select"
        >
          <option value="" disabled>請選擇國籍</option>
          <option value="台灣">台灣</option>
          <option value="美國">美國</option>
          <option value="日本">日本</option>
          <option value="韓國">韓國</option>
          <option value="其他">其他</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="preferredLanguage" class="form-label">偏好語言</label>
        <select
          v-model="details.preferredLanguage"
          id="preferredLanguage"
          class="form-select"
        >
          <option value="" disabled>請選擇偏好語言</option>
          <option value="中文">中文</option>
          <option value="英文">英文</option>
          <option value="日文">日文</option>
          <option value="韓文">韓文</option>
          <option value="其他">其他</option>
        </select>
      </div>

      <div class="mb-3 form-check">
        <input
          v-model="details.newsletterSubscription"
          type="checkbox"
          class="form-check-input"
          id="newsletterSubscription"
        />
        <label class="form-check-label" for="newsletterSubscription">
          訂閱電子報
        </label>
      </div>

      <!-- 頭貼顯示區 -->
      <div class="mb-3">
        <div class="d-flex align-items-center">
          <img
            v-if="previewImage || details.profilePicture"
            :src="previewImage || details.profilePicture"
            class="rounded-circle border border-secondary"
            alt="會員頭貼"
            style="width: 100px; height: 100px; object-fit: cover"
          />
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="form-control ms-3"
          />
          <button
            type="button"
            class="btn btn-primary ms-2"
            @click="uploadImage"
          >
            確定上傳
          </button>
        </div>
      </div>

      <button type="submitDetails" class="btn btn-secondary">完成註冊</button>
    </form>

    <div class="mt-3 text-center">
      <button
        type="button"
        class="btn"
        :class="isLineBound ? 'btn-secondary' : 'btn-success'"
        @click="bindLineAccount"
        :disabled="isLineBound"
      >
        <font-awesome-icon :icon="['fab', 'line']" class="me-2" />
        {{ isLineBound ? "已註冊" : "註冊/登入" }}
      </button>
    </div>

    <!-- 返回登入的按鈕 -->
    <div class="mt-3 text-center">
      <button @click="goBack" class="btn btn-outline-primary">
        已有帳號嗎? 登入
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onUnmounted,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import cities from "@/assets/cities.json"; // 引入 JSON 檔案
import "bootstrap-icons/font/bootstrap-icons.css"; // 引入 Bootstrap Icons
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import { storeToRefs } from "pinia";
import { API_BASE_URL } from "@/config";
import { useAuthStore } from "@/stores/auth";

const registrationStore = useRegistrationStore(); // 使用 Pinia Store
const authStore = useAuthStore();

const router = useRouter();
// 正確綁定 Pinia Store 的變數
const { email, password, confirmPassword, memberId, details } =
  storeToRefs(registrationStore);

const isLineBound = computed(() => !!details.value.socialMediaAccount);

// 使用 ref 和 reactive 來定義響應式狀態

const code = ref("");
const isVerificationCodeSent = ref(false);
const countdown = ref(0);
const countdownInterval = ref(null);
const isVerified = ref(false);
const showDetailsForm = ref(false);

const selectedCity = ref("");
const selectedArea = ref("");
const previewImage = ref(null); // 即時預覽圖片

const emailTouched = ref(false);
const citiesList = cities; // 城市資料（不變，直接傳入）
const verificationStatus = ref(null);

// 呼叫 Line Login
const bindLineAccount = () => {
  // 確保你定義了 `API_BASE_URL`
  const API_BASE_URL = "http://localhost:8080"; // 根據實際情況修改
  const lineLoginUrl = "https://access.line.me/oauth2/v2.1/authorize";
  const clientId = "2006867912";
  const redirectUri = encodeURIComponent(
    `${API_BASE_URL}/api/line-login/callback`
  );
  const state = "yourState123"; // 用於防篡改，可以考慮動態生成並存儲
  const scope = "profile openid";

  // 產生 LINE Login URL
  window.location.href = `${lineLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
};

// 計算屬性
const filteredAreas = computed(() => {
  const city = citiesList.find((city) => city.CityName === selectedCity.value);
  return city ? city.AreaList : [];
});

// 監聽器
watch(selectedCity, () => {
  selectedArea.value = ""; // 當城市改變時，重置區域
});

const passwordVisible = ref(false); // 控制密碼欄位的顯示
const confirmPasswordVisible = ref(false); // 控制確認密碼欄位的顯示

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// 切換顯示或隱藏
const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

// 發送驗證碼
const sendVerificationEmail = async () => {
  // 檢查 Email 是否為空
  if (!email.value.trim()) {
    Swal.fire({
      title: "錯誤",
      text: "請輸入有效的 Email 地址。",
      icon: "warning",
      confirmButtonText: "確定",
    });
    return; // 如果是空的，就直接返回，停止執行後續程式碼
  }

  // 如果倒數還沒結束或者已經驗證過，則不發送
  if (countdown.value > 0 || isVerified.value) {
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/members/register`, {
      email: email.value,
    });
    registrationStore.memberId = response.data.memberId;

    if (response.data.isRegistered && !response.data.isVerified) {
      Swal.fire({
        title: "信箱已註冊",
        text: "此信箱已被註冊，請更換新的 Email。",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    if (response.data.isVerified) {
      isVerified.value = true;
      Swal.fire({
        title: "已驗證",
        text: "該信箱已經驗證過，請輸入新信箱。",
        icon: "info",
        confirmButtonText: "確定",
      });
      registrationStore.email = "";
      return;
    }

    // 開始顯示驗證碼欄位
    isVerificationCodeSent.value = true;
    isVerified.value = false;

    // 開始倒數
    startCountdown(5);

    await axios.post(
      `${API_BASE_URL}/api/members/send-verification-email?memberId=${memberId.value}`,
      { email: email.value }
    );

    Swal.fire({
      title: "驗證碼已發送！",
      text: "請查看您的 Email 收取驗證碼。",
      icon: "success",
      confirmButtonText: "確定",
    });
  } catch (error) {
    Swal.fire({
      title: "發送失敗",
      text: error.response?.data?.message || "請稍後再試。",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 倒數計時
const startCountdown = (seconds) => {
  countdown.value = seconds;

  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }

  countdownInterval.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval.value);
      countdown.value = 0; // 倒數結束後的狀態
      // 不要把 isVerificationCodeSent 設為 false
    }
  }, 1000);
};

const resetVerificationState = () => {
  isVerified.value = false; // 重置已驗證狀態
  isVerificationCodeSent.value = false; // 重置驗證碼狀態
  countdown.value = 0;
};

// 驗證 Email 驗證碼
const verifyEmailCode = async () => {
  if (!isVerificationCodeSent.value) {
    Swal.fire({
      title: "請先發送驗證碼",
      text: "請先點擊發送驗證碼後再輸入。",
      icon: "warning",
      confirmButtonText: "確定",
    });
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/api/members/verify-email`, {
      email: email.value,
      code: code.value,
    });

    isVerified.value = true;

    Swal.fire({
      title: "驗證成功！",
      text: "您的 Email 驗證成功，請設定密碼。",
      icon: "success",
      confirmButtonText: "確定",
    });
  } catch (error) {
    Swal.fire({
      title: "驗證失敗",
      text: error.response?.data?.message || "驗證碼錯誤，請重新輸入。",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

const isPasswordValid = computed(() => {
  return (
    isVerified.value &&
    password.value &&
    password.value === confirmPassword.value
  );
});

// 進入下一步（設定密碼）
const nextStep = async () => {
  if (!isVerified.value) {
    Swal.fire({
      title: "請先驗證 Email",
      text: "請先輸入驗證碼並通過驗證。",
      icon: "warning",
      confirmButtonText: "確定",
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({
      title: "密碼不一致",
      text: "密碼與確認密碼不相符，請重新輸入。",
      icon: "error",
      confirmButtonText: "確定",
    });
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/api/members/complete-password`, {
      memberId: registrationStore.memberId,
      password: password.value,
    });

    Swal.fire({
      title: "密碼設定成功！",
      text: "請繼續填寫您的詳細資料。",
      icon: "success",
      confirmButtonText: "確定",
    });

    showDetailsForm.value = true;
  } catch (error) {
    Swal.fire({
      title: "錯誤",
      text: error.response?.data?.message || "發生錯誤，請稍後再試。",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 提交詳細資料函式
const submitDetails = async () => {
  try {
    const detailsData = details.value;

    const fullAddress = `${selectedCity.value} ${selectedArea.value} ${details.value.address}`;

    // 提交詳細資料
    const detailsResponse = await axios.post(
      `${API_BASE_URL}/api/members/details/${memberId.value}`,
      {
        fullName: detailsData.fullName,
        gender: detailsData.gender,
        dateOfBirth: detailsData.dateOfBirth,
        phoneNumber: detailsData.phoneNumber,
        address: fullAddress,
        nationality: detailsData.nationality,
        preferredLanguage: detailsData.preferredLanguage,
        newsletterSubscription: detailsData.newsletterSubscription,
        socialMediaAccount: detailsData.socialMediaAccount,
      }
    );
    console.log("詳細資料提交成功:", detailsResponse.data);

    Swal.fire({
      title: "資料提交成功",
      text: "您的詳細資料已提交。",
      icon: "success",
      confirmButtonText: "確定",
    });

    // 註冊完成後，調用 store 的 completeRegistration 方法
    registrationStore.completeRegistration();

    // 清除 store 中的資料和 localStorage
    registrationStore.resetForm();
    localStorage.removeItem("registrationStore");

    // 導航到登入頁面
    router.push("/member-center/login");
  } catch (error) {
    console.error("提交失敗:", error);

    const errorMessage =
      error.response?.data?.message || "提交失敗，請稍後再試。";
    Swal.fire({
      title: "錯誤",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

//
onMounted(() => {
  registrationStore.clearStoreOnRefresh(); // 這是你要呼叫的方法
});

onBeforeUnmount(() => {
  // 當離開頁面時清除 localStorage 中的資料
  registrationStore.clearRegistration();
});

// 處理檔案上傳並即時預覽
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 預覽圖片
    previewImage.value = URL.createObjectURL(file);
    // 儲存檔案，以便上傳
    details.profilePicture = file;
  }
};

const uploadImage = async () => {
  if (!details.profilePicture) {
    Swal.fire({
      title: "請選擇圖片",
      text: "請先選擇一張圖片再上傳。",
      icon: "warning",
      confirmButtonText: "確定",
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", details.profilePicture);

  try {
    const imageResponse = await axios.post(
      `${API_BASE_URL}/api/members/upload-profile-picture/${memberId.value}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("頭貼上傳成功:", imageResponse.data);

    // **確保完整的圖片 URL**
    const fullImageUrl = `${API_BASE_URL}/api/members${imageResponse.data.imageUrl}`;

    console.log("完整圖片 URL:", fullImageUrl);

    // **即時更新 UI**
    details.profilePicture = fullImageUrl;
    previewImage.value = fullImageUrl;

    // 顯示成功訊息
    Swal.fire({
      title: "上傳成功！",
      text: "您的頭像已成功更新。",
      icon: "success",
      confirmButtonText: "確定",
    });
  } catch (error) {
    console.error("頭貼上傳失敗:", error);

    Swal.fire({
      title: "上傳失敗",
      text: "請稍後再試，或聯絡客服。",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
});

// 返回上一頁
const goBack = () => {
  router.push("/member-center/login"); // 跳回到 /member-center 頁面
};

// 計算屬性，檢查電子郵件格式
const emailInvalid = computed(() => {
  // 使用正規表達式檢查 email 格式
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return !emailPattern.test(email.value); // 如果不符合格式，返回 true
});

function handleEmailInputAndReset() {
  emailTouched.value = true;
  resetVerificationState();
}
</script>

<style scoped></style>
