<template>
  <div class="main-second__sub">
    <div class="main-second__sub-left">
      <!-- ElementUI 导航栏 -->
      <el-tabs type="border-card" v-model="activeName">
        <!-- 问卷标签第一题 -->
        <el-tab-pane
          :name="itemquestion.title"
          v-for = "(itemquestion, indexquestion) in value.questions"
          :key="indexquestion"
        >
          <span slot="label">
            <i :class="itemquestion.icon"
              :style="{ color: itemquestion.color, fontSize: '14px', }">
            </i>
            {{itemquestion.title}}
          </span>
          <h2><span>{{ itemquestion.question }}</span>
            <el-input type="number" v-model = "itemquestion.total" disabled></el-input></h2>
            <!-- 问卷内容 -->
          <div class="el-tab-pane___content-div"
            v-for = "(item, index) in itemquestion.options"
            :key="index"
          >
            <p>
              <span>{{(index + 1) + '. ' + item.text}}</span>
              <el-input type = "number" :value = "item.question_id" disabled></el-input>
            </p>
            <el-slider show-stops :max = "10" v-model = "item.question_id"></el-slider>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-card class="main-second__sub-right" shadow="hover">
      <h2>答题说明</h2>
      <p>1. 本问卷共有七个部分，每部分有十项陈诉。每部分的总分是10分。
        请将10分分配给你认为最准确地描述你的行为和感觉的项目上。</p>
      <p>2. 你可以自由分配这10分，你认为哪一项越能反映你的行为或感受，就给这
      一项一个较高的分数;这10分既可以分别打给几项，也可以只打到一项上。</p>
      <p>3. 每部分的总分必须是10分。</p>
      <p :class="{ pclass: pclass }" style="margin-top: 80px;text-align:center;border:0;display:none;">
        <i class="el-icon-warning"></i>&nbsp;已提交过该问卷
      </p>
      <el-button
        :type="type"
        :disabled="isdisabled"
        :loading="loading"
        @click="submitData"
      >提交
      </el-button>
      <p style=" position: absolute; left: 20px;
        bottom: 20px;font-size: 14px; border-bottom: 0;
        text-align: center; color: green;"
      ><i class="el-icon-caret-left"></i>
        请将答案写在左侧"答题表"中
      </p>
    </el-card>
    <el-dialog
      title="网页错误"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>网页数据传输出现错误呢，请等等再提交吧!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitData('success')"
          :loading="loading"
        >确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'pageanswersub',
  data() {
    return {
      value: [],
      type: 'info',
      activeName: '第1题', // 默认显示第几题
      pclass: false,
      isdisabled: true,
      loading: false,
      centerDialogVisible: false,
    };
  },
  props: ['ruleForm'],
  created() {
    this.value = Object.assign({}, this.$store.state.answer.questions);
    this.value.questions.forEach((item, index) => {
      const updataitem = item;
      updataitem.title = `第${index + 1}题`;
      updataitem.total = 0;
      updataitem.icon = '';
      updataitem.color = '';
      updataitem.options.forEach((itemoptions) => {
        const grade = itemoptions;
        grade.question_id = 0;
      });
    });
  },
  watch: {
    value: {
      handler() { // value值发生改变 则每题总分发生变化
        this.value.questions.forEach((item) => {
          const iitem = item;
          iitem.total = item.options.reduce((n, itemitem) => {
            const total = n + itemitem.question_id;
            return total;
          }, 0);
          if (item.total > 10) {
            iitem.icon = 'el-icon-error';
            iitem.color = 'rgba(255,0,0,.8)';
            // this.$message({
            //   message: `请注意第${index + 1}题总分不能超过10分`,
            // });
          } else if (item.total === 10) {
            iitem.icon = 'el-icon-success';
            iitem.color = 'rgba(0,255,0,.8)';
          } else {
            iitem.icon = '';
          }
        });
        // 判断是否满足所有的total都为10
        let flag = true;
        this.value.questions.forEach((item) => {
          if (item.total !== 10) {
            flag = false;
          }
        });
        if (flag) {
          this.type = 'primary';
          this.isdisabled = false;
          this.$store.commit('subQuestion', {
            ruleForm: this.ruleForm,
            questions: this.value.questions,
          });
          if (this.pclass) {
            this.isdisabled = true;
          }
        } else {
          this.type = 'info';
          this.isdisabled = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    submitData(val) { // 提交
      this.loading = true;
      if (val === 'success') {
        this.centerDialogVisible = false;
      }
      // 提交数据给后台
      this.$ajax
        .post('/api/survey', this.$store.state.answer.personalpool)
        .then((res) => {
          if (res) {
            // 跳转到个人汇总界面
            this.$router.push({
              name: 'personalpool',
            });
            // 个人页面解封
            this.$emit('openList', 'ispersonalpool');
          } else {
            this.$message(`${res.message}`);
          }
        })
        .catch(() => {
          if (this.$store.state.answer.personalpool) {
            this.isdisabled = true;
            this.loading = false;
            this.pclass = true;
            return;
          }
          this.centerDialogVisible = true;
          this.loading = false; // 清空dialog的样式
        });
    },
  },
};
</script>

<style lang="stylus">
.pclass
  display block !important
  font-size 18px !important
  font-weight 600 !important
  color rgba(255,241,0,.8) !important
  text-shadow 0px 1px 1px black

.main-second__sub
  width 100%
  height 100%
  .main-second__sub-right
    float left
    position relative
    box-sizing border-box
    width 250px
    height calc(100% - 2px)
    margin-left 10px
    .el-button
      position absolute
      bottom 60px
      left 40px
      width calc(100% - 80px)
    h2
      color #606266
    p
      border-bottom 1px solid #cccccc
      margin-top 20px
      padding-bottom 5px
      font-family "微软雅黑"
      font-size 14px
      color #A6A9Ad
      text-align: justify;
      text-justify: inter-ideograph; /*IE*/
      span
       color rgba(255,0,0,.7)
  .main-second__sub-left
    float left
    width calc(100% - 250px - 10px)
    height 100%
    box-shadow -2px 2px 12px 0 rgba(0,0,0,.1)
    .el-tabs
      height calc(100% - 2px)
      .el-tabs__content
        height calc(100% - 40px - 30px)
        overflow scroll
        h2
          width 96%
          padding 0
          margin 0
          height 40px
          color #888888
          font-size 20px
          padding 10px 0 10px 2%
          .el-input
            float right
            width 50px
            .el-input__inner
              padding-right 0
        .el-tab-pane___content-div
          width 88%
          margin-left 6%
          p
            height 30px
            line-height 30px
            font-size 16px
            color #878889
            .el-input
              float right
              width 48px
              height 30px
              margin-top 15px
              .el-input__inner
                height 30px
                padding-right 0
          .el-slider
            width 70%
            margin-left 20px
</style>
