/**
 * Created by jerem_000 on 28/04/2016.
 */
var User = require('../models/user');
var sha512 = require('sha512');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var token = require('token');

token.defaults.secret = 'gerenciadorEscolar';
token.defaults.timeStep = 30*60;// 30 minutos

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'jeremias23456@gmail.com',
        pass: 'batista86'
    }
}));

exports.save = function (_user, callback) {
    var user = {
        username: _user.username,
        nome: _user.nome,
        email: _user.email,
        password: sha512(_user.password).toString('hex'),
        cpf: _user.cpf,
        tipoUser: _user.tipoUser,
        status: _user.status
    }
    new User(user).save(function (error, _user) {
        if (error) {
            if (error.code == 11000) {
                var email = error.errmsg.search('email_1');
                var cpf = error.errmsg.search('cpf_1');
                var username = error.errmsg.search('username_1');
                if (email >= 0) {
                    callback(null, { sucesso: 'false', msg: "Email já existe no cadastrado!" })
                } else if (cpf >= 0) {
                    callback(null, { sucesso: 'false', msg: "CPF já existe no cadastrado!" })
                } else if (username >= 0) {
                    callback(null, { sucesso: 'false', msg: "Username já existe no cadastrado!" })
                } else {
                    callback(null, { sucesso: 'false', msg: "Não foi possível salvar, Ocorreu um erro inesperado!" });
                }
            } else if (error.errors.nome) {
                callback(null, { sucesso: 'false', msg: error.errors.nome.message });
            } else if (error.errors.cpf) {
                callback(null, { sucesso: 'false', msg: error.errors.cpf.message });
            } else if (error.errors.email) {
                callback(null, { sucesso: 'false', msg: error.errors.email.message });
            } else if (error.errors.tipoUser) {
                callback(null, { sucesso: 'false', msg: 'Entre com um dos seguintes valores: Administrador, Gestor, Secretário ou Professor.' });
            } else if (error.errors.status) {
                callback(null, { sucesso: 'false', msg: 'Entre com um dos seguintes valores: Ativo ou Inativo' });
            } else {
                //callback({sucesso: 'false',msg: 'Não foi possível salvar, Ocorreu um erro inesperado!'});
                callback(null, error);
            }
        } else {
            callback({ msg: 'Cadastrado com sucesso!' });
        }
    });
};
exports.list = function (callback) {
    User.find({}, 'nome username email cpf status tipoUser dataCadastro', function (error, user) {
        if (error) {
            callback(null, { error: 'Erro ao listar usuário.' });
        } else {
            callback(user);
        }
    });
};

exports.listPorTipo = function (tipo, callback) {
    User.find({ tipoUser: tipo }, 'nome username email cpf status tipoUser dataCadastro', function (error, user) {
        if (error) {
            callback(null, { error: 'Erro ao listar usuário.' });
        } else {
            callback(user);
        }
    });
};

exports.findId = function (id, callback) {
    User.findById(id, 'nome username email cpf status tipoUser dataCadastro', function (error, user) {
        if (error) {
            callback(null, { error: 'Erro ao buscar usuário.' });
        } else {
            callback(user);
        }
    });
};
exports.login = function (login, callback) {
    if (login && login.username && login.password) {
        User.find({ username: login.username, password: sha512(login.password).toString('hex')}, function (error, users) {
            if (error) {
                callback(null, error);
            } else {
                if (users.length > 0) {
                    if (users[0].status == 'Ativo') {
                        callback(users[0]);
                    } else {
                        callback(null, { error: 'Usuário desativado!' });
                    }
                } else {
                    callback(null, { error: 'Usuário ou senha inválidos!' });
                }
            }
        });
    } else {
        callback(null, { error: 'Usuário ou senha inválidos.' });
    }
};
exports.deleteById = function (id, callback) {
    User.findById(id, function (error, user) {
        if (user.username == 'admin') {
            callback(null, { sucesso: 'false', msg: 'Não foi possível remover, o usuário admin não pode ser removido!' });
        } else {
            User.remove({ _id: id }, function (error, status) {
                if (error) {
                    callback(null, { sucesso: 'false', msg: 'Não foi possível remover!' });
                } else {
                    callback({ sucesso: 'true', msg: 'Usuário removido com sucesso.' })
                }
            });
        }
    })
}
exports.update = function (id, body, callback) {

    User.findById(id, function (error, user) {
        if (user.username == 'admin' && body.tipoUser != '0') {
            callback(null, { sucesso: 'false', msg: "O tipo de usuário desse usuário não pode ser alterado!" })
        }else if (user.username == 'admin' && body.username != 'admin') {
            callback(null, { sucesso: 'false', msg: "O username desse usuário não pode ser alterado!" })
        } else {
            var opts = { runValidators: true };
            User.findByIdAndUpdate(id, { $set: body }, opts, function (error, status) {
                if (error) {
                    if (error.code == 11000) {
                        var email = error.errmsg.search('email_1');
                        var cpf = error.errmsg.search('cpf_1');
                        var username = error.errmsg.search('username_1');
                        if (email >= 0) {
                            callback(null, { sucesso: 'false', msg: "Email já existe no cadastrado!" })
                        } else if (cpf >= 0) {
                            callback(null, { sucesso: 'false', msg: "CPF já existe no cadastrado!" })
                        } else if (username >= 0) {
                            callback(null, { sucesso: 'false', msg: "Nome username já existe no cadastrado!" })
                        } else {
                            callback(null, { sucesso: 'false', msg: "Não foi possível salvar, Ocorreu um erro inesperado!" });
                        }
                    } else if (error.errors.nome) {
                        callback(null, { sucesso: 'false', msg: error.errors.nome.message });
                    } else if (error.errors.cpf) {
                        callback(null, { sucesso: 'false', msg: error.errors.cpf.message });
                    } else if (error.errors.email) {
                        callback(null, { sucesso: 'false', msg: error.errors.email.message });
                    } else if (error.errors.tipoUser) {
                        callback(null, { sucesso: 'false', msg: 'Entre com um dos seguintes valores: Administrador, Gestor, Secretário ou Professor.' });
                    } else {
                        callback(null, { sucesso: 'false', msg: 'Não foi possível salvar, Ocorreu um erro inesperado!' });
                    }
                } else {
                    callback({ sucesso: 'true', msg: "Atualizado com sucesso." });
                };
            })
        }
    })

}

exports.updateStatus = function (id, body, callback) {
    if (body.status == 'Ativo' || body.status == 'Inativo') {
        User.findById(id, function (error, user) {
            if (error) {
                callback(null, { sucesso: 'false', msg: 'Não foi possível Atualizar!' });
            } else {
                if (user.username == 'admin') {
                    callback(null, { sucesso: 'false', msg: 'Não foi possível Atualizar! O usuário admin não pode ser desativado.' });
                } else {
                    user.status = body.status;
                    user.save(function (error) {
                        if (error) {
                            console.log(error)
                        }
                        callback({ sucesso: 'true', msg: "Atualizado com sucesso." });
                    })
                }
            };
        })
    } else {
        callback(null, { sucesso: 'false', msg: 'Não foi possível Atualizar! dados inválido.' });
    }

}
exports.updateSenha = function (id, body, callback) {
    if (body.password == body.rePassword) {
        if (body.password.length > 5 && body.password.length < 9) {
            User.findByIdAndUpdate(id, { $set: { password: sha512(body.password).toString('hex') } }, function (error, status) {
                if (error) {
                    callback(null, { sucesso: 'false', msg: 'Não foi possível Atualizar!' });
                } else {
                    callback({ sucesso: 'true', msg: "Senha atualizada com sucesso." });
                };
            });
        } else {
            callback(null, { sucesso: 'false', msg: 'A Senha deve ter entre 6 à 8 caracteres!' });
        }
    } else {
        callback(null, { sucesso: 'false', msg: 'As Senhas devem ser iguais!' });
    }
}

exports.recuperarSenha_enviarToken = function (email, callback) {
	User.find({email: email},function (err, users) {
		if (err) {
			callback({error: 'Error ao buscar usuário!'})
		} else {
			if (users.length===1) {
				var tokenGenerated = token.generate(email);
				var mailOptions = {
					from: '"G.E-PRO" <medhelp.noreply@gmail.com>',
					to: email,
					subject: 'Recuperar senha do G.E-PRO',
					text: 'Recuperar senha do G.E-PRO',
					html: '<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width" /> <!-- For development, pass document through inliner --> </head><body style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;width: 100% !important;height: 100%;background: #efefef;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: none"><table class="body-wrap" style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;width: 100% !important;height: 100%;background: #efefef;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: none"> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td class="container" style="margin: 0 auto !important;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;display: block !important;clear: both !important;max-width: 580px !important"> <!-- Message start --> <table style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;width: 100% !important;border-collapse: collapse"> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td align="center" class="masthead" style="margin: 0;padding: 80px 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;background: #336699;color: white"> <h1 style="margin: 0 auto !important;padding: 0;font-size: 32px;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.25;margin-bottom: 20px;max-width: 90%;text-transform: uppercase">Recupere sua senha</h1> </td> </tr> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td class="content" style="margin: 0;padding: 30px 35px;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;background: white"> <h2 style="margin: 0;padding: 0;font-size: 28px;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.25;margin-bottom: 20px">Olá '+users[0].nome+'</h2> <p style="margin: 0;padding: 0;font-size: 16px;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;font-weight: normal;margin-bottom: 20px">Foi feito um pedido de recuperação de senha na sua conta do Sistema de Gestão Educacional Proficional.</p> <table style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;width: 100% !important;border-collapse: collapse"> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td align="center" style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <p style="margin: 0;padding: 0;font-size: 16px;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;font-weight: normal;margin-bottom: 20px"> <a href="http://localhost/users/cadastrarnovasenha?id='+users[0]._id+'&token='+tokenGenerated+'" class="button" style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;color: white;text-decoration: none;display: inline-block;background: #336699;border: solid #336699;border-width: 10px 20px 8px;font-weight: bold;border-radius: 4px">Recupere sua senha</a> </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td class="container" style="margin: 0 auto !important;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;display: block !important;clear: both !important;max-width: 580px !important"> <!-- Message start --> <table style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;width: 100% !important;border-collapse: collapse"> <tr style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65"> <td class="content footer" align="center" style="margin: 0;padding: 30px 35px;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;background: none"> <p style="margin: 0;padding: 0;font-size: 14px;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;font-weight: normal;margin-bottom: 0;color: #888;text-align: center">Enviado por <a href="#" style="margin: 0;padding: 0;font-size: 100%;font-family: &quot;Avenir Next&quot;, &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;line-height: 1.65;color: #888;text-decoration: none;font-weight: bold">G.E-PRO</a></p> </td> </tr> </table> </td> </tr></table></body></html>'
				};
				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						callback(null,error);
					}
					else{
						callback({success: 'true'});
					}
				});
			}else{
				callback(null,{error: 'Usuário não existe!'})
			}

		}
	});
}
//body:{tokenGenerated:'', newPassword:'', reNewPassword:''}
/*UserController.prototype.forgottenPassword = function (_id, body, callback) {
	User.findById(_id,function (err, user) {
		if (err) {
			callback({error: 'Error ao buscar usuário!'})
		} else {
			if (user) {
				if(token.verify(user.email, body.tokenGenerated)==1){
					if(body.newPassword.length>6 && body.newPassword===body.reNewPassword){
						var newPassword = sha512(body.newPassword).toString('hex')
						user.password = newPassword;
						user.save(function (err) {
							if(err){
								callback({error: 'Não foi possível alterar a senha!'})
							}else{
								callback({success: 'true'});
							}
						})
					}else{
						callback({error: 'Nova senha inválida!'})
					}
				}else {
					callback({error: 'Tempo de recuperação de senha expirado!'})
				}
			} else {
				callback({error: 'Usuário não existe!'})
			}
		}
	});
}*/
