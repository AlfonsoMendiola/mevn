<template>
  <div class="container">
    <h1>Notas</h1>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="mensaje.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ mensaje.texto }}
    </b-alert>

    <form @submit.prevent="editarNota(notaEditar)" v-if="editar">
      <h3>Editar Nota</h3>
      <input
        type="text"
        class="form-control my-2"
        placeholder="Nombre"
        v-model="notaEditar.nombre"
      />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Descripción"
        v-model="notaEditar.descripcion"
      />

      <button type="submit" class="btn btn-success my-1 mx-2">Editar</button>
      <button
        type="submit"
        class="btn btn-secondary my-1"
        @click="editar = false"
      >
        cancelar
      </button>
    </form>

    <form @submit.prevent="agregarNota()" v-if="!editar">
      <h3>Agregar nueva nota</h3>
      <input
        type="text"
        class="form-control my-2"
        placeholder="Nombre"
        v-model="nota.nombre"
      />
      <input
        type="text"
        class="form-control my-2"
        placeholder="Descripción"
        v-model="nota.descripcion"
      />
      <div class="d-grid gap-2">
        <button type="submit" class="btn btn-success my-2">Agregar</button>
      </div>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <!-- <td> <b-button @click="alerta()">Acción</b-button> </td> -->
          <td>
            <b-button class="btn-danger btn-sm" @click="eliminarNota(item._id)"
              >Eliminar</b-button
            >
            <b-button
              class="btn-primary btn-sm m-1"
              @click="activarEdicion(item._id)"
              >Editar</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <router-link class="page-link" :to="{ query: { pagina: paginaActual - 1 } }">
            Anterior
          </router-link>
        </li>
        <li class="page-item" :class="{active: paginaActual === index + 1 }" v-for="(item, index) in cantidadPaginas" :key="index">
          <router-link :to="{ query: { pagina: index + 1 } }" class="page-link" >{{ index + 1 }}</router-link>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === cantidadPaginas }">
          <router-link class="page-link" :to="{ query: { pagina: paginaActual + 1 } }">
            Siguiente
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      //los siguientes tres atributos son para la paginacion
      totalNotas: 0,
      limite: 5,
      paginaActual: 1,

      notas: [],
      dismissSecs: 5,
      dismissCountDown: 0,
      mensaje: { color: "", texto: "" },
      nota: { nombre: "", descripcion: "" },
      notaEditar: {},
      editar: false,
    };
  },
  computed: {
    ...mapState(["token"]),
    //este metodo se hace en las propiedades computadas para que siempre calcule en numero de paginas de manera dinamica
    cantidadPaginas(){
      //la funcion matematica redondea hacia arriba para que no existan paginas decimales
      return Math.ceil(this.totalNotas / this.limite)
    }
  },
  methods: {
    alerta() {
      this.mensaje.color = "success";
      this.mensaje.texto = "Probando alerta";
      this.showAlert();
    },
    paginacion(pagina) {
      let config = {
        headers: {
          token: this.token,
        },
      };
      //esta formula calcula el salto de datos para hacer la paginacion
      let skip = (pagina - 1) * this.limite;
      //esta ruta la lee el back end, no aparece en el navegador ni en el cliente de alguna forma
      this.axios
        .get(`/nota?limite${this.limite}&skip=${skip}`, config)
        .then((res) => {
          console.log(res.data);
          this.notas = res.data.notaDB;
          this.totalNotas = res.data.totalNotas;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    async listarNotas() {
      //envio del token como segundo parametro en la ruta
      let config = {
        headers: {
          token: this.token,
        },
      };
      //con vue axios de puede hacer los llamados de manera directa
      //la base_url tambien esta configurada en el main.js
      this.axios.get("/nota", config).then((res) => {
        console.log(res.data);
        this.notas = res.data.notaDB;
      });
      // sin axios
      // try {
      //     //const res = await fetch('https://bakend-mevn.herokuapp.com/api/nota')
      //     const res = await fetch('http://localhost:3000/api/nota')
      //     const dataDB = await res.json()
      //     this.notas = dataDB
      //     console.log(dataDB)
      // } catch (error) {
      //     console.log(error)
      // }
    },
    agregarNota() {
      //envio del token como tercer parametro en la ruta y el segundo es el body
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .post("/nueva-nota", this.nota, config)
        .then((res) => {
          this.notas.push(res.data);
          this.nota.nombre = "";
          this.nota.descripcion = "";
          this.mensaje.color = "success";
          this.mensaje.texto = "Nota agregada";
          this.showAlert();
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.data.error.errors.nombre.message) {
            this.mensaje.texto = err.response.data.error.errors.nombre.message;
          } else {
            this.mensaje.texto = "Error del sistema";
          }
          this.mensaje.color = "danger";

          this.showAlert();
        });
    },
    eliminarNota(id) {
      this.axios
        .delete(`/nota/${id}`)
        .then((res) => {
          const index = this.notas.findIndex(
            (item) => item._id === res.data._id
          );
          //splice borra la candidad de elementos indicados que coincidan con el este index
          this.notas.splice(index, 1);
          this.mensaje.color = "success";
          this.mensaje.texto = "Nota eliminada";
          this.showAlert();
        })
        .catch((err) => {});
    },
    activarEdicion(id) {
      this.editar = true;
      this.axios.get(`/nota/${id}`).then((res) => {
        this.notaEditar = res.data;
      });
    },
    editarNota(item) {
      this.axios.put(`/nota/${item._id}`, item).then((res) => {
        const index = this.notas.findIndex((n) => n._id === res.data._id);
        this.notas[index].nombre = res.data.nombre;
        this.notas[index].descripcion = res.data.descripcion;
        this.mensaje.color = "success";
        this.mensaje.texto = "Nota Editada";
        this.showAlert();
        this.editar = false;
      });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
  //ya no se usara created, en ñugar de eso, watch para que la paginacion funcione correctamente
  // created() {
  //   this.listarNotas();
  // },
  watch: {
    //esta lee una ruta url con el parametro 'pagina' y captura el valor el el handler
    "$route.query.pagina": {
      immediate: true,
      //handler es una palabra reservada, ejecuta el metodo dle observador
      handler(pagina) {
        pagina = parseInt(pagina) || 1;
        this.paginacion(pagina);
        this.paginaActual = pagina;
      },
    },
  },
};
</script>

<style>
</style>