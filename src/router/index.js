import Vue from 'vue';
import VueRouter from 'vue-router';
import { Dialog } from 'vant';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login'),
    meta: { requireAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('views/home'),
        meta: { requireAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('views/qa'),
        meta: { requireAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('views/video'),
        meta: { requireAuth: false }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('views/profile'),
        meta: { requireAuth: false }
      },
      {
        path: '/profile/edit',
        name: 'profileEdit',
        component: () => import('views/profile-edit'),
        meta: { requireAuth: true }
      },
      {
        path: '/profile/collection',
        name: 'profileCollection',
        component: () => import('views/collection'),
        meta: { requireAuth: true }
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('views/search'),
        meta: { requireAuth: false }
      }
    ]
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true,
    meta: { requireAuth: false }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('views/chat'),
    meta: { requireAuth: false }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.meta.requireAuth && !store.state.user) {
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录，确认登录吗？'
    })
      .then(() => {
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
      })
      .catch(() => {
        next(false);
      });
  } else {
    next();
  }
});
export default router;
