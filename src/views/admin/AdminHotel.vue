<!-- AdminDashboard.vue -->
<template>
    <div class="admin-container">
      <ESidebar />
      <!-- 主要內容區域 -->
      <div class="main-content">
        <h1>介紹資訊</h1>
        <div class="infoBackground">
          <h4>飯店資訊變更</h4>
          <table class="edit-table">
          <tbody>
            <tr>
              <th><label for="hotelName">飯店名稱：</label></th> <!--label for用來點擊名稱自動對焦輸入框-->
              <td><input v-model="hotelName" id="hotelName" /></td>
            </tr>
            <tr>
              <th><label for="welcomeMessage">歡迎訊息：</label></th>
              <td><input v-model="welcomeMessage" id="welcomeMessage" /></td>
            </tr>
            <tr>
              <th><label for="intro">內文介紹：</label></th>
              <td><textarea v-model="intro" id="intro"></textarea></td>
            </tr>
            <tr>
              <th><label for="footIntro">頁尾介紹：</label></th>
              <td><textarea v-model="footIntro" id="footIntro"></textarea></td>
            </tr>
            <tr>
              <td colspan="2" class="button-cell">
                <button @click="updateHotelInfo">更新資訊</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        
      </div>  
    </div>
    </template>
    
    <script>
    import ESidebar from "@/components/admin/ESidebar.vue";
    import { useHomeStore } from '@/stores/home.js';
    import { ref } from 'vue';
    import Swal from 'sweetalert2';
    export default {
      components: {
      ESidebar,
    },
    setup() {
      const homeStore = useHomeStore();
  
      const hotelName = ref(homeStore.hotelName);
      const welcomeMessage = ref(homeStore.welcomeMessage);
      const intro = ref(homeStore.intro);
      const footIntro =ref(homeStore.footIntro);
  
      const updateHotelInfo = () => {
        try {
          if (homeStore) {
            // 更新 store 中的 `welcomeMessage` 和 `intro`
            homeStore.updateHotelInfo({
              hotelName:hotelName.value,
              welcomeMessage: welcomeMessage.value,
              intro: intro.value,
              footIntro: footIntro.value,
            });
            Swal.fire({
                title: '更新成功!',
                text: '您的飯店資訊已成功更新。',
                icon: 'success',
                confirmButtonText: '確定'
              });
            }
          }catch (error) {
            Swal.fire({
              title: '更新失敗',
              text: '更新飯店資訊時發生錯誤，請稍後再試。', error,
              icon: 'error',
              confirmButtonText: '確定'
            });
        }
      };
      return {
        hotelName,
        welcomeMessage,
        intro,
        footIntro,
        updateHotelInfo,
      };},
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
  .infoBackground{
    padding: 20px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 50%;
  }
  .header h1 {
    font-size: 28px;
    font-weight: bold;
  }
  .header p {
    font-size: 18px;
    margin-top: 10px;
  }
  .edit-table {
    width: 100%;
    margin: 20px 0;
    border-collapse: collapse;
    border: 1px solid #ddd;
    background: #f9f9f9;
  }
  .edit-table th, .edit-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  .edit-table th {
    width: 9%; /* 調整 th 只占 30% */
    white-space: nowrap; /* 防止換行 */
  }
  
  .edit-table td {
    width: 70%; /* 讓輸入框部分占比較多 */
  }
  
  
  /* 輸入框樣式 */
  .edit-table input, .edit-table textarea {
    width: 100%;
    padding: 5px;
    font-size: 16px;
  }
  .edit-table textarea {
  width: 100%;
  padding: 5px;
  font-size: 16px;
  min-height: 150px; /* 設置最小高度 */
  resize: vertical; /* 允許用戶手動調整高度 */
}

/* 按鈕樣式 */
.button-cell button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: white; /* 文字顏色 */
  background-image: url('@/assets/pictures/bluebutton.png'); /* 設置背景圖片 */
  background-size: cover; /* 讓背景圖片覆蓋整個按鈕 */
  background-position: center; /* 背景圖片居中 */
  text-align: center;
  line-height: 28px; /* 讓文字垂直居中 */
  width: 200px; /* 設定按鈕寬度 */
  height: 50px; /* 設定按鈕高度 */
  transition: opacity 0.3s ease; /* 按鈕 hover 效果 */
  border: none; /* 移除邊框 */
}

/* 按鈕的 hover 效果 */
.button-cell button:hover {
  opacity: 0.9; /* 鼠標懸停時，按鈕稍微變暗 */
}
  </style>