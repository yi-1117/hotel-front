<!-- SingleEmployee.vue -->
<template>
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
                <input v-model="employee.phoneNumber" type="text" @input="validatePhoneNumber" />
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
                <select v-model="employee.status">
                  <option value="ACTIVE">在職員工</option>
                  <option value="RESIGNATION">離職</option>
                  <option value="LOAWP">留職停薪</option>
                  <option value="LEAVE">休假</option>
                </select>
              </td>
            </tr>
          <tr>
            <td>角色</td>
            <td>
              <select v-model="employee.role">
                <option value="STAFF">一般員工</option>
                <option value="RESERVATIONIST">飯店訂房專員</option>
                <option value="MERCHANDISER">商品管理專員</option>
                <option value="MANAGER">部門主管</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>頭像</td>
            <td>
              <img :src="imagePreview" alt="預覽" class="profile-img"  @click="previewProfilePicture" />
              <span v-if="imageName">{{ imageName }}</span>
              <input ref="fileInput" type="file" @change="handlePicUpload" style="display: none;" />
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" @click="triggerFileInput">更換頭像</button>         
      <button type="submit">更新資料</button>
      <button type="button" @click="showChangePassword">修改密碼</button>
      <button type="button" @click="deleteEmployee">刪除員工</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';
import defaultAvatar from '@/assets/pictures/employeeDefaultAvatar.jpeg';
import { API_BASE_URL } from '@/config.js';

export default {
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imagePreview: null,
      imageName: "",
      phoneError: "",
    };
  },
  setup() {
    const router = useRouter(); 
    return {router};
  },
    mounted() {
    this.getProfilePicture(); 
  },
  methods: {
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
        validatePhoneNumber() {
            const phoneRegex = /^09\d{2}-\d{3}-\d{3}$/; // 正規表達式，台灣手機號碼格式
            if (this.employee.phoneNumber && !phoneRegex.test(this.employee.phoneNumber)) {
                this.phoneError = "請輸入有效的電話號碼（格式: 0987-123-456）";
            } else {
                this.phoneError = ""; // 清除錯誤訊息
            }
        },
    async submitUpdatedEmployee() {
      // 驗證電話號碼格式
      const phoneRegex = /^09\d{2}-\d{3}-\d{3}$/; // 台灣手機號碼格式
            if (!phoneRegex.test(this.employee.phoneNumber)) {
            Swal.fire({
                title: "更新失敗",
                text: "請輸入有效的電話號碼（格式: 0987-123-456）",
                icon: "error",
                confirmButtonText: "重試",
            });
            return; // 若電話號碼格式錯誤，停止執行後續的註冊操作
        }
      try {
        const response = await axios.post(
          `${API_BASE_URL}/employee/update/${this.employee.employeeId}`,
          this.employee
        );
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
    async deleteEmployee() {
  Swal.fire({
    title: "確定要刪除嗎？",
    text: `此操作將永久刪除員工 ID: ${this.employee.employeeId}，無法恢復！`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "刪除",
    cancelButtonText: "取消"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/employee/${this.employee.employeeId}`);
        if (response.data.status === "success") {
          Swal.fire({
            title: "刪除成功",
            text: "員工已成功刪除",
            icon: "success",
            confirmButtonText: "確定"
          }).then(() => {
            this.$emit("employee-deleted");
            this.router.push("/admin/employees"); // 刪除後返回員工列表
          });
        } else {
          Swal.fire({
            title: "刪除失敗",
            text: response.data.message || "未知錯誤",
            icon: "error",
            confirmButtonText: "重試"
          });
        }
      } catch (error) {
        Swal.fire({
          title: "刪除失敗",
          text: "發生錯誤，請稍後再試",
          icon: "error",
          confirmButtonText: "重試"
        });
        console.error("刪除員工錯誤:", error);
      }
    }
  });
},
    updateMaskedPassword(event) {
        const newPassword = event.target.value;
        if (newPassword.length > this.employee.password.length) {
        this.employee.password += newPassword.slice(-1);// 添加新輸入的字元
        } else {
        // 刪除操作
        this.employee.password = this.employee.password.slice(0, newPassword.length);
        }
        if (this.employee.password.length === 0) {
        this.maskedPassword = ""; // 避免 `repeat(-1)`
        } else {
        this.maskedPassword = "*".repeat(Math.max(0, this.employee.password.length - 1)) + this.employee.password.slice(-1);
        }
    },
    showChangePassword() {
      // 彈出視窗要求輸入舊密碼和新密碼
      Swal.fire({
        title: '修改密碼',
        html: `
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { oldPassword, newPassword } = result.value;
          
          try {
            const response = await axios.put(`${API_BASE_URL}/employee/change-password`, {
              employeeId: this.employee.employeeId,
              oldPassword,
              newPassword,
            });
            console.log(response);
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
  },
};
</script>

<style scoped>
.employee-info-container {
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 60%;
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
.employee-info-container button {
  background-image: url('@/assets/pictures/bluebutton.png'); /* 設定背景圖片 */
  background-size: cover; /* 確保圖片填滿按鈕 */
  background-position: center; /* 圖片居中 */
  border: none; /* 移除預設的邊框 */
  color: white; /* 按鈕文字顏色為白色 */
  font-size: 16px; /* 文字大小 */
  padding: 10px 20px; /* 內邊距（上/下，左/右） */
  cursor: pointer; /* 設定指標為手形，顯示可以點擊 */
  transition: transform 0.2s; /* 過渡效果，讓按鈕點擊時能夠有動態效果 */
  margin: 0px 10px;
  width: 200px;
  line-height: 25px;
}

.employee-info-container button:hover {
  transform: scale(1.05); /* 在懸停時，按鈕放大 */
}

.employee-info-container button:active {
  transform: scale(0.98); /* 按下按鈕時，稍微縮小 */
}

</style>