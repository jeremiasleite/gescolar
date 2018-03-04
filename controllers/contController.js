/**
 * Created by jerem_000 on 12/07/2016.
 */
var Cont = require('../models/cont');

exports.inserir = function (id, modelo, callback) {
    var cont = new Cont({_id: id,modelo: modelo, seq: 1});
    cont.save(function (err) {
        if(err){
            callback(err)
        }else{
            callback({msg: 'Cadastrado com sucesso.'})
        }

    })
}

exports.getNextSequence = function(id, callback) {
    Cont.findByIdAndUpdate(id, {$inc: {seq:1}}, function (err, data) {
        if(err){
            callback(err)
        }else{
            callback(data.seq)
        }

    });
}