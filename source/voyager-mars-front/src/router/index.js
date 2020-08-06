import Vue from 'vue';
import VueRouter from 'vue-router';

import { getJsModules } from '@/plugins/util';

const modules = getJsModules(require.context('.', false, /\.js$/), true);

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: modules,
});

export default router;
