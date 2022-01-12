import express from "express";
const router = express.Router();

//JSON web token para firmas electricicas de usuarios
const jwt = require('jsonwebtoken')

//importar el modelo de los usuarios
import User from '../models/user';

//importar el bcrypt para encriptar contraseñas
const bcrypt = require('bcrypt');
const saltRounds = 10;

//rutas

router.post('/', async(req, res) => {
    const body = req.body;
    try {
        //se busca el email
        const usuarioDB = await User.findOne({email: body.email})
        //se valida si existe el email
        if(!usuarioDB){
            return res.status(400).json({mensaje: 'correo no valido'})
        }
        //se valida la pass
        if(!bcrypt.compareSync(body.pass, usuarioDB.pass)){
            return res.status(400).json({mensaje: 'Contraseña incorrecta'})
        }

        //Generar token. se incluye la data publica del usuario, una clave secreta en string y la expitacion en s
        const token = jwt.sign({
            data: usuarioDB
        }, 'secret', {expiresIn: 60 * 60 * 24 * 30})

        //si todas las validaciones son correctas, se devuelve el u y un token
        return res.json({
            usuarioDB,
            token
        }) 
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})









module.exports = router;