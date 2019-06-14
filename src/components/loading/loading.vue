<template>
    <div class="loading">
        <img :src="this.OSSIMG+'icon_send_loading.gif'" alt="">
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    }
}
</script>

<style lang="less" scoped>
    .loading{
        z-index: 1111;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 0 8px 8px 0;
        // background: rgba(255, 255, 255, .7);
        background: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 30px;
            height: 30px;
        }
    }
</style>
