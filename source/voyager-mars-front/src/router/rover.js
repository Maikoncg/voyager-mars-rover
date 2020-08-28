import Layout from '@/layouts/Layout.vue';
import Index from '@/pages/rover/Index.vue';

export default [{
  path: '/rover',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'rover-index',
      component: Index,
    },
  ],
}];
