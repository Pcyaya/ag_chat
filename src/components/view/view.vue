<template>
    <div class="">
        <div id="galley" class="imgs">
            <img v-show="false" v-for="(src, index) in images" :key="index" :src="src" alt="">
        </div>
    </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
    data() {
        return {
            viewer: '',
            images:[],
        }
    },
    created(){
        this.images = this.viewdata.imgs
    },
    mounted() {
        const self = this;
        var galley = document.getElementById('galley');
        this.viewer = new Viewer(galley, {
            hidden: ()=>{
                // this.viewer = ""
            }
        });
        this.viewer.view(this.viewdata.index);
    },
    watch: {

    },
    methods: {
        showImg(imgs,index){
            this.images = []
            this.images = imgs
            var galley = document.getElementById('galley');
            this.viewer = new Viewer(galley, {
                hidden: ()=>{
                    // this.viewer = ""
                }
            });
            this.viewer.view(index);
        }
    },
    props:[
        'viewdata'
    ]
}
</script>
