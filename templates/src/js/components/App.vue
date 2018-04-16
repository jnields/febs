<template>
    <div>
        <div id="c1">{{message}}</div>
    </div>
</template>

<script>
  export default {
    name: 'App',
    props: ['message'],
  };
</script>

<style scoped>
    #c1 {
        background-color: green;
        padding: 20px;
        text-align: center;
    }
</style>