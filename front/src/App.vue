import { mapActions } from 'vuex';
<template>
  <div id="app">
    <div id="nav" class="container">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login" v-if="!estaActivo">Login</router-link> |
      <router-link to="/notas" v-if="estaActivo">Notas</router-link> |
      <a @click="cerrarSesion()" v-if="estaActivo">Cerrar Sesion</a>
    </div>


    
    <router-view/>
  </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'

export default{
  methods:{
    ...mapActions(['cerrarSesion', 'leerToken'])
  },
  computed:{
    ...mapGetters(['estaActivo'])
  },
  created(){
    this.leerToken()
  }
  
}
</script>