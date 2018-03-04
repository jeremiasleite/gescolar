var express = require('express');
var app = express();
var router = express.Router();
var alunoController = require('../controllers/alunoController');
//var vinculoController = require('../controllers/vinculoController');
//var turmaController = require('../controllers/turmaController');
//var responsavelController = require('../controllers/responsavelController');
//var escolaController = require('../controllers/escolaController')
var flash = require('express-flash');
var pug = require('pug');
app.set('views', './views');
app.set('view engine', 'pug');
var multer = require('multer')//para upload da imagem
var upload = multer({ dest: 'uploads/' })//para upload da imagem
app.use(flash());

router.get('/cadastrar', function (req, res) {    
    var aluno = {
        nomeCompleto: '',
        nomeMae: '',
        nomePai: '',
        dataNascimento: '',
        email: '',
        cpf: '',
        rg: '',
        naturalidade: '',
        nacionalidade: 'Brasileiro',
        tipoSanguineo: '',
        sexo: '',
        celular: '',
        foneFixo: '',
        foneOutro: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        observacao: '',
        religiao: ''

    }
    res.render('aluno/cadastrar', {aluno: aluno});
});

router.post('/cadastrar', function (req, res) {
    var data = req.body.dataNascimento.split('/');
    var _aluno = {
        nomeCompleto: req.body.nomeCompleto,
        nomeMae: req.body.nomeMae,
        nomePai: req.body.nomePai,
        dataNascimento: new Date(data[2], data[1] - 1, data[0]),
        email: req.body.email,
        cpf: req.body.cpf,
        rg: req.body.rg,
        naturalidade: req.body.naturalidade,
        nacionalidade: req.body.nacionalidade,
        tipoSanguineo: req.body.tipoSanguineo,
        sexo: req.body.sexo,
        celular: req.body.celular,
        foneFixo: req.body.foneFixo,
        foneOutro: req.body.foneOutro,
        cep: req.body.cep,
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        observacao: req.body.observacao,
        religiao: req.body.religiao
    }
    alunoController.save(_aluno, function (aluno, error) {
        if (error) {            
            var aluno = {
                nomeCompleto: req.body.nomeCompleto,
                nomeMae: req.body.nomeMae,
                nomePai: req.body.nomePai,
                dataNascimento:req.body.dataNascimento,
                email: req.body.email,
                cpf: req.body.cpf,
                rg: req.body.rg,
                naturalidade: req.body.naturalidade,
                nacionalidade: req.body.nacionalidade,
                tipoSanguineo: req.body.tipoSanguineo,
                sexo: req.body.sexo,
                celular: req.body.celular,
                foneFixo: req.body.foneFixo,
                foneOutro: req.body.foneOutro,
                cep: req.body.cep,
                endereco: req.body.endereco,
                numero: req.body.numero,
                complemento: req.body.complemento,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                uf: req.body.uf,
                observacao: req.body.observacao,
                religiao: req.body.religiao
            }
            req.flash('info', error.msg)
            res.render('aluno/cadastrar', { aluno: aluno, voltar: '/'});
        } else {
            //res.render('alunos/inserirFoto', { aluno: aluno, voltar: '/', usuario: req.session.user.username });
            res.redirect('/aluno/' + aluno._id+'/perfil')
        }
    });
});

router.post('/', function (req, res) {
    alunoController.findByName(req.body.nome, function (resp, error) {
        if (resp.length === 0) {
            res.render('aluno/listar', {alunos: []});
        } else {
            res.render('aluno/listar', {alunos: resp});
        }
    })
});

router.get('/:id/perfil/', function (req, res) {
    alunoController.findById(req.params.id, function (resp, error) {
        res.render('aluno/perfil', { aluno: resp})
    })
});

router.get('/:id/atualizar', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        if (aluno) {
            res.render('aluno/atualizar', { aluno: aluno});
        } else {
            res.redirect('/alunos/'+req.params.id+'/atualizar')
        }
    })
});
router.post('/:id/atualizar', function (req, res) {
    var data = req.body.dataNascimento.split('/');
    var aluno = {
        nomeCompleto: req.body.nomeCompleto,
        nomeMae: req.body.nomeMae,
        nomePai: req.body.nomePai,
        dataNascimento: new Date(data[2], data[1] - 1, data[0]),
        email: req.body.email,
        cpf: req.body.cpf,
        rg: req.body.rg,
        naturalidade: req.body.naturalidade,
        nacionalidade: req.body.nacionalidade,
        tipoSanguineo: req.body.tipoSanguineo,
        sexo: req.body.sexo,
        celular: req.body.celular,
        foneFixo: req.body.foneFixo,
        foneOutro: req.body.foneOutro,
        cep: req.body.cep,
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        observacao: req.body.observacao,
        religiao: req.body.religiao
    }
    alunoController.update(req.params.id, aluno, function (status, error) {
        if (error) {
            res.render('aluno/msgError', { msg: 'Falha ao tentar atualizar!', voltar: '/alunos/buscar/' + req.params.id });
        } else {
            res.redirect('/alunos/'+req.params.id+'/atualizar')
        }
    })
})

//atualizar foto, escolher entre pc e wbcam
/*router.get('/:id/atualizar/foto/', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/atualizarFoto', { aluno: aluno, usuario: req.session.user.username });
    })
});*/

//adicionar foto web can no cadastro de aluno 
/*router.get('/:id/foto/uploadfotowebcam', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/foto', { aluno: aluno, usuario: req.session.user.username, action: '/alunos/' + req.params.id + '/foto/uploadfotowebcam' });
    })
});

router.post('/:id/foto/uploadfotowebcam', function (req, res) {
    alunoController.atualizarFoto64(req.params.id, req.body.foto, function (aluno, error) {
        res.redirect('/alunos/' + req.params.id + '/responsavel')
    })
});

//atualizar foto webcam do aluno 
router.get('/:id/atualizar/foto/uploadfotowebcam', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/foto', { aluno: aluno, usuario: req.session.user.username, action: '/alunos/' + req.params.id + '/atualizar/foto/uploadfotowebcam' });
    })
});

router.post('/:id/atualizar/foto/uploadfotowebcam', function (req, res) {
    alunoController.atualizarFoto64(req.params.id, req.body.foto, function (aluno, error) {
        res.redirect('/alunos/buscar/' + req.params.id)
    })
});
//atualizar foto do aluno upload do pc
router.get('/:id/atualizar/foto/uploadfotopc', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/uploadFotoPc', { aluno: aluno, usuario: req.session.user.username, action: '/alunos/' + req.params.id + '/atualizar/foto/uploadfotopc' });
    })
});

router.post('/:id/atualizar/foto/uploadfotopc', upload.single('foto'), function (req, res) {
    alunoController.atualizarFoto(req.params.id, req.file, function (aluno, error) {
        res.redirect('/alunos/buscar/' + req.params.id)
    })
});
//inserir foto para cadastro do aluno
/*router.get('/:id/foto/uploadfotopc', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/uploadFotoPc', { aluno: aluno, usuario: req.session.user.username, action: '/alunos/' + req.params.id + '/foto/uploadfotopc' });
    })
});

router.post('/:id/foto/uploadfotopc', upload.single('foto'), function (req, res) {
    alunoController.atualizarFoto(req.params.id, req.file, function (aluno, error) {
        res.redirect('/alunos/' + req.params.id + '/responsavel')
    })
});*/

/*router.get('/:id/responsavel', function (req, res) {
    alunoController.findById(req.params.id, function (aluno, error) {
        res.render('alunos/inserirResponsavel', { aluno: aluno, usuario: req.session.user.username });
    })
});

router.post('/:id/responsavel', function (req, res) {
    responsavelController.inserir(req.body, function (responsavel, error) {
        if (!error) {
            alunoController.findById(req.params.id, function (aluno, error) {
                req.flash('info', 'Responsavel ' + responsavel.nome + ' Cadastrado com sucesso! deseja cadastrar outro?');
                res.render('alunos/inserirResponsavel', { aluno: aluno, usuario: req.session.user.username });
            })
        }
    })
});

router.get('/:idAluno/responsavel/lista', function (req, res) {
    responsavelController.listar(req.params.idAluno, function (responsaveis, error) {
        alunoController.findById(req.params.idAluno, function (aluno, error) {
            res.render('alunos/listarResponsaveis', { aluno: aluno, responsaveis: responsaveis, usuario: req.session.user.username });
        })
    })
});

router.get('/:id/responsavel/:idResp/atualizar', function (req, res) {
    responsavelController.buscarId(req.params.idResp, function (responsavel, error) {
        res.render('alunos/atualizarResponsavel', { resp: responsavel, voltar: '/alunos/' + req.params.id + '/responsavel/lista', usuario: req.session.user.username });
    })
});

router.post('/:id/responsavel/:idResp/atualizar', function (req, res) {
    responsavelController.atualizar(req.params.idResp, req.body, function (resp, error) {
        req.flash('info', 'Atualizado com sucesso!')
        res.render('alunos/atualizarResponsavel', { resp: resp, voltar: '/alunos/' + req.params.id + '/responsavel/lista', usuario: req.session.user.username });
    })
});

router.get('/:id/responsavel/:idResp/remover', function (req, res) {
    responsavelController.remover(req.params.idResp, function (resp, error) {
        res.redirect('/alunos/' + req.params.id + '/responsavel/lista');
    })
});

router.get('/buscar', function (req, res) {
    res.render('alunos/buscarAluno', { usuario: req.session.user.username });
});

router.get('/buscar/:id', function (req, res) {
    alunoController.findById(req.params.id, function (resp, error) {
        res.render('alunos/ver', { aluno: resp, usuario: req.session.user.username })
    })
});



router.post('/buscarMatricula', function (req, res) {
    alunoController.findByMatricula(req.body.codMatricula, function (resp, error) {
        if (!resp) {
            //res.render('alunos/msg', { msg:"Código de matrícula não cadastrado!",voltar: "/alunos/buscar", usuario: req.session.user.username });    
            req.flash('info', 'Código de matrícula não cadastrado!');
            res.render('alunos/buscarAluno', { usuario: req.session.user.username });
        } else {
            res.render('alunos/ver', { aluno: resp, usuario: req.session.user.username });
        }

    })
});

router.delete('/:id', function (req, res) {
    alunoController.deleteById(req.params.id, function (resp) {
        res.render('aluno/msg', { msg: resp.msg, voltar: '/alunos/buscar' , usuario: req.session.user.username });
    })
})



router.get('/vinculo/:id', function (req, res) {
    vinculoController.findByAluno(req.params.id, function (vinculos, error) {
        alunoController.findById(req.params.id, function (aluno, error) {
            res.render('alunos/vinculo', { vinculos: vinculos, aluno: aluno , usuario: req.session.user.username });
        })
    })
});

router.get('/vinculo/:id/situacao', function (req, res) {
    vinculoController.findById(req.params.id, function (vinculo, error) {        
        res.render('alunos/vinculo_atualizar_situacao', { vinculo: vinculo, usuario: req.session.user.username });        
    })
});

router.post('/vinculo/:id/situacao', function (req, res) {
   vinculoController.atualizarSituacao(req.params.id,req.body.situacao,function (vinculo, error) {             
        res.redirect('/alunos/vinculo/'+vinculo.aluno)        
    })
});

router.get('/vinculo/:id/remover', function (req, res) {
    vinculoController.findById(req.params.id, function (vinculo, error) {        
        res.render('alunos/vinculo_remover', { vinculo: vinculo, usuario: req.session.user.username });        
    })
});

router.post('/vinculo/:id/remover', function (req, res) {
   vinculoController.excluirVinculo(req.params.id,function (result, error) {             
        res.redirect('/alunos/vinculo/'+req.body.aluno)        
    })
});

router.get('/transferir/:idMatricula', function (req, res) {
    vinculoController.findById(req.params.idMatricula, function (vinculo, error) {
        turmaController.findByAnoEnsino(vinculo.anoLetivo, vinculo.turma.ensino._id,function (turmas, error) {
            var listTurmas = []
            for (i in turmas) {
                if (!turmas[i]._id.equals(vinculo.turma._id)) {
                    listTurmas.push(turmas[i])
                }
            }
            res.render('alunos/transferir', { vinculo: vinculo, turmas: listTurmas });
        })
    })
})

router.post('/transferir/:idMatricula', function (req, res) {
    vinculoController.transferir(req.params.idMatricula, req.body.turma, function (result, error) {
        vinculoController.findById(req.params.idMatricula, function (matricula, error) {
            res.redirect('/alunos/vinculo/' + matricula.aluno._id);
        })
    })
})

router.get('/reclassificar/:idMatricula', function (req, res) {
    vinculoController.findById(req.params.idMatricula, function (vinculo, error) {
        turmaController.findByAno(new Date().getFullYear(), function (turmas, error) {
            var listTurmas = []
            for (i in turmas) {
                if (!turmas[i].ensino._id.equals(vinculo.turma.ensino._id)) {
                    listTurmas.push(turmas[i])
                }
            }
            res.render('alunos/reclassificar', { vinculo: vinculo, turmas: listTurmas, usuario: req.session.user.username });
        })
    })
})

router.get('/vinculo/:id/documentos', function (req, res) {
    vinculoController.findById(req.params.id, function (vinculo, error) {
        res.render('alunos/documentos', { aluno: vinculo.aluno, vinculo: vinculo, usuario: req.session.user.username });
    })
});

router.get('/vinculo/:id/declaracao', function (req, res) {
    escolaController.buscar('57cc3dc81b9773c01a275adb', function (escola, err) {
        vinculoController.findById(req.params.id, function (vinculo, error) {
            res.render('alunos/documentos/declaracao', { escola: escola, aluno: vinculo.aluno, vinculo: vinculo, usuario: req.session.user.username });
        })
    })

});

//mostrar página com dados médicos do aluno
router.get('/:id/mostrarmedicos/', function (req, res) {
    alunoController.findById(req.params.id, function (resp, error) {
        res.render('alunos/mostrarDadosMedicos', { aluno: resp, usuario: req.session.user.username })
    })
});

//mostrar página para atualizar dados médicos do aluno
router.get('/:id/atualizarmedicos/', function (req, res) {
    alunoController.findById(req.params.id, function (resp, error) {
        res.render('alunos/atualizarDadosMedicos', { aluno: resp, usuario: req.session.user.username })
    })
});

router.post('/:id/atualizarmedicos/', function (req, res) {
    dadosMedicos = {
        usaRemedios: req.body.usaRemedios,
        qualAlergia: req.body.qualAlergia,
        alergiaManifesta: req.body.alergiaManifesta,
        trataAlergia: req.body.trataAlergia,
        alergiaARemedio: req.body.alergiaARemedio,
        cuidadoAlergia: req.body.cuidadoAlergia,
        teveDoencas: req.body.teveDoencas,
        vacinaAntitetanica: req.body.vacinaAntitetanica,
        vacinaFebreAmarela: req.body.vacinaFebreAmarela,
        outraVacina: req.body.outraVacina,
        problema1: req.body.problema1 == undefined ? false : true,
        problema2: req.body.problema2 == undefined ? false : true,
        problema3: req.body.problema3 == undefined ? false : true,
        problema4: req.body.problema4 == undefined ? false : true,
        problema5: req.body.problema5 == undefined ? false : true,
        problema6: req.body.problema6 == undefined ? false : true,
        problema7: req.body.problema7 == undefined ? false : true,
        problema8: req.body.problema8 == undefined ? false : true,
        problema9: req.body.problema9 == undefined ? false : true,
        problema10: req.body.problema10 == undefined ? false : true,
        problema11: req.body.problema11 == undefined ? false : true,
        problema12: req.body.problema12 == undefined ? false : true,
        outroProblema: req.body.outroProblema,
        febre: req.body.febre,
        podeTomarAlergia: req.body.podeTomarAlergia,
        enjoo: req.body.enjoo,
        instestinoSolto: req.body.instestinoSolto,
        vegetariano: req.body.vegetariano == undefined ? false : true,
        carneSuina: req.body.carneSuina == undefined ? false : true,
        carneBovina: req.body.carneBovina == undefined ? false : true,
        outraRestricao: req.body.outraRestricao,
        sabeNadar: req.body.sabeNadar == undefined ? false : true,
        podeNadar: req.body.podeNadar == undefined ? false : true,
    }
    alunoController.atualizarDadosMedicos(req.params.id, dadosMedicos, function (resp, error) {
        res.redirect('/alunos/' + req.params.id + '/mostrarmedicos')
    })
});*/



module.exports = router;