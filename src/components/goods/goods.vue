<template>
  <div>
    <div class="foods-root">
      <div class="menu-wrap" ref="menuWrap">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
            <span class="text">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrap" ref="foodsWrap">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item" @click="selectFood(food, $event)">
                <div class="icon">
                  <img :src="food.icon" alt="商品图片" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc">{{ food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span>
                    <span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{ food.price }}</span>
                    <span v-show="food.oldPrice" class="old">¥{{ food.oldPrice }}</span>
                  </div>
                  <div class="cart-control-wrap">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shop-cart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopCart from '../shopcart/shopcart'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import food from '../foodDetail/foodDetail'

    export default {
      components: {shopCart, cartcontrol, food},
      props: {
        seller: {
          type: Object
        }
      },
      data() {
        return {
          goods: [],
          listHeight: [],  //用来存放每个分类起始位置所在高度的数组
          scrollY: 0, //用来实时标记跟踪右侧滚动的位置
          selectedFood: {}
        }
      },
      computed: {
        currentIndex() {
          for(let i = 0; i < this.listHeight.length; i++) {
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i + 1];
            if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
              return i;
            }
          }
          return 0;
        },
        selectFoods() {
          let foods = [];
          this.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if(food.count) {
                foods.push(food);
              }
            })
          })
          return foods;
        }
      },
      created() {
        this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
        this.$http.get('api/goods').then((response) => {
          response = response.body;
          this.goods = response;
          //Vue在更新Dom时是一个异步的过程，上面this.goods=response虽然改变了数据，但此时dom并没有发生变化，如果不使用$nextTick，直接执行_initScroll()，那么此时初始化BScroll，对高度的计算就会有问题，导致列表不能滚动
          //$nextTick：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        })
      },
      methods: {
        _initScroll() {
          this.meunScroll = new BScroll(this.$refs.menuWrap,{
            click: true  //better-scroll 默认会阻止浏览器的原生 click 事件, click设置为true后，li绑定的点击事件就可以点击了
          });
          this.foodsScroll = new BScroll(this.$refs.foodsWrap,{
            probeType: 3, //3 表示scroll在滚动时能实时监测滚动的位置
            click: true
          });
          this.foodsScroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y));
          })
        },
        _calculateHeight() {
          let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
          let height = 0;
          this.listHeight.push(height);
          for(let i = 0; i < foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
        },
        selectMenu(index) {
          let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
          let el = foodList[index];
          this.foodsScroll.scrollToElement(el,500)
        },
        addFood(target) {
          this._drop(target);
        },
        _drop(target) {
          // 体验优化,异步执行下落动画
          this.$nextTick(() => {
            this.$refs.shopcart.drop(target);
          });
        },
        selectFood(food, event) {
          this.selectedFood = food;
          this.$refs.food.show();   //在父组件里直接调用子组件的show（）方法，需要先给相应的组件增加ref属性，通过this.$ref.name(ref的属性名来获取到该子组件节点，再调用子组件的方法)
        }
      }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../common/less/mixin";

  .foods-root{
    display: flex;
    position: absolute;
    top: 173px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrap{
      flex: 0 0 80px;
      width: 80px;
      .menu-item{
        display: table;
        padding: 0 12px;
        width: 56px;
        height: 54px;
        line-height: 14px;
        background: #f3f5f7;
        &.current{
          position: relative;
          z-index: 10;
          margin-right: -1px;
          background: #fff;
          font-weight: 700;
          .text{
            .border-none
          }
        }
        .icon{
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          &.decrease{
            .bg-image('decrease_3');
          }
          &.discount{
            .bg-image('discount_3');
          }
          &.guarantee{
            .bg-image('guarantee_3');
          }
          &.invoice{
            .bg-image('invoice_3');
          }
          &.special{
            .bg-image('special_3');
          }
        }
        .text{
          display: table-cell;
          vertical-align: middle;
          width: 56px;
          font-size: 12px;
          .border-1px(rgba(7, 17, 27, 0.1));
        }
      }
    }
    .foods-wrap{
      flex: 1;
      .title{
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item{
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        .border-1px(rgba(7, 17, 27, 0.1));
        &:last-child{
          .border-none;
          margin-bottom: 0;
        }
        .icon{
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content{
          flex: 1;
          .name{
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(7, 17, 27);
          }
          .desc, .extra{
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc{
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra{
            .count{
              margin-right: 12px;
            }
          }
          .price{
            font-weight: 700;
            line-height: 24px;
            font-size: 0;
            .now{
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old{
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .cart-control-wrap{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
