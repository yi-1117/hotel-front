<template>
  <div class="container custom-container mt-3">
    <div class="row d-flex align-items-center justify-content-between gap-2">
      <!-- 房型下拉式選單 -->
      <div class="col text-end">
        <select :value="selectedRoomType" @change="handleRoomChange" class="form-select">
          <option v-for="room in roomTypes" :key="room.roomTypeName" :value="room.roomTypeName">
            {{ room.roomTypeName }} - ${{ room.unitPrice }} - 容納 {{ room.adultCapacity }} 至 {{ room.maxCapacity }} 人
          </option>
        </select>
      </div>
    
      <!-- 切換月份 -->
      <div class="col text-center">
        <button @click="prevMonth" class="btn btn-outline-primary">←</button>
        <span class="fw-bold mx-2">{{ year }} 年 {{ month }} 月</span>
        <button @click="nextMonth" class="btn btn-outline-primary">→</button>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-center">
    <!-- 月曆表格 -->
    <table class="calendar">
      <thead>
        <tr>
          <th v-for="(day, index) in daysOfWeek" :key="index">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in weeks" :key="index">
          <td v-for="day in week" :key="day.date" 
              :class="{
                'has-availability': day.availability > 0,
                'selected-date': isDateInRange(day.date)
              }">
            <div v-if="day.date">
              <div>{{ day.date }}</div>
              <div v-if="day.availability !== undefined">空房: {{ day.availability }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>

const props = defineProps({
  year: Number,
  month: Number,
  roomTypes: Array,
  weeks: Array,
  selectedRoomType: String,
  fetchRoomAvailability: Function,
  prevMonth: Function,
  nextMonth: Function,
  startDate: Date,
  endDate: Date
});

// 检查日期是否在选取范围内
const isDateInRange = (date) => {
  if (!props.startDate || !props.endDate) return false;
  
  const start = new Date(props.startDate).setHours(0, 0, 0, 0);
  const end = new Date(props.endDate).setHours(0, 0, 0, 0);
  const current = new Date(date).setHours(0, 0, 0, 0);

  return current >= start && current <= end;
};


const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
const emit = defineEmits(["update:selectedRoomType"]);
const handleRoomChange = (event) => {
  emit("update:selectedRoomType", event.target.value);
  console.log("handleRoomChange");
    
  // 觸發 fetchRoomAvailability
  props.fetchRoomAvailability();
};

</script>

<style scoped>
.calendar {
  width: 30%;
  border-collapse: collapse;
  text-align: center;
}
.calendar th, .calendar td {
  border: 1px solid #ddd;
  padding: 10px;
  min-width: 80px;
  height: 60px;
}
.has-availability {
  background-color: #c8e6c9;
}
.selected-date {
  background-color: #ffeb3b;
}
</style>
