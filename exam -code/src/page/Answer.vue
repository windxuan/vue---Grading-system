<template>
  <div id="answer">
    <!-- 头部 -->
    <div class="header">
      <p>
        <img src="../assets/logo.jpg" />
        江苏远大信息股份有限公司<span style="font-size: 16px; color: green; padding: 0 4px 0 4px;">调查系统</span>
        <i class="el-icon-edit" style="font-size: 18px;"></i>
      </p>
      <!-- <span class="headerspan">{{this.user}}</span> -->
      <el-dropdown :hide-on-click="false" trigger="click">
        <span class="el-dropdown-link">
          欢迎,{{this.user}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <label for="setUser">
            <el-dropdown-item >
              <span id="setUser" @click="setUser">用户</span>
            </el-dropdown-item>
          </label> -->
          <label for="deletToken">
            <el-dropdown-item >
              <span id="deletToken" @click="deleteToken">退出</span>
            </el-dropdown-item>
          </label>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="avatar">
        <img src="../assets/timg.gif">
      </div>
    </div>
    <!-- 内容 -->
    <el-card
      shadow="hover"
      class="main"
    >
      <!-- 侧边栏 -->
      <div class="aside">
        <el-menu
          class="el-menu-vertical-demo"
          :default-openeds="nav.keypath"
          :default-active="nav.key"
          active-text-color="#303133"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>江苏远大信息公司</span>
            </template>
            <el-menu-item-group>
              <template slot="title">团队角色认知</template>
              <el-submenu index="1-1">
                <template slot="title">
                  <i class="el-icon-edit-outline"></i>问卷调查
                </template>
                <label for="pageansweritem">
                  <el-menu-item index="pageansweritem">
                    <i class="el-icon-document"></i>
                    <router-link
                      id="pageansweritem"
                      tag="button"
                      active-class="router-link-active"
                      :to="{ name: 'pageansweritem' }"
                      append
                    >问卷列表
                    </router-link>
                  </el-menu-item>
                </label>
                <label for="pageanswersub">
                  <el-menu-item index="pageanswersub" :disabled="isanswer">
                    <i class="el-icon-tickets"></i>
                    <router-link
                      id="pageanswersub"
                      active-class="router-link-active"
                      tag="button"
                      :class="isanswer ? 'cursor' : ''"
                      :to="{ name: 'pageanswersub' }"
                      :disabled="isanswer"
                      append
                    >答题界面
                    </router-link>
                  </el-menu-item>
                </label>
                <label for="personalpool">
                  <el-menu-item index="personalpool" :disabled="ispersonalpool">
                    <i class="el-icon-share"></i>
                    <router-link
                      id="personalpool"
                      tag="button"
                      :class="ispersonalpool ? 'cursor' : ''"
                      :to="{ name: 'personalpool' }"
                      :disabled="ispersonalpool"
                    >个人汇总
                    </router-link>
                  </el-menu-item>
                </label>
              </el-submenu>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <!-- 子路由跳转 -->
      <div class="pageanswerrouter">
        <router-view @openList = "openList" :ruleForm = 'ruleForm'/>
      </div>
    </el-card>
    <!-- 登录dialog框 -->
    <div class="userlogin" v-if="dialog">
      <!-- 遮罩层 -->
      <div class="logindialog" @click="removedialog" v-if="resetitem"></div>
      <!-- 内容 -->
      <el-dialog title="用户登录" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="员工工号" prop="worknumber">
            <el-input v-model="ruleForm.worknumber"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="员工性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="el-item-button">
            <el-button type="success" @click = "submitForm('ruleForm')" :loading="loading">保存</el-button>
            <el-button type="primary" @click = "resetForm('ruleForm')">重置</el-button>
            <el-button type="info"  @click = "changeMainShow">返回列表</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    // 获取token令牌
    this.$ajax.post('/api/login', {
      username: 'test',
      password: 'test',
    })
      .then((response) => {
        if (response) {
          // 通过vuex的mutation来存储authorization的值
          this.$store.commit('getAuthorization', {
            authorization: response.headers.authorization,
          });
        } else {
          this.$message('后台返回数据出现问题!');
        }
      })
      .catch((error) => {
        // 请求失败页面弹出失败框
        if (error) {
          this.$message.error('您的所在的地方信号较弱!!!');
        }
      });
  },
  data() {
    return {
      dialog: true,
      user: '未登录',
      hold: false, // 保存信息表单
      resetitem: true, // 遮罩层
      dialogFormVisible: false,
      loading: false,
      ruleForm: {
        name: '',
        worknumber: '',
        sex: '',
        date1: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入您的姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2-5个字' },
        ],
        worknumber: [
          { required: true, message: '请输入您的工号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3-5个字' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
        ],
      },
      isanswer: true, // 答题界面封印
      ispersonalpool: true, // 个人汇总封印
    };
  },
  computed: {
    nav() {
      return this.$store.state.answer.select;
    },
  },
  created() {
    // 根据vuex的数据判断是否由个人汇总页面回退
    if (this.$store.state.answer.personalpool) {
      // 判断是回退 信息记录dialog不显示,答题栏,人汇总栏--解封
      this.dialog = false;
      this.isanswer = false;
      this.ispersonalpool = false;
      // ruleform 与 回退前保持一致
      this.ruleForm = this.$store.state.answer.ruleForm;
    }
  },
  watch: {
    ruleForm: {
      handler() {
        this.user = this.ruleForm.name;
      },
      deep: true,
    },
  },
  methods: {
    openList(val) { // 列表子组件选中问卷后 对父组件的操作
      this[val] = false; // 问卷列表按钮解封
      this.$store.commit('openList');
    },
    setUser() { // 修改用户信息
      this.dialog = true;
      this.resetForm = false;
      this.dialogFormVisible = true;
      this.loading = false;
    },
    deleteToken() {
      this.$store.commit('deleteAuthorization');
      // this.$router.push({
      //   name: 'login',
      // });
      location.reload();
    },
    removedialog() { // 显示登录dialog
      // let flag = true; // 防止会电脑的小白瞎搞
      // Object.keys(this.ruleForm).forEach((key) => {
      //   if (this.ruleForm[key] !== '') {
      //     flag = false;
      //   }
      // });
      // if (flag) {
      this.dialogFormVisible = true;
      // }
    },
    changeMainShow() { // 返回列表按钮 点击隐藏dialog框
      this.dialogFormVisible = false;
    },
    submitForm(formName) { // 保存表单
      this.$refs[formName].validate((valid) => {
        if (valid) { // 保存成功
          this.resetitem = true; // 保存成功 数据封印
          this.loading = true;
          this.dialogFormVisible = false; // 关掉
          this.dialog = false; // 关掉遮罩
        }
      });
    },
    resetForm(formName) { // 重置表单
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus">
p
  margin 0
html
body
  background-color #F8f8f8

.router-link-active{
  color #409EFF
}
.cursor{
  cursor not-allowed !important
}

#answer
  position relative
  width 100%
  height 100%
  margin 0 auto
  .header
    position relative
    width 100%
    height 60px
    margin-bottom 4px
    line-height 60px
    font-weight 600
    background-color #ffffff
    box-shadow 1px 0px 10px 0px #888888
    p
      position absolute
      top 0
      left 5%
      color #303133
      font-size 20px
      letter-spacing 2px
      padding-left 60px
      height 60px
      img
        position absolute
        top 5px
        left 0
        width 50px
        height 50px
    .el-dropdown
      float right
      cursor pointer
      font-family "微软雅黑,华文宋体"
      font-size 13px
      letter-spacing 1px
      margin-right calc(4% + 40px + 5px + 2px)
    .avatar
      position absolute
      top 50%
      right 4%
      overflow hidden
      transform translateY(-50%)
      width 32px
      height 32px
      text-align center
      line-height 40px
      border-radius 50%
      box-shadow 0px 0px 4px 0px rgba(0,0,0,.7)
      img
        position absolute
        top -5px
        left -5px
        width 42px
        height 42px
  .main
    width 98%
    height calc(100% - 60px - 4px - 2px - 10px)
    margin 0 auto
    margin-bottom 10px
    .el-card__body
      position relative
      height calc(100% - 40px)
      .aside
        width 248px
        height 100%
        .el-menu
          width 100%
          height 100%
          button
            border 0
            background-color transparent
            cursor pointer
            outline none
      .pageanswerrouter
        position absolute
        top 20px
        left calc(248px + 20px + 20px - 10px)
        width calc(100% - 248px - 40px - 10px)
        height calc(100% - 40px)
  .userlogin
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    .logindialog
      height 100%
      width 100%
    .el-dialog
      width 400px
      .el-item-button
        width 290px
        margin 0 auto
</style>
