<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">編輯房型</h5>
          <button type="button" class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateRoomType">
            <div class="row">
              <div class="col-md-6" v-for="(field, key) in roomType" :key="key">
                <div class="mb-3">
                  <label :for="key" class="form-label">{{ field.label }}</label>
                  <input 
                    v-if="field.type !== 'textarea'" 
                    :type="field.type" 
                    :id="key" 
                    v-model="field.value" 
                    class="form-control" 
                    :required="field.required" 
                    :readonly="key === 'roomTypeId' || key === 'roomTypeName'" 
                    :disabled="key === 'roomTypeId' || key === 'roomTypeName'"
                  />
                  <textarea v-else :id="key" v-model="field.value" class="form-control" :required="field.required"></textarea>
                </div>
              </div>
            </div>
            
            <!-- 圖片上傳 -->
            <h3 class="mt-4">更新圖片</h3>
            <div class="mb-3">
              <input type="file" multiple @change="handleFileChange" class="form-control" />
              <p class="text-muted mt-2">支援六張圖片上傳。</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          <button type="submit" class="btn btn-primary" @click="updateRoomType">更新房型</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "@/config";

const props = defineProps({
  selectedRoom: Object,
});

const emit = defineEmits(["close", "refresh"]);

const roomType = ref({});
const selectedFiles = ref([]);

if (props.selectedRoom) {
  roomType.value = {
    roomTypeId: { label: "ID", value: props.selectedRoom.roomTypeId, type: "number", required: true },
    roomTypeName: { label: "名稱", value: props.selectedRoom.roomTypeName, type: "text", required: true },
    bedType: { label: "床型", value: props.selectedRoom.bedType, type: "text", required: true },
    area: { label: "面積", value: props.selectedRoom.area, type: "number", required: true },
    bathroomType: { label: "浴室類型", value: props.selectedRoom.bathroomType, type: "text", required: true },
    roomTypeDescription: { label: "描述", value: props.selectedRoom.roomTypeDescription, type: "textarea", required: true },
    isHandicap: { label: "無障礙", value: props.selectedRoom.isHandicap, type: "text", required: false },
    adultCapacity: { label: "成人容納人數", value: props.selectedRoom.adultCapacity, type: "number", required: true },
    childrenCapacity: { label: "兒童容納人數", value: props.selectedRoom.childrenCapacity, type: "number", required: true },
    maxCapacity: { label: "最大容納人數", value: props.selectedRoom.maxCapacity, type: "number", required: true },
    unitPrice: { label: "價格", value: props.selectedRoom.unitPrice, type: "number", required: true },
    additionalPricePerPerson: { label: "額外人數加價", value: props.selectedRoom.additionalPricePerPerson, type: "number", required: true },
    overTimeRatio: { label: "超時費率", value: props.selectedRoom.overTimeRatio, type: "number", required: true },
    roomTypeMaxCount: { label: "最大房型數", value: props.selectedRoom.roomTypeMaxCount, type: "number", required: true },
  };
}

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const updateRoomType = async () => {
  try {
    const payload = {
      roomType: Object.fromEntries(Object.entries(roomType.value).map(([key, field]) => [key, field.value]))
    };
    
    await axios.put(`${API_BASE_URL}/api/room-type/update`, payload);
    
    if (selectedFiles.value.length > 0) {
      const formData = new FormData();
      selectedFiles.value.forEach(file => formData.append("files", file));
      await axios.put(`${API_BASE_URL}/api/room-type-image/update/${roomType.value.roomTypeId.value}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    
    Swal.fire("成功!", "房型資料已更新", "success");
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("更新失敗", error);
    console.error("message")
    Swal.fire("失敗!", "房型修改失敗", "error");
    emit("refresh");
    emit("close");
  }
};
</script>

<style>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
