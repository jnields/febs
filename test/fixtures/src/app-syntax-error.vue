// app.vue with ES2015
<style>
  .red {
    color: #f00;
  }
</style> 
 
<template>
  <h1 class="red">{{msg}}</h
</template>
 
<script>
export default {
  data () {

    let str = "Hello world"

    return {
      msg: `Vue says, "${str}!"`
    }
  }
}
</scr