<template>
  <div class="homepage">
    <!-- Navbar -->
    <nav class="scrollheader" :class="{ 'scrollheader-visible': isNavbarVisible }">
    <Navbar/></nav>
    <HomeVideo style="margin-top: -58px"></HomeVideo>
    <div class="homeBookingBarContainer">
      <BookingBar/>
    </div>
    <div class="hotel-intro">
      <h1>{{ hotelInfo.welcomeMessage }}</h1>
      <p>{{ hotelInfo.intro }}</p>
    </div>
    
    <!-- 服務項目 -->
    <div class="services">
      <h1 style="padding-bottom: 20px;text-align: center;">探索更多新生活的精彩世界</h1>
      <div class="service-list">
        <div class="service-item" @click.prevent="showUnderConstructionAlert">
          <img src="@/assets/pictures/homepool.jpg" alt="游泳池" class="pic" />
          <h3>游泳池</h3>
          <p>享受室內或室外泳池，放鬆身心。</p>
        </div>
        <div class="service-item" @click.prevent="showUnderConstructionAlert">
          <img src="@/assets/pictures/homespa.jpg" alt="水療中心" class="pic" />
          <h3>水療中心</h3>
          <p>享受專業的水療和按摩服務。</p>
        </div>
        
        <div class="service-item" @click.prevent="showUnderConstructionAlert">
          <img src="@/assets/pictures/homediningroom.jpg" alt="餐廳" class="pic"/>
          <h3>餐廳</h3>
          <p>提供各種美味的國際美食，滿足您的味蕾。</p>
        </div>
      </div>
    </div>
    <!-- 輪播圖 -->
    <div class="carouselContainer" style="display: flex; justify-content: space-between;">
    <div class="carousel">
        <ImagesCarousel />
    </div>
    <div class="text-content">
        <h3>享受絕美的特殊房型</h3>
        <img src="@/assets/pictures/hotellogo.png" alt="Logo" style="height: 300px;width: 300px;"/>
        <h4>體驗頂級奢華的快樂</h4>
    </div>
</div>
    
    <!-- google Map -->

  </div>

</template>

<script>
import HomeVideo from '@/components/home/HomeVideo.vue';
import Navbar from "@/components/Navbar.vue";
import BookingBar from '@/components/home/BookingBar.vue';
import ImagesCarousel from "@/components/home/HomeCarousel.vue";

import { useHomeStore } from '@/stores/home';
import { computed} from 'vue';
import Swal from 'sweetalert2';
export default {
  components: {
    HomeVideo,
    Navbar,
    BookingBar,
    ImagesCarousel,
  },
  data() {
    return {
      userName: "訪客", // 預設顯示「訪客」
      isNavbarVisible: false, // 用來控制 navbar 顯示或隱藏
      lastScrollTop: 0, // 記錄上次的滾動位置
    };
  },
  setup() {
    const homeStore = useHomeStore();
    const hotelInfo = computed(() => ({ // 使用 computed 去監聽 store 的資料變化
      welcomeMessage: homeStore.welcomeMessage,
      intro: homeStore.intro,
    }));
    return {
      hotelInfo,
    };
  },
  mounted() {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      this.userName = storedName;
    }
    // 監聽navbar滾動事件
    window.addEventListener('scroll', this.handleScroll);
    const homeStore = useHomeStore();
    homeStore.initializeHotelInfo();
  },
  unmounted() {
    // 清除navbar滾動事件監聽器
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
    let currentScrollTop = window.scrollY; // 當前滾動位置
    if (currentScrollTop > 1050 || currentScrollTop < this.lastScrollTop) {
      // 如果滾動超過 50px 或者是向上滾動，顯示 navbar
      this.isNavbarVisible = true;
    } else {
      // 向下滾動時隱藏 navbar
      this.isNavbarVisible = false;
    }
    // 更新滾動位置
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
},
    showUnderConstructionAlert() {
      Swal.fire({
        icon: 'info',
        title: '頁面建設中',
        text: '此頁面正在開發中，敬請期待！',
        confirmButtonText: '知道了',
      });
    },
  },
};
</script>

<style scoped>

.scrollheader {
  position: fixed;
  top: -100px;/* 初始位置讓 navbar 隱藏 */
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  transition: top 0.5s ease;
  z-index: 10;

}

.scrollheader-visible {
  top: 0;
}
.home-video {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保影片覆蓋整個背景區域 */
  z-index: -10; /* 使影片位於背景 */
}
.homepage {
  position: relative;
  z-index: 1; /* 保證內容位於影片上方 */
}
.homeBookingBarContainer{
  background: linear-gradient(to bottom, #000000 60%, white 100%);
  margin-top: -106px;
  height: 200px;
  padding-top: 220px;
}

.hotel-intro {
  padding: 40px 20px;
  border-radius: 15px; 
  text-align: center;
  margin: 40px auto;
}

.hotel-intro h1 {
  font-size: 2.5rem; 
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}

.hotel-intro p {
  font-size: 1.2rem; 
  color: #555;
  line-height: 1.8;
  max-width: 1150px;
  margin: 0 auto;
}
.services{
  background:rgb(237, 235, 235);
  background: linear-gradient( white 0%, rgb(169, 169, 169) 30%,rgb(136, 136, 136) 55%, rgb(194, 194, 194)80%, white 100%);
  height: 500px;
}
.service-list {
  display: flex;
  justify-content: space-between;
  gap: 50px;
  justify-content: center;
}

.service-item {
  width: 30%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.service-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.service-item h3 {
  padding: 10px;
  font-size: 24px;
  text-align: center;
}

.service-item p {
  padding: 0 10px 10px;
  text-align: center;
}

.pic {
  width: 100%;
  height: 280px;
}

.carouselContainer {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;  /* 左右分開，並保持間隔 */
  align-items: center;  /* 讓它們垂直居中 */
}


.text-content {
  width: 30%;  /* 控制文本區域的寬度 */
  padding: 20px;  /* 給文本區域一些間距 */
  border-radius: 15px;  /* 圓角效果 */
  text-align: center;  /* 使文本居中 */
  transform: translateX(-135px);
}

.text-content h3 {
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
  font-style: italic;  /* 設置斜體 */
  transform: skewX(-10deg);
  font-size: 3rem;
  color: #666;
  line-height: 1.6;
}
.text-content h4 {
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
  font-style: italic;  /* 設置斜體 */
  transform: skewX(-10deg);
  font-size: 3rem;
  color: #666;
  line-height: 1.6;
}


</style>
