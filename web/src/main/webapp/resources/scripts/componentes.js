/**
 * JS com a função que verifica se o valor horas por dia está utrapassando o valor máximo.
 */
function verificaValorHoraDia() {

    var vhd = $(".cadastro_proprietario_txtVazaoHoraDia").val();

    if(vhd > 24) {
    	vhd = 24;
    }
    $(".cadastro_proprietario_txtVazaoHoraDia").autoNumeric('set', vhd);
}

/**
 * JS com a função que verifica se o valor dias por mês está utrapassando o valor máximo.
 */
function verificaValorDiaMes() {

    var vdm = $(".cadastro_proprietario_txtVazaoDiaMes").val();

    if(vdm > 30) {
    	vdm = 30;
    }
    $(".cadastro_proprietario_txtVazaoDiaMes").autoNumeric('set', vdm);
}

/**
 * JS com a função que verifica se o número do telefone tem 9 digitos.
 */
function mascaraTelefone() {
    var v = document.getElementById(".cadastro_proprietario_telefone").value;
     v = v.replace(/\D/g,"");
     v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
     v = v.replace(/(\d)(\d{4})$/,"$1-$2");
     document.getElementById("cadastro:telefone").value = v
 }

/**
 * JS com a função que verifica se o número do telefone fax tem 9 digitos.
 */
function mascaraFax(){
    var v = document.getElementById("cadastro_proprietario_fax").value;
     v = v.replace(/\D/g,"");
     v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
     v = v.replace(/(\d)(\d{4})$/,"$1-$2");
     document.getElementById("cadastro:fax").value = v
 }

/**
 * JS com a função que verifica se o número do celular tem 9 digitos.
 */
function mascaraCelular(){
    var v = document.getElementById("cadastro_proprietario_celular").value;
     v = v.replace(/\D/g,"");
     v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
     v = v.replace(/(\d)(\d{4})$/,"$1-$2");
     document.getElementById("cadastro:celular").value = v
}


