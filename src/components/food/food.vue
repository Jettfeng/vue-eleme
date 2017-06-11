<template>
<div v-show="showFlag" class="food" transition="move" v-el:food>
  <div class="food-content">
    <div class="image-header">
      <img :src="food.image" alt="">
      <div @click="hide" class="back">
        <i class="icon-arrow_lift"></i>
      </div>
    </div>
    <div class="content">
      <h1 class="title">{{food.name}}</h1>
      <div class="detail">
        <span class="sell-count">月售{{food.sellCount}}份</span>
        <span class="rating">好评率{{food.rating}}%</span>
      </div>
      <div class="price">
        <span class="now">￥{{food.price}}</span>
        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
      </div>
      <div class="cartcontrol-wrapper">
        <cartcontrol :food="food"></cartcontrol>
      </div>
      <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count===0" transition="fade">加入购物车</div>
    </div>
    <split v-show="food.info"></split>
    <div class="info" v-show="food.info">
      <h1 class="title">商品信息</h1>
      <p class="text">{{food.info}}</p>
    </div>
    <split></split>

    <div class="rating">
      <h1 class="title">商品评价</h1>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul v-show="food.ratings && food.ratings.length">
          <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
              class="rating-item border-1px">
            <div class="user">
              <span class="name">{{rating.username}}</span>
              <img class="avatar" width="12" height="12" :src="rating.avatar">
            </div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
            <p class="text">
              <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
            </p>
          </li>
        </ul>
        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
//  如果是export function (){}，引用时需要加{}
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect';
  import split from 'components/split/split';

  const ALL = 2;
  export default {
      props: {
          food: {
              type: Object
          }
      },
      data() {
          return {
              showFlag: false,
              selectType: ALL,
              onlyContent: true,
              desc: {
                  all: '全部',
                  positive: '推荐',
                  negative: '吐槽'
              }
          };
      },
      methods: {
          show() {
              // 父组件可以调用子组件的方法，而子组件不能调用父组件的方法
              this.showFlag = true;
              this.selectType = ALL;
              this.onlyContent = true;
              this.$nextTick(() => {
                  if (!this.srcoll) {
                      this.scroll = new BScroll(this.$els.food, {
                          click: true
                    });
                  } else {
                      this.scroll.refresh();
                  }
              });
          },
          hide() {
            this.showFlag = false;
          },
          addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                this.$dispatch('cart.add', event.target);
//                把购物车的消失做成动画，不然小球会乱跑（因为获取不到event的位置）
                Vue.set(this.food, 'count', 1);
          },
          needShow(type, text) {
            if (this.onlyContent && !text) {
              return false;
            }
            if (this.selectType === ALL) {
              return true;
            } else {
              return type === this.selectType;
            }
          }
      },
      events: {
//        events接收子组件$dispatch派发的事件
//          监听子组件ratingselect组件中的ratingtype.select事件
        'ratingtype.select'(type) {
            this.selectType = type;
            this.$nextTick(() => {
              this.scroll.refresh();
            });
        },
        'content.toggle'(onlyContent) {
            this.onlyContent = onlyContent;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
      },
      filters: {
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
      },
      components: {
          cartcontrol,
          split,
          ratingselect
      }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
.food
  position: fixed
  left:0
  top: 0
  bottom: 48px
  z-index:30
  width: 100%
  background: #fff
  &.move-transition
    -webkit-transition: all 0.2s linear
    -moz-transition: all 0.2s linear
    -ms-transition: all 0.2s linear
    -o-transition: all 0.2s linear
    transition: all 0.2s linear
    transform:translate3d(0,0,0)
  &.move-enter,&.move-leave
    -webkit-transform: translate3d(100%,0,0)
    -moz-transform: translate3d(100%,0,0)
    -ms-transform: translate3d(100%,0,0)
    -o-transform: translate3d(100%,0,0)
    transform: translate3d(100%,0,0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff


  .content
    position: relative
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight:700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size:0
      .sell-count,.rating
        font-size: 10px
        color: rgb(147, 153, 159)
      .sell-count
        margin-left: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
  .cartcontrol-wrapper
    position: absolute
    right: 12px
    bottom: 12px
  .buy
    position: absolute
    right: 18px
    bottom: 18px
    z-index:10
    height: 24px
    line-height: 24px
    padding:0 12px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
    font-size: 10px
    -webkit-border-radius: 12px
    -moz-border-radius: 12px
    border-radius: 12px
    background: rgb(0, 160, 220)
    &.fade-transition
      transition: all 0.2s
      opacity: 1
    &.fade-enter, &.fade-leave
      opacity: 0

  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      line-height: 24px
      padding:0 8px
      font-size: 12px
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7, 17, 27)
    .rating-wrapper
      padding:0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-bottom:1px solid red
        .user
          position: absolute
          right:0
          top: 16px
          line-height: 12px
          font-size:0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147,153,159)
          .avatar
            -webkit-border-radius:50%
            -moz-border-radius:50%
            border-radius:50%

        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up,.icon-thumb_dowm
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_dowm
            color: rgb(147, 153, 159)

      .no-rating
        padding:16px 0
        font-size: 12px
        color: rgb(17, 153, 159)
</style>
