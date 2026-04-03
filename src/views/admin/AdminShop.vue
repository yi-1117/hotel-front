<!-- AdminDashboard.vue -->
<template>
    <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <!-- 主要內容區域 -->
    <div class="main-content">
        <h1>商城管理</h1>
        <p>hello</p>
    </div>
    </div>
    </template>
    
    <script>
    import ESidebar from "@/components/admin/ESidebar.vue";
    
    export default {
    components: {
      ESidebar, // 註冊組件
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
</style>