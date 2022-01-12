import express from 'express';
const router =  express.Router();

//importar el modelo de las notas
import Nota from '../models/nota.js';

//middlewares personalizados
const {verificarAuth, verificarAdministrador} = require('../middlewares/autenticacion');

//agregar una nota

router.post('/nueva-nota', verificarAuth, async(req, res)=>{
    const body = req.body;
    //como para el momento que un usuario añade una nota ya tiene un token, se puede setear la propiedad
    //id de usuario del token(que es la info encriptada del usuario) en la nota. ver schema de la nota
    body.usuarioId = req.usuario._id;
    try {
        const notaDB = await Nota.create(body);
        res.status(200).json(notaDB);
    } catch (error) {
        return res.status(500).json({mensaje: 'Ocurrio un error', error});
    }
});

//get con parametros para consegir unicos documentos
router.get('/nota/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const notaDB = await Nota.findOne({_id})
        // el status 200 esta por defecto en express
        res.json(notaDB)
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})

//get sin parametros para conseguir todos los documentos
// router.get('/nota', verificarAuth, async(req, res) => {
//     //con el middleware podemos filtrar todas las notas que haya escruto ese usuario en particular
//     const usuarioId = req.usuario._id;
//     try {
//         //el parametro del find es para filtral la informacion
//         const notaDB = await Nota.find({usuarioId});
//         res.json(notaDB)
//     } catch (error) {
//         return res.status(400).json({
//             mensaje: 'Ocurrio un error',
//             error
//         })
//     }
// })

//get con paginacion para conseguir todos los documentos en partes, por lo tanto, la ruta anterior ya no
//es necesaria
router.get('/nota', verificarAuth, async(req, res) => {
    //con el middleware podemos filtrar todas las notas que haya escruto ese usuario en particular
    const usuarioId = req.usuario._id;
    //para leer parametros de la url (como si fueran formularios get de php) se usa query o 5 por defecto
    //Numbre para convertir el numero de string a numerico
    const limite = Number(req.query.limite) || 5
    //configurar el salto de documentos en la consulta para hacer la paginacion
    const skip = Number(req.query.skip) || 0
    try {
        //el parametro del find es para filtral la informacion
        //limit es para mostrar la cantidad indicada de documentos
        //skip es para saltar cierta cantidad de documentos
        const notaDB = await Nota.find({usuarioId}).limit(limite).skip(skip);
        //contar documentos
        const totalNotas = await Nota.find({usuarioId}).countDocuments();
        res.json({notaDB, totalNotas})
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})

//delete para eliminar datos
router.delete('/nota/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const notaDB = await Nota.findByIdAndDelete({_id})
        if(!notaDB){
            return res.status(400).json({
                mensaje: 'Ocurrio un error',
                error
            })
        }
        res.json(notaDB)
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})

//actualizar documentos
router.put('/nota/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const notaDB = await Nota.findByIdAndUpdate(_id, body, {new: true})
        res.json(notaDB)
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})

//exportar el router

module.exports = router;