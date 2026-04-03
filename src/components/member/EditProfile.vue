<template>
  <div class="container mt-4">
    <h2 class="mb-4">修改會員資料</h2>

    <!-- 大頭貼卡片 -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body text-center">
        <p class="text-muted mb-3">點擊圖片可更換大頭貼</p>
        <div class="img-placeholder" @click="triggerFileInput">
          <img
            v-if="form.profilePicture || profilePictureUrl"
            :src="profilePictureUrl"
            alt="大頭貼"
            class="rounded-circle"
          />
          <p v-else class="placeholder-text">請點擊更換圖片</p>
        </div>

        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleProfilePictureChange"
          accept="image/*"
        />
      </div>
    </div>

    <!-- 表單卡片 -->
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="updateProfile">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="fullName" class="form-label" required>*姓名</label>
              <input
                v-model="form.fullName"
                type="text"
                class="form-control"
                id="fullName"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">*性別</label>
              <select v-model="form.gender" id="gender" class="form-select" required>
                <option value="Male">男</option>
                <option value="Female">女</option>
                <option value="Other">其他</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label for="dateOfBirth" class="form-label">*出生日期</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                id="dateOfBirth"
                required
                class="form-control"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label for="phoneNumber" class="form-label">*電話號碼</label>
              <input
                v-model="form.phoneNumber"
                type="text"
                class="form-control"
                required
                id="phoneNumber"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label for="address" class="form-label">*地址</label>
              <input
                v-model="form.address"
                type="text"
                class="form-control"
                required
                id="address"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label for="nationality" class="form-label">國籍</label>
              <select
                v-model="form.nationality"
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

           

            <div class="col-md-6 mb-3">
              <label for="socialMediaAccount" class="form-label"
                >社交媒體帳號</label
              >
              <input
                v-model="form.socialMediaAccount"
                type="text"
                class="form-control"
                id="socialMediaAccount"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label for="preferredLanguage" class="form-label">偏好語言</label>
              <select
                v-model="form.preferredLanguage"
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

            <div class="col-md-12 mb-3 form-check">
              <input
                v-model="form.newsletterSubscription"
                type="checkbox"
                class="form-check-input"
                id="newsletterSubscription"
              />
              <label class="form-check-label" for="newsletterSubscription"
                >訂閱電子報</label
              >
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary mt-3   d-block"
          >
            更新資料
          </button>
        </form>

        <!-- 返回按鈕 -->
        <div class="mt-3">
          <button
            class="btn btn-secondary d-block"
            @click="goBack"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

// 使用路由參數獲取 memberId
const route = useRoute();
const router = useRouter();

const memberId = route.params.memberId;

const form = ref({
  fullName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  address: "",
  nationality: "",
  preferredLanguage: "",
  socialMediaAccount: "",
  newsletterSubscription: false,
  profilePicture: null,
});

const profilePictureUrl = ref("");

const fetchMemberDetails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/members/details/${memberId}`
    );
    form.value = response.data;
    console.log("會員頭貼:", response.data.profilePicture);
    profilePictureUrl.value = response.data.profilePicture
      ? `${API_BASE_URL}/api/members${response.data.profilePicture}`
      : "";
  } catch (error) {
    console.error("無法獲取會員資料", error);
    Swal.fire({
      icon: "error",
      title: "無法獲取會員資料",
      text: "請稍後再試。",
    });
  }
};

onMounted(() => {
  fetchMemberDetails();
});

const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.click();
};

const handleProfilePictureChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.profilePicture = file;
    profilePictureUrl.value = URL.createObjectURL(file);
  }
};

const updateProfile = async () => {
  try {
    const { profilePicture, ...updatedForm } = form.value;

    if (!profilePicture) {
      delete updatedForm.profilePicture;
    }

    await axios.post(
      `${API_BASE_URL}/api/members/details/${memberId}`,
      updatedForm
    );

    if (form.value.profilePicture) {
      const formData = new FormData();
      formData.append("file", form.value.profilePicture);

      await axios.post(
        `${API_BASE_URL}/api/members/upload-profile-picture/${memberId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    Swal.fire({
      icon: "success",
      title: "資料更新成功",
      text: "您的會員資料已成功更新！",
    }).then(() => {
      router.push(`/profile/${memberId}`); // 更新成功後跳轉
    });
  } catch (error) {
    console.error("更新失敗", error);
    Swal.fire({
      icon: "error",
      title: "資料更新失敗",
      text: "資料更新失敗，請稍後再試。",
    });
  }
};

const goBack = () => {
  router.back();
};

</script>

<style scoped>
.img-placeholder {
  width: 150px;
  height: 150px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background-color: #f8f9fa;
  margin: 0 auto;
}
.img-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder-text {
  color: #aaa;
  font-size: 14px;
  text-align: center;
}
</style>