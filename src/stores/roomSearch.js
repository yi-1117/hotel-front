// src/stores/roomSearch.js
import { defineStore } from 'pinia';
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from "@/config";

export const useRoomSearchStore = defineStore('roomSearch', () => {

    // 儲存房型、日期等狀態
    const year = ref(new Date().getFullYear());
    const month = ref(new Date().getMonth() + 1);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // 確保初始值
    const startDate = ref(today);
    const endDate = ref(tomorrow);
    const residentCount = ref(1);
    const roomTypes = ref([]);  // 所有的房型
    const roomPrice = ref(0);  // 下拉式選單選的房型的房價
    const selectedRooms = ref([]);  // 已經加入的房型
    const selectedRoomType = roomTypes.value[0];  // 下拉式選單選擇的房型

    // 總價格
    const totalCost = computed(() => {
        const days = Math.max(
            Math.ceil((new Date(endDate.value) - new Date(startDate.value)) / (1000 * 3600 * 24)),
            1 // 至少為 1 天
        );

        return selectedRooms.value.reduce((sum, room) => {
            const count = room.count ?? 0;
            const price = room.roomPrice ?? roomTypes.value.find(r => r.roomTypeName === room.roomTypeName)?.unitPrice ?? 0;
            return sum + count * price;
        }, 0) * days;
    });

    // 用來儲存日期範圍內的結果，用來更新顏色
    const dateRange = ref({ start: null, end: null });

    // 監視 startDate 和 endDate，更新日期範圍
    watch([startDate, endDate], () => {
        dateRange.value = { start: startDate.value, end: endDate.value };
    });

    // 根據選擇的日期範圍檢查某天是否在範圍內
    const isDateInRange = (day) => {
        const dateToCheck = new Date(year.value, month.value - 1, day).setHours(0, 0, 0, 0);
        const startTime = new Date(dateRange.value.start).setHours(0, 0, 0, 0);
        const endTime = new Date(dateRange.value.end).setHours(0, 0, 0, 0);
        return dateToCheck >= startTime && dateToCheck <= endTime;
    };

    // 抓取房型資料
    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/room-type/select-all`);
            console.log("所有房型",response.data);
            roomTypes.value = response.data.map(room => ({
                ...room,
                roomPrice: room.unitPrice // 確保 roomPrice 使用 unitPrice
            }));

            if (roomTypes.value.length > 0) {
                selectedRoomType.value = roomTypes.value[0].roomTypeName;
            }

            console.log("roomTypes", roomTypes.value);
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    };

    // 當房型資料載入完成後，初始化房型
    onMounted(async () => {
        await fetchRoomTypes();
    });

    return {
        year,
        month,
        startDate,
        endDate,
        roomTypes,
        selectedRoomType,
        roomPrice,
        selectedRooms,
        totalCost,
        fetchRoomTypes,
        residentCount,
        isDateInRange,  // 返回檢查日期是否在範圍內的函數
    };
});
