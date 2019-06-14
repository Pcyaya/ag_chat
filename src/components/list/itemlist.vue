<template>
    <div class="itemList">
        <div class="bg"><div></div></div>
        <div class="content" ref="viewBox">
            <div class="list-title">
                <div :style="{'background':locaData.titleBg}">{{infoData.title}}</div>
            </div>
            <div class="list-item">
                <div></div>
                <div>{{infoData.content}}</div>
            </div>
            <div class="list-item" v-for="(item, index) in infoData.capsules" :key="index">
                <div>{{item.item}}</div>
                <div>{{item.content}}</div>
            </div>
            <div class="state">声明 ： 该文来源于网络，不代表艾侗游的立场，艾侗游仅提供信息存储空间服务。</div>
            <!-- <div class="state-rel">声明 ： 该文来源于网络，不代表艾侗游的立场，艾侗游仅提供信息存储空间服务。</div> -->
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            locaData: {},
            infoData: {},
            flg: ''
        }
    },
    mounted() {
        const that = this
        that.locaData = JSON.parse(localStorage.getItem('locaItemlist'))
        if(that.$base.isAndroid()){
            //android
            that.GetDataInfo()
            android.toAndroid()
        }else{
            //ios
            that.GetDataInfo()
            that.$base.setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goSurviveDetail','锦囊详情', function responseCallback(responseData) {})
            })
        }
    },
    methods: {
        GetDataInfo() {
            $.ajax({
                url: this.urlHost + 'survival/info',
                type: 'post',
                data: {"id": this.locaData.id},
                dataType: 'json',
                success: (res)=> {
                    if(res.success === "00000000"){
                        this.infoData = res.obj
                        // console.log(this.infoData)
                    }
                },
                error: (err)=> {
                    
                }
            })
        },
        back() {
            this.$router.push({
                path: '/list'
            })
        }
    }
}
</script>


<style lang="less" scoped>
*::-webkit-scrollbar{
  width: 0px; 
}
    .bg{
        position: absolute;
        background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_scjn.png);
        background-size: cover;
        width: 100%;
        height: 100%;
    }
    
    .content{
        position: absolute;
        background-size: cover;
        overflow: auto;
        -webkit-overflow-scrolling:touch;    /* 用于 ios5+ */ 
        width: 100%;
        height: 100%;
        color: #fff;
    }
    .list-title{
        margin: 10% 0 7% 0;
    }
    .list-title div{
        display: inline;
        background: #5395D2;
        padding: .5em 10% .5em 5%;
        border-radius:0 50px 50px 0;
        box-shadow: 1px 1px 5px rgba(100, 100, 100, .5); 
    }
    .list-item{
        width: 90%;
        padding: .5em 0;
        margin: 0 auto;
        position: relative;
    }
    .list-item div:nth-child(1){
        font-size: 1.2em;
        margin-bottom: .2em;
    }
    .list-item div:nth-child(2){
        font-size: .95em;
        line-height: 1.5em;
    }
    .state{
        width: 120%;
        margin: 1em 0 1em -7%;
        font-size: 12px;
        transform: scale(0.75);
        color: #999;
    }
    .state-rel{
        position: absolute;
        bottom: 1em;
        width: 120%;
        margin: 1em 0 1em -7%;
        font-size: 12px;
        transform: scale(0.75);
        color: #999;
    }
</style>
