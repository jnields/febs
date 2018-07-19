// app.vue with ES2015
// Syntax error is on line 3.
<style
  .red {
    color: #f00;
  }
</style>

<template>
  <h1 class="red">{{ msg }}</h1>
</template>

<script>
  export default {
    data() {
      const str = 'Hello world';

      return {
        msg: `Vue says, "${str}!"`,
      };
    },
  };
</script>
