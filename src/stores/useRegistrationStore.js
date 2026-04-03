// stores/useRegistrationStore.js
import { defineStore } from "pinia";

export const useRegistrationStore = defineStore("registration", {
  state: () => ({
    email: "",
    password: "", // 不存入 localStorage
    confirmPassword: "", // 不存入 localStorage
    memberId: "",
    details: {
      fullName: "",
      gender: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      nationality: "",
      preferredLanguage: "",
      newsletterSubscription: false,
      socialMediaAccount: "", // 儲存 LINE 用戶 ID
      displayName: "", // 儲存 LINE 顯示名稱
      pictureUrl: "", // 儲存 LINE 頭像 URL
      statusMessage: "", // 儲存 LINE 狀態訊息
      profilePicture: "",
    },
    isRegistered: false, // 註冊狀態
  }),
  actions: {
    setMemberId(memberId) {
      this.memberId = memberId;
    },
    setEmail(email) {
      this.email = email;
    },
    setPassword(password) {
      this.password = password;
    },
    setDetails(details) {
      Object.assign(this.details, details); // 避免整個物件被覆蓋
    },
    resetForm() {
      this.$reset();
      localStorage.removeItem("registrationStore");
    },
    completeRegistration() {
      this.isRegistered = true;
    },
    clearRegistration() {
      // 只在 isRegistered 為 false 時清除資料
      if (!this.isRegistered) {
        this.$reset();
        localStorage.removeItem("registrationStore");
      }
    },
    // 新增的 `clearStoreOnRefresh` 方法，重新整理頁面時清空 store
    clearStoreOnRefresh() {
      if (localStorage.getItem("registrationStore")) {
        localStorage.removeItem("registrationStore"); // 移除 localStorage 中的資料
        this.$reset(); // 清空 store 的狀態
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "registrationStore",
        storage: localStorage,
        paths: ["email", "details", "isRegistered", "memberId"], // 移除 password 以保安全
      },
    ],
  },
});
