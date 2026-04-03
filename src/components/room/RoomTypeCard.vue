<template>
  <router-link :to="`/room-type/${roomType.roomTypeId}`" class="room-card">
    <img :src="imageUrl" alt="Room Image" class="room-image" />
    <div class="info-box">
      <h4>{{ roomType.roomTypeName }}</h4>
      <p>{{ roomType.roomTypeDescription }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { API_BASE_URL } from "@/config";

const props = defineProps<{
  roomType: { roomTypeId: number; roomTypeName: string; roomTypeDescription: string };
}>();

const imageUrl = computed(() => `${API_BASE_URL}/api/room-type-image/${props.roomType.roomTypeId}_0`);
</script>

<style scoped>
.room-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  max-width: 350px; /* 控制卡片寬度，讓排版更整齊 */
  margin: auto;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.room-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-card:hover .room-image {
  transform: scale(1.03);
}

.info-box {
  padding: 15px;
  text-align: center;
  background: white;
  min-height: 150px; /* 設定固定高度，確保所有卡片對齊 */
  border-top: 1px solid #eee; /* 增加分隔線，區分圖片與文字 */
}

h4 {
  font-size: 1.4rem;
  margin-bottom: 5px;
  color: #333;
}

p {
  font-size: 1rem;
  color: #666;
  line-height: 1.4;
}
</style>
