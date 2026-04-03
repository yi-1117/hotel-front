<!-- AdminEmployee.vue -->
<template>
    <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <!-- 主要內容區域 -->
    <div class="main-content">
          <!-- 按鈕區域 -->
          <div class="button-container">
            <h1 style="padding-right: 20px;">員工管理</h1>
                <button @click="showRegisterForm" class="register-button">註冊新員工</button>
                <button @click="showEmployeeList" class="view-button">顯示所有員工</button>
          </div>
          
          <ERegister v-if="isRegisterVisible" />
          <AllEmployeeInfo v-if="isEmployeeListVisible" :employees="employeeList" @employee-selected="showEmployeeDetail" />
          <SingleEmployeeInfo v-if="selectedEmployee" :employee="selectedEmployee" @employee-deleted="handleEmployeeDeleted"/>
    </div>
    </div>
    </template>
    
    <script>
    import ESidebar from "@/components/admin/ESidebar.vue";
    import ERegister from "@/components/admin/ERegister.vue";
    import AllEmployeeInfo from "@/components/admin/AllEmployeeInfo.vue";
    import SingleEmployeeInfo from "@/components/admin/SingleEmployeeInfo.vue";
    
    export default {
    components: {
      ESidebar,
      ERegister,
      AllEmployeeInfo,
      SingleEmployeeInfo,
    },
    data() {
  return {
    isRegisterVisible: false,  // 控制 ERegister 是否顯示
    isEmployeeListVisible: true, // 控制 EmployeeInfo 是否顯示
    selectedEmployee: null, // 用來儲存選中的員工
    employeeList: [], // 定義 employeeList 屬性
  };
},
    methods: {
      showRegisterForm() {
      this.isRegisterVisible = true;
      this.isEmployeeListVisible = false;
      this.selectedEmployee = null; // 確保不顯示單一員工
    },
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
    showEmployeeList() {
      this.isRegisterVisible = false;
      this.isEmployeeListVisible = true;
      this.selectedEmployee = null;
    },
    showEmployeeDetail(employee) {
      this.selectedEmployee = employee; 
      this.isEmployeeListVisible = false;
    },
    handleEmployeeDeleted() {
    this.selectedEmployee = null; // 清空選中的員工
    this.showEmployeeList(); // 重新顯示員工列表並刷新數據
    }
  },
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

/* 按鈕容器 */
.button-container {
  margin-top: 20px;
  display: flex; /* 讓按鈕水平排列 */
}

/* 按鈕的共同樣式 */
.register-button, .view-button {
  padding: 10px 20px;
  margin-right: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: white; /* 文字顏色 */
  background-image: url('@/assets/pictures/bluebutton.png'); /* 設置背景圖片 */
  background-size: cover; /* 讓圖片覆蓋整個按鈕 */
  background-position: center; /* 背景圖片居中 */
  text-align: center;
  line-height: 30px; /* 讓文字垂直置中，這裡可根據需要調整 */
  width: 200px; /* 調整按鈕的寬度 */
  height: 50px; /* 調整按鈕的高度 */
  transition: opacity 0.3s ease; /* 過渡效果 */
}

/* 按鈕的 hover 效果 */
.register-button:hover, .view-button:hover {
  opacity: 0.9; /* 當鼠標懸停時，略微變暗 */
}

/* 註冊按鈕專屬樣式（如果需要，可以保留不同的背景圖或其他樣式） */
.register-button {
  /* 如果需要不同的 hover 效果，可以在這裡調整 */
}

/* 顯示員工按鈕專屬樣式 */
.view-button {
  /* 同樣，如果需要修改，可以在這裡調整 */
}
</style>