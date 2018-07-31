export default {
  changeMainShow(state, val) { // 列表页提交获取的后台问卷数据
    state.answer.questions = val;
  },
  deleteAuthorization(state) { // 删除令牌token
    state.authorization = false;
  },
  subQuestion(state, val) { // 提交给个人汇总
    // 浏览器在个人汇总页回退时，ruleForm留存上一回的数据
    state.answer.ruleForm = val.ruleForm;
    // 清除上次的数据 再进行个人汇总 --- 用来适应个人汇总页面的布局结构
    state.answer.personalpool = {
      staff: {},
      noncestr: '',
      questions: [],
    };
    state.answer.personalpool.staff.name = val.ruleForm.name;
    state.answer.personalpool.staff.sex = val.ruleForm.sex;
    state.answer.personalpool.staff.staff_no = val.ruleForm.worknumber;
    state.answer.personalpool.noncestr = state.answer.surveyur.substring(7);
    val.questions.forEach((item, index) => {
      const obj = {
        id: index + 1,
        options: [],
      };
      state.answer.personalpool.questions.push(obj);
      item.options.forEach((item2, index2) => {
        const obj2 = {
          id: index2 + 1,
          code: '',
          score: '',
        };
        state.answer.personalpool.questions[index].options.push(obj2);
        state.answer.personalpool.questions[index].options[index2].code = item2.code;
        state.answer.personalpool.questions[index].options[index2].score = item2.question_id;
      });
    });
  },
  keepSurveyur(state, val) { // 列表项提交surveyur
    state.answer.surveyur = val.surveyur;
  },
  openList(state) { // 导航栏数据
    state.answer.select.key = 'pageanswersub'; // 答题界面导航项点亮
    state.answer.select.keypath = ['1', '1-1']; // 导航项展开
  },
};
