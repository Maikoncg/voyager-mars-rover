<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs"></v-breadcrumbs>
    <AsyncComponent :component="roverTable" widthLoading class="fluid pa-0"/>
  </div>
</template>

<script>
import AsyncComponent from '@/components/common/AsyncComponent.vue';

export default {
  components: { AsyncComponent },
  data: () => ({
    roverTable: null,
    roverForm: null,
    itemsBreadcrumbs: [
      {
        text: 'Rovers',
        disabled: true,
        href: '/rover/index',
      },
    ],
  }),
  mounted() {
    this.roverTable = 'rover/RoverTable';
  },
};
</script>
