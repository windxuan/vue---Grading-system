<template>
  <div class="el-main__box">
    <div class="el-main__title">
      <i style="font-size: 24px" class="el-icon-share"></i>
      <span>&nbsp;已进入</span><span style="font-weight: 700; cursor: pointer;">问卷列表模块</span>
      <p style="float: right;">请选中需要的调查问卷！</p>
    </div>
    <div class="table">
      <el-table
        ref="singleTable"
        :data="tabledata.slice((currentPage-1)*pagesize, currentPage*pagesize)"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="编号"
          property="id"
          width = "80">
        </el-table-column>
        <el-table-column
          property="created_at"
          label="开始日期"
          min-width="160">
        </el-table-column>
        <el-table-column
          property="updated_at"
          label="更新日期"
          min-width="160">
        </el-table-column>
        <el-table-column
          property="name"
          label="问卷信息"
          min-width="170">
        </el-table-column>
        <el-table-column
          property="show"
          label="测评方向">
        </el-table-column>
        <el-table-column
          property="desc"
          label="类型">
        </el-table-column>
        <el-table-column
          label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click = "setCurrent(scope.row)" :disabled="isdisabled">选中</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确认选择该问卷吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toPageanswersub" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.tabledata.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pageansweritem',
  data() {
    return {
      data: [],
      dialogVisible: false, // dialog框的显示隐藏
      loading: false, // dialog确认按钮的加载效果
      currentPage: 1, // 分页页数
      pagesize: 5, // 每页数据条数
      tabledata: [], // 列表数据
      isdisabled: false,
      row: '', // 存储用户的选中操作,选中列表中的某一行
      surveyur: '', // 存储 生成问卷的url
    };
  },
  props: ['ruleForm'],
  created() {
    // DOM渲染之前获取列表数据
    this.$ajax.get('/api/survey')
      .then((res) => { // 有数据返回
        if (res) { // 此步判断返回的数据是否正确
          this.tabledata = res.data.data;
        } else {
          this.message('加载的页面没有数据呢,刷新一下吧!!!');
        }
      })
      .catch(() => {
        this.$message('404'); // 跳转到页面404
      });
  },
  methods: {
    setCurrent(row) { // 选中列表的某一行
      this.loading = false; // 清空dialog框的加载状态
      this.row = row; // 目的是为了将用户的操作传递给dialog框
      // 通过遍历父组件传递过来的个人信息数据 判断是否为空决定该按钮是否可以被点击
      let flag = true;
      Object.keys(this.ruleForm).forEach((key) => {
        if (this.ruleForm[key] === '') {
          flag = false;
        }
      });
      if (!flag) {
        this.isdisabled = true;
        return;
      }
      this.dialogVisible = true; // 显示dialog框
    },
    updataToken() { // 刷新token
      this.$ajax.post('/api/refresh-token', null, {
        headers: {
          Authorization: `Bearer${this.$store.state.authorization}`,
        },
      })
        .then((res) => {
          // 通过vuex的mutation来改变authorization的值
          this.$store.commit('getAuthorization', {
            authorization: res.headers.authorization,
          });
          this.toPageanswersub();
        });
    },
    handleSizeChange(size) { // 决定每页多少条数据
      this.pagesize = size;
    },
    handleCurrentChange(current) { // 决定显示第几页数据
      this.currentPage = current;
    },
    handleClose(done) { // 点击dialog框中的‘X’按钮触发事件
      done();
    },
    toPageanswersub() { // 点击dialog框确认按钮
      this.loading = true;
      // 选中某一行时,进行获取url --- 解决bug1(详情见text.txt)
      this.$ajax.get('/api/url/generate',
        {
          headers: {
            Authorization: `Bearer${this.$store.state.authorization}`,
          },
          params: {
            survey_id: this.row.id,
            num: 1,
          },
        })
        .then((response) => {
          if (response) { // 判断数据是否是我们需要的
            this.surveyur = response.data[0]; // 获取问卷列表 url
            this.$store.commit('keepSurveyur', {
              surveyur: this.surveyur,
            });
            // 生成问卷内容
            this.$ajax.get(`/api/${this.surveyur}`)
              .then((rep) => { // 获取数据
                if (rep) {
                  // 数据提交到vuex,方便兄弟子组件获取 答题数据 ,后跳转到答题界面
                  this.$store.commit('changeMainShow', rep.data);
                  this.$router.push({
                    name: 'pageanswersub',
                  });
                  // 解封父组件导航区的问卷列表栏
                  this.$emit('openList', 'isanswer');
                } else {
                  this.$message({
                    message: '网页好像出了点小问题呢! 过两分钟再试试!!!',
                    type: 'info',
                  });
                }
              })
              .catch(() => {
                this.dialogVisible = false;
                this.$message({
                  message: '网页好像出了点小问题呢! 过两分钟再试试!!!',
                  type: 'info',
                });
              });
          } else {
            this.$message('后台数据返回错误');
          }
        })
        .catch(() => {
          this.updataToken(); // 刷新token
        });
    },
  },
};
</script>

<style lang="stylus">
  .el-main__box
    width 100%
    height 100%
    overflow hidden
    .el-main__title
      height 60px
      line-height 60px
      border-bottom 1px solid #e6e6e6
      margin-bottom 20px
      color #303133
      padding 0 20px 0 20px
      font-size 14px
    .table
      height calc(100% - 80px - 55px)
      padding 0 20px 0 20px
      border-radius 10px 10px 0 0
      text-align center
      overflow auto
      .el-table__header-wrapper
        .el-table__header th
          padding-top 20px
          padding-bottom 20px
          .cell
            text-align center
    .el-pagination
      text-align center
      padding-top 25px
</style>
