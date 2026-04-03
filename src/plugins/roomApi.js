import axios from "axios";
import { useOrderStore } from "@/stores/order";

const roomApi = axios.create({
    baseURL: import.meta.env.VITE_ROOM_API_URL,
    timeout: 3000
});

roomApi.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response && error.response.status === 403) {
            window.location.href = "/403";
        }
        return Promise.reject(error);
    }
);

export const bookRoom = async ({ memberName, startingDate, leavingDate, selectedRooms }) => {
    if (!memberName || !startingDate || !leavingDate || !selectedRooms || selectedRooms.length === 0) {
        throw new Error("缺少必要的訂房資訊");
    }

    const totalPayment = selectedRooms.reduce((sum, room) => sum + room.price * room.count, 0);
    const roomCombination = new Map();
    selectedRooms.forEach(room => {
        roomCombination.set(room.roomTypeName, room.count);
    });

    const orderData = {
        memberName,
        roomOrderId: `ORD-${Date.now()}`,
        residentCount: selectedRooms.reduce((sum, room) => sum + room.count, 0),
        totalPayment,
        startingDate,
        leavingDate,
        roomCombination: Object.fromEntries(roomCombination) // 轉換 Map 為 Object 傳送
    };

    try {
        const response = await roomApi.post("/book-room", orderData);
        const orderStore = useOrderStore();
        orderStore.setOrderInfo(orderData); // 更新 Pinia 狀態
        return response.data;
    } catch (error) {
        console.error("訂房失敗", error);
        throw error;
    }
};

export default roomApi;
