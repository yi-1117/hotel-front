<template>
    <div class="employee-info-container">
        <h1>新進員工註冊資料表</h1>
    <!-- 員工資料表格 -->
    <table class="employee-table">
        <thead>
            <tr>
            <th>欄位</th>
            <th>資料</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>姓名</td>
                <td><input v-model="employee.fullName" type="text" placeholder="姓名" /></td>
            </tr>
            <tr>
                <td>電子郵件</td>
                <td><input v-model="employee.email" type="email" placeholder="電子郵件" /></td>
            </tr>
            <tr>
                <td>密碼</td>
                <td><input v-model="maskedPassword" type="text" placeholder="密碼" @input="updateMaskedPassword"/></td>
            </tr>
            <tr>
                <td>電話號碼</td>
                <td>
                    <input v-model="employee.phoneNumber" type="text" placeholder="電話號碼" @input="validatePhoneNumber"/>
                    <span v-if="phoneError" style="color: red; font-size: 14px;">{{ phoneError }}</span>
                </td>
            </tr>
            <tr>
                <td>地址</td>
                <td><input v-model="employee.address" type="text" placeholder="地址" /></td>
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
            <td>頭像</td>
                <td style="display: flex; gap: 10px;">
                    <input ref="fileInput" type="file" @change="handlePicUpload" style="display: none;" />
                    <button @click="triggerFileInput">選擇照片</button>
                    <p v-if="imageName">選擇的檔案：{{ imageName }}</p>
                </td>
            </tr>
        </tbody>
    </table>

    <button @click="submitRegistration" class="btn">註冊</button>

    </div>
</template>
<!--hi-->
<script>
import axios from "axios";
import Swal from 'sweetalert2';
import { API_BASE_URL } from '@/config.js';
import { useRouter } from 'vue-router';
    export default {
        data() {
        return {
            employee: {
                fullName: "張員瑛",
                email: "wang8888pt@gmail.com",
                password: "123",
                phoneNumber: "0988-878-787",
                address: "台灣台北",
                gender: "女",
                dateOfBirth: "2004-08-31",
                role: "STAFF", 
                status: "ACTIVE", 
                profilePicture: null,
        },
        maskedPassword: "", // 顯示在輸入框中的密碼（只顯示最後一碼）
        imagePreview: null,
        imageName: null,
        phoneError: "",
        };
    },
    methods: {
        handlePicUpload(event) {
            const file = event.target.files[0]; // 獲取選中的檔案
            if (file && file.type.startsWith('image')) {
                this.imageName = file.name; 
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagePreview = reader.result; // 設定預覽圖片為檔案的結果
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
        async submitRegistration() {
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

            const response = await axios.post(`${API_BASE_URL}/employee/register`, this.employee);
            const passwordJson ={
                    "employeeId":response.data.employeeId,
                    "password": this.employee.password,
                }
            const Passwordresponse = await axios.post(`${API_BASE_URL}/employee/complete-password`,passwordJson);
            if (response.data.status === 'success' && Passwordresponse.data.status === 'success') {
                Swal.fire({
                    title: "註冊成功",
                    text: "員工 ID: " + response.data.employeeId,
                    icon: "success",
                    confirmButtonText: "確定",
                }).then(() => {
                    this.$router.push('/admin/dashboard');
                });
                if (this.imagePreview) {
                        const formData = new FormData();
                        const fileInput = this.$refs.fileInput.files[0];
                        formData.append('file', fileInput);
                        // 上傳圖片
                        const uploadPicResponse = await axios.post(`${API_BASE_URL}/employee/upload-profile-picture/${response.data.employeeId}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        if (response.data.status === 'success'&&Passwordresponse.data.status === 'success'||uploadPicResponse.data.status === 'success') {
                            console.log("圖片上傳成功");
                        } else {
                            Swal.fire({
                                title: "圖片上傳失敗",
                                text: uploadPicResponse.data.message,
                                icon: "error",
                                confirmButtonText: "重試",
                            });
                        }
                    }
            }else if (response.data.status === 'error') {
                Swal.fire({
                    title: "註冊失敗",
                    text:response.data.message,
                    icon: "error",
                    confirmButtonText: "重試",
                    })
            } else {
                Swal.fire({
                    title: "註冊失敗",
                    text:"未知錯誤",
                    icon: "error",
                    confirmButtonText: "重試",
                    })
            }
        },
        generateEmail() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以 +1
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}@gmail.com`;
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
        validatePhoneNumber() {
            const phoneRegex = /^09\d{2}-\d{3}-\d{3}$/; // 正規表達式，台灣手機號碼格式
            if (this.employee.phoneNumber && !phoneRegex.test(this.employee.phoneNumber)) {
                this.phoneError = "請輸入有效的電話號碼（格式: 0987-123-456）";
            } else {
                this.phoneError = ""; // 清除錯誤訊息
            }
        },
    }
};
</script>

<style scoped>
.employee-info-container {
    padding: 20px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    background-color: #f4f4f4;
    font-weight: bold;
}
.employee-table td {
    font-size: 14px;
}
.profile-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-top: 10px;
}
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
</style>