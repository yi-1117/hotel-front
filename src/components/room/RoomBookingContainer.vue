<template>
  <div class="container">
    <div class="table-layout">
      <div class="table-row">
        <div class="table-cell">
          <!-- 日期選擇器 -->
          <div class="date-picker-container">
            <div class="date-picker ms-4">
              <div class="d-flex gap-2 align-items-center">
                <label> 從 </label>
                <DatePicker 
                  v-model="roomSearchStore.startDate" 
                  :format="'yyyy-MM-dd'" 
                  :clearable="false" 
                  @update:modelValue="(val) => roomSearchStore.startDate = formatDate(val)"
                  style="width: 45%;" 
                />
                <label> 到 </label>
                <DatePicker 
                  v-model="roomSearchStore.endDate" 
                  :format="'yyyy-MM-dd'" 
                  :clearable="false"
                  @update:modelValue="(val) => roomSearchStore.endDate = formatDate(val)"
                  style="width: 45%;" 
                />
              </div>
            </div>
            <div class="resident-count ms-4 mt-2">
              房客： 
              <input type="number" v-model="residentCount" min="1" style="width: 100px;" />
              人，共 {{ calculateDays }} 晚
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 房間選擇器 -->
    <div class="room-selector-container mt-3">
      <div class="d-flex gap-4 align-items-center">
        <div class="w-50">
          <select v-model="roomSearchStore.selectedRoomType" class="form-select">
            <option v-for="room in roomSearchStore.roomTypes" :key="room.roomTypeName" :value="room.roomTypeName">
              {{ room.roomTypeName }}
            </option>
          </select>
        </div>
        <div class="w-25">
          <label>共</label>
          <input type="number" v-model="selectedRoomCount" min="1" style="width: 50px;" />
          <label>間</label>
        </div>
        <div class="w-25">
          <button @click="addRoom" :disabled="isOverBooking" class="btn btn-primary w-100">
            加入房間
          </button>
        </div>
      </div>
    </div>

    <!-- 已加入的房間 -->
    <div class="selected-rooms-container mt-3">
      <div class="row align-items-center mb-3">
        <div class="col">
          <h5>已加入房型：</h5>
        </div>
        <div class="col text-end">
          <button @click="bookRoom" class="btn btn-success">訂房</button>
        </div>
      </div>
      <ul style="margin-top: -20px;">
        <li v-for="(room, index) in roomSearchStore.selectedRooms" :key="index">
          {{ room.roomTypeName }} {{ room.count }} 間
          <button @click="removeRoom(index)" class="btn btn-sm btn-danger ms-2">移除</button>
        </li>
      </ul>
      <div>
        <h5>總價為：{{ roomSearchStore.totalCost }} 元</h5>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useOrderStore } from "@/stores/order";
import { useRouter } from "vue-router";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Swal from "sweetalert2";
import { useRoomSearchStore } from "@/stores/roomSearch";

const router = useRouter();
const orderStore = useOrderStore();
const roomSearchStore = useRoomSearchStore();

const formatDate = (date) => {
  return date instanceof Date ? date.toISOString().split('T')[0] : date;
};

// 房客數量
const residentCount = roomSearchStore.residentCount;

// 當前選擇的房間數量
const selectedRoomCount = ref(1);

const start = computed(() => new Date(roomSearchStore.startDate));
const end = computed(() => new Date(roomSearchStore.endDate));

// 計算住宿天數
const calculateDays = computed(() => {
  console.log("start", start.value);
  console.log("end", end.value);

  const timeDiff = end.value - start.value;
  return Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1);
});


// 計算當前房型的剩餘可用房數
const availableRoomCount = computed(() => {
  const room = roomSearchStore.roomTypes.find(r => r.roomTypeName === roomSearchStore.selectedRoomType);
  return room ? room.availableCount : 0;
});

// 判斷是否超額訂房
const isOverBooking = computed(() => {
  const existingCount = roomSearchStore.selectedRooms
    .filter(room => room.roomTypeName === roomSearchStore.selectedRoomType)
    .reduce((sum, room) => sum + room.count, 0);

  return existingCount + selectedRoomCount.value > availableRoomCount.value;
});

// 加入房間
const addRoom = () => {
    if (isOverBooking.value) {
        alert("房間數量超過可訂數量");
        return;
    }

    const existingRoom = roomSearchStore.selectedRooms.find(room => room.roomTypeName === roomSearchStore.selectedRoomType);
    const roomTypeData = roomSearchStore.roomTypes.find(room => room.roomTypeName === roomSearchStore.selectedRoomType);

    if (existingRoom) {
        existingRoom.count += selectedRoomCount.value;
    } else {
        roomSearchStore.selectedRooms.push({
            roomTypeName: roomSearchStore.selectedRoomType,
            roomTypeId: roomTypeData.roomTypeId,
            count: selectedRoomCount.value,
            roomPrice: roomTypeData?.unitPrice ?? 0 // 確保有價格
        });
    }
    
};

// 移除房間
const removeRoom = (index) => {
  roomSearchStore.selectedRooms.splice(index, 1);
};

// 訂房
const bookRoom = () => {
  const memberId = localStorage.getItem("memberId");
  console.log("start",start.value);
  console.log("end",end.value);

  if (!memberId) {
    Swal.fire({
      title: "尚未登入",
      text: "您的訂單資訊已暫存，請登入以繼續訂單。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "前往登入",
      cancelButtonText: "取消"
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/member-center");
      }
    });
    return;
  }

  const totalPaymentBeforeUsedPoints = roomSearchStore.totalCost;
  const totalPayment = roomSearchStore.totalCost;
  const tradeNo = "EC" + Date.now();

  orderStore.setOrderInfo(
    tradeNo,
    memberId,
    residentCount,
    totalPayment,
    start.value,
    end.value,
    totalPaymentBeforeUsedPoints,
    roomSearchStore.selectedRooms
  );
  console.log("房型組合",roomSearchStore.selectedRooms);
  Swal.fire({
    title: "訂單已建立",
    text: "請確認您的訂單資訊。",
    icon: "success",
    confirmButtonText: "前往訂單確認"
  }).then(() => {
    router.push("/order-preview");
  });
};

// 監聽整個 `roomSearchStore`，當 `startDate` 或 `endDate` 改變時觸發
watch(
  () => [roomSearchStore.startDate, roomSearchStore.endDate],
  () => {
    roomSearchStore.totalCost;
  }
);

watch(() => roomSearchStore.startDate, (newDate) => {
  console.log('開始日期更新:', newDate);
});

watch(() => roomSearchStore.endDate, (newDate) => {
  console.log('結束日期更新:', newDate);
});

watch(() => roomSearchStore.startDate, (newDate) => {
  console.log("Pinia startDate 變更:", newDate);
});

watch(() => roomSearchStore.endDate, (newDate) => {
  console.log("Pinia endDate 變更:", newDate);
});

</script>

<style scoped>
.container {
  width: 100%;
  max-width: 900px; /* 限制最大寬度 */
  margin: 10 -20 10 10;
}

.date-picker-container,
.room-selector-container,
.selected-rooms-container {
  background-color: white;
  padding-left: 10px;
  margin-left: 0;
}

.date-picker {
  width: 100%;
}

.date-picker-input {
  width: 45%; /* 調整日期選擇框的寬度 */
}

.resident-count {
  margin-top: 10px;
}

.room-selector-container {
  background-color: white;
}

.selected-rooms-container {
  padding: 10px;
}

.selected-rooms-container ul {
  list-style-type: none;
  padding-left: 0;
}

.selected-rooms-container button {
  margin-top: 10px;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.w-50 {
  width: 50%;
}

.w-25 {
  width: 25%;
}

.ms-4 {
  margin-left: 1rem;
}

.text-end {
  text-align: right;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

</style>