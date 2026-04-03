<template>
  <div class="room-card">
    <router-link :to="`/room-type/${roomType.roomTypeId}`">
      <!-- 直接使用 <img> 加載圖片 -->
      <img :src="imageUrl" alt="Room Image" class="room-image" />
    </router-link>
    <h3>{{ roomType.roomTypeName }}</h3>
    <p>{{ roomType.roomTypeDescription }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { API_BASE_URL } from "@/config";
const props = defineProps<{
  roomType: { roomTypeId: number; roomTypeName: string; roomTypeDescription: string };
}>();

// 直接給出圖片 URL
const imageUrl = computed(() => `${API_BASE_URL}/api/room-type-image/${props.roomType.roomTypeId}_0`);
</script>

<style scoped>
.room-card {
  text-align: center;
}

.room-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.room-image:hover {
  transform: scale(1.05);
}
</style>
