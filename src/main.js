import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import mixins from './mixins';

Vue.config.productionTip = false;

Vue.mixin(mixins);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
