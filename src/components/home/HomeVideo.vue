<template>
    <video ref="videoPlayer" controls :src="videoSource" @play="onPlay" @pause="onPause" @ended="onEnded" class="video" loop muted> 
    您的瀏覽器不支持影片。</video>
</template>

<script>
import videoSource from '@/assets/video/homevideo.mp4';
export default {
    name: 'HomeVideo',
    data() {
    return {
        videoSource, // 影片來源
        isPlaying: false, // 是否播放中
    };
    },
    mounted() {
    const video = this.$refs.videoPlayer;
    video.play();  // 在页面渲染后自动播放视频
    },
    methods: {
    playPause() {
        const video = this.$refs.videoPlayer;
        if (this.isPlaying) {
        video.pause();
        } else {
        video.play();
        }
        this.isPlaying = !this.isPlaying;
    },
    stop() {
        const video = this.$refs.videoPlayer;
        video.pause();
        video.currentTime = 0;
        this.isPlaying = false;
    },
    toggleFullscreen() {
        const video = this.$refs.videoPlayer;
        if (video.requestFullscreen) {
        video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
        video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
        }
    },
    onPlay() {
        this.isPlaying = true;
    },
    onPause() {
        this.isPlaying = false;
    },
    onEnded() {
        this.isPlaying = false;
        this.$refs.videoPlayer.currentTime = 0;
    },
    },
};
</script>

<style scoped>
.video {
    width: 100%;
    height: 1200px;
} 

</style>
