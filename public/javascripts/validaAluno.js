function validaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}
var regExpNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
var regExpCep = /^\d{5}\-?\d{3}$/;
$(document).ready(function(){

    $('#btn_submit').click(function(){        
        if ($('#nomeCompleto').val().length < 6 || $('#nomeCompleto').val().length > 30) {
            $("#group_nome").addClass("has-error");
            $('#nomeCompleto').focus();
            var msg = '<div class="alert alert-danger m_esquerda_direita" role="alert">O nome deve conter entre 5 à 30 caracteres!</div>'
            $('#header').after(msg);                   
        }else if(!regExpNome.test($('#nomeCompleto').val())){
            $("#group_nome").addClass("has-error");
            $('#nomeCompleto').focus();
            var msg = '<div class="alert alert-danger m_esquerda_direita" role="alert">O nome não deve possuir números ou caracteres especial!</div>'
            $('#header').after(msg);
        }/*else if(!validaCPF($('#cpf').val())){
            $("#group_cpf").addClass("has-error");
            $('#cpf').focus();
            var msg = '<div class="alert alert-danger m_esquerda_direita" role="alert">CPF inválido!</div>'
            $('#header').after(msg);
        }*/else if(!regExpCep.test($('#cep').val())){
            $("#group_cep").addClass("has-error");
            $('#cep').focus();
            var msg = '<div class="alert alert-danger m_esquerda_direita" role="alert">O CEP só deve possuir números!</div>'
            $('#header').after(msg);
        }else{
            $('form').submit();
        }
    })
});
