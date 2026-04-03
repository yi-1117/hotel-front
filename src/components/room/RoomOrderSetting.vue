<template>
  <div class="container mt-5">
    <h2 class="mb-4">訂單查詢</h2>

    <!-- 會員 ID 條件 -->
    <div class="mb-3">
      <label for="memberId" class="form-label">會員 ID：</label>
      <input type="number" v-model="conditions.memberId" class="form-control" placeholder="輸入會員 ID">
    </div>

    <!-- 入住日期條件 -->
    <div class="mb-3">
      <label class="form-label">入住日期範圍：</label>
      <div class="d-flex gap-2">
        <input type="date" v-model="conditions.startingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.startingTimeMax" class="form-control" placeholder="結束日期">
      </div>
    </div>

    <!-- 退房日期條件 -->
    <div class="mb-3">
      <label class="form-label">退房日期範圍：</label>
      <div class="d-flex gap-2">
        <input type="date" v-model="conditions.leavingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.leavingTimeMax" class="form-control" placeholder="結束日期">
      </div>
    </div>

    <button class="btn btn-primary mb-3" @click="fetchOrders">查詢訂單</button>

    <!-- 每頁顯示筆數選擇 -->
    <div class="dropdown mb-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        每頁顯示 {{ itemsPerPage }} 筆
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" @click="changeItemsPerPage(5)">5</a></li>
        <li><a class="dropdown-item" href="#" @click="changeItemsPerPage(10)">10</a></li>
        <li><a class="dropdown-item" href="#" @click="changeItemsPerPage(20)">20</a></li>
      </ul>
    </div>

    <!-- 查詢結果表格 -->
    <table class="table table-hover table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>訂單 ID</th>
          <th>會員 ID</th>
          <th>會員姓名</th>
          <th>電話</th>
          <th>電子郵件</th>
          <th>入住日期</th>
          <th>退房日期</th>
          <th>訂單狀態</th>
          <th>總金額</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.roomOrderId">
          <td>{{ order.roomOrderId }}</td>
          <td>{{ order.member.memberId }}</td>
          <td>{{ order.memberDetails.fullName }}</td>
          <td>{{ order.memberDetails.phoneNumber }}</td>
          <td>{{ order.member.email }}</td>
          <td>{{ order.startingTime }}</td>
          <td>{{ order.leavingTime }}</td>
          <td>{{ order.orderStatus }}</td>
          <td>{{ order.totalPayment }} 元</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteOrder(order)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "@/config";

const orders = ref([]);
const conditions = ref({
  memberId: "",
  startingTimeMin: "",
  startingTimeMax: "",
  leavingTimeMin: "",
  leavingTimeMax: "",
});
const itemsPerPage = ref(10);

const fetchOrders = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/order/query`, assembleConditions());
    orders.value = response.data;
  } catch (error) {
    console.error("查詢訂單失敗: ", error);
    Swal.fire("錯誤", "無法獲取訂單資料，請稍後再試", "error");
  }
};

const deleteOrder = async (order) => {
  const orderId = order.roomOrderId;
  const result = await Swal.fire({
    title: `確定要刪除訂單 ${orderId} 嗎？`,
    text: "刪除後無法恢復！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定刪除",
    cancelButtonText: "取消",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/order/delete/${orderId}`);
    orders.value = orders.value.filter((o) => o.roomOrderId !== orderId);
    Swal.fire("已刪除", `訂單 ${orderId} 已成功刪除`, "success");
  } catch (error) {
    console.error("刪除失敗: ", error);
    Swal.fire("刪除失敗", "無法刪除訂單，請稍後再試", "error");
  }
};

const changeItemsPerPage = (count) => {
  itemsPerPage.value = count;
};

const paginatedOrders = computed(() => {
  return orders.value.slice(0, itemsPerPage.value);
});
</script>

<style>
.table {
  border-radius: 10px;
  overflow: hidden;
}
.table th, .table td {
  vertical-align: middle;
}
</style>
