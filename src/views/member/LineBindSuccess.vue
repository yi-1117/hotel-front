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
  import axios from 'axios';
  import { API_BASE_URL } from '@/config';

  const store = useAuthStore();
  const isBound = ref(false);

  onMounted(() => {
    initializeLiff();
  });

  function initializeLiff() {
    if (typeof window.liff === 'undefined') {
      console.error('LIFF SDK 尚未加載');
      return;
    }

    window.liff.init({ liffId: '2006867912-WgxpB5oY' }).then(async () => {
      if (window.liff.isLoggedIn()) {
        const lineUserId = window.liff.getDecodedIDToken().sub;
        const memberId = store.memberDetails?.memberId || localStorage.getItem('memberId');

        if (!memberId) {
          console.error('找不到會員 ID，請先登入系統');
          return;
        }

        try {
          await axios.post(`${API_BASE_URL}/api/line/bind`, { lineUserId, memberId });
          store.setMemberDetails({ ...store.memberDetails, socialMediaAccount: lineUserId });
          isBound.value = true;
        } catch (error) {
          console.error('綁定失敗:', error.response?.data || error.message);
        }
      }
    }).catch((error) => {
      console.error('LIFF 初始化失敗', error);
    });
  }

  function bindLineAccount() {
    if (typeof window.liff === 'undefined') {
      console.error('LIFF 尚未加載');
      return;
    }
    window.liff.login();
  }

  function addOfficialLineAccount() {
    window.location.href = 'https://line.me/R/ti/p/@228attwe';
  }
  </script>
  
  <style scoped>
  .line-binding-page {
    max-width: 600px;
    margin: 50px auto;
  }
  </style>
  