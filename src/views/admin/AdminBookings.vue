<!-- AdminDashboard.vue -->
<template>
    <div class="admin-container">
    <!-- 側邊導航欄 -->
    <ESidebar />
    <!-- 主要內容區域 -->
    <div class="main-content">
      <div class="container mt-5">
    <h2>訂單查詢</h2>

    <!-- 會員 ID 條件 -->
    <div class="mb-3">
      <label for="memberId" class="form-label">會員 ID：</label>
      <input type="number" v-model="conditions.memberId" class="form-control" placeholder="輸入會員 ID">
    </div>

    <!-- 入住日期條件 -->
    <div class="mb-3">
      <label for="startingTime" class="form-label">入住日期範圍：</label>
      <div class="d-flex">
        <input type="date" v-model="conditions.startingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.startingTimeMax" class="form-control ms-2" placeholder="結束日期">
      </div>
    </div>

    <!-- 退房日期條件 -->
    <div class="mb-3">
      <label for="leavingTime" class="form-label">退房日期範圍：</label>
      <div class="d-flex">
        <input type="date" v-model="conditions.leavingTimeMin" class="form-control" placeholder="開始日期">
        <input type="date" v-model="conditions.leavingTimeMax" class="form-control ms-2" placeholder="結束日期">
      </div>
    </div>

    <!-- 查詢按鈕區域 -->
    <div class="d-flex mb-3">
      <button class="btn btn-primary me-2" @click="fetchOrders">查詢訂單</button>
      <button class="btn btn-secondary me-2" @click="fetchAllOrders">查詢所有訂單</button>
      <button class="btn btn-warning" @click="clearConditions">清空查詢條件</button>
    </div>

    <!-- 查詢結果 -->
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>訂單 ID</th>
          <th>會員 ID</th>
          <th>會員姓名</th>
          <th>電話</th>
          <th>Email</th>
          <th>入住日期</th>
          <th>退房日期</th>
          <th>訂單狀態</th>
          <th>總金額</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.roomOrderId">
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
            <button class="btn btn-danger btn-sm" @click="deleteOrder(order)">取消訂單</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    </div>
    </div>
    </template>
    
    <script setup>
    import ESidebar from "@/components/admin/ESidebar.vue";
    import { ref } from "vue";
    import axios from "axios";
    import Swal from "sweetalert2";
    import { API_BASE_URL } from '@/config.js';
    
    const orders = ref([]);
    const conditions = ref({
      memberId: "",
      startingTimeMin: "",
      startingTimeMax: "",
      leavingTimeMin: "",
      leavingTimeMax: "",
    });

    const fetchOrders = async () => {
      const assembledConditions = assembleConditions();
      try {
        const response = await axios.post(`${API_BASE_URL}/api/order/query`, assembledConditions);
        orders.value = response.data;
        fetchMemberDetails();
      } catch (error) {
        console.error("查詢訂單失敗: ", error);
        Swal.fire("錯誤", "無法獲取訂單資料，請稍後再試", "error");
      }
    };

    const fetchAllOrders = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/order/query`, {});
        orders.value = response.data;
        fetchMemberDetails();
      } catch (error) {
        console.error("查詢所有訂單失敗: ", error);
        Swal.fire("錯誤", "無法獲取所有訂單資料，請稍後再試", "error");
      }
    };

    const clearConditions = () => {
      conditions.value = {
        memberId: "",
        startingTimeMin: "",
        startingTimeMax: "",
        leavingTimeMin: "",
        leavingTimeMax: "",
      };
    };

    const fetchMemberDetails = async () => {
      const memberIds = [...new Set(orders.value.map(order => order.member.memberId))];
      const memberDetailsMap = {};

      await Promise.all(memberIds.map(async (memberId) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/members/details/${memberId}`);
          memberDetailsMap[memberId] = response.data;
        } catch (error) {
          console.error(`無法獲取會員 ${memberId} 的詳細資料: `, error);
        }
      }));
    
      orders.value = orders.value.map(order => ({
        ...order,
        memberDetails: memberDetailsMap[order.member.memberId] || {},
      }));
    };

    const deleteOrder = async (order) => {
      console.log("order",order);
      const orderId = order.roomOrderId;
      const result = await Swal.fire({
        title: `確定要刪除訂單 ${orderId} 嗎？`,
        text: "刪除後無法恢復！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確定刪除",
        cancelButtonText: "取消",
        reverseButtons: true,
      });
    
      if (!result.isConfirmed) return;
    
      try {
        await axios.delete(`${API_BASE_URL}/api/order/delete/${orderId}`);
        orders.value = orders.value.filter((o) => o.orderId !== orderId);
        Swal.fire("已刪除", `訂單 ${orderId} 已成功刪除`, "success");
      } catch (error) {
        console.error("刪除失敗: ", error);
        Swal.fire("刪除失敗", "無法刪除訂單，請稍後再試", "error");
      }

      fetchOrders();
    };

    const assembleConditions = () => {
      const validConditions = {};
      if (conditions.value.memberId) validConditions.memberId = conditions.value.memberId;
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
</script>
<style scoped>
  /* 設定整體容器 */
.admin-container {
    display: flex;
    height: 100vh;
    background-color: white;
}

  /* 主要內容區域 */
.main-content {
    padding: 10px;
    flex: 1;
    margin-left:-60px;
}
.header h1 {
    font-size: 28px;
    font-weight: bold;
}
.header p {
    font-size: 18px;
    margin-top: 10px;
}
</style>