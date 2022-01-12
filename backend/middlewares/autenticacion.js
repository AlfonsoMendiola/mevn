const jwt = require('jsonwebtoken');


//Este middelware permite usar el token del usuario para añadir seguridad a la web
const verificarAuth = (req, res, next) =>{
    //debido a que el middleware se esta usan do en una rura que ya retorna una respuesta
    //no se puide retornar una respuesta desde el middleware
    // res.json({
    //     mensaje: 'Dentro del middelware de auth'
    // })
    //se crea una cabecera con datos
    const token = req.get('token');
    jwt.verify(token, 'secret', (err, decoded) =>{
        if(err){
            return res.status(401).json({
                mensaje: 'usuario no valido'
            })
        }
        req.usuario = decoded.data;
        next();
    })
    //next permite que se ejecute el codigo de la ruta
    
}

const verificarAdministrador = (req, res, next) => {
    const rol = req.usuario.role
    if(rol === 'ADMIN'){
        next();
    }else{
        return res.status(401).json({mensaje: 'Usuario no valido'})
    }
}


module.exports = {verificarAuth, verificarAdministrador}