<template>
    <div class="line-binding-page">
      <b-card title="LINE 帳號綁定" class="mb-3">
        <p v-if="isBound">綁定成功！請加入官方 LINE 帳號。</p>
        <p v-else>尚未綁定 LINE 帳號，請點擊下方按鈕。</p>
        <b-button v-if="!isBound" @click="bindLineAccount" variant="success">綁定 LINE 帳號</b-button>
        <b-button v-if="isBound" @click="addOfficialLineAccount" variant="primary">加入官方 LINE 帳號</b-button>
      </b-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const store = useAuthStore();
  const isBound = ref(false);
  
  onMounted(() => {
    initializeLiff();
  });
  
  function initializeLiff() {
  // 確認 liff 是否已經加載
  if (typeof window.liff === 'undefined') {
    console.error('LIFF SDK 尚未加載');
    return;
  }

  // 初始化 LIFF
  window.liff.init({
    liffId: '2006867912-WgxpB5oY' // 請替換成你的 LIFF ID
  }).then(() => {
    // 確認是否已經登入
    if (window.liff.isLoggedIn()) {
      const userId = window.liff.getDecodedIDToken().sub;
      store.socialMediaAccount = userId;
      isBound.value = true;
    }
  }).catch((error) => {
    console.error('LIFF 初始化失敗', error);
  });
}

function bindLineAccount() {
  // 確認 liff 是否已經加載並初始化
  if (typeof window.liff === 'undefined') {
    console.error('LIFF 尚未加載');
    return;
  }

  // 呼叫 login 方法進行 LINE 登入
  window.liff.login();
}
  
  function addOfficialLineAccount() {
    window.location.href = 'https://line.me/R/ti/p/@228attwe'; // 替換為你的官方帳號
  }
  </script>
  
  <style scoped>
  .line-binding-page {
    max-width: 600px;
    margin: 50px auto;
  }
  </style>
  