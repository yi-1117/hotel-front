<template>
    <footer class="footer">
    <div class="footer-container">
        <div class="footer-left">
            <a href="/" class="footer-title"><h3>{{ hotelInfo.hotelName }}</h3></a>
            <p class="footer-description">{{ hotelInfo.footInfo }}</p>
            <div  class="footer-links">
            <a href=https://maps.app.goo.gl/zztWS5aqyZfHYBKX6 target="_blank" style="margin-left: -10px;position: relative; top: -8px;">取得地址</a>    
        </div>
            <div class="footer-social" style="margin-left: -10px;position: relative; top: 3px;">
            <a href="https://www.facebook.com" target="_blank" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com" target="_blank" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
        </div>
        </div>
        <div class="footerRight">
        <div class="footer-links">
        <ul>
            <li class="nav-item">
            <router-link class="nav-link" :to="adminRoute" @click="checkRoute">後台管理</router-link>
            </li>
            <li><a href="#"@click.prevent="showUnderConstructionAlert">關於我們</a></li>
            <li><a href="#"@click.prevent="showUnderConstructionAlert">餐廳菜單</a></li>
            <li><a href="#"@click.prevent="showUnderConstructionAlert">聯繫我們</a></li>
            <li><a href="#"@click.prevent="showUnderConstructionAlert">使用條款</a></li>
            <li><a href="#"@click.prevent="showUnderConstructionAlert">隱私政策</a></li>
        </ul>
        </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 新生活飯店. 版權所有.</p>
    </div>
    </footer>
</template>

<script>
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";
import { useHomeStore } from '@/stores/home';
import { useEAuthStore } from "@/stores/e_auth";
export default {
    name: 'Footer',
    data() {
        return {
            adminRoute: this.getAdminRoute()
        };
    },
    methods: {
        getAdminRoute() {
            const EAuthStore = useEAuthStore();
            return EAuthStore.isLoggedIn && (EAuthStore.role === "STAFF" || EAuthStore.role === "MANAGER"|| EAuthStore.role === "RESERVATIONIST"|| EAuthStore.role === "MERCHANDISER")
                ? "/admin/dashboard"
                : "/admin/login";
        },
        
    showUnderConstructionAlert() {
        Swal.fire({
            icon: 'info',
            title: '頁面建設中',
            text: '此頁面正在開發中，敬請期待！',
            confirmButtonText: '知道了',
            });
        },
    checkRoute (){
        const EAuthStore = useEAuthStore();
        if (EAuthStore.isLoggedIn && (EAuthStore.role === "STAFF" || EAuthStore.role === "MANAGER"|| EAuthStore.role === "RESERVATIONIST"|| EAuthStore.role === "MERCHANDISER")) {
            this.$router.push("/admin/dashboard");
    } else {
            this.$router.push("/admin/login");
            }
        },
    },
    computed: {
    hotelInfo() {
        const homeStore = useHomeStore();
    return {
        hotelName:homeStore.hotelName,
        footInfo: homeStore.footIntro,
        };
        }
    },
    mounted() {
        const homeStore = useHomeStore();
        homeStore.initializeHotelInfo();
    }

};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap');
.footerRight{
    margin-right: -200px;
}
.footer {
    margin-top: 30px;
    background-image: url("@/assets/pictures/footerPic.jpg");
    color: white;
    padding: 20px 0;
    font-size: 14px;
    height: 220px;
    z-index: 800;
}
.footer-container {
    font-family: 'Lora', serif;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
}
.footer-left {
    margin-left: -132px;
    margin-top: 10px;
}
.footer-title {
    font-size: 24px;
    margin-bottom: 10px;
    color:white;
    text-decoration: none;
}
.footer-description {
    font-size: 16px;
}
.footer-links {
    margin-left: 10px;
}
.footer-links ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
.footer-links li {
    margin: 8px 0;
}
.footer-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}
.footer-links a:hover {
    color: #ff9c42;
}
.social-icon {
    color: white;
    margin: 0 10px;
    font-size: 18px;
    transition: color 0.3s ease;
}
.social-icon:hover {
    color: #ff9c42;
}
.footer-bottom {
    text-align: center;
    margin-top: -5px;
}
.footer-bottom p {
    font-size: 12px;
    color: #cfcece;
    font-weight: bold;
}
</style>
