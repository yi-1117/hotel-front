<template>
        <Carousel v-bind="carouselConfig">
            <Slide v-for="room in rooms" v-bind:key="room">
                <div class="carousel__item">
                    <text v-bind="room"/>
                </div>
            </Slide>

        <template #addons>
            <Navigation class="navigation"/>
            <Pagination class="pagination"/>
        </template>
        </Carousel>
</template>
    
<script setup lang='ts'>
    import { ref, onMounted } from "vue";
    import 'vue3-carousel/carousel.css'
    import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
    import { API_BASE_URL } from "@/config";
    const rooms = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchRooms = async () => {
        loading.value = true;
        error.value = null;
        try {
            console.log("fetch start...")
            const response = await fetch(`${API_BASE_URL}/api/room-type/select-all`);
            if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        console.log("response ok")
        rooms.value = await response.json();
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const carouselConfig = {
        itemsToShow: 1,
        wrapAround: true
    }

    onMounted(() => {
        console.log("onMounted triggered");
        fetchRooms();
    });
</script>
    
<style>
    .navigation {
        size: 200%;
    }
    .pagination {
        size: 200%;
    }
</style>