<template>
  <div class="backgroundpic">
  <div class="order-container">
    <h1>訂單確認</h1>

    <div v-if="orderStore.memberDetails" class="order-card">
      <div class="order-section">
        <p><strong>訂單編號：</strong> {{ orderStore.roomOrderId }}</p>
        <p><strong>顧客姓名：</strong> {{ memberName }}</p>
        <p><strong>入住日期：</strong> {{ orderStore.startingDate.toDateString() }}</p>
        <p><strong>退房日期：</strong> {{ orderStore.leavingDate.toDateString() }}</p>
      </div>
      
      <div class="order-section">
        <h5><strong>房間組合</strong></h5>
        <ul class="room-list">
          <li v-for="room in orderStore.roomCombination" :key="room.roomTypeId">
            {{ room.roomTypeName }} <span class="room-count">(數量: {{ room.count }})</span>
          </li>
        </ul>
      </div>
      
      <div class="order-section">
        <h5><strong>費用資訊</strong></h5>
        <p><strong>原始總金額：</strong> ${{ orderStore.totalPaymentBeforeUsedPoints }}</p>
        <p><strong>折抵後金額：</strong> <span class="final-amount">${{ finalAmount }}</span></p>
      </div>

      <div class="order-section">
        <h5><strong>積分折抵</strong></h5>
        <p class="points-info"><i class="fa-solid fa-coins"></i> 目前可用積分： <strong>{{ memberPoints }}</strong> 點</p>
        <div class="point-redeem">
          <i class="fa-solid fa-coins"></i>
          <strong>使用積分：</strong>
          <input v-model.number="pointsToUse" type="number" class="point-input" :max="maxPointsToUse" min="0" @input="validatePoints" placeholder="不得小於0" />
          <button class="confirm-btn" :disabled="isInvalid" @click="confirmRedeem">確認折抵</button>
        </div>
        <p v-if="isInvalid" class="error-message"> ⚠️ 超過可用積分，請重新輸入 </p>
      </div>

      <div class="order-section">
        <h5><strong>本次可獲得積分</strong></h5>
        <p>消費滿 100 元加 1 點，本次可獲得 <strong>{{ earnedPoints }}</strong> 點</p>
      </div>

      <button @click="submitOrder" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? "送出中..." : "確認並送出訂單" }}
      </button>
    </div>
    
    <div v-else class="error-message">
      <p>找不到訂單資訊，請返回首頁。</p>
    </div>
  </div>
</div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useOrderStore } from "@/stores/order";
import { useRoomSearchStore } from "@/stores/roomSearch";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

const orderStore = useOrderStore();
const roomSearchStore = useRoomSearchStore();
const isSubmitting = ref(false);
const memberName = localStorage.getItem("memberName");
const memberId = localStorage.getItem("memberId");

// 會員積分
const memberPoints = ref(0);
const pointsToUse = ref(0);
const finalAmount = ref(orderStore.totalPayment);

// 計算折抵積分的最大值
const maxPointsToUse = computed(() => Math.min(orderStore.totalPayment, memberPoints.value));
const isInvalid = computed(() => pointsToUse.value > maxPointsToUse.value);

// 訂單可獲得的積分
const earnedPoints = computed(() => Math.floor(orderStore.totalPaymentBeforeUsedPoints / 100));

const fetchMemberPoints = async () => {
  try {
    console.log(memberId);
    const response = await axios.get(`${API_BASE_URL}/points/get/${memberId}`);
    memberPoints.value = parseInt(response.data.success, 10);
  } catch (error) {
    console.error("獲取積分失敗", error);
    memberPoints.value = 0;
  }
};

const validatePoints = () => {
  if (pointsToUse.value < 0) pointsToUse.value = 0;
  if (pointsToUse.value > maxPointsToUse.value) pointsToUse.value = maxPointsToUse.value;
};

const confirmRedeem = () => {
  console.log("totalPaymentBeforeUsedPoints",orderStore.totalPaymentBeforeUsedPoints);
  if (isInvalid.value) return;
  finalAmount.value = orderStore.totalPayment - pointsToUse.value;
  Swal.fire("折抵成功！", `已使用 ${pointsToUse.value} 點，剩餘金額 $${finalAmount.value}，原價 ${orderStore.totalPaymentBeforeUsedPoints}`, "success");
  orderStore.usedPoints = pointsToUse.value;
  orderStore.totalPayment = orderStore.totalPaymentBeforeUsedPoints - orderStore.usedPoints;
  console.log("orderStore.roomCombination",orderStore.roomCombination);
  
};

const submitOrder = async () => {
  if (isSubmitting.value) return;
  console.log("startDate",roomSearchStore.startDate);
  console.log("endDate",roomSearchStore.endDate);

  isSubmitting.value = true;

  const orderPayload = {
    memberId,
    roomOrderId: orderStore.roomOrderId,
    residentCount: orderStore.residentCount,
    totalPayment: finalAmount.value,
    startingDate: roomSearchStore.startDate,
    leavingDate: roomSearchStore.endDate,
    usedPoints: orderStore.usedPoints,
    totalPaymentBeforeUsedPoints: orderStore.totalPaymentBeforeUsedPoints,
    roomTypeOrderDTOs: orderStore.roomCombination.map((room) => ({
      roomTypeId: room.roomTypeId,
      roomTypeName: room.roomTypeName,
      roomCount: room.count,  
      roomOrderId: orderStore.roomOrderId
    })),
    message: {},
  };
  console.log(orderPayload);
  try {
    // 扣除積分
    if (pointsToUse.value > 0) {
      await axios.post(`${API_BASE_URL}/points/reduce/${memberId}/${pointsToUse.value}`);
    }

    // 增加積分
    if (earnedPoints.value > 0) {
      await axios.post(`${API_BASE_URL}/points/add/${memberId}/${earnedPoints.value}`);
    }

    console.log("orderPayload",orderPayload);

    // 先確認訂單
    await axios.post(`${API_BASE_URL}/api/order/confirm`, orderPayload, {
      responseType: "text",
    });

    // 確認成功後再進行付款
    const response = await axios.post(
      `${API_BASE_URL}/api/order/payment`,
      orderPayload,
      { responseType: "text" }
    );

    window.document.write(response.data);
  } catch (error) {
    console.error("訂單送出失敗:", error);
    Swal.fire({
      title: "訂單送出失敗",
      text: error.response?.data?.message || "請稍後再試。",
      icon: "error",
      confirmButtonText: "確定",
    });
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(async () => {
  await fetchMemberPoints();
  console.log("roomCombination",orderStore.roomCombination);
});
</script>

<style scoped>
.backgroundpic {
  position: relative;
  
  overflow: hidden; /* 防止溢出 */
}

.backgroundpic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(/src/pictures/room/bookingcom-3-hotel.jpg);
  background-size: cover;
  background-position: center;
  opacity: 0.5; /* 设置背景图片的透明度 */
  z-index: -1; /* 确保伪元素在图片后面，不影响内容 */
}

.order-container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: url('/path-to-your-background-image.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh; /* 确保容器的最小高度为视口高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 让内容从顶部开始显示 */
  align-items: center;
}


h1, h2 {
  text-align: center;
  color: #333;
}

.order-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.order-section {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.room-list {
  list-style: none;
  padding: 0;
}

.room-list li {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.room-count {
  font-weight: bold;
  color: #007bff;
}

.final-amount {
  font-size: 1.2rem;
  color: #d9534f;
  font-weight: bold;
}

.points-info {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #004b97;
  display: inline-block;
}

.point-redeem {
  display: flex;
  align-items: center;
  gap: 10px;
}

.point-input {
  width: 100px;
  font-size: 16px;
  border: 2px solid #004b97;
  border-radius: 5px;
  padding: 5px;
}

.confirm-btn {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px 10px;
}

.confirm-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  text-align: center;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 16px;
}
</style>