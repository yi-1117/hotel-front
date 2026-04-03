<template>
  <div class="container mt-5">
    <h2 class="mb-4">房型管理</h2>
    <button class="btn btn-primary mb-3" @click="showAddModal = true">新增房型</button>

    <table class="table table-hover table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th class="id-column">ID</th>
          <th>名稱</th>
          <th class="description-column">床型</th>
          <th>面積</th>
          <th class="description-column">浴室類型</th>
          <th class="description-column">描述</th> <!-- Apply the three-line class here -->
          <th class="capacity-column">成人</th>
          <th class="capacity-column">兒童</th>
          <th class="capacity-column">最大人數</th>
          <th>價格</th>
          <th>額外人數加價</th>
          <th>超時費率</th>
          <th class="capacity-column">房間數量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in roomTypes" :key="room.roomTypeId">
          <td class="id-column">{{ room.roomTypeId }}</td>
          <td>{{ room.roomTypeName }}</td>
          <td class="description-column">{{ room.bedType }}</td>
          <td>{{ room.area }} m²</td>
          <td class="description-column">{{ room.bathroomType }}</td>
          <td class="description-column">{{ room.roomTypeDescription }}</td>
          <td class="capacity-column">{{ room.adultCapacity }}</td>
          <td class="capacity-column">{{ room.childrenCapacity }}</td>
          <td class="capacity-column">{{ room.maxCapacity }}</td>
          <td>{{ room.unitPrice }} 元</td>
          <td>{{ room.additionalPricePerPerson }} 元</td>
          <td>{{ room.overTimeRatio }}</td>
          <td class="capacity-column">{{ room.roomTypeMaxCount }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editRoom(room)">編輯</button>
            <!-- <button class="btn btn-danger btn-sm ms-2" @click="deleteRoom(room)">刪除</button> -->
          </td>
        </tr>
      </tbody>
    </table>

    <AddRoomTypeModal v-if="showAddModal" @close="showAddModal = false" @refresh="fetchRoomTypes" />
    <EditRoomTypeModal v-if="showEditModal" @close="showEditModal = false" @refresh="fetchRoomTypes" :selectedRoom="selectedRoom" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import AddRoomTypeModal from "@/components/room/AddRoomTypeModal.vue";
import { API_BASE_URL } from "@/config";
import EditRoomTypeModal from "@/components/room/EditRoomTypeModal.vue";

const roomTypes = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedRoom = ref(null);

const fetchRoomTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/room-type/select-all`);
    roomTypes.value = response.data;
  } catch (error) {
    console.error("無法獲取房型資料: ", error);
    Swal.fire("錯誤", "無法獲取房型資料，請稍後再試", "error");
  }
};

const editRoom = (room) => {
  selectedRoom.value = room;
  showEditModal.value = true;
};

const deleteRoom = async (room) => {
  const result = await Swal.fire({
    title: `確定要刪除 ${room.roomTypeName} 嗎？`,
    text: "刪除後無法恢復！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定刪除",
    cancelButtonText: "取消",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/room-type/delete/${room.roomTypeName}`);
    roomTypes.value = roomTypes.value.filter(r => r.roomTypeName !== room.roomTypeName);
    Swal.fire("已刪除", `${room.roomTypeName} 已成功刪除`, "success");
    fetchRoomTypes();
  } catch (error) {
    console.error("刪除失敗: ", error);
    Swal.fire("刪除失敗", "無法刪除房型，請稍後再試", "error");
  }
};

onMounted(fetchRoomTypes);
</script>

<style scoped>
.container{
  margin-left: 0;
}
.table {
  table-layout: fixed; /* 強制設定表格的列寬固定 */
  width: 120%; /* 使表格寬度充滿容器 */
  
}

.table th, .table td {
  vertical-align: middle;
  white-space: normal;
  padding: 0.5rem;
  text-align: center;
}

.table td {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Set width of specific columns */
.id-column,
.capacity-column {
  width: 75px;
  word-wrap: break-word;
}

/* Set width of '描述' column */
.description-column {
  width: 200px !important; /* 強制設置描述欄位寬度 */
  overflow: hidden;
  white-space: normal; /* 允許文字換行 */
  word-wrap: break-word; /* 長文字換行顯示 */
}


</style>
