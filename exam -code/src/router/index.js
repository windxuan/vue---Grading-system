import Vue from 'vue';
import Router from 'vue-router';
import Answer from '@/page/Answer';
import Login from '@/page/Login';
import TotalPool from '@/page/TotalPool';
import PersonalPool from '@/page/PersonalPool';
import Pageansweritem from '@/components/pageansweritem';
import Pageanswersub from '@/components/pageanswersub';
import routerBeforeEach from './routerBeforeEach';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/answer',
      name: 'answer',
      component: Answer,
      meta: {
        requireAuth: 'answer/pageansweritem', // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [ // 列表页
        {
          name: 'pageansweritem',
          path: 'pageansweritem',
          component: Pageansweritem,
        },
        { // 答题页面
          name: 'pageanswersub',
          path: 'pageanswersub',
          component: Pageanswersub,
          meta: {
            requireAuth: 'answer/pageansweritem', // 添加该字段，表示进入这个路由是需要登录的
          },
        },
      ],
    },
    { // 个人汇总页
      path: '/totalpool',
      name: 'totalpool',
      component: TotalPool,
      meta: {
        requireAuth: 'login', // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/personalpool',
      name: 'personalpool',
      component: PersonalPool,
      meta: {
        requireAuth: 'answer/pageansweritem', // 添加该字段，表示进入这个路由是需要登录的
      },
    },
  ],
});

routerBeforeEach(); // 路由拦截
