<template>
    <div>
      <h1>商城首頁</h1>
      <CategoryFilter :categories="categories" @filter-category="applyFilter" />
      
      <div class="product-list">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
          @add-to-cart="addToCart" 
        />
      </div>
      
      <router-link to="/cart">前往購物車</router-link> <!-- 前往購物車的鏈接 -->
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import ProductCard from './ProductCard.vue';
  import CategoryFilter from './CategoryFilter.vue';
  import { useCartStore } from '../stores/cart';
  
  export default {
    components: {
      ProductCard,
      CategoryFilter,
    },
    setup() {
      const cartStore = useCartStore();
      const products = ref([
        { id: 1, name: '商品A', price: 100, image: 'path/to/imageA.jpg', category: '家具' },
        { id: 2, name: '商品B', price: 200, image: 'path/to/imageB.jpg', category: '裝飾品' },
        { id: 3, name: '商品C', price: 300, image: 'path/to/imageC.jpg', category: '家具' },
        { id: 4, name: '商品D', price: 150, image: 'path/to/imageD.jpg', category: '照明' },
        // ...更多商品
      ]);
      const categories = ref(['家具', '裝飾品', '照明']);
      const selectedCategory = ref(null);
  
      const filteredProducts = computed(() => {
        return selectedCategory.value === null
          ? products.value
          : products.value.filter(product => product.category === selectedCategory.value);
      });
  
      function addToCart(product) {
        cartStore.addToCart(product);
      }
  
      function applyFilter(category) {
        selectedCategory.value = category;
      }
  
      return {
        products,
        categories,
        filteredProducts,
        addToCart,
        applyFilter,
      };
    },
  };
  </script>
  
  <style>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  </style>