<template>
  <div class="bookingBar">
      <div class="bookingContent">
          <div class="date-section">
              <strong class="point-checkin">入住日期：</strong>
              <DatePicker v-model="roomSearchStore.startDate" format="yyyy-MM-dd" :clearable="false" class="date-picker" />
              <i class="fa-solid fa-arrow-right"></i>
              <strong style="font-size: 20px;">退房日期：</strong>
              <DatePicker v-model="roomSearchStore.endDate" format="yyyy-MM-dd" :clearable="false" class="date-picker" />
          </div>
          <div class="guest-section" style="margin-top: 10px;">
              <i class="fa-solid fa-user" style="margin-right: 10px;"></i>
              <input type="number" v-model="roomSearchStore.residentCount" min="1" class="guest-input" /> 人，
              共 <span class="highlight">{{ calculateDays(roomSearchStore.startDate, roomSearchStore.endDate) }}</span> 晚
          </div>
          <button @click="setBookingBar" :class="['booking-btn', isSpecialPage ? 'special-color' : '']">
              立即預訂
          </button>
      </div>
  </div>
</template>

<script>
import { useRoomSearchStore } from "@/stores/roomSearch";
import DatePicker from "@vuepic/vue-datepicker";

export default {
  name: "BookingBar",
  components: { DatePicker },
  setup() {
      const roomSearchStore = useRoomSearchStore();
      
      return {
          roomSearchStore,
      };
  },
  methods: {
      setBookingBar() {
          console.log("roomSearchStore.startDate:", this.roomSearchStore.startDate);
          console.log("roomSearchStore.endDate:", this.roomSearchStore.endDate);
          console.log("roomSearchStore.residentCount:", this.roomSearchStore.residentCount);

          this.$router.push("/room-search");
      },
      calculateDays(startDate, endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const timeDiff = end - start;
          return Math.ceil(Math.max(timeDiff / (1000 * 3600 * 24), 0));
      },
  },
};
</script>


<style>
.bookingBar{
  justify-content: center;
  padding: 25px;
  border-radius: 10px;
  background-color:white;
  transform: translateY(-100px);
  position: relative;
  /* height: 100px; */
  border-top: 2px solid #F0F0F0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 1300px;
  margin: 20px auto;
}
.point-checkin{
  margin-left: 60px;
  font-size: 20px;
}
.bookingContent{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px; /* 增加間距 */
}
.date-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-picker {
  width: 250px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}
.guest-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}
.guest-input {
  width: 70px;
  padding: 6px;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.highlight {
  font-weight: bold;
  color: #004B97;
}

.booking-btn {
  background-color: #004B97;
  color: white;
  font-size: 1.1rem;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.booking-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>