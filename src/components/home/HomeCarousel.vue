<template>
    <div class="carousel">
        <!-- 控制按鈕組 -->
        <div class="controls">
            <button @click="prevSlide" class="control-button">
            <svg
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        </button>
        <button @click="nextSlide" class="control-button">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        </button>
        <button @click="togglePause" class="control-button pause-button">
        <svg
            v-if="isPaused"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        </button>
    </div>

    <!-- 圖片輪播區域 -->
      <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div
        v-for="(image, index) in images"
        :key="image.id"
        class="carousel-slide"
        :class="{ active: index === currentIndex }"
        
        >
        <img :src="image.src" :alt="image.alt" />
        </div>
    </div>
    <!-- 資訊區塊 -->
    <div class="info">
        <transition name="fade">
            <div v-if="images[currentIndex]" class="info-content">
            <h2 class="info-title">{{ images[currentIndex].title }}</h2>
            <p class="info-description">{{ images[currentIndex].description }}</p>
        </div>
        </transition>
    </div>
    <!-- 進度指示條 -->
    <div class="progress-container">
        <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        class="progress-bar"
        >
        <div
            class="progress-fill"
            :class="{ active: index === currentIndex }"
            :style="{ width: index === currentIndex ? `${progress}%` : '0%' }"
        ></div>
        </button>
    </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
  const router = useRouter();
  const currentIndex = ref(0);
  const progress = ref(0);
  const isPaused = ref(false);
  
  // 添加跳轉方法 
  const goToEvent = () => {
    console.log("跳轉");
    // router.push("/room-search");
  };
  
  // 導入圖片
  import fr01 from "@/assets/pictures/homeroom01.png"; 
  import fr02 from "@/assets/pictures/homeroom02.jpg";
  import fr03 from "@/assets/pictures/homeroom03.jpg";
  import fr04 from "@/assets/pictures/homeroom04.jpg";
  import fr05 from "@/assets/pictures/homeroom05.jpg";
  
  const images = [
  {
    id: 1,
    src: fr01,
    alt: "日落皇室套房",
    title: "日落皇室套房",
    description: "「這是為皇室而建的」。提供相當壯觀的四臥室皇家宅邸。私人門廳裡面有百年歷史的橄欖樹和高聳的天花板。",
  },
  {
    id: 2,
    src: fr02,
    alt: "四季皇家套房",
    title: "四季皇家套房",
    description: "設有大理石地板、威尼斯吊燈和小型三角鋼琴，而大理石浴室。擁有超大浴缸、蒸汽房、雙人更衣室和兩個可欣賞海景的私人陽台。",
  },
  {
    id: 3,
    src: fr03,
    alt: "皇家頂樓套房",
    title: "皇家頂樓套房",
    description: "皇家頂層套房提供奢華至極的住宿體驗，擁有專屬的私人健身房，還有可容納16位客人的用餐區，是尊貴的您享受生活的最佳場所。",
  },
  {
    id: 4,
    src: fr04,
    alt: "豪華家庭房",
    title: "豪華家庭房",
    description: "設有多個睡床區域，提供家庭旅客最舒適的住宿選擇，擁有寬敞的空間和便捷的設施。",
  },
  {
    id: 5,
    src: fr05,
    alt: "豪華海景",
    title: "豪華海景",
    description: "擁有壯麗海景，寬敞的設計讓您可以在床上欣賞到美麗的海洋景色。充足的自然光線使房間更加明亮和舒適，是放鬆身心的理想選擇。",
  },
  ];
  
  const nextSlide = () => {
    console.log("Next Slide triggered");
    currentIndex.value =
      currentIndex.value === images.length - 1 ? 0 : currentIndex.value + 1;
    progress.value = 0;
    // console.log("Next Slide:", currentIndex.value);
  };
  
  const prevSlide = () => {
    console.log("Pre Slide triggered");
    currentIndex.value =
      currentIndex.value === 0 ? images.length - 1 : currentIndex.value - 1;
    progress.value = 0;
    console.log("Previous Slide:", currentIndex.value);
  };
  
  const goToSlide = (index) => {
    currentIndex.value = index;
    progress.value = 0;
  };
  
  const togglePause = () => {
    console.log("Pause Toggled");
    isPaused.value = !isPaused.value;
  };
  
  let timer = null;
  let progressTimer = null;
  
  const startTimers = () => {
    const interval = 2000;
    const progressInterval = 50;
  
    timer = setInterval(nextSlide, interval);
    progressTimer = setInterval(() => {
      if (progress.value < 100) {
        progress.value += (progressInterval / interval) * 100;
      }
    }, progressInterval);
  };
  
  const stopTimers = () => {
    clearInterval(timer);
    clearInterval(progressTimer);
  };
  
  onMounted(() => {
    if (!isPaused.value) {
      startTimers();
    }
    console.log("自動輪播已關閉");
  });
  
  onUnmounted(() => {
    stopTimers();
  });
  
  watch(isPaused, (newValue) => {
  if (newValue) {
    stopTimers();  // 暫停時停止定時器
  } else {
    startTimers();  // 恢復時啟動定時器
  }
});

  </script>
  
<style>
.carousel {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 控制按鈕的容器 */
.controls {
  position: absolute;
  top: 50%; /* 調整至垂直居中 */
  left: 50%;
  transform: translate(-50%, -50%); /* 使按鈕在中間 */
  display: flex;
  justify-content: space-between;
  width: 100%;
  z-index: 10; /* 確保在圖片上方 */
}

/* 單個控制按鈕的樣式 */
.control-button {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 10px;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  z-index: 20; /* 確保按鈕能夠顯示在其他內容之上 */
  transform: translateY(155px);
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* 暫停按鈕置中 */
.pause-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transform: translateY(155px);
}

/* 輪播容器 */
.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 550px;
}

.carousel-slide {
  flex: 0 0 100%;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.carousel-slide img {
  width: 100%; 
  height: 100%;
  object-fit: cover;
}
.carousel-slide.active {
  opacity: 1;
}

/* 資訊區塊 */
.info {
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.info-title {
  font-size: 1.5rem;
  margin: 0;
}

.info-description {
  font-size: 1rem;
}

/* 進度指示條 */
.progress-container {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  width: 100%;
}

.progress-bar {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 5px;
  border: none;
  cursor: pointer;
}

.progress-bar .progress-fill {
  height: 100%;
  background: white;
  border-radius: 50%;
  transition: width 0.4s ease;
}

.progress-fill.active {
  width: 100%;
}

/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>
