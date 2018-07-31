<template>
  <div id="box">
    <div class="bg_pic">
      <img src="../assets/login_bg.jpg" alt="" />
    </div>
    <pagelogin></pagelogin>
  </div>
</template>

<script>
import Pagelogin from '../components/pagelogin';

export default {
  name: 'login',
  components: {
    Pagelogin,
  },
};
</script>

<style lang='stylus'>
  #box
    position relative
    width 100%
    height 100%
    .bg_pic
      filter blur(2px)
      width 100%
      height 100%
      font-size 0
    .bg_pic img
      width 100%
      height 100%
    .login
      position absolute
      top 50%
      left 50%
      width 300px
      height 410px
      padding: 60px 40px 40px 40px
      margin -256px 0 0 -191px
      background-image url('../assets/login_bg.jpg')
      background-size 100% 100%
      background-position center
      background-attachment fixed
      border 1px solid #ffffff
      border-radius 20px
      box-shadow 0px 0px 5px 1px rgba(255,255,255,.5)
</style>
