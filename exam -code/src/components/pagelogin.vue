<template>
  <div class="login">
      <div class="login_title">
        <span>管理员登录</span>
        <el-tooltip
          effect="dark"
          content="点击跳转至用户登录"
          placement="top"
        >
          <el-button round
            class="el-input__switch"
            @click= "adminChangeLogin"
            auto-complete="no"
          >用户登录
          </el-button>
        </el-tooltip>
      </div>
      <form class="login_fields">
        <!-- 账号 -->
        <el-input
          class="username"
          placeholder="员工工号"
          auto-complete="on"
          v-model="username"
          :class="username !== '' ? active : error"
        >
          <i slot="prefix" class="el-input__icon el-icon-bell"></i>
        </el-input>
        <!-- 密码 -->
        <el-input
          type="password"
          class="password"
          auto-complete="on"
          placeholder="账户密码"
          v-model="password"
          :class="password !== '' ? active : error"
        >
          <i slot="prefix" class="el-input__icon el-icon-view"></i>
        </el-input>
        <!-- 验证码 -->
        <el-input
          class="validata"
          placeholder="验证码"
          v-model="validata"
          :class="parseInt(validata) === validatameta ? active : error"
        >
          <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
          <!-- 验证码生成 -->
          <template slot="append">
            <div @click="validatametaClick">{{validatameta}}</div>
          </template>
        </el-input>
        <el-button round class="el-input__submit" @click = "adminLoginLogin">登录</el-button>
        <!-- <div class="el-input__reset">去官网&gt;&gt;</div> -->
      </form>
      <div class="disclaimer"><p>欢迎进入问卷品测系统</p></div>
  </div>
</template>

<script>
export default {
  name: 'pageloginadmin',
  data() {
    return {
      focus: false, // 选中某一元素时,给元素添加显示效果
      username: 'test',
      password: 'test',
      active: 'active', // 输入框内容正确时,赋予样式
      error: 'error', // 输入框错误时, 赋予样式
      validata: 1234,
      validatameta: 1234,
    };
  },
  methods: {
    adminLoginLogin() { // 点击登录按钮
      // 验证码
      if (parseInt(this.validata, 0) !== this.validatameta) {
        this.$message.error('验证码错误');
        return;
      }
      // 点击确认按钮后向/api/login发送请求 后端返回数据
      this.$ajax.post('/api/login', {
        username: this.username,
        password: this.password,
      })
        .then((response) => {
          // 判断是否登录成功
          if (response) {
            // 通过vuex的mutation来改变authorization的值
            this.$store.commit('getAuthorization', {
              authorization: response.headers.authorization,
            });
            // 路由跳转
            this.$router.push({
              name: 'totalpool',
            });
          }
        })
        .catch((error) => {
          // 请求失败页面弹出失败框
          if (error) {
            this.$message.error('用户或密码错误');
          }
        });
    },
    adminChangeLogin() { // 改变登录方式 --- 用户登录
      this.$router.push({
        path: '/answer/pageansweritem',
      });
    },
    validatametaClick() { // 验证码生成
      this.validatameta = Math.floor(Math.random() * 8999 + 1000);
    },
  },
};
</script>

<style lang="stylus">
  .active
    box-shadow 0px 0px 5px 0px rgba(255,255,255,.5)
  .error
    box-shadow 0px 0px 10px 0px rgba(255,0,0,1)
  .login
    position absolute
    top 0
    left 0
    width 300px
    height 410px
    padding: 60px 40px 40px 40px
    .login_title
        width 300px
        height 60px
        color #FFFFFF
        font-size 20px
        text-align left
        .el-input__switch
          padding 4px 8px 4px 8px
          margin-left 100px
          border 1px solid #ffffff
          background-color rgba(122,122,122,0)
          border-radius 4px
          color #ffffff
          transition all .5s linear
          &:hover
            color rgba(255,255,255,.8)
            border 1px solid rgba(0,0,0,0)
            box-shadow 0px 0px 5px 0px rgba(255,255,255,1)
            // background-color rgba(122,122,122,.5)
      .login_fields
        position absolute
        left 0
        box-sizing border-box
        padding 0 40px 0px 30px
        margin-top 10px
        width 380px
        height 278px
        background: linear-gradient(230deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .1) 100%);
        .username
        .password
        .validata
          width 310px
          margin-top 15px
          transition all .8s linear
          background-color rgba(0,0,0,0)
          &:hover
            box-shadow 0px 0px 10px 0px rgba(255,255,255,1)
          .el-input-group__append
            padding-left 20px
            background-color rgba(255,255,255,0)
            border 0
            font-size 18px
            font-weight 600
            letter-spacing 2px
            color #ffffff
            cursor pointer
            transition all .8s linear
            &:hover
              box-shadow 0px 0px 5px rgba(255, 255, 255,.4) inset
          .el-input__icon
            line-height 45px
            color #ffffff
          .el-icon-bell::before
          .el-icon-view::before
          .el-icon-mobile-phone::before
              font-size 16px
          .el-input__inner
            height 45px
            padding-left 35px
            background-color rgba(255,255,255,0)
            border 0px solid #ffffff
            color #fff
            font-size 16px
          .el-input__inner::-webkit-input-placeholder
            color #ffffff
        .el-input__submit
          position absolute
          left 30px
          bottom 0px
          width 310px
          height 45px
          border 1px solid rgba(255,255,255,.7)
          background-color rgba(0,0,0,0)
          color #fff
          font-size 16px
          letter-spacing 3px
          transition all 0.5s linear
          &:hover
            box-shadow 0px 0px 10px rgba(250,250,250,1)
        .el-input__reset
          position absolute
          right 35px
          bottom 0
          width 80px
          height 45px
          padding 0
          background-color rgba(0,0,0,0)
          color #ffffff
          font-size 16px
          letter-spacing 1px
          text-align center
          line-height 45px
          white-space nowrap
          cursor pointer
      .disclaimer
        position absolute
        bottom 20px
        left 30px
        width 250px
        height 20px
        p
          margin 0
          color #ffffff
          font-size 15px
          text-align left
</style>
