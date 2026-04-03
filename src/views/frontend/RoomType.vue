<template>
  <div>
    <RoomTypeDetail :roomTypeId="roomTypeId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import RoomTypeDetail from '@/components/room/RoomTypeDetail.vue'

const route = useRoute()
const roomTypeId = Number(route.params.roomTypeId)
</script>


<style></style>