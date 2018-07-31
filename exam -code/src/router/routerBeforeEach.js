import router from '../router';
import store from '../store';

// 跳转拦截 --- 子路由拦截不会,暂时以假的路由拦截代替
export default function () {
  router.beforeEach((to, from, next) => {
    // 判断是否需要拦截
    if (to.meta.requireAuth) {
      // 判断拦截之后需要跳转到哪个界面
      if (to.meta.requireAuth === 'answer/pageansweritem') {
        if (store.state.answer.surveyur) {
          next();
        } else {
          next({
            path: '/answer/pageansweritem',
          });
        }
      } else if (to.meta.requireAuth === 'login') {
        if (store.state.authorization) {
          next();
        } else {
          next({
            path: '/login',
          });
        }
      }
    } else if (to.path === '/') {
      next({
        name: 'pageansweritem',
      });
    } else {
      next();
    }
  });
}
