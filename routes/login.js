var express = require('express');
var app = express();
var router = express.Router();
var userController = require('../controllers/userController');
var session = require('express-session')
var pug = require('pug');
//var jwt = require('jsonwebtoken');
var flash = require('express-flash');

app.set('views','./views');
app.set('view engine', 'pug');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true, 
    cookie: { maxAge: 3600000 }
}))
app.use(flash());


router.get('/', function (req, res) {    
    res.render('login', {});   
});
router.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
        res.redirect('/login');
    })    
});


router.post('/', function(req, res){
    userController.login(req.body, function(user, error){
        if(error){
            req.flash('info', error.error);
            res.render('login', {});
        }else{
            
            if(user){
                req.session.regenerate(function(){
                    //var token = jwt.sign({_id: user._id, tipoUser: user.tipoUser}, global.getSuperSecret, {
				    //expiresIn: 3600000});
                    req.session.user = {username: user.username, id: user._id, tipoUser: user.tipoUser};                       
                    res.redirect('/');
                });               
                
            }else{
                
                res.render('login', {});
            }
        }
    });
});


module.exports = router;