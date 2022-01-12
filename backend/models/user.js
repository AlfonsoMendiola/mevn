import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//libreria para validar que un campo debe ser unico, la propiedad unique ya puede ser usada
const uniqueValidator = require('mongoose-unique-validator');

const roles = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} Rol no valido'
}

const userSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre obligatorio']},
    email: {type: String, required:[true, 'Correo obligatorio'], unique: true},
    pass: {type: String, required:[true, 'La contraseña es necesaria']},
    date: {type: Date, default: Date.now},
    role: {type: String, default:'USER', enum: roles},
    activo: {type: Boolean, default: true}
});
// validar el email
userSchema.plugin(uniqueValidator, {message: 'Error, esperaba {PATH} unico'});

// Ocular la contraseña encriptada del ususario de la respuesta json
userSchema.methods.toJSON = function (){
    const obj = this.toObject();
    delete obj.pass;
    return obj;
}

//convertir a modelo de mongoose y exportar
const User = mongoose.model('User', userSchema);
export default User;