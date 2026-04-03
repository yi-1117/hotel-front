<template>
    <div style="display: flex;background: green;">
            <div style="flex: 1;background: red;background:linear-gradient(to bottom, #ffffff 20%, #99d3eb 80%);height: 100px;"></div>
            <div style="flex: 1;;background: blue;background:linear-gradient(to bottom, #ffffff 20%, #65b6ee 80%);"></div>
          </div>
    <BookingBar class="pointsBookingBar"/>
    <div>
      <img :src="pointsIntropic" alt="積分中心" class="pointsIntropic"/>
    </div>
    <div class="bigTitle">
      <h1 style="color: #004B97;margin-top:-20px ;margin-left: -18px;">盡情享用積分</h1>
      <p style="font-size: 1.5rem;color: #666;padding-bottom: 15px;">註冊新生活會員，立即賺取100積分，享受更多會員專屬優惠。</p>
      <button @click="goRegisterMember"class="cta-button">免費加入新生活會員</button>
    </div>
    <!-- 使用積分 -->
    <div class="grid-container">
      <div class="grid-item">
        <img :src="usePointsImage" alt="使用積分" class="feature-image"/>
        <div class="gridVerticalContent">
              <h3 style="font-size:40px;font-weight: bold;">如何使用積分</h3>
              <p><strong class="pointIntro">住宿</strong></p><p>使用積分兌換新生活飯店全球的頂級豪華住宿，享受免費或折扣優惠的美好假期。</p>
              <p><strong class="pointIntro">升級</strong></p><p>使用積分享受新生活飯店全球高級的房型免費升級，讓您的住宿體驗更上一層樓。</p>
              <p><strong class="pointIntro">餐飲</strong></p><p>在新生活飯店的餐廳與酒吧，使用積分支付餐飲帳單，盡情享受美味佳餚與飲品。</p>
              <p><strong class="pointIntro">禮品</strong></p>
              <div class="text-button-container">
                <p>用積分兌換精選禮品，精品商品到禮品卡應有盡有，盡情選擇。</p>
                <button class="cta-button" @click.prevent="showUnderConstructionAlert">了解更多</button>
              </div>
        </div>
      </div>
    </div>
    <!-- 賺取積分 -->
    <div class="grid-container">
      <div class="grid-item">
        <div class="earn-points-container">
        <div class="gridVerticalContent">
            <h3 style="font-size:40px;font-weight: bold;">如何賺取積分</h3>
            <p><strong class="pointIntro">住宿</strong></p><p>透過在新生活飯店全球各地的住宿，輕鬆賺取積分，享受會員專屬優惠與獎勳。</p>
            <p><strong class="pointIntro">推廣</strong></p><p>透過新生活會員限定的限時促銷活動，加速積分累積，快速享有更多專屬獎賞。</p>
            <p><strong class="pointIntro">刷卡</strong></p><p>使用我們的新生活飯店聯名信用卡，享有專屬精英優惠好禮，並賺取更多積分。</p>
            <p><strong class="pointIntro">餐飲</strong></p>
            <div class="text-button-container">
              <p>在新生活飯店的餐廳與酒吧，享受燭光美食同時賺取積分。</p>
              <button class="cta-button" @click.prevent="showUnderConstructionAlert">了解更多</button>
          </div>
        </div>
  <img :src="earnPointsImage" alt="賺取積分" class="feature-image"style="height:526px;width:936px;margin-left:-150px;"/>
</div>
      </div>
    </div>
    <button class="joinMember" @click="goRegisterMember">準備好加入新生活會員了嗎？立即<u>免費加入</u></button>
</template>

<script>
import earnPointsImage from '@/assets/pictures/earnPoints.jpg';
import usePointsImage from '@/assets/pictures/usePoints.jpg';
import pointsIntropic from '@/assets/pictures/pointsIntropic.jpg';
import {useOrderStore} from "@/stores/order";
import DatePicker from "@vuepic/vue-datepicker";
import Swal from 'sweetalert2';
import BookingBar from '@/components/home/BookingBar.vue';

export default {
  name: "PointsCenter",
  components: {
    DatePicker,
    BookingBar,
  },
  data() {
    return {
      earnPointsImage,
      usePointsImage,
      pointsIntropic,
      useOrderStore,
      startDate:new Date(),
      endDate:new Date(),
      residentCount:1
    };
  },
  methods:{
    goRegisterMember(){
      this.$router.push("/member-center/register")
    },
    setBookingBar(){
      const orderStore = useOrderStore();
      orderStore.setBookingBar(this.startDate,this.endDate,this.residentCount);
      this.$router.push("/room-search")
    },
    calculateDays(startDate, endDate){
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const dayDiff = timeDiff / (1000 * 3600 * 24);
        return dayDiff >= 0 ? dayDiff : 0;
    },
    showUnderConstructionAlert() {
      Swal.fire({
        icon: 'info',
        title: '頁面建設中',
        text: '此頁面正在開發中，敬請期待！',
        confirmButtonText: '知道了',
      });
    },
    
  }
};
</script>

<style scoped>

.pointsIntropic {
  width: 100%; 
  height: 560px;
  margin-top: -150px;
  z-index: -1;
  /* display: none; */
}
.bigTitle{
  padding-top: 50px;
  width: 1300px;
  margin-top: -100px;
  margin-left: 310px;
  height: 250px;
  background-color:  rgba(242, 242, 242, 0.85);
  text-align: center;
  position: relative;
  z-index: 1;
}
.gridVerticalContent{
  height: 500px;
  width: 900px;
}
.pointIntro{
  font-size: 32px;
}
.grid-item p {
  font-size: 1.3rem;
  color: #666;
  /* background: red; */
}
/*=========================*/



h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.grid-container {
  display: grid;
  gap: 40px;
  margin-top: 40px;
  background-color: rgb(242, 242, 242, 0.85);
}

.grid-item {
  display: flex;
  align-items: center;
  text-align: left;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-image {
  width: 50%; /* 調整圖片寬度 */
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 50px; /* 讓圖片和文字之間有些間距 */
  transition: transform 0.3s ease-in-out; 
}
.feature-image:hover {
  transform: scale(1.05); /* 放大圖片 */
}
.grid-item .content {
  width: 60%; /* 讓文字區域占用剩餘空間 */
}

h3 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color:  #004B97;
}


.cta-button {
  background-color: #004B97;
  color: white;
  font-size: 1.1rem;
  padding: 12px 25px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: -20px;
  transform: translateX(-20px);
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.cta-button:hover {
  background-color: #0056b3;
}
/* =============================*/

.joinMember{
  margin-bottom:-300px;
  background-color:rgb(1, 156, 222);
  font-size: 26px;
  color: white;
  width: 100%;
  padding: 20px 25px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  letter-spacing: 2.2px;
  transform: translateY(6px);
}
.text-button-container {
  display: flex;
  align-items: center; /* 讓文字與按鈕垂直置中 */
  gap: 50px; /* 控制兩者的間距 */
}
.earn-points-container {
  margin-left: 70px;
  margin-bottom: 27px;
  display: flex;
  align-items: center; 
  justify-content: space-between;
  gap: 40px;
}

</style>
