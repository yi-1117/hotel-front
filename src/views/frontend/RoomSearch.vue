<template>
  <div class="background">
    <div class="container my-4">
      <div class="row">
        <!-- 左側 Component -->
        <div class="col-md-6 mb-4">
          <ContainerWithCalendar />
        </div>

        <!-- 右側 Component -->
        <div class="col-md-6">
          <RoomBookingContainer />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ContainerWithCalendar from "@/components/room/ContainerWithCalendar.vue";
import RoomBookingContainer from "@/components/room/RoomBookingContainer.vue";
import { useRoomSearchStore } from "@/stores/roomSearch";
import { API_BASE_URL } from "@/config";

const store = useRoomSearchStore();





// 切換月份的方法 ===============================================

const prevMonth = () => {
  month.value = month.value === 1 ? 12 : month.value - 1;
  year.value = month.value === 12 ? year.value - 1 : year.value;
  fetchRoomAvailability();
};

const nextMonth = () => {
  month.value = month.value === 12 ? 1 : month.value + 1;
  year.value = month.value === 1 ? year.value + 1 : year.value;
  fetchRoomAvailability();
};

const isDateInRange = (date) => {
  if (!startDate.value || !endDate.value) return false;
  const currentDate = new Date(year.value, month.value - 1, date);
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  return currentDate >= start && currentDate <= end || currentDate.getTime() === start.getTime() || currentDate.getTime() === end.getTime();
};

// 增加房間的方法 =======================================

const addRoom = () => {
  if (!selectedRoomType.value || selectedRoomCount.value < 1) {
    alert("請選擇房型並輸入有效的數量！");
    return;
  }

  const selectedRoom = roomTypes.value.find(room => room.roomTypeName === selectedRoomType.value);
  if (!selectedRoom) {
    alert("找不到對應的房型！");
    return;
  }

  const existingRoom = selectedRooms.value.find(room => room.roomTypeName === selectedRoomType.value);
  if (existingRoom) {
    existingRoom.count += selectedRoomCount.value;
  } else {
    selectedRooms.value.push({
      roomTypeName: selectedRoomType.value,
      count: selectedRoomCount.value,
      roomTypeId: selectedRoom.roomTypeId,
    });
    console.log("selectedRooms",selectedRooms);
  }

  totalCost.value += selectedRoomCount.value * roomPrice.value;
  console.log("totalCost",totalCost.value);
};

</script>

<style scoped>
.background{
  width: 100%;
  height: 67.3vh;
  background-image: url(/src/pictures/room/the-lana-the-marina-royal-suite-living-room-dorchester-collection-full-size.jpg); /* 背景圖片路徑 */
  background-size: cover; /* 使圖片覆蓋整個容器 */
  background-position: center center; /* 背景圖片居中 */
  background-repeat: no-repeat; /* 不重複背景圖片 */
  background-color: red;
  margin-top: -23px;
  margin-bottom: -30px;
}
.container {
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.75);
}

.component-left, .component-right {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .component-left, .component-right {
    padding: 10px;
  }
}
</style>