<template>
  <div id="app">
    <app-header></app-header>
    <main>
      <router-view></router-view>
      
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'App',
  components: {
    AppHeader: Header,
  },
};
</script>

