import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import ReportsView from './views/ReportsView.vue';
import Reports from './views/Reports.vue';
import ReportUpload from './views/ReportUpload.vue';
import ReportEdit from './views/ReportEdit.vue';
import ReportView from './views/ReportView.vue';
import Report from './views/Report.vue';
import RecordEdit from './views/RecordEdit.vue';

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
      component: ReportView,
      children: [{
        path: '',
        component: Report,
      },
      {
        path: 'edit',
        component: ReportEdit,
      },
      {
        path: ':recordId/edit',
        component: RecordEdit,
        name: 'record',
      },
      ],
    },
    ],
  },
  ],
});
