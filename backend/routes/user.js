import express from 'express';
const router =  express.Router();

//importar el modelo de los usuarios
import User from '../models/user';

//importar los middelwares personalizados para la autenticacion de usuarios y uso del token
const {verificarAuth, verificarAdministrador} = require('../middlewares/autenticacion')

//importar el bcrypt para encriptar contraseñas
const bcrypt = require('bcrypt');
const saltRounds = 10;

//importar underscore para filtrar campos en la actualizacion
const _ = require('underscore');

//rutas

router.post('/nuevo-usuario', async(req, res) => {
    // se construye el body a mano para encriptar la pass body anterior: const body = req.body

    const body = {
        nombre: req.body.nombre,
        email: req.body.email,
        role: req.body.role,
    }
    //encriptar la pass con un coste computacional de saltRounds = 10
    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try {
        const usuarioDB = await User.create(body)
        res.json(usuarioDB)
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurio un eror',
            error
        })
    }
})

router.put('/usuario/:id', [verificarAuth, verificarAdministrador], async(req, res) => {
    const _id = req.params.id;
    //en el array se indican los campos que se pueden modificar
    const body = _.pick(req.body, ['nombre', 'email', 'pass', 'activo']);
    if(body.pass){
        body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
    }
    try {
        const usuarioDB = await User.findByIdAndUpdate(_id, body, {new: true, runValidators: true});
        return res.json(usuarioDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        });
    }
});

//exportar el router

module.exports = router;