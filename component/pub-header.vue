<template>
  <div id="pub-header">
    <div class="head-title">
      <div class="back back-btn" @click="goBackHandler()">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596606010934&di=d5bedc71c593eb4d9bff8d100a63c65d&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F39%2F84%2F84573cd8a135d3a.jpg" alt />
      </div>
      <div class="header-center">
        <slot name="center"></slot>
      </div>
      <div class="header-right" @click="jumpToRecodes()">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pub-header",
  methods: {
    goBackHandler() {
      this.$emit("back");
    },
    jumpToRecodes(){
      this.$emit("recodes")
    }
  }
};
</script>
<style>
#pub-header{
  width: 100%;
}
.head-title{
    font-weight: 600;
    font-size: 0.34rem;
    color: #212121;
    opacity: 0.9;
    text-align: center;
    padding: 1.12rem 0.6rem 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.back-btn{
    width: 1.2rem;
    text-align: left;
}
.head-title img{
    width: 0.12rem;
    height: 0.24rem;
}
.header-right{
    width: 1.2rem;
    color: var(--c);
    font-size: 0.28rem;
}
</style>
