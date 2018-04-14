<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

    export default {
      props: {
        food: {
          type: Object
        }
      },
      methods: {
        addCart(event) {
          if(!event._constructed) {    //当发现在PC端点击事件会重复执行多次时，加上这条判断，否则不用加
            return;
          }
          //当food没有count这个字段时，添加该字段，并设置count为1；当有该字段时，让count++
          if(!this.food.count) {
            //由于food对象本身没有count字段，当想要添加一个字段时，可以用Vue.set(obj,key,value),它接受三个参数，要添加的对象、字段名、字段值
            Vue.set(this.food, 'count', 1);  //使用该set方法时，要先引入Vue
            this.food.count = 1;
          }else{
            this.food.count++;
          }
          this.$emit('add', event.target);
        },
        decreaseCart() {
          if(!event._constructed) {    //当发现在PC端点击事件会重复执行多次时，加上这条判断，否则不用加
            return;
          }
          if(this.food.count > 0) {
            this.food.count--;
          }else{
            this.food.count = 0;
          }
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .cart-control{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: 6px;
      opacity: 1;
      transform: translate3d(0, 0, 0);
      .inner{
        display: inline-block;
        line-height: 24px;
        font-size: 24px;
        color: rgb(0, 160, 220);
        transition: all 0.3s linear;
        transform: rotate(0);
      }
      &.move-enter-active, &.move-leave-active{
        transition: all 0.3s linear;
      }
      &.move-enter, &.move-leave-to{
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner{
          transform: rotate(180deg);
        }
      }
    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      padding-top: 6px;
      width: 12px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      color: rgb(147, 153, 159);
    }
    .cart-add{
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }
  }
</style>
