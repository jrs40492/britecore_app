import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import ReportsView from './views/ReportsView.vue';
import Reports from './views/Reports.vue';
import ReportUpload from './views/ReportUpload.vue';
import RecordsView from './views/RecordsView.vue';
import Records from './views/Records.vue';
import Record from './views/Record.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/reports',
    component: ReportsView,
    children: [{
      path: '',
      name: 'reports',
      component: Reports,
    },
    {
      path: 'upload',
      component: ReportUpload,
    },
    {
      path: ':reportId',
      component: RecordsView,
      children: [{
        path: '',
        component: Records,
      },
      {
        path: ':recordId',
        name: 'record',
        component: Record,
      },
      ],
    },
    ],
  },
  ],
});
