package br.gov.ana.importasiagas.util;

import br.gov.ana.importasiagas.entidade.PocoValidacao;

public class LimparCampos {

    /**
     * Método responsável por limpar os campos
     * referente aos campos de proprietário por CPF e CNPJ.
     */
    public static PocoValidacao limparBuscaCPFCNPJ(PocoValidacao poco) {
        poco.setNomeProprietario(null);
        poco.setCepProprietario(null);
        poco.setEnderecoProprietario(null);
        poco.setBairroProprietario(null);
        poco.setUfProprietario(null);
        poco.setMunicipioProprietario(null);
        poco.setTelefoneProprietario(null);
        poco.setFaxProprietario(null);
        poco.setCelularProprietario(null);
        return poco;
    }

    /**
     * Método responsável por limpar os campos
     * referente aos campos de endereço por CEP.
     */
    public static PocoValidacao limparEndereco(PocoValidacao poco) {
        poco.setEnderecoProprietario(null);
        poco.setBairroProprietario(null);
        poco.setUfProprietario(null);
        poco.setMunicipioProprietario(null);
        return poco;
    }
}
