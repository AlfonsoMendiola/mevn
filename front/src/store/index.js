import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router/index'

//decodificar el jwt
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    usuarioDB: ''
  },
  mutations: {
    obtenerUsuario(state, payload){
      state.token = payload
      if(payload === ''){
        state.usuarioDB = ''
        router.push({name: 'Login'})
      }else{
        state.usuarioDB = decode(payload)
        //router.push({name: 'Notas'})
      }
    }
  },
  actions: {
    guardarUsuario({commit}, payload){
      localStorage.setItem('token', payload);
      commit('obtenerUsuario', payload)
    },
    cerrarSesion({commit}){
      commit('obtenerUsuario', '')
      localStorage.removeItem('token')
    },
    //leer token para mantener la sesion iniciada cuando se recargue la pag
    leerToken({commit}){
      const token = localStorage.getItem('token')
      if(token){
        commit('obtenerUsuario', token)
      }else{
        commit('obtenerUsuario', '')
      }
    }
  },
  getters:{
    estaActivo: state => !!state.token
  },
  modules: {
  }
})
