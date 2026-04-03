<template>
  <div class="container mt-5">
      <div class="content-wrapper">
          <!-- 左側: 圖片輪播區塊 -->
          <div class="image-container">
              <div class="carousel-wrapper">
                  <Carousel :items-to-show="1" :wrap-around="true" v-model="selectedImageIndex">
                      <Slide v-for="(image, index) in roomImages" :key="index">
                          <img :src="image" alt="Room Image" class="carousel-image" />
                      </Slide>
                      <template #addons>
                          <Pagination />
                          <Navigation />
                      </template>
                  </Carousel>
              </div>

              <div class="thumbnail-wrapper">
                  <img
                      v-for="(image, index) in roomImages"
                      :key="index"
                      :src="image"
                      class="thumbnail"
                      :class="{ active: selectedImageIndex === index }"
                      @click="selectedImageIndex = index"
                  />
              </div>
          </div>

          <!-- 右側: 房間資訊區塊 -->
          <div class="text-container">
              <div class="room-info" v-if="roomDetails">
                  <h2 class="room-title">{{ roomDetails.roomTypeName }}</h2>
                  <p class="room-description">{{ roomDetails.roomTypeDescription }}</p>
                  <div class="room-details">
                      <div class="detail-item" v-for="(value, key) in roomDetailList" :key="key">
                          <span class="detail-label">{{ key }}：</span>
                          <span class="detail-value">{{ value }}</span>
                      </div>
                  </div>
                  <button class="btn-reserve">立即訂房</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import axios from "axios";
import { API_BASE_URL } from "@/config";
const props = defineProps({
  roomTypeId: {
      type: Number,
      required: true
  }
});

const selectedImageIndex = ref(0);
const roomImages = ref<string[]>([]);
const roomDetails = ref<any>(null);

const fetchRoomData = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/api/room-type/select/${props.roomTypeId}`);
      roomDetails.value = response.data.roomType;
      
      // 動態加載房間圖片
      roomImages.value = Array.from({ length: 5 }, (_, i) => `${API_BASE_URL}/api/room-type-image/${roomDetails.value.roomTypeId}_${i+1}`);
  } catch (error) {
      console.error("Error fetching room data:", error);
  }
};

onMounted(() => {
  fetchRoomData();
});

const roomDetailList = computed(() => {
  if (!roomDetails.value) return {};
  return {
      "床型": roomDetails.value.bedType,
      "面積": `${roomDetails.value.area} m²`,
      "浴室": roomDetails.value.bathroomType,
      "可容納人數": `成人 ${roomDetails.value.adultCapacity}，小孩 ${roomDetails.value.childrenCapacity}`,
      "價格": `${roomDetails.value.unitPrice} NTD / 每晚`
  };
});
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh; /* 讓整個內容區塊佔據畫面的 60% 高度 */
    padding-top: 0; /* 移除 padding-top 避免影響置中 */
}

.content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center; /* 讓左右區塊垂直對齊 */
    width: 80%; /* 適當控制寬度，讓內容不會過寬 */
    max-width: 1200px; /* 限制最大寬度 */
    height: 100%; /* 讓內容區塊撐滿 .container */
}

/* 左側圖片區域 */
.image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%; /* 讓圖片區塊填滿 */
    justify-content: center;
    /* padding-top: 10%; */
    /* background-color: #007bff; */
}

.carousel-wrapper {
    width: 100%;
    /* max-width: 500px; */
    height: 50%; /* 確保主圖片有固定高度 */
    display: flex;
    align-items: center;
    /* background-color: red; */
}

.carousel-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
}

/* 縮圖區塊 */
.thumbnail-wrapper {
    display: flex;
    gap: 10px;
    margin-top: 10%;
}

.thumbnail {
    width: 80px;
    height: 50px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    transition: 0.3s;
}

.thumbnail:hover, .thumbnail.active {
    border-color: #007bff;
    transform: scale(1.1);
}

/* 右側文字區域 */
.text-container {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    /* margin-left: 5%; */
    padding-left: 5%;
    padding-top: 2%;
}

.room-info {
    max-width: 450px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
}

.room-title {
    font-size: 24px;
    font-weight: bold;
}

.room-description {
    font-size: 16px;
    line-height: 1.5;
}

.detail-item {
    font-size: 14px;
}

/* 訂房按鈕 */
.btn-reserve {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #d9534f, #a18815);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 40%;
}

.btn-reserve:hover {
    background: linear-gradient(135deg, #b52b27, #8f1d1b);
}

</style>