<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">新增房型</h5>
          <button type="button" class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRoomType">
            <!-- 批量貼上 -->
            <div class="mb-3">
              <label for="bulkPaste" class="form-label">批量貼上</label>
              <textarea id="bulkPaste" class="form-control" @paste="handlePaste"></textarea>
            </div>
            
            <!-- 房型基本資訊 -->
            <div class="row">
              <div class="col-md-6" v-for="(field, key) in roomType" :key="key">
                <div class="mb-3">
                  <label :for="key" class="form-label">{{ field.label }}</label>
                  <input v-if="field.type !== 'textarea'" :type="field.type" :id="key" v-model="field.value" class="form-control" :required="field.required" />
                  <textarea v-else :id="key" v-model="field.value" class="form-control" :required="field.required"></textarea>
                </div>
              </div>
            </div>

            <!-- 圖片上傳 -->
            <h3 class="mt-4">新增圖片</h3>
            <div class="mb-3">
              <input type="file" multiple @change="handleFileChange" class="form-control" />
              <p class="text-muted mt-2">支援六張圖片上傳。</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          <button type="submit" class="btn btn-primary" @click="submitRoomType">新增房型</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// 房型資料結構
const roomType = ref({
  roomTypeName: { label: "房型名稱", value: "", type: "text", required: true },
  bedType: { label: "床型", value: "", type: "text", required: true },
  area: { label: "面積 (平方公尺)", value: 0, type: "number", required: true },
  bathroomType: { label: "浴室類型", value: "", type: "text", required: true },
  roomTypeDescription: { label: "房型描述", value: "", type: "textarea", required: true },
  unitPrice: { label: "價格 (每晚)", value: 0, type: "number", required: true },
  additionalPricePerPerson: { label: "額外人數加價", value: 0, type: "number", required: false },
  overTimeRatio: { label: "超時費率", value: 1.5, type: "number", required: false },
  roomTypeMaxCount: { label: "最大房型數", value: 10, type: "number", required: false },
  isHandicap: { label: "是否無障礙房", value: false, type: "checkbox", required: false },
  adultCapacity: { label: "成人容量", value: 2, type: "number", required: true },
  childrenCapacity: { label: "兒童容量", value: 2, type: "number", required: true },
  maxCapacity: { label: "最大入住人數", value: 4, type: "number", required: true },
});

// 圖片上傳
const selectedFiles = ref([]);

// 處理圖片上傳
function handleFileChange(event) {
  selectedFiles.value = Array.from(event.target.files);
}

// 批量貼上處理
function handlePaste(event) {
  const pastedData = event.clipboardData.getData("text");
  if (!pastedData) return;
  const lines = pastedData.split(" ").map(line => line.trim()).filter(line => line);
  const keys = Object.keys(roomType.value);
  
  lines.forEach((val, index) => {
    if (keys[index]) {
      roomType.value[keys[index]].value = val;
    }
  });
  event.preventDefault();
}

// 提交房型
async function submitRoomType() {
  try {
    const formattedRoomType = {
      roomType: {
        ...Object.fromEntries(
          Object.entries(roomType.value).map(([key, field]) => [key, field.value])
        ),
        roomTypeId: null // 在 roomType 內加入 roomTypeId 並賦予空值
      },
      message: {} // 確保 message 存在
    };

    console.log("formattedRoomType", formattedRoomType);
    const response = await axios.post(`${API_BASE_URL}/api/room-type/create`, formattedRoomType);
    console.log('response',response);
    const roomTypeId = response.data.roomType.roomTypeId;
    console.log('roomTypeId', roomTypeId);

    if (selectedFiles.value.length > 0) {
      const formData = new FormData();
      selectedFiles.value.forEach(file => formData.append("files", file));
      await axios.post(`${API_BASE_URL}/api/room-type-image/create/${roomTypeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    alert("房型與圖片新增成功！");
  } catch (error) {
    console.error("Error:", error);
    alert("新增失敗，請稍後再試！");
  }
}
</script>

<style>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
