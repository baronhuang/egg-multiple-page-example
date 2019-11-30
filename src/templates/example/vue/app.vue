<template>
  <div class="vue-page" id="app">
    <img class="vue-logo" alt="Vue logo" src="@/images/example/vue-logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from '@/templates/components/vue/helloWorld.vue';

export default {
  name: 'demoVuePage',
  components: {
    HelloWorld
  },
  mounted () {
    console.log('------------- mounted');
  }
};
</script>

<style lang="scss" scoped>
  .vue-page {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
