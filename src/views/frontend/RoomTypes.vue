<template>
  <div class="backgroundpic">
    <div class="container mt-2">
      <div class="row justify-content-center">
        <div class="col-4 col-md-3" v-for="roomType in roomTypes" :key="roomType.id">
          <RoomTypeCard :room-type="roomType" />
        </div>
      </div>
    <div class="pushBot"></div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import RoomTypeCard from "@/components/room/RoomTypeCard.vue";
import { API_BASE_URL } from "@/config";

const roomTypes = ref([]);

const fetchRoomTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/room-type/select-all`);
    console.log(response.data);
    roomTypes.value = response.data;
  } catch (error) {
    console.error("Error fetching room types:", error);
  }
};

onMounted(fetchRoomTypes);
</script>
<style scoped>
.backgroundpic{
  width: 100%;
  height: 70vh;
  background-image: url(/src/pictures/room/the-lana-the-marina-royal-suite-living-room-dorchester-collection-full-size.jpg); /* 背景圖片路徑 */
  background-size: cover; /* 使圖片覆蓋整個容器 */
  background-position: center center; /* 背景圖片居中 */
  background-repeat: no-repeat; /* 不重複背景圖片 */
  /* background-color: red; */
  margin-top: -23px;
  margin-bottom: -30px;
}
.container {
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.75);
  height: 900px;
}
.col-4{
  /* background-color: red; */
  border-radius: 15px;
}

</style>
