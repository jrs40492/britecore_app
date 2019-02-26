<template>
  <div class="home">
    <Home msg="Welcome to Jacob Swansons BriteCore Data Table!"/>
  </div>
</template>

<script>
import Vue from 'vue';
import Home from '@/components/Home.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    Home,
  },
});
</script>
