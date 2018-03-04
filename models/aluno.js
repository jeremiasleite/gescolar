/**
 * Created by jerem_000 on 13/05/2016.
 */
var funcoes = require('../funcoes');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlunoSchema = new Schema({
    nomeCompleto: {
        type: String,
        maxlength: [30,'O nome deve ter no máximo 50 caracteres!'],
        minlength: [5, 'O nome deve ter no minimo 5 caracteres!'],
        //match: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
        required: true
    },
    nomeMae: {
        type: String,
        maxlength: [30, 'O nome da mãe deve ter no máximo 50 caracteres']
        
    },
    nomePai: {
        type: String,
        maxlength: [30, 'O nome do pai deve ter no máximo 50 caracteres']
        
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },    
    dataNascimento: {
        type: Date,
        required: [true,'Informe a data de nascimento']
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return filter.test(v)
            },
            message: '{VALUE} Este email não é um email válido!'
        }
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
        unique: true
    },
    rg: {
        type: String,
        maxlength: [15, 'O rg deve ter no máximo 15 caracteres'],
        unique: true
        
    },
    naturalidade: {
        type: String,
        maxlength: [30, 'O naturalidade deve ter no máximo 30 caracteres']
        
    },
    nacionalidade: {
        type: String,
        maxlength: [30, 'O nacionalidade deve ter no máximo 30 caracteres']
    },
    tipoSanguineo: {
        type: String,
        enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-']        
    },
    sexo: {
        type: String,
        enum: ['M','F','-']
    },
    celular: {
        type: String,
        maxlength: [16, 'O telefone deve ter no máximo 16 caracteres']
    },
    foneFixo: {
        type: String,
        maxlength: [16, 'O telefone deve ter no máximo 16 caracteres']
    },
    foneOutro: {
        type: String,
        maxlength: [16, 'O telefone deve ter no máximo 16 caracteres']
    },
    cep: {
        type: String,        
    },
    endereco: {
        type: String,
        maxlength: [50,'O campo endereço deve ter no máximo 50 caracteres']
    },
    numero: {
        type: String,
        match: /^[0-9]*$/
    },
    complemento: {
        type: String,
        maxlength: [50, 'O Complemento deve ter no máximo 50 caracteres']
    },
    bairro: {
        type: String,
        maxlength: [30, 'O Bairro deve ter no máximo 30 caracteres'],
        
    },
    cidade: {
        type: String,
        maxlength: [30, 'O cidade deve ter no máximo 30 caracteres'],
        
    },
    uf: {
        type: String,
        match: /^[a-zA-Z]{2}$/,
        
    },    
    observacao: {
        type: String,
        maxlength: [200, 'O campo observação deve ter no máximo 200 caracteres']
    },
    foto: {
        type: String
    },    
    religiao: {
        type: String
    },
    codMatricula: { //anoDaMatricula(2016)+cont(0000001)=>20160000001
        type: String,
        required: true
    },
    dadosMedicos:{
        usaRemedios: String,
        qualAlergia: String,
        alergiaManifesta: String,
        trataAlergia: String,
        alergiaARemedio: String,
        cuidadoAlergia: String,
        teveDoencas: String,
        vacinaAntitetanica: String,
        vacinaFebreAmarela: String,
        outraVacina: String,
        problema1: Boolean,
        problema2: Boolean,
        problema3: Boolean,
        problema4: Boolean,
        problema5: Boolean,
        problema6: Boolean,
        problema7: Boolean,
        problema8: Boolean,
        problema9: Boolean,
        problema10: Boolean,
        problema11: Boolean,
        problema12: Boolean,
        outroProblema: String,
        febre: String,
        podeTomarAlergia: String,
        enjoo: String,
        instestinoSolto: String,
        vegetariano: Boolean,
        carneSuina: Boolean,
        carneBovina: Boolean,
        outraRestricao: String,
        sabeNadar: Boolean,
        podeNadar: Boolean
    }
})

module.exports = mongoose.model('aluno', AlunoSchema);