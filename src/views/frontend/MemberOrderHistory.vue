<template>
  <div class="container mt-5">
    <h2>歷史訂單查詢</h2>

    <!-- 入住日期條件 -->
    <div class="mb-3">
      <label class="form-label">入住日期範圍：</label>
      <div class="d-flex">
        <input type="date" v-model="conditions.startingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.startingTimeMax" class="form-control ms-2" placeholder="結束日期">
      </div>
    </div>

    <!-- 退房日期條件 -->
    <div class="mb-3">
      <label class="form-label">退房日期範圍：</label>
      <div class="d-flex">
        <input type="date" v-model="conditions.leavingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.leavingTimeMax" class="form-control ms-2" placeholder="結束日期">
      </div>
    </div>

    <button class="btn btn-primary mb-3" @click="fetchOrders">查詢訂單</button>

    <!-- 查詢結果 -->
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>訂單 ID</th>
          <th>入住日期</th>
          <th>退房日期</th>
          <th>訂單狀態</th>
          <th>總金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.roomOrderId">
          <td>{{ order.roomOrderId }}</td>
          <td>{{ order.startingTime }}</td>
          <td>{{ order.leavingTime }}</td>
          <td>{{ order.orderStatus }}</td>
          <td>{{ order.totalPayment }} 元</td>
        </tr>
      </tbody>
    </table>
    <div class="heightAdjustment"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { API_BASE_URL } from "@/config";
const authStore = useAuthStore();
const orders = ref([]);
const conditions = ref({
  startingTimeMin: "",
  startingTimeMax: "",
  leavingTimeMin: "",
  leavingTimeMax: "",
});

const assembleConditions = () => {
  const validConditions = {
    memberId: authStore.memberId, // 直接帶入當前會員 ID
  };

  if (conditions.value.startingTimeMin || conditions.value.startingTimeMax) {
    validConditions.startingTime = {};
    if (conditions.value.startingTimeMin) validConditions.startingTime.min = conditions.value.startingTimeMin;
    if (conditions.value.startingTimeMax) validConditions.startingTime.max = conditions.value.startingTimeMax;
  }

  if (conditions.value.leavingTimeMin || conditions.value.leavingTimeMax) {
    validConditions.leavingTime = {};
    if (conditions.value.leavingTimeMin) validConditions.leavingTime.min = conditions.value.leavingTimeMin;
    if (conditions.value.leavingTimeMax) validConditions.leavingTime.max = conditions.value.leavingTimeMax;
  }

  return { additionalConditions: validConditions };
};

const fetchOrders = async () => {
  if (!authStore.memberId) {
    console.error("未登入，無法查詢訂單");
    return;
  }

  const assembledConditions = assembleConditions();
  try {
    const response = await axios.post(`${API_BASE_URL}/api/order/query`, assembledConditions);
    orders.value = response.data;
  } catch (error) {
    console.error("查詢訂單失敗: ", error);
  }
};

onMounted(fetchOrders);
</script>

<style>
.container {
  margin-left: 20px;
  padding-left: 20px;
  max-width: 90%;
  
}
.heightAdjustment{
  height: 193px;
}

</style>