<template>
  <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 搜尋欄位 -->
      <div class="mb-3">
        <label for="search" class="form-label">搜尋會員</label>
        <div class="input-group" style="max-width: 300px">
          <input
            id="search"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="搜尋 會員 ID 或 Email"
          />
          <button class="btn btn-primary" @click="searchMembers">搜尋</button>
        </div>
      </div>

      <!-- 會員資料表格 -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>會員 ID</th>
            <th>信箱</th>

            <th>
              <!-- <span>信箱狀態</span> -->
              <select
                v-model="verifiedFilter"
                @change="searchMembers"
                class="form-select form-select-sm d-inline-block w-auto ms-2"
              >
                <option value="">所有驗證</option>
                <option value="true">已驗證</option>
                <option value="false">未驗證</option>
              </select>
            </th>

            <th>
              <!-- <span>信箱狀態</span> -->
              <select
                v-model="statusFilter"
                @change="searchMembers"
                class="form-select form-select-sm d-inline-block w-auto ms-2"
              >
                <option value="">所有狀態</option>
                <option value="ACTIVE">活躍</option>
                <option value="INACTIVE">非活躍</option>
                <option value="SUSPENDED">暫停</option>
                <option value="PENDING">待驗證</option>
              </select>
            </th>
            <th>註冊時間</th>
            <th>最後更新時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.memberId">
            <td>{{ member.memberId }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.isVerified ? "已驗證" : "未驗證" }}</td>
            <td>{{ getStatusText(member.status) }}</td>
            <td>{{ formatDate(member.createdAt) }}</td>
            <td>{{ formatDate(member.updatedAt) }}</td>
            <td>
              <button
                class="btn btn-primary btn-sm"
                @click="getMemberDetails(member.memberId)"
              >
                詳細資料
              </button>
              <button
                class="btn btn-primary btn-sm"
                @click="sendVerificationEmail(member.memberId, member.email)"
              >
                發送驗證碼
              </button>
              <button
                v-if="member.status !== 'INACTIVE'"
                class="btn btn-warning btn-sm"
                @click="softDeleteMember(member.memberId)"
              >
                停用
              </button>
              <button
                v-else
                class="btn btn-success btn-sm"
                @click="restoreMember(member.memberId)"
              >
                恢復
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteMember(member.memberId)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分頁控制 -->
      <div class="pagination">
        <button
          class="btn btn-secondary"
          @click="prevPage"
          :disabled="currentPage === 0"
        >
          上一頁
        </button>
        <button
          class="btn btn-secondary"
          @click="nextPage"
          :disabled="currentPage === totalPages - 1"
        >
          下一頁
        </button>
      </div>

      <!-- Modal 來顯示會員詳細資料 -->
      <b-modal v-model="showModal" hide-footer>
        <template #modal-title>會員詳細資料</template>

        <!-- 編輯表單 -->
        <div v-if="isEditing">
          <form @submit.prevent="updateMemberDetails">
            <!-- 顯示其他欄位，排除 joinDate 和 updatedAt -->
            <div v-for="(value, key) in form" :key="key">
              <label :for="key">{{ getFieldLabel(key) }}</label>
              <input
                v-model="form[key]"
                :id="key"
                type="text"
                class="form-control"
                :disabled="key === 'joinDate' || key === 'updatedAt'"
                :value="
                  key === 'joinDate' || key === 'updatedAt'
                    ? formatDate(form[key])
                    : form[key]
                "
              />
            </div>

            <button type="submit" class="btn btn-primary mt-3">更新資料</button>
          </form>
        </div>

        <!-- 會員詳細資料展示 -->
        <div v-else>
          <p>姓名: {{ selectedMemberDetails.fullName }}</p>
          <p>性別: {{ selectedMemberDetails.gender }}</p>
          <p>生日: {{ selectedMemberDetails.dateOfBirth || "未提供" }}</p>
          <p>電話號碼: {{ selectedMemberDetails.phoneNumber || "未提供" }}</p>
          <p>地址: {{ selectedMemberDetails.address || "未提供" }}</p>
          <p>國籍: {{ selectedMemberDetails.nationality }}</p>
          <p>偏好語言: {{ selectedMemberDetails.preferredLanguage }}</p>
          <p>社交媒體帳號: {{ selectedMemberDetails.socialMediaAccount }}</p>
          <p>
            電子報訂閱:
            {{
              selectedMemberDetails.newsletterSubscription ? "已訂閱" : "未訂閱"
            }}
          </p>
          <p v-if="userPoints !== undefined" class="points-info">
              <i class="fa-solid fa-coins"></i>
              <strong> 目前積分:</strong> {{ userPoints }}
            </p>
          <p>
            大頭貼:
            <img
              v-if="selectedMemberDetails.profilePicture"
              :src="`${API_BASE_URL}/api/members${selectedMemberDetails.profilePicture}`"
              alt="會員頭像"
              class="profile-picture"
            />
            <img
              v-else
              src="/images/defaultpic.png"
              alt="預設頭像"
              class="profile-picture"
            />
          </p>
          <p>最後更新時間: {{ formatDate(selectedMemberDetails.updatedAt) }}</p>
          <button class="btn btn-warning mt-3" @click="enterEditMode">
            編輯
          </button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // 引入 useRoute
import axios from "axios";
import Swal from "sweetalert2";
import ESidebar from "@/components/admin/ESidebar.vue";
import { BModal } from "bootstrap-vue-3"; // 引入 BModal
import { API_BASE_URL } from "@/config";
import { useRegistrationStore } from "@/stores/useRegistrationStore";

const route = useRoute(); // 使用 useRoute 來獲取當前路由
const memberId = ref(route.params.memberId); // 用來存放 memberId

const searchQuery = ref(""); // 搜尋關鍵字
const statusFilter = ref(""); // 篩選會員狀態
const verifiedFilter = ref(""); // 篩選是否驗證

const email = ref("");
const isVerified = ref(false);
const isVerificationCodeSent = ref(false);
const registrationStore = useRegistrationStore();

// 定義狀態
const members = ref([]);
const totalPages = ref(0); // 儲存總頁數
const currentPage = ref(0); // 當前頁面
const selectedMemberDetails = ref({}); // 儲存選中的會員詳細資料
const isEditing = ref(false); // 用於控制是否顯示編輯模式

const showModal = ref(false); // 控制 Modal 顯示的狀態

const form = ref({});

const getFieldLabel = (key) => {
  const fieldLabels = {
    memberId: "會員 ID",
    fullName: "姓名",
    gender: "性別",
    dateOfBirth: "生日",
    phoneNumber: "電話號碼",
    address: "地址",
    nationality: "國籍",
    preferredLanguage: "偏好語言",
    socialMediaAccount: "社交媒體帳號",
    newsletterSubscription: "電子報訂閱",
    profilePicture: "大頭貼",
    updatedAt: "最後更新時間",
    joinDate: "註冊時間",
  };
  return fieldLabels[key] || key; // 如果沒有對應名稱，顯示原來的 key
};

const sendVerificationEmail = async (memberId, email) => {
  if (!email) {
    Swal.fire("錯誤", "請填寫信箱再發送驗證碼", "error");
    return;
  }

  try {
    // 1. 查詢該會員的資料，檢查是否已驗證
    const response = await axios.get(`${API_BASE_URL}/api/members/${memberId}`);

    if (response.data.isVerified) {
      // 2. 如果信箱已經驗證過
      Swal.fire({
        title: "已驗證",
        text: "該信箱已經驗證過，無需再次發送驗證碼。",
        icon: "info",
        confirmButtonText: "確定",
      });
      return;
    }

    // 3. 如果信箱未驗證，發送驗證碼
    await axios.post(
      `${API_BASE_URL}/api/members/send-verification-email?memberId=${memberId}`,
      {
        memberId: memberId,
        email: email.value,
      }
    );

    Swal.fire({
      title: "驗證碼已發送！",
      text: "請查看您的 Email 收取驗證碼。",
      icon: "success",
      confirmButtonText: "確定",
    });

    // 顯示驗證碼欄位
    isVerificationCodeSent.value = true;
    isVerified.value = false;
  } catch (error) {
    // 發生錯誤時顯示錯誤訊息
    Swal.fire({
      title: "發送失敗",
      text: "請稍後再試。" || error.response?.data?.message,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 搜尋會員的函數
const searchMembers = async () => {
  // 確保 verifiedFilter 轉換為布林值或 null
  const isVerified =
    verifiedFilter.value === "" ? null : verifiedFilter.value === "true";

  const params = {
    search: searchQuery.value,
    status: statusFilter.value,
    isVerified: isVerified, // 轉換為布林值或 null
    page: currentPage.value, // 分頁
    size: 10, // 每頁顯示 10 筆
  };

  console.log(params); // 確認傳遞的搜尋條件

  try {
    const response = await axios.get(`${API_BASE_URL}/api/members/search`, {
      params,
    });
    console.log("API 回應資料:", response.data); // 確認返回的資料
    members.value = response.data.content;
    totalPages.value = response.data.totalPages; // 更新總頁數
  } catch (error) {
    console.error("搜尋會員失敗:", error);
  }
};

// 頁面初始化時調用
onMounted(() => {
  searchMembers(); // 頁面加載時獲取會員資料
});

// 當進入編輯模式時，直接將 selectedMemberDetails 資料賦值給 form
const enterEditMode = () => {
  form.value = { ...selectedMemberDetails.value };
  isEditing.value = true; // 顯示編輯模式
};

// 格式化日期的方法
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // 根據使用者的地區設定格式化日期
};

// 在 mounted 時獲取會員資料
onMounted(() => {
  const routeMemberId = route.params.memberId; // 從路由中獲取 memberId
  if (routeMemberId) {
    memberId.value = routeMemberId;
    getMemberDetails(routeMemberId); // 確保資料被撈取
  }
});

// 更新會員資料
const updateMemberDetails = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/api/members/details/${selectedMemberDetails.value.memberId}`,
      form.value
    );
    Swal.fire("更新成功", "會員資料已更新", "success");
    isEditing.value = false; // 退出編輯模式
    // 更新 selectedMemberDetails
    selectedMemberDetails.value = { ...form.value };
  } catch (error) {
    console.error("Error updating member details:", error);
    Swal.fire("更新失敗", "請稍後再試", "error");
  }
};

const userPoints =ref(0);
// 獲取會員詳細資料
const getMemberDetails = async (memberId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/members/details/${memberId}`
    );
    console.log(response.data); // 查看回傳的會員詳細資料
    selectedMemberDetails.value = response.data;
    isEditing.value = false; // 確保每次打開詳細資料時都回到查看模式
    showModal.value = true;

    try {
    const pointsresponse = await axios.get(
      `${API_BASE_URL}/points/get/${response.data.memberId}`
    );
    userPoints.value = pointsresponse.data.success; // 假設返回的資料結構中有 'points' 欄位
  } catch (error) {
    console.error("無法取得積分資料", error);
  }
  } catch (error) {
    console.error("Error fetching member details:", error);
  }
};

// 獲取會員資料
// const getMembers = async () => {
//   try {
//     const response = await axios.get(
//       `API_BASE_URL/api/members?page=${currentPage.value}`
//     );
//     members.value = response.data.content; // 使用 content 來獲取會員資料
//     totalPages.value = response.data.totalPages; // 設置總頁數
//   } catch (error) {
//     console.error("Error fetching members:", error);
//   }
// };

// 下一頁操作
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    searchMembers(); // 重新載入會員資料
  }
};

// 上一頁操作
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    searchMembers(); // 重新載入會員資料
  }
};

// 顯示會員狀態的文本
const getStatusText = (status) => {
  if (status === "ACTIVE") {
    return "活躍";
  } else if (status === "INACTIVE") {
    return "非活躍";
  }else if (status === "SUSPENDED") {
    return "暫停";
  }else if (status === "PENDING") {
    return "待驗證";
  }
  return status; // 若不是這兩個狀態則直接顯示原狀態
};

// 頁面初始化時調用
// onMounted(() => {
//   getMembers(); // 頁面加載時獲取會員資料
// });

// 刪除會員
const deleteMember = async (memberId) => {
  Swal.fire({
    title: "確定要刪除這位會員嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "是的，刪除",
    cancelButtonText: "取消",
  }).then(async (result) => {
    console.log(result); // 確認結果
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/members/${memberId}`);
        Swal.fire("刪除成功", "會員已被刪除。", "success");
        searchMembers(); // 刷新會員資料
      } catch (error) {
        console.error("Error deleting member:", error); // 打印錯誤資訊
        Swal.fire("刪除失敗", `請稍後再試。錯誤: ${error.message}`, "error");
      }
    }
  });
};

// 軟刪除會員
const softDeleteMember = async (memberId) => {
  Swal.fire({
    title: "確定要停用這位會員嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "是的，停用",
    cancelButtonText: "取消",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/api/members/soft-delete/${memberId}`);
        Swal.fire("停用成功", "會員狀態已更新為 非活躍。", "success");
        searchMembers(); // 刷新會員資料
      } catch (error) {
        Swal.fire("操作失敗", "請稍後再試。", "error");
      }
    }
  });
};

// 恢復會員狀態
const restoreMember = async (memberId) => {
  Swal.fire({
    title: "確定要恢復這位會員嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "是的，恢復",
    cancelButtonText: "取消",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_BASE_URL}/api/members/reactivate/${memberId}`);
        Swal.fire("恢復成功", "會員狀態已恢復為 活躍。", "success");
        searchMembers(); // 刷新會員資料
      } catch (error) {
        Swal.fire("操作失敗", "請稍後再試。", "error");
      }
    }
  });
};
</script>

<style scoped>
/* 設定整體容器 */
.admin-container {
  display: flex;
  height: 100vh;
  background-color: white;
}

/* 主要內容區域 */
.main-content {
  padding: 10px;
  flex: 1;
  margin-left: -60px;
}

.profile-picture {
  max-width: 200px; /* 設定最大寬度為 50px */
  max-height: 200px; /* 設定最大高度為 50px */
  object-fit: cover; /* 確保圖片不會失真或變形 */
  border-radius: 50%; /* 圓形顯示圖片 */
}
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
</style>