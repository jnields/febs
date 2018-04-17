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
        background-color: #39AF78;
        color: #000000;
        padding: 20px;
        text-align: center;
    }
</style>