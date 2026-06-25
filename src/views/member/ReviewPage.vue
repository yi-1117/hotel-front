<template>
  <div>
    <h2>酒店評論</h2>

    <!-- 新增評論 -->
    <div>
      <textarea v-model="newComment" placeholder="留下您的評論..."></textarea>
      <div>
        <label>評分:</label>
        <div class="rating">
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

    <!-- 評論列表 -->
    <div v-if="reviews.length">
      <h3>所有評論</h3>
      <div v-for="review in reviews" :key="review.reviewId" class="review">
        <p class="review-author">{{ review.member?.email }}</p>
        <p>{{ review.comment }}</p>
        <div class="rating">
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

        <!-- 按讚 -->
        <button
          class="like-btn"
          :class="{ liked: isLiked(review) }"
          @click="toggleLike(review.reviewId)"
        >
          <i :class="isLiked(review) ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'"></i>
          <span>{{ review.likes?.length ?? 0 }}</span>
        </button>

        <!-- 留言區塊 -->
        <div class="comments-section">
          <h4>留言</h4>

          <!-- 根留言 + 縮排回覆 -->
          <div
            v-for="comment in commentsByReview[review.reviewId] || []"
            :key="comment.commentId"
            class="comment"
          >
            <!-- 根留言 -->
            <div class="comment-body">
              <span class="comment-author">{{ comment.memberEmail }}</span>
              <span class="comment-content">{{ comment.content }}</span>
              <button class="reply-btn" @click="startReply(review.reviewId, comment)">
                回覆
              </button>
            </div>

            <!-- 回覆列表（縮排） -->
            <div
              v-for="reply in comment.replies"
              :key="reply.commentId"
              class="reply"
            >
              <span class="comment-author">{{ reply.memberEmail }}</span>
              <!-- @mention -->
              <span v-if="reply.replyToMemberEmail" class="mention">
                @{{ reply.replyToMemberEmail }}
              </span>
              <span class="comment-content">{{ reply.content }}</span>
              <!-- 回覆別人的回覆：parentComment 還是根留言，但 @mention 換人 -->
              <button
                class="reply-btn"
                @click="startReply(review.reviewId, comment, reply)"
              >
                回覆
              </button>
            </div>

            <!-- 回覆輸入框（掛在根留言下） -->
            <div
              v-if="
                replyTarget &&
                replyTarget.reviewId === review.reviewId &&
                replyTarget.rootCommentId === comment.commentId
              "
              class="reply-input"
            >
              <span v-if="replyTarget.mentionEmail" class="mention">
                @{{ replyTarget.mentionEmail }}
              </span>
              <input v-model="replyContent" placeholder="輸入回覆..." />
              <button @click="submitReply">送出</button>
              <button @click="replyTarget = null">取消</button>
            </div>
          </div>

          <!-- 新增根留言 -->
          <div class="new-comment-input">
            <input
              v-model="newCommentInputs[review.reviewId]"
              placeholder="新增留言..."
            />
            <button @click="submitComment(review.reviewId)">送出留言</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const memberId = computed(() => Number(authStore.memberId));
const isLoggedIn = computed(() => authStore.isLoggedIn);

const reviews = ref([]);
const newComment = ref("");
const newRating = ref(3);

// 每則評論的留言清單 { reviewId: [CommentDto...] }
const commentsByReview = reactive({});

// 每則評論的新留言輸入內容 { reviewId: string }
const newCommentInputs = reactive({});

// 回覆狀態
const replyTarget = ref(null); // { reviewId, rootCommentId, replyToMemberId, mentionEmail }
const replyContent = ref("");

onMounted(async () => {
  await fetchReviews();
});

const fetchReviews = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/reviews");
    reviews.value = response.data;
    // 平行載入所有評論的留言
    await Promise.all(reviews.value.map((r) => fetchComments(r.reviewId)));
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const fetchComments = async (reviewId) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/review-comments/with-replies/${reviewId}`
    );
    commentsByReview[reviewId] = res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

const submitReview = async () => {
  if (!isLoggedIn.value) return alert("請先登入");
  try {
    await axios.post("http://localhost:8080/api/reviews", {
      member: { memberId: memberId.value },
      rating: newRating.value,
      comment: newComment.value,
    });
    newComment.value = "";
    await fetchReviews();
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};

// 判斷當前登入會員是否已對這則評論按讚
const isLiked = (review) =>
  review.likes?.some((like) => like.member?.memberId === memberId.value) ?? false;

const toggleLike = async (reviewId) => {
  if (!isLoggedIn.value) return alert("請先登入");
  try {
    await axios.post(
      `http://localhost:8080/api/review-likes/toggle?reviewId=${reviewId}&memberId=${memberId.value}`
    );
    await fetchReviews();
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

// 新增根留言
const submitComment = async (reviewId) => {
  if (!isLoggedIn.value) return alert("請先登入");
  const content = newCommentInputs[reviewId];
  if (!content?.trim()) return;
  try {
    await axios.post("http://localhost:8080/api/review-comments/add", {
      review: { reviewId },
      member: { memberId: memberId.value },
      content,
    });
    newCommentInputs[reviewId] = "";
    await fetchComments(reviewId);
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};

// 點擊「回覆」按鈕
// rootComment = 根留言，targetReply = 被回覆的那則回覆（可為 null）
const startReply = (reviewId, rootComment, targetReply = null) => {
  replyContent.value = "";
  replyTarget.value = {
    reviewId,
    rootCommentId: rootComment.commentId,
    // @mention 對象：如果是回覆回覆，mention 那個回覆的作者；否則 mention 根留言作者
    replyToMemberId: targetReply
      ? targetReply.memberId
      : rootComment.memberId,
    mentionEmail: targetReply
      ? targetReply.memberEmail
      : rootComment.memberEmail,
  };
};

// 送出回覆
const submitReply = async () => {
  if (!isLoggedIn.value) return alert("請先登入");
  if (!replyContent.value.trim() || !replyTarget.value) return;
  const { reviewId, rootCommentId, replyToMemberId } = replyTarget.value;
  try {
    await axios.post("http://localhost:8080/api/review-comments/add", {
      review: { reviewId },
      member: { memberId: memberId.value },
      content: replyContent.value,
      parentComment: { commentId: rootCommentId },
      replyToMember: { memberId: replyToMemberId },
    });
    replyContent.value = "";
    replyTarget.value = null;
    await fetchComments(reviewId);
  } catch (error) {
    console.error("Error submitting reply:", error);
  }
};
</script>

<style scoped>
.review {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
}

textarea,
input {
  width: 100%;
}

textarea {
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
  color: #ffcc00;
}

.text-muted {
  color: #ccc;
}

.review-author {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 4px;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  margin-top: 6px;
}

.like-btn:hover {
  background: #f0f2f5;
}

.like-btn.liked {
  color: #1877f2;
  border-color: #1877f2;
}

.like-btn i {
  font-size: 1rem;
}

.comments-section {
  margin-top: 12px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.comment {
  margin-bottom: 8px;
}

.comment-body {
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.reply {
  margin-left: 24px;
  margin-top: 4px;
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.comment-author {
  font-weight: bold;
  font-size: 0.85rem;
}

.mention {
  color: #1877f2;
  font-size: 0.85rem;
}

.comment-content {
  font-size: 0.9rem;
}

.reply-btn {
  font-size: 0.75rem;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.reply-input {
  margin-left: 24px;
  margin-top: 4px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.reply-input input {
  flex: 1;
}

.new-comment-input {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}

.new-comment-input input {
  flex: 1;
}
</style>
