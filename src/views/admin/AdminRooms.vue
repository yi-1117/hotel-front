    <template>
        <div class="admin-container">
            <ESidebar />
            <!-- 主要內容區域 -->
            <div class="main-content">
                <RoomTypeSettings />
            </div>
        </div>
    </template>
    
    <script>
    import ESidebar from "@/components/admin/ESidebar.vue";
    import RoomTypeSettings from "../../components/room/RoomTypeSettings.vue";
    import { API_BASE_URL } from '@/config.js';
    export default {
    components: {
    ESidebar,
    RoomTypeSettings,
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
    margin-left: 0;  /* 移除負的 margin-left */
    margin-right: 0; /* 可以考慮移除右邊的 margin，讓內容完全靠左 */
    text-align: left; /* 確保文字和內部內容都向左對齊 */
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