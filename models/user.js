var funcoes = require('../funcoes');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
		trim: true,
		unique: true,
        required: true
    },
    
    nome: {
        type: String,        
        validate: {
            validator: function(v) {
                if(v.length>4&&v.length<30&&/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(v)){
                    return true;
                }else{
                    return false;
                }
            },
            message: '{VALUE} O nome deve ter somente letras e 5 à 30 caracteres!'
        },
        required: true
    },
    
    email: {
        type: String,
        validate: {
            validator: function(v) {
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return filter.test(v)
            },
            message: '{VALUE} Este email não é um email válido!'
        },
        required: [true,'Por favor inserir um email!'],
        trim: true,
        unique: [true,'Email já existe no cadastro, digite outro email!']
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    cpf: {
        type: String,
        /*validate: {
            validator: function(v) {
                return funcoes.TestaCPF(v)
            },
            message: '{VALUE} O CPF informado é inválido!'
        },*/
        required: true,
        trim: true,
        unique: true
    },
    tipoUser: {//0-administrador, 1-gestor, 2-secretário, 3-professor
        type: String,
        enum:['0','1', '2', '3'],
        required: true
    },
    status: {
        type: String,
        enum:['Ativo', 'Inativo'],
        default: 'Ativo'
    },
    dataCadastro:{
        type: Date,
        default: Date.now
    },
   

});

module.exports = mongoose.model('User', UserSchema);