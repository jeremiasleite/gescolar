var express = require('express');
var app = express();
var router = express.Router();
var userController = require('../controllers/userController');
var pug = require('pug');
app.set('views','./views');
app.set('view engine', 'pug');

router.get('/perfil', function (req, res) {
    //userController.findId(req.session.user.id, function(user, error){
        var user_ = {nome: 'jeremias', _id: 1, email: 'jeremias@gmail.com', username: 'jeremias12', tipoUser: '0', cpf: '0542', status: 'ativo', dataCadastro: '12/02/2017'}
        res.render('usuario/perfil', {user: user_});
    //})
    
});

router.get('/', function (req, res) {
    userController.list(function (resp) {
      res.render('usuario/users',{users: resp});
    });
});

router.get('/cadastrar', function (req, res) {
   res.render('usuario/cadastrar',{});
})

router.post('/cadastrar', function(req, res){
    userController.save(req.body, function(resp, error){
        if(error){
            res.render('usuario/msgErro', {msg: 'Ocorreu um erro, e não foi possível cadastrar!', voltar: '/users/cadastrar'});
        }else{
            res.render('usuario/msgSucesso',{voltar: '/users',msg: resp.msg});
        }
    });

});

router.get('/atualizar/:id', function (req, res) {
    userController.findId(req.params.id,function(resp){
        if(resp){
             res.render('usuario/atualizar', {user: resp});
        }else{
            res.render('usuario/msgErro', {msg: 'Falha ao tentar atualizar!', voltar: '/users'});
        }       
    })    
});

router.post('/atualizar/:id', function (req, res) {
    userController.update(req.params.id,req.body, function (status, error) {
        if(error){
            res.render('usuario/msgErro', {msg: 'Falha ao tentar atualizar!',voltar: '/users/atualizar/'+req.params.id});
        }else{
            //console.log(status);
            res.render('usuario/msgSucesso', {msg: status.msg, voltar: '/users'});            
        }
    })
})

router.post('/excluir/:id',function (req, res) {
    userController.deleteById(req.params.id, function (resp, error) {
      if(error){
         res.render('usuario/msgErro', {msg: error.msg, voltar: '/users'});
      }else{
         res.render('usuario/msgSucesso', {msg: resp.msg, voltar: '/users'});
      }
               
    })
})

router.get('/excluir/:id',function (req, res) {
    userController.findId(req.params.id, function(user, error){
        res.render('usuario/excluir', {user: user});
    })
})
/*router.get('/atualizar/senha', function (req, res) {
   userController.findId(req.session.user.id, function(user, error){
        res.render('usuarios/atualizarSenha', {user: user, usuario: req.session.user.username});
    })
});

router.post('/atualizar/senha', function (req, res) {
   userController.updateSenha(req.session.user.id, req.body, function (resp, error) {
        if(error){
            res.render('usuarios/msg',{msg: error.msg, voltar: '/users/atualizar/senha', usuario: req.session.user.username});
        }else{
            res.render('usuarios/msg',{msg: resp.msg, voltar: '/users/atualizar/senha', usuario: req.session.user.username});
        }
    })
});









router.put('/atualizarstatus/:id', function (req, res) {
    var status = 'Inativo';
    if(req.body.status && req.body.status=='on'){
        status = 'Ativo'        
    }else{
        status = 'Inativo'
    }
    userController.updateStatus(req.params.id,{status: status}, function (status, error) {
        res.redirect('/users');        
    });
    
})

router.get('/recuperarsenha', function (req, res) {
   res.render('usuarios/recuperarSenha');
});
router.post('/recuperarsenha', function (req, res) {
   userController.recuperarSenha_enviarToken(req.body.email, function(result, error){
       res.send(result);
   })   
});

router.get('/cadastrarnovasenha', function (req, res) {    
    res.render('usuarios/recuperarSenha');
});*/

module.exports = router;
