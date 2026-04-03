<template>
  <div class="container custom-container mt-3">
      <h2>空房查詢</h2>
    <div class="row d-flex align-items-center justify-content-between gap-2" style="background-color: white;">
      <!-- 房型下拉式選單 -->
      <div class="col text-end">
        <select v-model="store.selectedRoomType" @change="handleRoomChange" class="form-select">
          <option v-for="room in store.roomTypes" :key="room.roomTypeName" :value="room.roomTypeName">
            {{ room.roomTypeName }} - ${{ room.unitPrice }} - 容納 {{ room.adultCapacity }} 至 {{ room.maxCapacity }} 人
          </option>
        </select>
      </div>

      <!-- 切換月份 -->
      <div class="col text-center">
        <button @click="prevMonth" class="btn btn-outline-primary">←</button>
        <span class="fw-bold mx-2">{{ store.year }} 年 {{ store.month }} 月</span>
        <button @click="nextMonth" class="btn btn-outline-primary">→</button>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-center">
    <!-- 月曆表格 -->
    <table class="calendar table table-bordered">
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
import { onMounted, watch, ref, computed, triggerRef } from 'vue';
import axios from 'axios';
import { useRoomSearchStore } from '@/stores/roomSearch';
import { API_BASE_URL } from '@/config';

const store = useRoomSearchStore();
const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];

const daysArray = ref([]);
const weeks = ref([]);

const fetchRoomAvailability = () => {
  if (!store.selectedRoomType) return;

  const yearVal = store.year;
  const monthVal = store.month;
  const daysInMonth = new Date(yearVal, monthVal, 0).getDate();
  const firstDay = new Date(yearVal, monthVal - 1, 1).getDay();

  axios.post(`${API_BASE_URL}/api/room-availability/query`, [
    ...Array.from({ length: daysInMonth }, (_, i) => `${yearVal}-${monthVal.toString().padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}:${store.selectedRoomType}`)
  ])
  .then(response => {
    const availabilityData = response.data;
    daysArray.value = Array.from({ length: daysInMonth }, (_, i) => {
      const dateKey = `${yearVal}-${monthVal.toString().padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}:${store.selectedRoomType}`;
      return { date: i + 1, availability: availabilityData[dateKey] || 0 };
    });

    // 重新整理 weeks（7 天一組）
    weeks.value = [];
    let week = new Array(firstDay).fill({ date: null, availability: null });
    daysArray.value.forEach(day => {
      week.push(day);
      if (week.length === 7) {
        weeks.value.push(week);
        week = [];
      }
    });
    if (week.length > 0) {
      while (week.length < 7) week.push({ date: null, availability: null });
      weeks.value.push(week);
    }
  })
  .catch(error => console.error("Failed to fetch room availability:", error));
};

// 選擇日期變色
const start = computed(() => store.startDate);
const end = computed(() => store.endDate);

const isDateInRange = computed(() => (day) => {
  if (!start.value || !end.value) return false;

  const dateToCheck = new Date(store.year, store.month - 1, day);

  const startTime = new Date(start.value).setHours(0, 0, 0, 0);
  const endTime = new Date(end.value).setHours(0, 0, 0, 0);
  const current = dateToCheck.setHours(0, 0, 0, 0);

  return current >= startTime && current <= endTime;
});

watch(
  () => [store.startDate, store.endDate],
  () => {
    weeks.value = [...weeks.value]; // 讓 Vue 重新渲染
  }
);


const prevMonth = () => {
  store.month--;
  if (store.month < 1) {
    store.month = 12;
    store.year--;
  }
  fetchRoomAvailability();
};

const nextMonth = () => {
  store.month++;
  if (store.month > 12) {
    store.month = 1;
    store.year++;
  }
  fetchRoomAvailability();
};

onMounted(async () => {
  await store.fetchRoomTypes(); // 確保房型資料載入完成
  console.log("roomTypes after fetch:", store.roomTypes);

  // 給預設值
  if (!store.selectedRoomType) {
    store.selectedRoomType = store.roomTypes[0];
  }
  
  fetchRoomAvailability(); // 在設定好預設值後再抓取房況
});


// 監聽房型、月份變更時自動查詢空房數
watch(
  () => [store.selectedRoomType, store.year, store.month],
  () => fetchRoomAvailability(),
  { immediate: true }
);

watch(() => store.roomTypes, (newVal) => {
  if (newVal.length > 0 && !store.selectedRoomType) {
    store.selectedRoomType = newVal[0].roomTypeName;
  }
}, { immediate: true });

watch(
  () => [store.startDate, store.endDate],
  () => {
    console.log("date change");
    triggerRef(weeks);  // 直接觸發 Vue 重新渲染
  }
);

</script>

<style scoped>
h2{
  text-align: center;
  margin: auto;
  margin-bottom: 10px;
  font-weight: 700;
  background-color: white;
  border-radius: 10px;
  width: 200px;
  height: 40px;
}
.form-select{
  width: 350px;
}
.calendar {
  width: 100%;
  table-layout: fixed;
  text-align: center;
  background-color: #fff;
  margin-top: 10px;
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