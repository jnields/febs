// app.vue with ES2015
// Syntax error is on line 14.
<style
  .red {
    color: #f00;
  }
</style>

<template>
  <h1 class="red">{{ msg }}</h1>
</template>

<script>
  expor default { // <-- Syntax error here
    data() {
      const str = 'Hello world';

      return {
        msg: `Vue says, "${str}!"`,
      };
    },
  };
</script>
