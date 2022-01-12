// const express = require('express');
// const app = express();

// const morgan = require('morgan');
// const cors = require('cors');
// const path = require('path') //para acceder al directorio actual

// app.use(morgan('tiny'));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// Rutas
// app.get('/', function(req, res){
//     res.send('Hola mundo');
// })

// el history es para que funcione correctamente con las rutas de vue. previamente las rutas del backend ya deberian estar configuradas
// const history = require('connect-history-api-fallback'); 
// app.use(history());
// app.use(express.static(path.join(__dirname, 'public')));


// app.set('puerto', process.env.PORT || 3000)

// app.listen(app.get('puerto'), function(){
//     console.log('Escuchando el puerto: ', app.get('puerto'))
// })

//despues de terminar las configuraciones, ejecutar en terminal
// node app.js
// para inicializar el servidor backed de node
//o si se tiene instalado y configurado nodemon ejecutar npm run dev
//o si se tiene instalado devbabel ejecutar npm run devbabel

//El paquete nodemon es el escuchador de cambios del servidor, se pude instalar de 
//manera local por cada proyecto o global para la pc
// añadir en package.json en el apartado de scripts "dev": "nodemon app.js"
// despues de instalar nodemon para que funcione correctamente

//el paquete externo morgan sirve para detectar peticiones al servidor

//el paquete externo cors sirve para que el servidor pueda aceptar peticiones de otros dominios

// el paquete externo connect-history-api-fallback hace que el back end funcione correctamente con las rutas de vue
//  babel sirve para programar en js moderno y que sea compilado en versionas mas viejas para servidores


import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

//conexion a db
const mongoose = require('mongoose');
//conexion local
const uri = 'mongodb://localhost:27017/dbpruebas';
//conexion en la nube con mongo atlas
//const uri = 'mongodb+srv://user_udemy:gAzxg81oroZqB77q@udemy.n8ana.mongodb.net/dbpruebas?retryWrites=true&w=majority'

const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
mongoose.connect(uri, options).then(
  () => { console.log("conectado a mondo db"); },
  err => { err }
);

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
app.use('/api', require('./routes/nota'));
app.use('/api', require('./routes/user'));
app.use('/api/login', require('./routes/login'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('escuchando en el puerto: '+ app.get('puerto'));
});