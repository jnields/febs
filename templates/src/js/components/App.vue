<template>
  <div class="example-vue-component">
    <div id="c1">{{ message }}</div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    props: {
      message: {
        type: String,
        default: 'default message',
      },
    },
  };
</script>

<style scoped>
  #c1 {
    background-color: #39AF78;
    color: #000;
    padding: 20px;
    text-align: center;
    border: solid;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
</style>
