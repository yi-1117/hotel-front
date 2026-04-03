<template>
  <div class="container mt-4">
    <h2 class="display-4 mb-4 text-center">會員詳細資料</h2>
    <div v-if="loading" class="fs-4">正在載入資料...</div>
    <div v-else-if="userProfile">
      <div class="card p-4 shadow-sm">
        <div class="row g-3">
          <!-- 會員頭像與積分資訊 -->
          <div
            class="col-md-12 d-flex justify-content-center align-items-center flex-column text-center"
          >
            <img
              v-if="userProfile && userProfile.profilePicture"
              :src="`${API_BASE_URL}/api/members${userProfile.profilePicture}`"
              alt="會員頭像"
              class="profile-picture"
            />
            <!-- 預設頭像 -->
            <img
              v-else
              :src="defaultProfilePicture"
              alt="預設頭像"
              class="profile-picture"
            />
            <p v-if="userPoints !== undefined" class="points-info">
              <i class="fa-solid fa-coins"></i>
              <strong> 目前積分:</strong> {{ userPoints }}
            </p>
          </div>

          <!-- 會員詳細資料 -->
          <div>
            <!-- 會員資料表格 -->
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <th>會員姓名</th>
                  <td>{{ userProfile.fullName }}</td>
                </tr>
                <tr>
                  <th>性別</th>
                  <td>
                    {{
                      userProfile.gender === "Male"
                        ? "男"
                        : userProfile.gender === "Female"
                        ? "女"
                        : "其他"
                    }}
                  </td>
                </tr>
                <tr>
                  <th>出生日期</th>
                  <td>{{ userProfile.dateOfBirth }}</td>
                </tr>
                <tr>
                  <th>電話號碼</th>
                  <td>{{ userProfile.phoneNumber }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ userProfile.address }}</td>
                </tr>
                <tr>
                  <th>國籍</th>
                  <td>{{ userProfile.nationality }}</td>
                </tr>
                <tr>
                  <th>偏好語言</th>
                  <td>{{ userProfile.preferredLanguage }}</td>
                </tr>
                <tr>
                  <th>電子報訂閱</th>
                  <td>
                    <span v-if="userProfile.newsletterSubscription"
                      >已訂閱</span
                    >
                    <span v-else>未訂閱</span>
                  </td>
                </tr>
                <tr>
                  <th>社交媒體帳號</th>
                  <td>{{ userProfile.socialMediaAccount }}</td>
                </tr>
                <tr>
                  <th>訂房訂單紀錄:</th>
                  <td>
                    <router-link to="/order-history">查看歷史紀錄</router-link>
                  </td>
                </tr>
                <tr>
                  <th>商城訂單紀錄:</th>
                  <td>
                    <router-link to="/MemberShoppingOrders"
                      >查看歷史紀錄</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 編輯與修改密碼按鈕 -->
            <div class="d-flex justify-content-end mt-4 gap-3">
              <button @click="goToEditPage" class="btn btn-primary btn-lg">
                編輯資料
              </button>
              <button
                @click="goToEditPasswordPage"
                class="btn btn-warning btn-lg"
              >
                修改密碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_BASE_URL } from "@/config.js";

const props = defineProps({
  memberId: {
    type: String,
    required: true,
  },
});
const profilePictureUrl = ref("");
const userPoints = ref(0);
const userProfile = ref(null);
const loading = ref(true);
const router = useRouter();

const defaultProfilePicture = "/images/defaultpic2.png"; // 預設頭像的路徑

const fetchMemberDetails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/members/details/${props.memberId}`
    );
    userProfile.value = response.data;
    loading.value = false;
    getProfilePicture();
    fetchUserPoints();
  } catch (error) {
    console.error("無法取得會員資料", error);
    loading.value = false;
  }
};

const getProfilePicture = () => {
  // 確認 profilePicture 是否有值
  if (userProfile.value && userProfile.value.profilePicture) {
    let fileName = userProfile.value.profilePicture;
    let shortfileName = fileName.substring(fileName.lastIndexOf("/") + 1);

    // 設定圖片 URL
    profilePictureUrl.value = `${API_BASE_URL}/api/members/profile_pictures/${
      props.memberId
    }/${shortfileName}?timestamp=${new Date().getTime()}`;
  } else {
    // 使用預設頭像
    profilePictureUrl.value = defaultProfilePicture;
    console.log(profilePictureUrl.value); // 查看路徑是否正確
  }
};

// 新增函數來查詢積分
const fetchUserPoints = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/points/get/${props.memberId}`
    );
    userPoints.value = response.data.success; // 假設返回的資料結構中有 'points' 欄位
  } catch (error) {
    console.error("無法取得積分資料", error);
  }
};

onMounted(() => {
  fetchMemberDetails();
});

const goToEditPage = () => {
  router.push({ name: "EditProfile", params: { memberId: props.memberId } });
};

const goToEditPasswordPage = () => {
  router.push({ name: "EditPassword", params: { memberId: props.memberId } });
};
</script>

<style scoped>
.container {
  max-width: 960px; /* 限制最大寬度 */
  margin: 0 auto; /* 讓內容置中 */
}

/* 設置顯示標題樣式 */
.display-4 {
  font-size: 2.5rem;
  color: #444;
  margin-bottom: 20px;
}

.profile-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.profile-image {
  width: 25%;
  text-align: center;
  padding: 10px;
}

/* 會員頭像區塊樣式 */
.profile-picture {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 調整卡片間隔與陰影 */
.card {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* 積分資訊區塊 */
.points-info {
  background-color: white;
  color: #004b97;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 2px solid #004b97;
  font-size: 1rem;
  width: 150px;
}

/* 表格樣式 */
.table {
  width: 100%;
  margin-top: 10px;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}
.table th {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: bold;
  text-align: left;
  padding: 12px;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #ddd;
}

.table td {
  background-color: #fff;
  padding: 12px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .table th,
  .table td {
    display: block;
    width: 100%;
    text-align: left;
  }
}
</style>
