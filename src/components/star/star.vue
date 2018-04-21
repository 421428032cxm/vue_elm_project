<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;  //代表一共有5颗星
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

    export default {
       props: {
         size: {
           type: Number
         },
         score: {
           type: Number
         }
       },
      computed: {
        starType() {
          return 'star-' + this.size
        },
        itemClasses() {
          let result = [];  //itemClasses肯定是个数组，所以这里先定义一个数组
          let score = Math.floor(this.score * 2) / 2;  //最终要显示的星的值
          let hasDecimal = score % 1 !== 0;  //判断是否有小数，如4.5星 hasDecimal用来控制是否有半星
          let integer = Math.floor(score);  //integer用来控制是否为全星
          //先填充全星
          for (let i = 0; i < integer; i++) {
            result.push(CLS_ON);
          }
          //如果存在半星，则填充一个半星，if要在for循环后再进行，因为半星最多只可能出现一次
          if(hasDecimal) {
            result.push(CLS_HALF);
          }
          //integer可能小于5，此时全星和半星填充完，剩下的要用空星补齐（因为一共要有5颗星）
          while(result.length < LENGTH) {
            result.push(CLS_OFF)
          }
          return result;  //最后返回result
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
 @import "../../common/less/mixin";

  .star{
    font-size: 0;
    .star-item{
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48{
      .star-item{
        width: 20px;
        height: 20px;
        margin-right: 22px;
        background-size: 20px 20px;
        &:last-child{
          margin-right: 0;
        }
        &.on{
          .bg-image('star48_on');
        }
        &.half{
          .bg-image('star48_half');
        }
        &.off{
          .bg-image('star48_off');
        }
      }
    }
    &.star-36{
      .star-item{
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child{
           margin-right: 0;
         }
        &.on{
          .bg-image('star36_on');
        }
        &.half{
          .bg-image('star36_half');
        }
        &.off{
          .bg-image('star36_off');
        }
      }
    }
    &.star-24{
      .star-item{
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child{
          margin-right: 0;
        }
        &.on{
          .bg-image('star24_on');
        }
        &.half{
          .bg-image('star24_half');
        }
        &.off{
          .bg-image('star24_off');
        }
      }
    }
  }
</style>
