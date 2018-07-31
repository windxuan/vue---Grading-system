<template>
  <div class="hello">
    <el-container>
      <el-header>
          <div class="container">
            <img src="../assets/logo.jpg" />
            <span style="font-size: 25px;">江苏远大信息股份有限公司
              <span style="font-size: 16px; color: green; padding: 0 4px 0 4px;">调查系统管理员界面</span>
              <i class="el-icon-edit" style="font-size: 18px;"></i>
            </span>
          </div>
          <span class="title">{{surveyName}}</span>
          <el-button class="signOutBtn" type="primary" v-on:click="backToLogin">退出</el-button>
      </el-header>
      <el-main>
        <el-input
          v-show = "inputShow"
          placeholder="请输入员工姓名或编号"
          prefix-icon="el-icon-search"
          v-model="input"
          @keyup.enter.native="searchStaff"
          clearable>
        </el-input>
        <el-table
          v-show = "surveyDataShow"
          v-loading="surveyDataLoading"
          ref="singleTable"
          :data="surveyData.slice((surveyCurrentPage-1)*surveyPageSize,surveyCurrentPage*surveyPageSize)"
          highlight-current-row
          border
          style="width: 100%;height: 100%;margin-left: auto; margin-right: auto;text-align: center;"
          height="595"
          :default-sort = "{prop: 'date', order: 'descending'}">
          <el-table-column
            label="编号"
            property="id"
            style="text-align: center;"
            header-align=center
            sortable>
          </el-table-column>
          <el-table-column
            property="created_at"
            label="创建日期"
            header-align=center
            style="text-align: center;"
            sortable>
          </el-table-column>
          <el-table-column
            property="updated_at"
            label="更新日期"
            style="text-align: center;"
            header-align=center
            sortable>
          </el-table-column>
          <el-table-column
            property="name"
            label="问卷名称"
            style="text-align: center;"
            header-align=center>
          </el-table-column>
          <el-table-column
            property="show"
            label="测评方向"
            style="text-align: center;"
            header-align=center
            sortable>
          </el-table-column>
          <el-table-column
            property="desc"
            label="类型"
            style="text-align: center;"
            header-align=center
            sortable>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align=center>
              <template slot-scope="scope">
                <el-button @click = "getTargetSurvey(scope.row)">详情</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show = "tableDataShow"
          v-loading="tableDataLoading"
          :data="tableData.slice((staffCurrentPage-1)*staffPageSize,staffCurrentPage*staffPageSize)"
          border
          style="height: 100%;margin-left: auto; margin-right: auto;text-align: center;"
          height="595"
          :default-sort = "{prop: 'date', order: 'descending'}"
          ref="mainTable">
          <el-table-column
            fixed
            width="200"
            :render-header="backBtn">
            <el-table-column
              fixed
              prop="staffID"
              label="员工编号"
              style="text-align: center;"
              header-align=center
              sortable
              width="110">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              header-align=center
              sortable
              width="90">
            </el-table-column>
          </el-table-column>
          <el-table-column
            fixed
            prop="evalSummit"
            width="180"
            header-align=center
            label="总评">
            <template slot-scope="scope">
              <el-tag
              type="primary">
              {{getSummitEval(scope.row.Number)}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="智多星(PL)"
            header-align=center>
            <el-table-column
              prop="scorePL"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalPL"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagPL"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scorePL)">
                {{getEval(scope.row.scorePL)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="外联者(RI)"
            header-align=center>
            <el-table-column
              prop="scoreRI"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalRI"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagRI"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreRI)">
                {{getEval(scope.row.scoreRI)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="协调者(CO)"
            header-align=center>
            <el-table-column
              prop="scoreCO"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalCO"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagCO"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreCO)">
                {{getEval(scope.row.scoreCO)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="鞭策者(SH)"
            header-align=center>
            <el-table-column
              prop="scoreSH"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalSH"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagSH"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreSH)">
                {{getEval(scope.row.scoreSH)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="监督者(ME)"
            header-align=center>
            <el-table-column
              prop="scoreME"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalME"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagME"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreME)">
                {{getEval(scope.row.scoreME)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="凝聚者(TW)"
            header-align=center>
            <el-table-column
              prop="scoreTW"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalTW"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagTW"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreTW)">
                {{getEval(scope.row.scoreTW)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="实干者(IM)"
            header-align=center>
            <el-table-column
              prop="scoreIM"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalIM"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagIM"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreIM)">
                {{getEval(scope.row.scoreIM)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="善始善终者(CF)"
            header-align=center>
            <el-table-column
              prop="scoreCF"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              prop="evalCF"
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagCF"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                :type="getType(scope.row.scoreCF)">
                {{getEval(scope.row.scoreCF)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="专家(SP)"
            header-align=center>
            <el-table-column
              prop="scoreSP"
              label="分数"
              width="75"
              header-align=center
              sortable>
            </el-table-column>
            <el-table-column
              label="评价"
              width="75"
              header-align=center
              :filters="[{ text: '优秀', value: '优秀' }, { text: '良好', value: '良好' }, { text: '一般', value: '一般' }, { text: '较差', value: '较差' }]"
              :filter-method="filterTagSP"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                prop="evalSP"
                :type="getType(scope.row.scoreSP)">
                {{getEval(scope.row.scoreSP)}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="时间"
            prop="createTime"
            width="160"
            header-align=center
            sortable>
          </el-table-column>
          <el-table-column
            v-if="numberShow"
            label="序号"
            prop="Number"
            width="40"
            header-align=center
            sortable>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show = "surveyGuideShow"
          @size-change="handleSizeChangeSurvey"
          @current-change="handleCurrentChangeSurvey"
          :current-page="surveyCurrentPage"
          :page-sizes="[8, 16, 32]"
          :page-size="surveyPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="surveyTotalCount">
        </el-pagination>
        <el-pagination
          v-show = "staffGuideShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="staffCurrentPage"
          :page-sizes="[8, 16, 32, 64]"
          :page-size="staffPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="staffTotalCount">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'totalpool',
  data() {
    return {
      tableData: [],
      storeData: [],
      tableDataShow: false,
      surveyData: [],
      surveyDataShow: true,
      surveyPageSize: 8,
      staffPageSize: 8,
      surveyCurrentPage: 1,
      staffCurrentPage: 1,
      surveyTotalCount: 0,
      staffTotalCount: 0,
      surveyName: '问卷列表',
      surveyID: '',
      tableDataLoading: false,
      surveyDataLoading: true,
      surveyGuideShow: true,
      staffGuideShow: false,
      numberShow: false,
      input: '',
      inputShow: false,
    };
  },
  created() {
    this.getSurveyData();
  },
  methods: {
    searchStaff() {
      this.staffCurrentPage = 1;
      let arr = this.storeData.slice(0);
      this.tableData.splice(0, this.tableData.length);
      let j = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === this.input || arr[i].staffID === this.input) {
          // 将解析后的数据压入表中
          this.tableData.push({
            id: arr[i].id,
            staffID: arr[i].staffID,
            name: arr[i].name,
            scorePL: arr[i].scorePL,
            scoreRI: arr[i].scoreRI,
            scoreCO: arr[i].scoreCO,
            scoreSH: arr[i].scoreSH,
            scoreME: arr[i].scoreME,
            scoreTW: arr[i].scoreTW,
            scoreIM: arr[i].scoreIM,
            scoreCF: arr[i].scoreCF,
            scoreSP: arr[i].scoreSP,
            createTime: arr[i].createTime,
            Number: j,
          });
          j++;
        } else if (this.input === '') {
          this.tableData = this.storeData.slice(0);
        }
      }
      this.staffTotalCount = this.tableData.length;
    },
    backToLogin() {
      this.$store.commit('deleteAuthorization');
      this.$router.push({
        name: 'login',
      });
    },
    backBtn() { // 返回按钮
      return (
        <div>
          <el-button onClick={this.backSurveyData}>返回</el-button>
          <el-button type='primary' onClick={this.getData}>刷新</el-button>
        </div>
      );
    },
    backSurveyData() { // 返回按钮函数
      this.tableDataShow = false;
      this.surveyDataShow = true;
      this.staffGuideShow = false;
      this.surveyGuideShow = true;
      this.surveyName = '问卷列表';
      this.surveyID = '';
      this.inputShow = false;
    },
    getSurveyData() { // 获取问卷列表
      this.$ajax.get('/api/survey')
        .then((response) => {
          this.surveyData = response.data.data;
          this.surveyDataLoading = false;
          this.surveyTotalCount = this.surveyData.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTargetSurvey(row) { // 获取目标问卷结果汇总
      // console.log(this.tableDataLoading);
      this.tableDataShow = true;
      this.surveyDataShow = false;
      this.staffGuideShow = true;
      this.surveyGuideShow = false;
      this.surveyID = row.id;
      this.getData();
      this.surveyName = row.name;
      this.inputShow = true;
    },
    getData() { // 获取后台数据
      let id = this.surveyID;
      // console.log(this.surveyID);
      this.tableDataLoading = true;
      this.tableData.splice(0, this.tableData.length);
      this.$ajax.get('/api/survey/summary', {
        headers: {
          Authorization: `Bearer${this.$store.state.authorization}`,
        },
      })
        .then((response) => {
          // console.log(response);
          this.tableDataLoading = false;
          this.pushData(response, id);
        })
        .catch((response) => {
          console.log(response);
        });
    },
    handleSizeChangeSurvey(val) { // 改变每页显示条数
      // console.log(`每页 ${val} 条`);
      this.surveyPageSize = val;
    },
    handleCurrentChangeSurvey(val) { // 改变当前页码
      // console.log(`当前页: ${val}`);
      this.surveyCurrentPage = val;
    },
    handleSizeChange(val) { // 改变每页显示条数
      // console.log(`每页 ${val} 条`);
      this.staffPageSize = val;
    },
    handleCurrentChange(val) { // 改变当前页码
      // console.log(`当前页: ${val}`);
      this.staffCurrentPage = val;
    },
    getType(number) { // 设置标签样式函数
      for (let i = 0; i < this.tableData.length; i++) {
        if (number >= 85) {
          return 'primary';
        } else if (number < 85 && number >= 50) {
          return 'success';
        } else if (number < 50 && number >= 20) {
          return 'warning';
        }
        return 'danger';
      }
      return 'danger';
    },
    getEval(number) { // 设置每个分数评价函数
      for (let i = 0; i < this.tableData.length; i++) {
        if (number >= 85) {
          return '优秀';
        } else if (number < 85 && number >= 50) {
          return '良好';
        } else if (number < 50 && number >= 20) {
          return '一般';
        }
        return '较差';
      }
      return '较差';
    },
    getSummitEval(id) { // 设置最后评价汇总函数
      // console.log(id);
      let evalAll = '';
      const arr = [];
      arr.push(this.getEval(this.tableData[id].scorePL),
        this.getEval(this.tableData[id].scoreRI),
        this.getEval(this.tableData[id].scoreCO),
        this.getEval(this.tableData[id].scoreSH),
        this.getEval(this.tableData[id].scoreME),
        this.getEval(this.tableData[id].scoreTW),
        this.getEval(this.tableData[id].scoreIM),
        this.getEval(this.tableData[id].scoreCF),
        this.getEval(this.tableData[id].scoreSP));
      let test = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '优秀') {
          test = true;
        }
      }
      if (test) {
        if (this.getEval(this.tableData[id].scorePL) === '优秀') {
          evalAll += ' 智多星';
        }
        if (this.getEval(this.tableData[id].scoreRI) === '优秀') {
          evalAll += ' 外联者';
        }
        if (this.getEval(this.tableData[id].scoreCO) === '优秀') {
          evalAll += ' 协调者';
        }
        if (this.getEval(this.tableData[id].scoreSH) === '优秀') {
          evalAll += ' 鞭策者';
        }
        if (this.getEval(this.tableData[id].scoreME) === '优秀') {
          evalAll += ' 监督者';
        }
        if (this.getEval(this.tableData[id].scoreTW) === '优秀') {
          evalAll += ' 凝聚者';
        }
        if (this.getEval(this.tableData[id].scoreIM) === '优秀') {
          evalAll += ' 实干者';
        }
        if (this.getEval(this.tableData[id].scoreCF) === '优秀') {
          evalAll += ' 善始善终者';
        }
        if (this.getEval(this.tableData[id].scoreSP) === '优秀') {
          evalAll += ' 专家';
        }
      } else {
        evalAll = '该员工还需继续努力！';
      }
      return evalAll;
    },
    pushData(response, id) { // 将数据压入表格
      const map = {}; // 用于区分不同员工
      const staffData = []; // 分类后的员工数据
      // 遍历所有题目分数，并按照员工ID对结果进行分组
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].survey_id === id) {
          const singleData = response.data[i]; // 后台获取的的单条数据，对应问卷的一个角色得分
          if (!map[singleData.staff.staff_no]) { // 如果map中不存在当前员工，就压入员工的数据
            staffData.push({
              staffName: singleData.staff.name,
              staffID: singleData.staff.staff_no,
              surverID: singleData.survey_id,
              data: [singleData],
            });
            map[singleData.staff.staff_no] = singleData;
          } else { // 若map中存在当前员工，则将当前角色的分数加入该员工的数据中
            for (let j = 0; j < staffData.length; j++) {
              const singleStaffData = staffData[j];
              if (singleStaffData.staffID === singleData.staff.staff_no) {
                singleStaffData.data.push(singleData);
                break;
              }
            }
          }
        }
      }
      // console.log(staffData);
      // 按每个员工遍历解析后的数据
      let i = staffData.length;
      for (let n = 0; n < staffData.length; n++) {
        let pl = 0;
        let ri = 0;
        let co = 0;
        let sh = 0;
        let me = 0;
        let tw = 0;
        let im = 0;
        let cf = 0;
        let sp = 0;
        let time = '';
        const currentStaffData = staffData[n].data; // 当前员工数据
        // console.log(staffData[n].data.length);
        // 遍历每个员工的所有分数，将分数进行赋值
        for (let j = 0; j < currentStaffData.length; j++) {
          const dataScore = staffData[n].data[j];
          // console.log(dataScore);
          time = dataScore.staff.created_at;
          if (dataScore.code === 'PL') {
            pl = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'RI') {
            ri = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'CO') {
            co = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'SH') {
            sh = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'ME') {
            me = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'TW') {
            tw = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'IM') {
            im = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'CF') {
            cf = parseInt(dataScore.score, 10);
          }
          if (dataScore.code === 'SP') {
            sp = parseInt(dataScore.score, 10);
          }
        }
        i--;
        // 将解析后的数据压入表中
        this.tableData.push({
          id: n,
          staffID: staffData[n].staffID,
          name: staffData[n].staffName,
          // scorePL: pl,
          scorePL: this.calculatorPL(pl),
          scoreRI: this.calculatorRI(ri),
          scoreCO: this.calculatorCO(co),
          scoreSH: this.calculatorSH(sh),
          scoreME: this.calculatorME(me),
          scoreTW: this.calculatorTW(tw),
          scoreIM: this.calculatorIM(im),
          scoreCF: this.calculatorCF(cf),
          scoreSP: this.calculatorSP(sp),
          createTime: time,
          Number: i,
        });
      }
      this.tableData = this.tableData.reverse();
      this.storeData = this.tableData.slice(0);
      this.staffTotalCount = staffData.length;
      // console.log(this.tableData);
    },
    filterTagPL(value, row) {
      return this.getEval(row.scorePL) === value;
    },
    filterTagRI(value, row) {
      return this.getEval(row.scoreRI) === value;
    },
    filterTagCO(value, row) {
      return this.getEval(row.scoreCO) === value;
    },
    filterTagSH(value, row) {
      return this.getEval(row.scoreSH) === value;
    },
    filterTagME(value, row) {
      return this.getEval(row.scoreME) === value;
    },
    filterTagTW(value, row) {
      return this.getEval(row.scoreTW) === value;
    },
    filterTagIM(value, row) {
      return this.getEval(row.scoreIM) === value;
    },
    filterTagCF(value, row) {
      return this.getEval(row.scoreCF) === value;
    },
    filterTagSP(value, row) {
      return this.getEval(row.scoreSP) === value;
    },
    calculatorPL(val) {
      if (val >= 15) {
        const v = 95;
        return v;
      }
      if (val === 14) {
        const v = 93;
        return v;
      }
      if (val === 13) {
        const v = 92;
        return v;
      }
      if (val === 12) {
        const v = 90;
        return v;
      }
      if (val === 11) {
        const v = 86;
        return v;
      }
      if (val === 10) {
        const v = 84;
        return v;
      }
      if (val === 9) {
        const v = 82;
        return v;
      }
      if (val === 8) {
        const v = 75;
        return v;
      }
      if (val === 7) {
        const v = 64;
        return v;
      }
      if (val === 6) {
        const v = 53;
        return v;
      }
      if (val === 5) {
        const v = 45;
        return v;
      }
      if (val === 4) {
        const v = 38;
        return v;
      }
      if (val === 3) {
        const v = 25;
        return v;
      }
      if (val === 2) {
        const v = 16;
        return v;
      }
      if (val === 1) {
        const v = 8;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorRI(val) {
      if (val >= 15) {
        const v = 95;
        return v;
      }
      if (val === 14) {
        const v = 90;
        return v;
      }
      if (val === 13) {
        const v = 86;
        return v;
      }
      if (val === 12) {
        const v = 83;
        return v;
      }
      if (val === 11) {
        const v = 77;
        return v;
      }
      if (val === 10) {
        const v = 71;
        return v;
      }
      if (val === 9) {
        const v = 66;
        return v;
      }
      if (val === 8) {
        const v = 58;
        return v;
      }
      if (val === 7) {
        const v = 49;
        return v;
      }
      if (val === 6) {
        const v = 38;
        return v;
      }
      if (val === 5) {
        const v = 32;
        return v;
      }
      if (val === 4) {
        const v = 23;
        return v;
      }
      if (val === 3) {
        const v = 16;
        return v;
      }
      if (val === 2) {
        const v = 7;
        return v;
      }
      if (val === 1) {
        const v = 3;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorCO(val) {
      if (val >= 16) {
        const v = 95;
        return v;
      }
      if (val === 15) {
        const v = 93;
        return v;
      }
      if (val === 14) {
        const v = 91;
        return v;
      }
      if (val === 13) {
        const v = 90;
        return v;
      }
      if (val === 12) {
        const v = 86;
        return v;
      }
      if (val === 11) {
        const v = 82;
        return v;
      }
      if (val === 10) {
        const v = 80;
        return v;
      }
      if (val === 9) {
        const v = 72;
        return v;
      }
      if (val === 8) {
        const v = 64;
        return v;
      }
      if (val === 7) {
        const v = 55;
        return v;
      }
      if (val === 6) {
        const v = 48;
        return v;
      }
      if (val === 5) {
        const v = 29;
        return v;
      }
      if (val === 4) {
        const v = 19;
        return v;
      }
      if (val === 3) {
        const v = 11;
        return v;
      }
      if (val === 2) {
        const v = 6;
        return v;
      }
      if (val === 1) {
        const v = 3;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorSH(val) {
      if (val >= 22) {
        const v = 95;
        return v;
      }
      if (val >= 21) {
        const v = 93;
        return v;
      }
      if (val >= 20) {
        const v = 92;
        return v;
      }
      if (val >= 19) {
        const v = 89;
        return v;
      }
      if (val >= 18) {
        const v = 87;
        return v;
      }
      if (val >= 17) {
        const v = 86;
        return v;
      }
      if (val >= 16) {
        const v = 83;
        return v;
      }
      if (val >= 15) {
        const v = 79;
        return v;
      }
      if (val === 14) {
        const v = 75;
        return v;
      }
      if (val === 13) {
        const v = 71;
        return v;
      }
      if (val === 12) {
        const v = 64;
        return v;
      }
      if (val === 11) {
        const v = 55;
        return v;
      }
      if (val === 10) {
        const v = 50;
        return v;
      }
      if (val === 9) {
        const v = 45;
        return v;
      }
      if (val === 8) {
        const v = 36;
        return v;
      }
      if (val === 7) {
        const v = 30;
        return v;
      }
      if (val === 6) {
        const v = 23;
        return v;
      }
      if (val === 5) {
        const v = 18;
        return v;
      }
      if (val === 4) {
        const v = 12;
        return v;
      }
      if (val === 3) {
        const v = 6;
        return v;
      }
      if (val === 2) {
        const v = 4;
        return v;
      }
      if (val === 1) {
        const v = 1;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorME(val) {
      if (val >= 13) {
        const v = 94;
        return v;
      }
      if (val === 12) {
        const v = 92;
        return v;
      }
      if (val === 11) {
        const v = 89;
        return v;
      }
      if (val === 10) {
        const v = 82;
        return v;
      }
      if (val === 9) {
        const v = 72;
        return v;
      }
      if (val === 8) {
        const v = 61;
        return v;
      }
      if (val === 7) {
        const v = 52;
        return v;
      }
      if (val === 6) {
        const v = 41;
        return v;
      }
      if (val === 5) {
        const v = 31;
        return v;
      }
      if (val === 4) {
        const v = 23;
        return v;
      }
      if (val === 3) {
        const v = 12;
        return v;
      }
      if (val === 2) {
        const v = 4;
        return v;
      }
      if (val === 1) {
        const v = 1;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorTW(val) {
      if (val >= 15) {
        const v = 95;
        return v;
      }
      if (val === 14) {
        const v = 94;
        return v;
      }
      if (val === 13) {
        const v = 89;
        return v;
      }
      if (val === 12) {
        const v = 83;
        return v;
      }
      if (val === 11) {
        const v = 79;
        return v;
      }
      if (val === 10) {
        const v = 74;
        return v;
      }
      if (val === 9) {
        const v = 67;
        return v;
      }
      if (val === 8) {
        const v = 60;
        return v;
      }
      if (val === 7) {
        const v = 49;
        return v;
      }
      if (val === 6) {
        const v = 37;
        return v;
      }
      if (val === 5) {
        const v = 27;
        return v;
      }
      if (val === 4) {
        const v = 19;
        return v;
      }
      if (val === 3) {
        const v = 12;
        return v;
      }
      if (val === 2) {
        const v = 6;
        return v;
      }
      if (val === 1) {
        const v = 1;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorIM(val) {
      if (val >= 16) {
        const v = 93;
        return v;
      }
      if (val >= 15) {
        const v = 91;
        return v;
      }
      if (val === 14) {
        const v = 86;
        return v;
      }
      if (val === 13) {
        const v = 83;
        return v;
      }
      if (val === 12) {
        const v = 77;
        return v;
      }
      if (val === 11) {
        const v = 68;
        return v;
      }
      if (val === 10) {
        const v = 61;
        return v;
      }
      if (val === 9) {
        const v = 49;
        return v;
      }
      if (val === 8) {
        const v = 36;
        return v;
      }
      if (val === 7) {
        const v = 29;
        return v;
      }
      if (val === 6) {
        const v = 19;
        return v;
      }
      if (val === 5) {
        const v = 14;
        return v;
      }
      if (val === 4) {
        const v = 8;
        return v;
      }
      if (val === 3) {
        const v = 4;
        return v;
      }
      if (val === 2) {
        const v = 2;
        return v;
      }
      if (val === 1) {
        const v = 1;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorCF(val) {
      if (val >= 13) {
        const v = 93;
        return v;
      }
      if (val === 12) {
        const v = 89;
        return v;
      }
      if (val === 11) {
        const v = 85;
        return v;
      }
      if (val === 10) {
        const v = 83;
        return v;
      }
      if (val === 9) {
        const v = 78;
        return v;
      }
      if (val === 8) {
        const v = 72;
        return v;
      }
      if (val === 7) {
        const v = 67;
        return v;
      }
      if (val === 6) {
        const v = 56;
        return v;
      }
      if (val === 5) {
        const v = 51;
        return v;
      }
      if (val === 4) {
        const v = 41;
        return v;
      }
      if (val === 3) {
        const v = 31;
        return v;
      }
      if (val === 2) {
        const v = 18;
        return v;
      }
      if (val === 1) {
        const v = 11;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
    calculatorSP(val) {
      if (val >= 14) {
        const v = 95;
        return v;
      }
      if (val === 13) {
        const v = 92;
        return v;
      }
      if (val === 12) {
        const v = 89;
        return v;
      }
      if (val === 11) {
        const v = 85;
        return v;
      }
      if (val === 10) {
        const v = 77;
        return v;
      }
      if (val === 9) {
        const v = 74;
        return v;
      }
      if (val === 8) {
        const v = 69;
        return v;
      }
      if (val === 7) {
        const v = 64;
        return v;
      }
      if (val === 6) {
        const v = 53;
        return v;
      }
      if (val === 5) {
        const v = 46;
        return v;
      }
      if (val === 4) {
        const v = 30;
        return v;
      }
      if (val === 3) {
        const v = 24;
        return v;
      }
      if (val === 2) {
        const v = 11;
        return v;
      }
      if (val === 1) {
        const v = 8;
        return v;
      }
      if (val === 0) {
        const v = 0;
        return v;
      }
      return val;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  float: left;
  margin: 0;
  display: flex;
  justify-content:center;
  align-items:Center;
}
img {
  /* margin-top: 10px; */
  height: 40px;
  width: 40px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-header {
  color: #606266;
  width: 100%;
  /* text-align: center; */
  font-size: 27px;
  line-height: 60px;
  margin-bottom: 4px;
  -webkit-box-shadow: 1px 0px 10px 0px #888;
  box-shadow: 1px 0px 10px 0px #888;
  text-align:center;
}
.title {
  display:inline;
  text-align: center;
  margin: 0 auto;
  color: rgb(57, 131, 228);
}
.el-footer {
  height: 40px;
  background-color: rgb(57, 131, 228);
  /* color: #333; */
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 40px;
}

/* .el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
} */

.el-main {
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0px;
  left: 0px;
  /* background-color: #E9EEF3;
  color: #333; */
  /* background-color: rgb(241, 248, 255); */
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-scrollbar {
    overflow-x: hidden;
}

.pre {
  height: 595px;
  width: 100%;
}
.signOutBtn {
  float: right;
  margin-top: 10px;
}
.el-input {
  width: 300px;
  float: right;
}
</style>
