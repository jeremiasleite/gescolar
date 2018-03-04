/**
 * Created by jerem_000 on 28/04/2016.
 */
var Aluno = require('../models/aluno');
var ContController = require('../controllers/contController');
var fs = require('fs')//para upload da imagem

exports.save = function (_aluno, callback) {

    var aluno = {
        nomeCompleto: _aluno.nomeCompleto,
        nomeMae: _aluno.nomeMae,
        nomePai: _aluno.nomePai,
        dataNascimento: _aluno.dataNascimento,
        email: _aluno.email,
        cpf: _aluno.cpf,
        rg: _aluno.rg,
        naturalidade: _aluno.naturalidade,
        nacionalidade: _aluno.nacionalidade,
        tipoSanguineo: _aluno.tipoSanguineo,
        sexo: _aluno.sexo,
        celular: _aluno.celular,
        foneFixo: _aluno.foneFixo,
        foneOutro: _aluno.foneOutro,
        cep: _aluno.cep,
        endereco: _aluno.endereco,
        numero: _aluno.numero,
        complemento: _aluno.complemento,
        bairro: _aluno.bairro,
        cidade: _aluno.cidade,
        uf: _aluno.uf,        
        observacao: _aluno.observacao,
        codMatricula: '',        
        religiao: _aluno.religiao,        
        foto : "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"
    }
    ContController.getNextSequence("579ca899ef4054bc1dca4474",function (cont, err) {
        var today = new Date();
        var x = ''
        if(cont<9){
            x='0000'+cont;
        }else if(cont>9 && cont<99){
            x='000'+cont;
        }else if(cont>99 && cont<999){
            x='00'+cont;
        }else if(cont>999 && cont<9999){
            x='0'+cont;
        }else if(cont>9999){
            x=cont;
        }
        aluno.codMatricula = today.getFullYear()+""+x;
        new Aluno(aluno).save(function (error, aluno_) {
            if (error) {                
                callback(null,{msg: 'Erro inesperado, não foi possível salvar!', error: Error})
            } else {
                callback(aluno_);
            }
        });
    })

};
exports.list = function(callback){
    Aluno.find({}, function(error, aluno){
        if(error){
            callback(null,{error: 'Erro ao listar alunos.'});
        } else{
            callback(aluno);
        }
    });
};

exports.findByName = function(_nome, callback){
    Aluno.find({nomeCompleto: new RegExp(_nome, "i")}, function (error, alunos) {
        if(error){
            callback(null,{error: "Erro ao buscar aluno!"});
        }else{
            callback(alunos);
        }
    });
};

exports.findById = function(_id, callback){
    Aluno.findOne({_id: _id}, function (error, aluno) {
        if(error){
            callback(null,{error: "Erro ao buscar aluno!"});
        }else{
            callback(aluno);
        }
    });
};

exports.findByManyId = function(ids, callback){
    Aluno.find({_id:{$in: ids}}, function (error, alunos) {
        if(error){
            callback(null,{error: "Erro ao buscar aluno!"});
        }else{
            callback(alunos);
        }
    });
};

exports.findByMatricula = function(matric, callback){
    Aluno.findOne({codMatricula: matric}, function (error, aluno) {
        if(error){
            callback(null,{error: "Erro ao buscar aluno!"});
        }else{
            callback(aluno);
        }
    });
};

exports.deleteById = function (id, callback) {
    Aluno.remove({_id: id}, function (error, status) {
        if(error){
            callback(null,{sucesso: 'false', msg: 'Não foi possível remover'});
        }else{
            callback({sucesso: 'true', msg: 'Removido com sucesso.'})
        }
    });
}

exports.update = function (id, _aluno, callback) {
    var aluno = {
        nomeCompleto: _aluno.nomeCompleto,
        nomeMae: _aluno.nomeMae,
        nomePai: _aluno.nomePai,
        dataNascimento: _aluno.dataNascimento,
        email: _aluno.email,
        cpf: _aluno.cpf,
        rg: _aluno.rg,
        naturalidade: _aluno.naturalidade,
        nacionalidade: _aluno.nacionalidade,
        tipoSanguineo: _aluno.tipoSanguineo,
        sexo: _aluno.sexo,
        celular: _aluno.celular,
        foneFixo: _aluno.foneFixo,
        foneOutro: _aluno.foneOutro,
        cep: _aluno.cep,
        endereco: _aluno.endereco,
        numero: _aluno.numero,
        complemento: _aluno.complemento,
        bairro: _aluno.bairro,
        cidade: _aluno.cidade,
        uf: _aluno.uf,        
        observacao: _aluno.observacao,        
        religiao: _aluno.religiao        
    }
    var opts = { runValidators: true };
    Aluno.findByIdAndUpdate(id, {$set: aluno}, opts,function (error, status) {
        
        if(error){
            //console.log(error)
            if(error.errors){
                callback(null,{sucesso: 'false',msg: error.errors.nome.message});
            }else if(error.errors.cpf){
                callback(null,{sucesso: 'false',msg: error.errors.cpf.message});
            }else if(error.errors.email){
                callback(null,{sucesso: 'false',msg: error.errors.email.message});
            }else if(error.errors){
                callback(null,{sucesso: 'false',msg: 'Formulário preechido incorretamente!'});
            }else{
                callback(null,{sucesso: 'false',msg: 'Não foi possível salvar, Ocorreu um erro inesperado!'});
            }
        } else{
            callback({sucesso: 'true', msg: "Atualizado com sucesso." });
        };
    });
};

exports.atualizarFoto = function (id, _image, callback) {
    fs.readFile('./uploads/'+_image.filename, function (error, data) {
        data = new Buffer(data).toString('base64');
        if(error){
            callback(null,error);
        }
            
        else{
            Aluno.update({ _id: id }, { $set: {foto:data} }, { upsert: true }, function (error, status) {
                if (error) {
                    fs.unlink('./uploads/'+_image.filename);
                    callback(null,error);
                } else {
                    fs.unlink('./uploads/'+_image.filename);
                    callback({ sucess: "ok" });
                }
            });
        }
    });
}

exports.atualizarFoto64 = function (id, _image64, callback) {
    Aluno.update({ _id: id }, { $set: {foto:_image64} }, { upsert: true }, function (error, status) {
        if (error) {
            callback(null,error);
        } else {
            callback({ sucess: "ok" });
        }
    });

}

exports.atualizarDadosMedicos = function (id, dados, callback){
    Aluno.update({ _id: id }, { $set: {dadosMedicos: dados} }, { upsert: true }, function (error, status) {
        if (error) {
            callback(null,error);
        } else {
            callback({ sucess: "ok" });
        }
    });
}