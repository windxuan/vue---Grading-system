<template>
  <div class="personalPool">
    <!-- 头部 -->
    <div class="header">
      <i class="back" @click="$router.back(-1)"></i>
      <p>
        <img src="../assets/logo.jpg" />
        江苏远大信息股份有限公司
      </p>
      <!-- <span class="headerspan">{{this.user}}</span> -->
      <el-dropdown :hide-on-click="false" trigger="click">
        <span class="el-dropdown-link">
          欢迎您,{{tableData.staff.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <label for="deletToken">
            <el-dropdown-item >
              <span id="deletToken">工号:{{tableData.staff.staff_no}}</span>
            </el-dropdown-item>
          </label>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="avatar">
        <img src="../assets/timg.gif" />
      </div>
    </div>
    <div class="information">
        <el-tag class="tag one">姓名：{{tableData.staff.name}}</el-tag>
        <el-tag class="tag two">性别：{{tableData.staff.sex}}</el-tag>
        <el-tag class="tag three">工号：{{tableData.staff.staff_no}}</el-tag>

        <div class="foo">
          <span class="letter" data-letter="我">我</span>
          <span class="letter" data-letter="的">的</span>
          <span class="letter" data-letter="个">个</span>
          <span class="letter" data-letter="人">人</span>
          <span class="letter" data-letter="汇">汇</span>
          <span class="letter" data-letter="总">总</span>
        </div>
    </div>
     <!-- 个人表格页面汇总 -->
    <el-table
      :data="tableData.questions"
      border
      :summary-method="getSummaries"
      show-summary
      sum-text="总分"
      style="width: 100%"
    >

      <el-table-column label="成绩分布">
       <el-table-column
        prop="id"
        label="题号"
        width="180">
       </el-table-column>
       <el-table-column
          prop="options[0].score"
          label="PL/智多星">
        </el-table-column>
        <el-table-column
          prop="options[1].score"
          label="RI/外联者">
        </el-table-column>
        <el-table-column
          prop="options[2].score"
          label="CO/协调者">
        </el-table-column>
        <el-table-column
          prop="options[3].score"
          label="SH/鞭策着">
        </el-table-column>
        <el-table-column
          prop="options[4].score"
          label="ME/监督者">
        </el-table-column>
        <el-table-column
          prop="options[5].score"
          label="TW/凝聚者">
        </el-table-column>
        <el-table-column
          prop="options[6].score"
          label="IM/实干者">
        </el-table-column>
        <el-table-column
          prop="options[7].score"
          label="CF/善始善终者">
        </el-table-column>
        <el-table-column
          prop="options[8].score"
          label="SP/专家">
        </el-table-column>
      </el-table-column>
    </el-table>

    <!-- 分值对照 -->
    <el-table
      style="width: 100%">
       <el-table-column
        label="分值对照"
        width="180">
       </el-table-column>
       <el-table-column
          label="智多星">
          <template slot-scope="scope">
            <!-- 颜色 -->
            <!-- <span></span> -->
            <!-- 分数对照值 -->
            <!-- <span></span> -->
          </template>
        </el-table-column>
        <el-table-column
          label="外联者">
        </el-table-column>
        <el-table-column
          label="协调者">
        </el-table-column>
        <el-table-column
          label="鞭策着">
        </el-table-column>
        <el-table-column
          label="监督者">
        </el-table-column>
        <el-table-column
          label="凝聚者">
        </el-table-column>
        <el-table-column
          label="实干者">
        </el-table-column>
        <el-table-column
          label="善始善终者">
        </el-table-column>
        <el-table-column
          label="专家">
        </el-table-column>
    </el-table>

  </div>
</template>

<script>

  let scoreList = {
    PL: {
      tag: '智多星',
      level: [25,64,95],
      score: [0,8,16,2,5,38,45,53,64,75,82,84,86,90,92,93,95]
    },
    RI: {
      tag: '外联者',
      level: [23,66,95],
      score: [0,3,7,16,23,32,38,49,58,66,71,77,83,86,90,95]
    },
    CO: {
      tag: '协调者',
      level: [29,64,95],
      score: [0,3,6,11,19,29,48,55,64,72,80,82,86,90,91,93,95]
    },
    SH: {
      tag: '鞭策着',
      level: [23,64,95],
      score: [0,1,4,6,12,18,23,30,36,45,50,55,64,71,75,79,83,86,87,89,92,93,95]
    },
    ME: {
      tag: '监督者',
      level: [23,61,94],
      score: [0,1,4,12,23,31,41,52,61,72,82,89,92,94]
    },
    TW: {
      tag: '凝聚者',
      level: [27,67,95],
      score: [0,1,6,12,19,27,37,49,60,67,74,79,83,89,94,95]
    },
    IM: {
      tag: '实干者',
      level: [29,68,93],
      score: [0,1,2,4,8,14,19,29,36,49,61,68,77,83,86,91,93]
    },
    CF: {
      tag: '善始善终者',
      level: [18,67,93],
      score: [0,11,18,31,41,51,56,67,72,78,83,85,89,93]
    },
    SP: {
      tag: '专家',
      level: [24,69,95],
      score: [0,8,11,24,30,46,53,64,69,74,77,85,89,92,95]
    }
  }

export default {
  data() {
    return {
      tableData: [],
      scoreList: scoreList,
    };
  },
  created() {
    this.tableData = this.$store.state.answer.personalpool;
   },
   methods: {
    // 计算总分
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总分';
            return;
          }
          const values = data.map((item) => {
            const index = column.property.charAt(8);
            const score = item.options[index].score || '0';
            return Number(score);
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 分';
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },
      // 对比分数
      contrastScore (type,sco) {
        if (typeof(sco) !== 'number') {
          sco = parseInt(sco)
        }
        console.log(scoreList);
        // 获取最大值
        const len = scoreList[type].score.length - 1;
        // 返回分数
        if (sco > len) {
          return scoreList[type].score[len]
        }
        return scoreList[type].score[sco]
      },
      // 对比颜色
      contrastColor (type,sco) {
        console.log(1);
        if (typeof(sco) !== 'number') {
          sco = parseInt(sco)
        }
        sco = this.contrastScore(type,sco)
        // 分数阶层
        const line = scoreList[type].line
        // 根据分数，返回对应颜色
        if (score >= line[2]) {   //优秀
          return '#409EFF'
        }
        if (score >= line[1]) {   //自然
          return '#67c23a'
        }
        if (score >= line[0]) {   //次要
          return '#f56c6c'
        }
        return '#909399'          //避免
      },
   }
};
</script>

<style>
body{
  font-family: 'Lato', sans-serif;
}
div.foo{
  width: 90%;
  margin: 0 auto;
  text-align: center;
}
.letter{
  display: inline-block;
  font-weight: 900;
  font-size: 3em;
  margin: 0.2em;
  position: relative;
  color: #00B4F1;
  transform-style: preserve-3d;
  perspective: 400;
  z-index: 1;
}
.letter:before, .letter:after{
  position:absolute;
  content: attr(data-letter);
  transform-origin: top left;
  top:0;
  left:0;
}
.letter, .letter:before, .letter:after{
  transition: all 0.3s ease-in-out;
}
.letter:before{
  color: #fff;
  text-shadow:
    -1px 0px 1px rgba(255,255,255,.8),
    1px 0px 1px rgba(0,0,0,.8);
  z-index: 3;
  transform:
    rotateX(0deg)
    rotateY(-15deg)
    rotateZ(0deg);
}
.letter:after{
  color: rgba(0,0,0,.11);
  z-index:2;
  transform:
    scale(1.08,1)
    rotateX(0deg)
    rotateY(0deg)
    rotateZ(0deg)
    skew(0deg,1deg);
}
.letter:hover:before{
  color: #fafafa;
  cursor: default;
  transform:
    rotateX(0deg)
    rotateY(-40deg)
    rotateZ(0deg);
}
.letter:hover:after{
  cursor: default;
  transform:
    scale(1.08,1)
    rotateX(0deg)
    rotateY(40deg)
    rotateZ(0deg)
    skew(0deg,22deg);
}
/*字体 .end*/

.personalPool {
  padding: 0 10px;
}
.personalPool .information {
  position: relative;
  border: 1px solid #eee;
  margin: 10px 0;
  padding: 15px;
}
.personalPool .el-tag {
  position: absolute;
}
.personalPool .information > .one {
  top: 5px;
}
.personalPool .information > .two {
  top: 40px;
}
.personalPool .information > .three {
  top: 75px;
}
.personalPool .el-table {
  text-align: center;
}
.personalPool .el-table th {
  text-align: center;
}

/*header*/
.personalPool .header{
  position: relative;
  width: 100%;
  height: 60px;
  margin-bottom: 4px;
  line-height: 60px;
  font-weight: 600;
  background-color: #fff;
  box-shadow: 1px 0px 10px 0px #888;
}

.personalPool .header> p {
  position: absolute;
  top: 0;
  left: 5%;
  color: #303133;
  font-size: 20px;
  letter-spacing: 2px;
  padding-left: 60px;
  height: 60px;
}
.personalPool .header > p > img {
  position: absolute;
  top: 5px;
  left: 0;
  width: 50px;
  height: 50px;
}
.personalPool .header > .back {
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 40px;
  top: .65rem;
  left: 1.35rem;
  background-image: url(../assets/back2.png);
  background-repeat: no-repeat;
  background-size: 80% 80%;
  -moz-background-size: 80% 80%;
  background-position: center;
}
.personalPool .header > .back:hover {
  cursor: pointer;
}
.personalPool .header> .el-dropdown {
  float: right;
  cursor: pointer;
  font-family: "微软雅黑,华文宋体";
  font-size: 13px;
  letter-spacing: 1px;
  margin-right: calc(4% + 40px + 5px + 2px);
}

.personalPool .header> .avatar {
  position: absolute;
  top: 50%;
  right: 4%;
  overflow: hidden;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,.7);
}

.personalPool .header> .avatar> img {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 42px;
  height: 42px;
}
</style>
