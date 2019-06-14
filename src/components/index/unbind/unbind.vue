<template>
  <div class="ubbind">
    <div>
      <div>绑定手机号才能获取更多操作哦！</div>
      <div @click="openType = true">立即绑定</div>
    </div>
    <phonebind v-if="openType" @unbindType="getUnbindType"></phonebind>
  </div>
</template>

<script>
import phonebind from './../../phonebind/phonebind'
export default {
    data(){
        return {
            openType: false
        }
    },
    methods: {
        getUnbindType(flg){
            this.openType = flg
        }
    },
    components: {
        phonebind
    }
};
</script>

<style lang="less">
.ubbind {
  position: relative;
  background: #f7f7f7;
  height: 100%;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  > div:nth-child(1) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    >div:nth-child(1){
        font-size: 90%;
        color: #999;
    }
    >div:nth-child(2){
        color: #666;
        border: 1px solid #aaa;
        margin-top: 20px;
        padding: 5px 100px;
        border-radius: 4px;
        cursor: pointer;
        transition: .1s;
        &:hover{
            background: #3A9CF7;
            color: #fff;
            border-color: #3A9CF7;
            box-shadow: 1px -1px 10px rgba(0, 0, 0,.2);
            transition: .1s;
        }
    }
  }
}
</style>
