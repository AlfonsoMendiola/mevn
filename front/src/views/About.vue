<template>
  <div class="about container">
    <h1>This is an about page</h1>
    <!--se puede usar el router-link para hacer las paginaciones-->

    <router-link class="btn btn-block btn-primary" :to="{query:{seccion:1}}">1</router-link>
    <router-link class="btn btn-block btn-primary" :to="{query:{seccion:2}}">2</router-link>
    <router-link class="btn btn-block btn-primary" :to="{query:{seccion:3}}">3</router-link>




  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  //en el patros observador se indica que se quiere observan
  watch: {
    "$route.query.seccion": {
      immediate: true,
      handler(seccion){
        console.log(`Seccion a cambiado: ${seccion}`)
      }
    }
  }
}
</script>