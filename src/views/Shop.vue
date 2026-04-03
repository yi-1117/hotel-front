<template>
  <div id="out" class="out">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" v-for="category in categories" :key="category.id">
              <a class="nav-link" href="#" @click="filterByCategory(category.name)">{{ category.name }}</a>
            </li>
          </ul>
          <form class="d-flex justify-content-center mx-auto" @submit.prevent="searchProducts">
    <input class="form-control me-2" type="search" placeholder="搜尋商品" v-model="searchQuery" aria-label="Search" style="width: 1000px;" />
    <button class="btn btn-outline-success" type="submit">搜尋</button>
</form>

        </div>
      </div>
    </nav>

   
    <!-- 輪播 -->
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">

          <img src="../pictures/shop/shop1.jpg" class="d-block" alt="第一張圖片">
        </div>
        <div class="carousel-item">
          <img src="../pictures/shop/shop2.jpg" class="d-block" alt="第二張圖片">
        </div>
      
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

 

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <div class="container mt-3">
  <div id="product-list-row" class="product-list row">
    <ProductCard 
      v-for="product in filteredProducts" 
      :key="product.productId" 
      :product="product" 
      @add-to-cart="addToCart"
      class="col-sm-6 col-md-4 col-lg-3 mb-4" 
    />
  </div>
</div>

</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProductCard from '../components/shop/ProductCard.vue';
import ShoppingCart from '../components/shop/ShoppingCart.vue'; // 引入 ShoppingCart 組件
import { useCartStore } from '@/stores/cart';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { API_BASE_URL } from '@/config'; // 引入 API_BASE_URL

export default {
  components: {
    ProductCard,
    ShoppingCart,
    FontAwesomeIcon,
  },
  setup() {
    const cartStore = useCartStore();

    const products = ref([]); // 儲存從 API 獲取的產品信息
    const categories = ref([]); // 商品類別資料
    const searchQuery = ref('');  // 搜尋關鍵字
    const selectedCategory = ref(''); // 選擇的類別
    

    // 獲取商品資料
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/product`);
        products.value = response.data;
      } catch (error) {
        console.error('獲取商品失敗:', error);
      }
    };

    // 獲取商品類別資料
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`); // 假設這是取得類別的 API
        categories.value = response.data;
      } catch (error) {
        console.error('獲取商品類別失敗:', error);
      }
    };

    // 搜尋及過濾產品
    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const categoryMatch = selectedCategory.value ? product.categoryName === selectedCategory.value : true;
        const queryMatch = searchQuery.value ? product.productName.includes(searchQuery.value) : true;
        return categoryMatch && queryMatch;
      });
    });
    

    const filterByCategory = (category) => {
      selectedCategory.value = category;
    };

    // 獲取商品圖片資料
    const fetchProductImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/product-photos`);
        return response.data;
      } catch (error) {
        console.error('獲取商品圖片失敗:', error);
        return [];
      }
    };

    // 獲取數據並整合
    const fetchAllData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]); // 同時獲取產品和類別資料

      const imagesData = await fetchProductImages();

      // 整合產品資料和圖片資料
      products.value = products.value.map(product => {
        const relatedImages = imagesData.filter(imgData => imgData.product.productId === product.productId);
        const primaryImage = relatedImages.length > 0 ? relatedImages[0] : null; // 這裡可以選擇其他邏輯來選擇顯示的圖片
        const images = primaryImage ? [`data:image/jpeg;base64,${primaryImage.productPhoto}`] : [];
        
        return {
          ...product,
          images: images,
        };
      });
    };

    onMounted(() => {
      fetchAllData(); // 組件掛載時調用
    });

    function addToCart(product) {
      cartStore.addToCart(product);
    }

    function removeFromCart(productId) {
      cartStore.removeFromCart(productId);
    }

    function viewCart() {
      // 導航到購物車頁面或展示購物車的邏輯
    }
    function searchProducts() {
      console.log('Searching for products with query:', searchQuery.value);
      filteredProducts.value = products.value.filter(product => 
        product.productName.includes(searchQuery.value)
      );
    }

    return {
      products,
      filteredProducts,
      addToCart,
      removeFromCart,
      viewCart,
      cartStore,
      filterByCategory,
      searchQuery, // 將 searchQuery 也導出
    };
  },
};
</script>

<style>

#carouselExample {
  width: 70%;  /* 修改寬度為占父容器的 80% */
  margin: 20px auto; /* 讓輪播居中 */
  border-radius: 10px; /* 圓角效果 */
  overflow: hidden;  /* 讓超出部分隱藏 */
}

.carousel-inner {
  height: 500; /* 設定適當的高度 */
  width: 70%;  /* 修改寬度為占父容器的 80% */
}

.carousel-item img {
  height: 500px; /* 設定圖片的高度為100% */
  width: auto;  /* 或者設置為100%來使圖片拉伸填滿，但可能會改變比例 */
  object-fit: cover; /* 使用 object-fit 保持圖片比例 */
  border-radius: 10px; /* 圓角效果 */
  justify-self: center
}

.product-list {
  margin-left: -15px; /* 調整容器之間的邊距 */
    margin-right: -15px; /* 調整容器之間的邊距 */
    display: flex; /* 使用 Flexbox */
    flex-wrap: wrap; /* 允許元素換行 */
    justify-content: center; /* 水平居中對齊子元素 */
    align-items: center; /* 垂直居中對齊子元素 */
    
}

.product-card {
    border: 1px solid #dee2e6; /* 為每個產品卡片添加邊框 */
    border-radius: 5px; /* 圓角邊框 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加陰影效果 */
    transition: transform 0.2s; /* 浮動效果 */
    overflow: hidden; /* 讓溢出部分隱藏 */
}

.product-card:hover {
    transform: translateY(-5px); /* 鼠標懸停時提升 */
}

.product-card img {
    width: 100%; /* 確保圖像不會超出卡片 */
  }

.info-button {
  background-color: #007bff; /* 藍色 */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.info-button:hover {
  background-color: #0056b3; /* 深藍色 */
}

body {
  font-family: Arial, sans-serif; /* 或其他字體 */
  background-color: #f8f9fa; /* 輕微的背景色 */
  color: #333; /* 文字顏色 */
}

.nav-link {
  cursor: pointer;
}


.product-list {
  padding: 20px;
}
.form-control {
    width: 400px; /* 設置為更大的固定值 */
    max-width: 100%; /* 確保它不會超出父容器的寬度 */
}

#out {
}

.navbar {
  /* margin-bottom: 20px;  */
  /* 導航條間距 */
}


</style>
