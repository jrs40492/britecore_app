import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/reports',
      component: () => import(/* webpackChunkName: "reportsView" */ '@/views/Reports_View.vue'),
      children: [
        {
          path: '',
          name: 'reports',
          component: () => import(/* webpackChunkName: "reports" */ '@/views/Reports.vue'),
        },
        {
          path: 'upload',
          component: () => import(/* webpackChunkName: "upload" */ '@/views/ReportUpload.vue'),
        },
        {
          path: ':reportId',
          component: () => import(/* webpackChunkName: "report" */ '@/views/Report_View.vue'),
          children: [
            {
              path: '',
              component: () => import(/* webpackChunkName: "report" */ '@/views/Report.vue'),
            },
            {
              path: ':recordId',
              name: 'record',
              component: () => import(/* webpackChunkName: "report" */ '@/views/Record.vue'),
            }
          ]
        }
      ]
    },
  ],
});
