import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', {
    state: () => ({ 
    hotelName:"新生活飯店 For New Life",
    welcomeMessage: '歡迎來到新生活飯店！',
    intro: '我們為您提供無與倫比的奢華住宿體驗，無論是精緻的客房設計，還是貼心的服務，我們都致力於為每一位客人營造一個無憂無慮、舒適優雅的休憩環境。從高端的床上用品到私人定制的服務，您將感受到每一個細節都被精心打磨，旨在超越您對奢華的所有期望',
    footIntro:'為您提供最尊絕不凡和無與倫比的旅宿體驗'
    }),
    actions: {
        // 初始化時檢查 localStorage
        initializeHotelInfo() {
            const hotelName = localStorage.getItem("hotelName");
            const welcomeMessage = localStorage.getItem("welcomeMessage");
            const intro = localStorage.getItem("intro");
            const footIntro = localStorage.getItem("footIntro");

            // 如果 localStorage 中有資料，則使用它；如果沒有，則使用預設值
            if (hotelName) this.hotelName = hotelName;
            if (welcomeMessage) this.welcomeMessage = welcomeMessage;
            if (intro) this.intro = intro;
            if (footIntro) this.footIntro = footIntro;
        },


        updateHotelInfo(payload) {
        this.hotelName=payload.hotelName;
        this.welcomeMessage = payload.welcomeMessage;
        this.intro = payload.intro;
        this.footIntro=payload.footIntro;

        localStorage.setItem("hotelName",payload.hotelName);
        localStorage.setItem("welcomeMessage",payload.welcomeMessage);
        localStorage.setItem("intro",payload.intro);
        localStorage.setItem("footIntro",payload.footIntro);
        },
    },
    persist: true,
    getters: {},
});
