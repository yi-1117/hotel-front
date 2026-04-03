<template>
    <div class="employee-info-container">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <h1 style="transform: translateY(3px);">所有員工資料</h1>
            <div class="search-container">
                <input v-model="searchQuery" placeholder="輸入員編 或 Email" @keyup.enter="searchEmployee" />
                <button @click="searchEmployee">搜尋</button>
            </div>
        <div class="page-size-selector" style="transform: translateY(-5px);">
            <label for="page-size">每頁顯示：</label>
            <select v-model="size" @change="fetchEmployees">
                <option value="2">2人</option>
                <option value="4">4人</option>
                <option value="10">10人</option>
                <option value="20">20人</option>
            </select>
        </div>
        </div>
        <!-- 員工資料表格 -->
        <table class="employee-table" v-if="employees.length">
            <thead>
                <tr>
                    <th>員工 ID</th>
                    <th>姓名</th>
                    <th>電子郵件</th>
                    <th>電話號碼</th>
                    <th>角色</th>
                    <th>性別</th>
                    <th>出生日期</th>
                    <th>加入日期</th>
                    <th>最新更新</th>
                    <th>狀態</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in employees" :key="employee?.employeeId" @click="selectEmployee(employee)">
                    <td>{{ employee.employeeId }}</td>
                    <td>{{ employee.fullName }}</td>
                    <td>{{ employee.email }}</td>
                    <td>{{ employee.phoneNumber }}</td>
                    <td>{{ getRoleLabel(employee.role) }}</td>
                    <td>{{ employee.gender }}</td>
                    <td>{{ employee.dateOfBirth }}</td>
                    <td>{{ formatDate(employee.joinDate) }}</td>
                    <td>{{ formatDate(employee.updatedAt) }}</td>
                    <td>{{ getStatusLabel(employee.status) }}</td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁控制 -->
        <div v-if="totalPages > 0" class="pagination">
            <button v-if="page > 0" @click="changePage(page - 1)" :disabled="page === 1" class="pagination-btn prev-btn">上一頁</button>
            <span> 第 {{ page }} 頁 </span>
            <button v-if="page <=totalPages"@click="changePage(page + 1)" :disabled="page === totalPages" class="pagination-btn next-btn">下一頁</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from '@/config.js';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            employees: [], // 員工列表
            page: 1, // 當前頁數
            size: 4, // 每頁顯示員工
            totalPages: 1, // 總頁數
            searchQuery: "",
        };
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get(`${API_BASE_URL}/employee/findAllEmployee?page=${this.page - 1}&size=${this.size}`);
                if (response.data.status === "success") {
                    this.employees = Array.isArray(response.data.data) ? response.data.data : [response.data.data]; 
                    this.totalPages = Math.ceil(response.data.totalItems / this.size); // 計算總頁數
                } else {
                    this.error = "獲取員工資料失敗";
                }
            } catch (err) {
                console.log("請求失敗：" + err.message);
                this.employees = [];
            }
        },
        async searchEmployee() {
            if (!this.searchQuery) {
                this.fetchEmployees();
                return;
            }
            try {
                let response;
                // 根據輸入的查詢條件（email 或員工ID）進行查詢
                if (this.searchQuery.includes("@")) {
                    // 如果是 Email 查詢
                    response = await axios.get(`${API_BASE_URL}/employee/find-by-email?email=${this.searchQuery}`);
                } else {
                    // 如果是 員工 ID 查詢
                    response = await axios.get(`${API_BASE_URL}/employee/${this.searchQuery}`);
                }

                if (response.data.status === "success") {
                    // 如果是單筆資料，將其包裝為陣列
                    this.employees = Array.isArray(response.data.employee) ? response.data.employee : [response.data.employee];
                    this.totalPages = 1; // 搜索結果不需要分頁

                    // 直接選擇該員工
                    const selectedEmployee = this.employees[0];
                    this.selectEmployee(selectedEmployee);
                } else {
                    this.employees = [];
                    Swal.fire({
                        title: '查無此員工',
                        icon: 'error',
                        text: '請確認輸入的電子郵件或員工編號是否正確',
                        confirmButtonText: '確認',
                    })
                }
            } catch (err) {
                this.employees = [];
                Swal.fire({
                        title: '查無此員工',
                        icon: 'warning',
                        text: '請確認輸入的電子郵件或員工編號是否正確',
                        confirmButtonText: '確認',
                    })
                    console.log("請求失敗：" + err.message);
            }
        },
        selectEmployee(employee) {
            if (employee && employee.employeeId) {
            this.$emit("employee-selected", employee);
        } else {
            console.warn("選擇的員工資料無效", employee);
        }
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // 24小時制
            });
        },
        changePage(newPage) {
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.page = newPage;
                this.fetchEmployees(); // 載入新頁數的資料
            }else if(newPage>this.totalPages){
                this.page = this.totalPages;
                this.fetchEmployees();
            }
        },
        getStatusLabel(status) {
        const statusMapping = {
            ACTIVE: "在職員工",
            RESIGNATION: "離職",
            LOAWP: "留職停薪",
            LEAVE: "休假",
        };
        return statusMapping[status] || "無狀態";
    },
    getRoleLabel(status) {
        const statusMapping = {
            STAFF: " 一般員工",
            RESERVATIONIST: "飯店訂房專員",
            MERCHANDISER: "商品管理專員",
            MANAGER: "部門主管",
        };
        return statusMapping[status] || "無狀態";
    }
    },
    mounted() {
        this.fetchEmployees(); // 組件載入時調用 API
    }
};
</script>

<style scoped>
.employee-info-container {
    padding: 20px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h1 {
    font-size: 24px;
    margin-bottom: 20px;
}
.employee-table {
    width: 100%;
    border-collapse: collapse;
}
.employee-table th:nth-child(1),
.employee-table td:nth-child(1) {
    width: 57px; /* 員工 ID 欄位 */
    text-align: center;
}

.employee-table th:nth-child(6),
.employee-table td:nth-child(6) {
    width: 50px; /* 性別欄位 */
    text-align: center;
}

.employee-table th,
.employee-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    width: 120px; /* 為每列設定固定寬度 */
}
.employee-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}
.employee-table td {
    font-size: 14px;
}

.profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.pagination {
    margin-top: 20px;
    display: flex;
    position: relative;
    justify-content: left;
    align-items: center;
    gap:18px
}

.pagination-btn {
    width: 150px;
    height: 40px;
    background-size: cover;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    color: white;
}

.prev-btn {
    background-image: url('@/assets/pictures/bluebutton.png'); /* 輸入你的藍色按鈕圖片路徑 */
}

.next-btn {
    background-image: url('@/assets/pictures/bluebutton.png'); /* 輸入你的藍色按鈕圖片路徑 */
}

.pagination-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.search-container{
    transform: translateX(-500px);
    margin-top:-10px;
}
</style>
