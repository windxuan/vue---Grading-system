import login from './login';
import answer from './answer';

export default {
  getAuthorization: login.getAuthorization, // 获取token
  changeMainShow: answer.changeMainShow, // 显示问卷内容
  deleteAuthorization: answer.deleteAuthorization, // 删除token
  subQuestion: answer.subQuestion, // 传递个人url
  openList: answer.openList, // 导航栏数据
  keepSurveyur: answer.keepSurveyur,
};
