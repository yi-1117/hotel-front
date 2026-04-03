<template>
  <div>
    <h2>酒店評論</h2>

    <!-- 評論區 -->
    <div>
      <textarea v-model="newComment" placeholder="留下您的評論..."></textarea>
      <div>
        <label>評分:</label>
        <div class="rating">
          <!-- 顯示星星圖形 -->
          <span v-for="n in 5" :key="n">
            <i
              class="bi bi-star-fill"
              :class="{
                'text-warning': n <= newRating,
                'text-muted': n > newRating,
              }"
              @click="newRating = n"
            ></i>
          </span>
        </div>
      </div>
      <button @click="submitReview">提交評論</button>
    </div>

    <!-- 顯示評論 -->
    <div v-if="reviews.length">
      <h3>所有評論</h3>
      <div v-for="review in reviews" :key="review.id" class="review">
        <p>{{ review.comment }}</p>
        <div class="rating">
          <!-- 顯示星星圖形 -->
          <span v-for="n in 5" :key="n">
            <i
              class="bi bi-star-fill"
              :class="{
                'text-warning': n <= review.rating,
                'text-muted': n > review.rating,
              }"
            ></i>
          </span>
        </div>

        <!-- 按讚 / 取消按讚按鈕 -->
        <button
          v-if="!review.liked"
          @click="toggleLike(review.id, review.memberId)"
        >
          按讚
        </button>
        <button
          v-if="review.liked"
          @click="toggleLike(review.id, review.memberId)"
        >
          取消按讚
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth"; // 確保引入你的 Pinia store

const authStore = useAuthStore();
const memberId = computed(() => authStore.memberId); // 使用 Pinia store 獲取登入會員的 ID

// 用來保存評論資料
const reviews = ref([]);

// 用來保存新的評論
const newComment = ref("");
const newRating = ref(3); // 預設評分 3 顆星

// 假設會員資料，這裡的 memberId 應該是從 Pinia store 中動態獲取
const currentMember = computed(() => ({ memberId: memberId.value })); // 使用 computed 來獲取 currentMember

// 初始化頁面時，獲取評論資料
onMounted(async () => {
  await fetchReviews();
});

// 獲取所有評論
const fetchReviews = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/reviews");
    reviews.value = response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const submitReview = async () => {
    console.log("submitReview 被觸發");
  try {
    const response = await axios.post(
      "http://localhost:8080/api/reviews",
      {
        member: { memberId: memberId.value },
        rating: newRating.value,
        comment: newComment.value,
      },
    );
    console.log("Review submitted:", response.data);
  } catch (error) {
    console.error("Error submitting review:", error);
    // 打印完整錯誤信息
    if (error.response) {
      console.error("Response error:", error.response);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("General error:", error.message);
    }
  }
};

// 按讚或取消按讚
const toggleLike = async (reviewId) => {
  try {
    await axios.post(
      `http://localhost:8080/api/review-likes/toggle?reviewId=${reviewId}&memberId=${memberId.value}`
    );
    // 重新獲取評論資料，以更新按讚狀態
    await fetchReviews();
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
</script>

<style scoped>
/* CSS 樣式 */
.review {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  height: 100px;
}

button {
  margin-top: 10px;
}

.rating i {
  font-size: 1.5rem;
  cursor: pointer;
}

.text-warning {
  color: #ffcc00; /* 黃色 */
}

.text-muted {
  color: #ccc; /* 灰色 */
}
</style>
