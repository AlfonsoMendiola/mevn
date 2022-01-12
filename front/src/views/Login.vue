<template>
  <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="login">
          <input type="text" placeholder="Email" class="form-control my-2" v-model="usuario.email">
          <input type="text" placeholder="Contraseña" class="form-control my-2" v-model="usuario.pass">
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-success my-2">Acceder</button>
        </div>
      </form>
      <div v-if="mensaje !== ''">
        <p>{{mensaje}}</p>
      </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      //el usuario debe ser = al schema del backend
      usuario: {email: 'hola@hola.com', pass:'123123'},
      mensaje: ''
    }
  },
  methods:{
    ...mapActions(['guardarUsuario']),
    login(){
      //console.log(this.usuario)
      this.axios.post('/login', this.usuario)
        .then(res =>{
          console.log(res.data)
          const token = res.data.token
          this.guardarUsuario(token)
          this.mensaje = ''
          this.$router.push({name: 'Notas'})
        }).catch(e => {
          console.log(e.response)
          this.mensaje = e.response.data.mensaje
        })
    }
  }

}
</script>

<style>

</style>