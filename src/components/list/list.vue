<template>
    <div class="list">
        <div class="bg"><div></div></div>
        <div class="content" ref="viewBox">
            <div class="list-title" v-for="(item, index) in listData" :key="index">
                 <div @click="itemButton(item.id, index+1)" class="list-item" :style="{ 'background-image': 'url(' + bgObj1[index] + ')','background-repeat':'no-repeat','background-size':'100% 100%' }">
                    <div>{{item.title}}</div>
                    <div>{{item.content}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bg:{
                icon1: this.OSSIMG+ 'icon_bg01.png',
                icon2: this.OSSIMG+ 'icon_bg02.png',
                icon3: this.OSSIMG+ 'icon_bg03.png',
                icon4: this.OSSIMG+ 'icon_bg04.png',
                icon5: this.OSSIMG+ 'icon_bg05.png',
                icon6: this.OSSIMG+ 'icon_bg06.png',
                icon7: this.OSSIMG+ 'icon_bg07.png',
                icon8: this.OSSIMG+ 'icon_bg08.png',
                icon9: this.OSSIMG+ 'icon_bg09.png',
            },
            bgObj: [
                this.OSSIMG+ 'icon_bg01.png',
                this.OSSIMG+ 'icon_bg02.png',
                this.OSSIMG+ 'icon_bg03.png',
                this.OSSIMG+ 'icon_bg04.png',
                this.OSSIMG+ 'icon_bg05.png',
                this.OSSIMG+ 'icon_bg06.png',
                this.OSSIMG+ 'icon_bg07.png',
                this.OSSIMG+ 'icon_bg08.png',
                this.OSSIMG+ 'icon_bg09.png',
                this.OSSIMG+ 'icon_bg01.png',
                this.OSSIMG+ 'icon_bg02.png',
                this.OSSIMG+ 'icon_bg03.png',
                this.OSSIMG+ 'icon_bg04.png',
                this.OSSIMG+ 'icon_bg05.png',
                this.OSSIMG+ 'icon_bg06.png',
                this.OSSIMG+ 'icon_bg07.png',
                this.OSSIMG+ 'icon_bg08.png',
                this.OSSIMG+ 'icon_bg09.png',
            ],
            titleColor: ['#5395D3','#77CAEE','#F07883','#77CF9F','#AAAAAA','#DC917B','#F4C677','#BE83D2','#CBB593'],
            bgObj1: [],
            token: '',
            listData: [],
            page: 1,
        }
    },
    watch: {
        
    },
    mounted() {
        const that = this
        that.GetList()
    },
    methods: {
        //列表
        GetList(){
            $.ajax({
                url: this.urlHost + 'survival/list',
                type: 'post',
                data: {"access_token":this.token,"page":this.page,"rows":9},
                dataType: 'json',
                success: (res)=> {
                    if(res.success == "00000000"){
                        if(res.obj.data != null){
                            // console.log(res.obj.data)
                            this.bgObj1 = this.bgObj1.concat(this.bgObj)
                            this.listData = this.listData.concat(res.obj.data)
                            this.$refs.viewBox.addEventListener('scroll', this.EventFn, false)
                        }else{ 
                            // console.log('end')
                        }
                    }
                },
                error: (err)=>{
                    console.log(err)
                }
            })
        },
        //点击列表
        itemButton(id, index){
            let localData = {
                titleBg: this.titleColor[index % 9 - 1],
                id: id
            }
            localStorage.setItem('locaItemlist', JSON.stringify(localData))
            this.$router.push({
                path: '/itemlist'
            })
        },
        EventFn() {
            if ((this.$refs.viewBox.scrollTop + this.$refs.viewBox.offsetHeight) >= this.$refs.viewBox.scrollHeight) {
                this.page++;
                this.GetList();
            }
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
        background: url('https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_scjn.png');
        background-size: cover;
        width: 100%;
        height: 100%;
    }
    .content{
        position: absolute;
        overflow: auto;
        -webkit-overflow-scrolling:touch;    /* 用于 ios5+ */ 
        width: 100%;
        height: 100%;
    }
    .list-item{
        /* width: 90%; */
        margin: 3% 5% -3% 5%;
        padding: 1em 0;
        /* position: relative; */
        display: flex;
        flex-direction: column
    }
    .list-item div{
        width: 90%;
        margin: .3em auto;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .list-item div:nth-child(1){
        color: #fff;
        font-size: 1.1em
    }
    .list-item div:nth-child(2){
        color: rgba(255, 255, 255, .56);
        font-size: .9em;
    }
</style>
