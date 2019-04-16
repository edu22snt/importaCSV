package br.gov.ana.importasiagas.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.faces.Mensagens;
import br.gov.ana.importasiagas.controle.AbstractUFMB;
import br.gov.ana.importasiagas.entidade.PocoValidacao;

/**
 * @author eduardo.andrade
 * @since 28/09/2015
 *
 */
@Log4j
public class PopulaObjetoPoco extends AbstractUFMB {

    private static final long serialVersionUID = 6524929960665435541L;

    PocoValidacao poco;

    public PocoValidacao popularObjetoPoco(String[] linhaObtida) {
        return popular(linhaObtida);
    }

    private PocoValidacao popular(String[] linha) {

        poco = new PocoValidacao();

        try {
            SimpleDateFormat dataConvertida = new SimpleDateFormat("dd/MM/yyyy");

            if(validaCamposObrigatorios(linha)){

                poco = preencherItensObrigatorios(linha);

                if (linha[1].trim().length() > 0) {
                    poco.setDataInstalacao(dataConvertida.parse(linha[1]));
                }
                if (linha[2].trim().length() > 0) {
                    poco.setCotaTerreno(Double.parseDouble(linha[2].replace(",", ".")));
                }

                if (linha[8].trim().length() > 0) {
                    poco.setProjeto(linha[8]);
                }
                if (linha[9].trim().length() > 0) {
                    poco.setNatureza(linha[9]);
                }
                if (linha[10].trim().length() > 0) {
                    poco.setSituacao(linha[10]);
                }

                if (linha[12].trim().length() > 0) {
                    poco.setUsoAgua(linha[12]);
                }
                if (linha[13].trim().length() > 0) {
                    poco.setMetodoPerfuracao(linha[13]);
                }
                if (linha[14].trim().length() > 0) {
                    poco.setTopo(Double.parseDouble(linha[14].replace(",", ".")));
                }
                if (linha[15].trim().length() > 0) {
                    poco.setBase(Double.parseDouble(linha[15].replace(",", ".")));
                }
                if (linha[16].trim().length() > 0) {
                    poco.setTipoPenetracao(linha[16]);
                }
                if (linha[17].trim().length() > 0) {
                    poco.setCondicao(linha[17]);
                }
                if (linha[18].trim().length() > 0) {
                    poco.setProfundidadeInicial(Double.parseDouble(linha[18].replace(",", ".")));
                }
                if (linha[19].trim().length() > 0) {
                    poco.setProfundidadeFinal(Double.parseDouble(linha[19].replace(",", ".")));
                }
                if (linha[20].trim().length() > 0) {
                    poco.setTipoFormacao(linha[20]);
                }
                if (linha[21].trim().length() > 0) {
                    poco.setDataTeste(dataConvertida.parse(linha[21]));
                }
                if (linha[22].trim().length() > 0) {
                    poco.setTipoTesteBombeamento(linha[22]);
                }
                if (linha[23].trim().length() > 0) {
                    poco.setMetodoInterpretacao(linha[23]);
                }
                if (linha[24].trim().length() > 0) {
                    poco.setUnidadeBombeamento(linha[24]);
                }
                if (linha[25].trim().length() > 0) {
                    poco.setNivelDinamico(Double.parseDouble(linha[25].replace(",", ".")));
                }
                if (linha[26].trim().length() > 0) {
                    poco.setNivelEstatico(Double.parseDouble(linha[26].replace(",", ".")));
                }
                if (linha[27].trim().length() > 0) {
                    poco.setVazaoEspecifica(Double.parseDouble(linha[27].replace(",", ".")));
                }
                if (linha[28].trim().length() > 0) {
                    poco.setCoeficienteArmazenamento(Double.parseDouble(linha[28].replace(",", ".")));
                }
                if (linha[29].trim().length() > 0) {
                    poco.setVazaoLivre(Double.parseDouble(linha[29].replace(",", ".")));
                }
                if (linha[30].trim().length() > 0) {
                    poco.setPermeabilidade(Float.parseFloat(linha[30].replace(",", ".")));
                }
                if (linha[31].trim().length() > 0) {
                    poco.setTransmissividade(Float.parseFloat(linha[31].replace(",", ".")));
                }
                if (linha[32].trim().length() > 0) {
                    poco.setVazaoEstabilizacao(Double.parseDouble(linha[32].replace(",", ".")));
                }
                if (linha[33].trim().length() > 0) {
                    poco.setDataAnalise(dataConvertida.parse(linha[33]));
                }
                if (linha[34].trim().length() > 0) {
                    poco.setDataColeta(dataConvertida.parse(linha[34]));
                }
                if (linha[35].trim().length() > 0) {
                    poco.setCondutividadeEletrica(Double.parseDouble(linha[35].replace(",", ".")));
                }
                if (linha[36].trim().length() > 0) {
                    poco.setCor(Double.parseDouble(linha[36].replace(",", ".")));
                }
                if (linha[37].trim().length() > 0) {
                    poco.setOdor(linha[37]);
                }
                if (linha[38].trim().length() > 0) {
                    poco.setSabor(linha[38]);
                }
                if (linha[39].trim().length() > 0) {
                    poco.setTemperatura(Double.parseDouble(linha[39].replace(",", ".")));
                }
                if (linha[40].trim().length() > 0) {
                    poco.setTurbidez(Double.parseDouble(linha[40].replace(",", ".")));
                }
                if (linha[41].trim().length() > 0) {
                    poco.setSolidosSedimentaveis(Double.parseDouble(linha[41].replace(",", ".")));
                }
                if (linha[42].trim().length() > 0) {
                    poco.setSolidosSuspensos(Double.parseDouble(linha[42].replace(",", ".")));
                }
                return poco;
            }

        } catch (ParseException e) {
            log.error(e);
            adicionaMensagemErro(Mensagens.MSG.get("mensagem.erro.importarpocos"));
        }
        return null;
    }

    /**
     * Método responsável por validar os campos obrigatórios da planilha.
     * @param linha
     * @return
     */
    private boolean validaCamposObrigatorios(String[] linha) {
        boolean isValue;
        if(linha[0].trim().isEmpty() && linha[3].trim().isEmpty() && linha[4].trim().isEmpty() &&
            linha[5].trim().isEmpty() && linha[6].trim().isEmpty() && linha[7].trim().isEmpty() &&
            linha[11].trim().isEmpty()){
            isValue = false;

        } else {
            isValue = true;
        }
        return isValue;
    }

    private PocoValidacao preencherItensObrigatorios(String[] linha) {
        poco.setPonto(Long.parseLong(linha[0]));

        poco.setLatitude(Double.parseDouble(linha[3].replace(",", ".")));
        poco.setLongitude(Double.parseDouble(linha[4].replace(",", ".")));
        poco.setUtme(Integer.parseInt(linha[5]));
        poco.setUtmn(Integer.parseInt(linha[6]));
        poco.setMunicipio(linha[7]);

        poco.setUf(linha[11]);

        poco.setSituacaoRegistro(1);
        poco.setDadosOrigem("planilha_siagas");

        return poco;
    }


}
