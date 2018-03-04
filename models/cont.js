/**
 * Created by jerem_000 on 12/07/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contSchema = new Schema({
    modelo: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('cont', contSchema);