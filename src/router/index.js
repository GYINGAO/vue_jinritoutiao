import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login')
  },
  {
    path: '/',
    component: () => import('@/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('views/home')
      },
      {
        path: '/qa',
        name: 'Qa',
        component: () => import('views/qa')
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('views/video')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('views/profile')
      },
      {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: () => import('views/profile/edit')
      },
      {
        path: '/profile/collection',
        name: 'ProfileCollection',
        component: () => import('views/profile/collection')
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('views/search')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});
export default router;
