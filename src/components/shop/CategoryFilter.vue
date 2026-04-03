<template>
    <div class="category-filter">
      <h3>商品類別</h3>
      <ul>
        <li v-for="category in categories" :key="category" @click="filterByCategory(category)">
          {{ category }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      categories: Array,
    },
    methods: {
      filterByCategory(category) {
        this.$emit('filter-category', category);
      },
    },
  };
  </script>
  
  <style>
  .category-filter {
    margin-bottom: 20px;
  }
  .category-filter ul {
    list-style: none;
    padding: 0;
  }
  .category-filter li {
    cursor: pointer;
    padding: 5px 10px;
  }
  .category-filter li:hover {
    background-color: #f0f0f0;
  }
  </style>