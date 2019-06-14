<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  // name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  -ms-overflow-style:none;
  /* overflow:-moz-scrollbars-none; */
}
body{
  font-family: Tahoma, Helvetica, Arial,"\5fae\8f6f\96c5\9ed1" ,"\5b8b\4f53",sans-serif;  
  /* font-size: 95%; */
  font-size: 16px;
}

*::-webkit-scrollbar{
  width: 7px;     
  height: 7px;
}
*::-webkit-scrollbar-thumb{
  border-radius: 3px;
  box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
  background: #aaa;
}
*::-webkit-scrollbar-track{
  box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
  border-radius: 3px;
  background: #EDEDED;
}
</style>
