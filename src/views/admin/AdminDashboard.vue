<!-- AdminDashboard.vue -->
<template>
  <div class="admin-container">
    <ESidebar />
    <!-- 主要內容區域 -->
    <div class="main-content">
      <div class="employee-info-container">
    <h1>員工詳細資料</h1>
    
    <form @submit.prevent="submitUpdatedEmployee">
      <table class="employee-table" v-if="employee">
        <thead>
          <tr>
            <th>欄位</th>
            <th>資料</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>頭像</td>
            <td>
              <img :src="imagePreview" alt="預覽" class="profile-img"  @click="previewProfilePicture" />
              <input ref="fileInput" type="file" @change="handlePicUpload" style="display: none;" />
            </td>
          </tr>
          <tr>
            <td>員工編號</td>
            <td>{{ employee.employeeId }}</td>
          </tr>
          <tr>
            <td>電子郵件</td>
            <td>{{ employee.email }}</td>
          </tr>
          <tr>
            <td>姓名</td>
            <td><input v-model="employee.fullName" type="text" /></td>
          </tr>
          <tr>
            <td>電話號碼</td>
            <td>
                <input v-model="employee.phoneNumber" type="text" @input="validatePhoneNumber"/>
                <span v-if="phoneError" style="color: red; font-size: 14px;">{{ phoneError }}</span>
              </td>
          </tr>
          <tr>
            <td>地址</td>
            <td><input v-model="employee.address" type="text" /></td>
          </tr>
          <tr>
            <td>性別</td>
            <td>
              <select v-model="employee.gender">
                <option value="男" selected>男</option>
                <option value="女">女</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>出生日期</td>
            <td><input v-model="employee.dateOfBirth" type="date" /></td>
          </tr>
          <tr>
            <td>狀態</td>
            <td>
              <p style="margin-top: 14px;">{{ employee.status }}</p> <!-- 顯示目前的狀態 -->
            </td>
          </tr>
          <tr>
            <td>角色</td>
            <td>
              <p  style="margin-top: 14px;">{{ employee.role }}</p> <!-- 顯示目前的角色 -->
            </td>
          </tr>
        </tbody>
      </table>
      <div class="button-container">
    <button type="button" class="btn change-avatar" @click="triggerFileInput">更換頭像</button>         
    <button type="submit" class="btn update-info">更新資料</button>
    <button type="button" class="btn change-password" @click="showChangePassword">修改密碼</button>
  </div>
    </form>
  </div>
    </div>
  </div>
  </template>
  
  <script>
  import ESidebar from "@/components/admin/ESidebar.vue";
  import { useRouter } from 'vue-router';
  import defaultAvatar from '@/assets/pictures/employeeDefaultAvatar.jpeg';
  import Swal from 'sweetalert2';
  import axios from "axios";
  import { API_BASE_URL } from '@/config.js';

  export default {
    components: {
    ESidebar,
  },
  data() {
    return {
      employee:null,
      imagePreview: null,
      imageName: "",
      confirmToken:"",
      phoneError: "",
      resetToken:"",
    };
  },
  setup() {
    const router = useRouter(); 
    return {router};
  },
  mounted() {
    this.getProfilePicture(); 
    this.fetchEmployeeData(); 
    const urlParams = new URLSearchParams(window.location.search);
  const passwordToken = urlParams.get('passwordtoken');

  
  if (passwordToken) {
    // 執行相關動作
    this.getProfilePicture(); 
    this.fetchEmployeeData(); 
    this.showChangePassword();
    const autoToken=localStorage.getItem("EresetToken")
    document.getElementById ('password-reset-token').value = autoToken;
  }
  },
  methods:{
    async fetchEmployeeData() {
      const employeeId = localStorage.getItem("employeeId"); // 取得員工 ID
      if (!employeeId) {
        Swal.fire({
          title: "錯誤",
          text: "找不到員工 ID，請重新登入",
          icon: "error",
          confirmButtonText: "確定",
        });
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
        this.employee = response.data.employee; // 存入員工數據

        // 設定頭像
        if (this.employee.profilePicture) {
          let rawPath = this.employee.profilePicture;
          let fileName = rawPath.substring(rawPath.lastIndexOf("/") + 1);
          this.imagePreview = `${API_BASE_URL}/employee/profile_pictures/${employeeId}/${fileName}?timestamp=${new Date().getTime()}`;
        } else {
          this.imagePreview = defaultAvatar;
        }
      } catch (error) {
        console.error("獲取員工資料失敗:", error);
        Swal.fire({
          title: "錯誤",
          text: "無法載入員工資料，請稍後再試",
          icon: "error",
          confirmButtonText: "確定",
        });
      }
    },
  previewProfilePicture() {
          Swal.fire({
            title: '頭像預覽',
            html: `
              <div style="text-align: center;">
                <img src="${this.imagePreview}" alt="預覽" style="max-width: 100%; max-height: 400px; border-radius: 10px;" />
              </div>`,
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: '重新選擇照片',
            confirmButtonText: '確認',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              // 重新選擇照片，觸發觸發檔案選擇框
              this.triggerFileInput();
            }
          });
},
    getProfilePicture() {
      if (this.employee && this.employee.profilePicture) {
        let rawPath = this.employee.profilePicture;
        let fileName = rawPath.substring(rawPath.lastIndexOf("/") + 1);
        this.imagePreview = `${API_BASE_URL}/employee/profile_pictures/${this.employee.employeeId}/${fileName}?timestamp=${new Date().getTime()}`;
          } else {
            this.imagePreview = defaultAvatar;
          }
    },
    handlePicUpload(event) {
            const file = event.target.files[0]; // 獲取選中的檔案
            if (file && file.type.startsWith('image')) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagePreview = reader.result; // 設定預覽圖片為檔案的結果
                    this.imageName = file.name;
                    Swal.fire({
                        title: '頭像預覽',
                        html: `
                            <div style="text-align: center;">
                                <img src="${this.imagePreview}" alt="預覽" style="max-width: 100%; max-height: 400px; border-radius: 10px;" />
                            </div>`,
                        icon: 'info',
                        showCancelButton: true,
                        cancelButtonText: '重新選擇照片',
                        confirmButtonText: '確認',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            // 重新選擇照片
                            this.triggerFileInput(); // 觸發重新選擇檔案的事件
                        }
                    });
                };
                reader.readAsDataURL(file); // 將檔案讀取為 DataURL 來顯示預覽
            } else {
                Swal.fire({
                    title: '錯誤',
                    text: '請選擇一個有效的圖片檔案。',
                    icon: 'error',
                    confirmButtonText: '重新選擇',
                });
            }
        },

    triggerFileInput() {
          this.$refs.fileInput.click(); // 觸發檔案選擇框
        },
    async submitUpdatedEmployee() {
      // 驗證電話號碼格式
      const phoneRegex = /^09\d{2}-\d{3}-\d{3}$/; // 台灣手機號碼格式
            if (!phoneRegex.test(this.employee.phoneNumber)) {
            Swal.fire({
                title: "註冊失敗",
                text: "請輸入有效的電話號碼（格式: 0987-123-456）",
                icon: "error",
                confirmButtonText: "重試",
            });
            return; // 若電話號碼格式錯誤，停止執行後續的註冊操作
        }
      try {
        const response = await axios.post(`${API_BASE_URL}/employee/update/${this.employee.employeeId}`,this.employee);
        if (response.data.status === 'success') {
          if (this.imagePreview) {
            const formData = new FormData();
            const fileInput = this.$refs.fileInput.files[0];
            formData.append('file', fileInput);
            const uploadPicResponse = await axios.post(`${API_BASE_URL}/employee/upload-profile-picture/${this.employee.employeeId}`, formData, {
            headers: {'Content-Type': 'multipart/form-data',}});
          if (uploadPicResponse.data.status === 'success') {
            Swal.fire({
              title: "更新成功",
              text: `員工資料已更新，員工 ID: ${this.employee.employeeId}`,
              icon: "success",
              confirmButtonText: "確定",
            });
        } else {
          Swal.fire({
            title: "更新失敗",
            text: response.data.message || "未知錯誤",
            icon: "error",
            confirmButtonText: "重試",
          });
        }
      }}}catch (error) {
        Swal.fire({
          title: "更新失敗",
          text: "發生錯誤，請稍後再試",
          icon: "error",
          confirmButtonText: "重試",
        });
        console.error("更新錯誤:", error);
      }
    },
    validatePhoneNumber() {
            const phoneRegex = /^09\d{2}-\d{3}-\d{3}$/; // 正規表達式，台灣手機號碼格式
            if (this.employee.phoneNumber && !phoneRegex.test(this.employee.phoneNumber)) {
                this.phoneError = "請輸入有效的電話號碼（格式: 0987-123-456）";
            } else {
                this.phoneError = ""; // 清除錯誤訊息
            }
        },
  
  showChangePassword() {
  Swal.fire({
    title: '修改密碼',
    html: `
      <button id="send-code-btn" class="swal2-confirm swal2-styled" style="margin-top: 10px; background-color: #007bff; color: white;">發送驗證碼</button>
      <input id="password-reset-token" class="swal2-input" type="password" placeholder="驗證碼" required />
      <input id="old-password" class="swal2-input" type="password" placeholder="舊密碼" required />
      <input id="new-password" class="swal2-input" type="password" placeholder="新密碼" required />
      <input id="confirm-password" class="swal2-input" type="password" placeholder="確認新密碼" required />
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    preConfirm: () => {
      const oldPassword = document.getElementById('old-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if (newPassword !== confirmPassword) {
        Swal.showValidationMessage('新密碼與確認新密碼不一致');
        return false;
      }
      // 返回要發送到後端的數據
      return { oldPassword, newPassword };
    },
    didOpen: () => {
      const sendCodeBtn = document.getElementById('send-code-btn');
      sendCodeBtn.addEventListener('click', this.sendVerificationCode);

      if (this.resetToken) {
        document.getElementById('password-reset-token').value = this.resetToken;
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { oldPassword, newPassword } = result.value;
      const localresetToken=localStorage.getItem("EresetToken")
      
      try {
        const response = await axios.post(`${API_BASE_URL}/employee/password/reset?token=${localresetToken}`, {
          employeeId: this.employee.employeeId,
          oldPassword,
          newPassword,
        });
        if (response.data.status === 'success') {
          Swal.fire({
            title: "密碼更新成功",
            text: "您的密碼已成功更改",
            icon: "success",
            confirmButtonText: "確定",
          });
        } else {
          Swal.fire({
            title: "密碼更新失敗",
            text: response.data.message || "未知錯誤",
            icon: "error",
            confirmButtonText: "重試",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "密碼更新失敗",
          text: "發生錯誤，請稍後再試",
          icon: "error",
          confirmButtonText: "重試",
        });
        console.error("更新密碼錯誤:", error);
      }
    }
  });
},

async sendVerificationCode() {
  try {
    const employeeId = this.employee.employeeId;  // 確保獲取正確的員工 ID
    const response = await axios.post(`${API_BASE_URL}/employee/password-reset-request?employeeId=${employeeId}`);
    if (response.data.status === 'success' && response.data.resetToken) {
      this.resetToken = response.data.resetToken;
      localStorage.setItem("EresetToken",response.data.resetToken);
    }
    if (response.data.status === 'success') {
      Swal.fire({
        title: '驗證碼已發送',
        text: '請檢查您的郵件以獲取驗證碼。',
        icon: 'success',
        confirmButtonText: '確定',
      });
    } else {
      Swal.fire({
        title: '發送失敗',
        text: response.data.message || '請稍後再試。',
        icon: 'error',
        confirmButtonText: '重試',
      });
    }
  } catch (error) {
    console.error('發送驗證碼錯誤:', error);
    Swal.fire({
      title: '發送失敗',
      text: '請稍後再試。',
      icon: 'error',
      confirmButtonText: '重試',
    });
  }
}

    
  }
}
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
  background-image: url("@/assets/pictures/adminBackground.jpeg");
  background-size: cover;
  background-position: center;
  padding: 10px;
  flex: 1;
  margin-left:-60px;
}
.header h1 {
    font-size: 28px;
    font-weight: bold;
}
.header p {
    font-size: 18px;
    margin-top: 10px;
}

/*==============*/
/* 統一的按鈕樣式 */
.btn {
  padding: 10px 20px;
  margin-right: 15px;
  border: none;
  border-radius: 8px; /* 圓角 */
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-image: url('@/assets/pictures/bluebutton.png'); /* 按鈕背景圖片 */
  background-size: cover; /* 讓圖片覆蓋按鈕 */
  background-position: center; /* 背景居中 */
  color: white; /* 文字顏色 */
  transition: all 0.3s ease; /* 過渡效果 */
  width: 200px; /* 調整按鈕寬度 */
  height: 50px; /* 調整按鈕高度 */
  text-align: center;
  line-height: 30px; /* 使文字垂直置中 */
}

/* 按鈕的 hover 效果 */
.btn:hover {
  opacity: 0.9; /* 讓圖片背景略微變暗，顯示按鈕被點擊的效果 */
}

/* 控制按鈕容器的排版 */
.button-container {
  display: flex;
  justify-content: space-between; /* 按鈕間隔一致 */
  margin-top: 20px;
}

/*==============*/

.employee-info-container {
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 40%;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th,
.employee-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.employee-table th:first-child,
.employee-table td:first-child {
  width: 100px; /* 設定第一欄（欄位名稱）的寬度 */
}
.employee-table th {
  background-color: whitesmoke;
}
.profile-img{
  
  width: 150px;  /* 固定寬度 */
  height: 150px; /* 固定高度 */
  object-fit: cover; /* 保持比例，裁切圖片，確保圖片填滿框 */
  border-radius: 50%; /* 圓形邊框 */
}
.employee-table td img {
  display: block;          /* 讓圖片變為區塊元素 */
  margin: 0 auto;          /* 水平置中 */
}
</style>