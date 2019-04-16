package importacsv.util;

import java.util.List;

import br.com.edu.framework.excecao.ServicoRemotoException;
import importacsv.entidade.PocoValidacao;
import br.gov.edu.wsclient.cruzamentoespacial.service.Exception_Exception;
import br.gov.edu.wsclient.cruzamentoespacial.service.ProcessadorDeNegocioService;
import br.gov.edu.wsclient.cruzamentoespacial.service.ResultadosPesquisa;

/**
 * @author eduardo.andrade
 * @since 01/10/2015
 */
public class EfetuaCruzamentoEspacial {

    private PocoValidacao poco;

    private static final String ps = "PAIS,";
    private static final String uf = "UNIDADE_FEDERACAO,";
    private static final String re = "REGIAO_HIDROGRAFICA,";
    private static final String uh = "UNIDADE_HIDROGRAFICA,";
    private static final String uph = "UNIDADE_PLANEJ_HIDRICO,";
    private static final String uhe = "UNIDADE_HIDRO_ESTADUAL,";
    private static final String ob = "OTTOBACIA,";
    private static final String pg = "PROVINCIA_GEOLOGICA,";
    private static final String sa = "SISTEMA_AQUIFERO";

    private void init() {
        poco = new PocoValidacao();
    }

    /**
     * Método responsável por efetuar a consulta para o cruzamento espacial dos dados do poço.
     * Parametros de pesquisa(
     *  dataSource
     *  temaDePonto
     *  temasInteresse
     *  raioCruzamento
     *  unidMedida
     *  coordenadas).
     */
    public PocoValidacao efetuarCruzamentoEspacial() throws ServicoRemotoException {
        init();
        ProcessadorDeNegocioService process = null;
        try {
            ResultadosPesquisa cruzamento = null;
            if(process == null) {
                process = new ProcessadorDeNegocioService();
            }
            cruzamento = process.getProcessadorDeNegocioPort().efetuarCruzamentoEspacial("dsIG", "MUNICIPIO", concatenarTemas(), "0", "#RAPIDO#", prepararCoordenadas());
            popularObjetoCruzamento(cruzamento);
            return poco;
        } catch (Exception_Exception e) {
            throw new ServicoRemotoException("cadastrocsv.erro.serviceig", e);
        }
    }

    private String concatenarTemas() {
        String temas = ps + uf + re + uh + uph + uhe + ob + pg + sa;
        return temas;
    }

    private String prepararCoordenadas() {
        String longitude = poco.getLongitude().toString().replace(",", ".");
        String latitude = poco.getLatitude().toString().replace(",", ".");
        return longitude + "," +  latitude;
    }

    /**
     * Método responsável por popular o objeto do poço com as informações do cruzamento espacial abaixo.
     * MUN_UFD_CD = Município
     * PAI_CD = País
     * RHI_CD = Região Hidrográfica
     * UFD_CD = Estado
     * UHE_CD = Unidade Gestão Estadual
     * UHI_CD = Unidade Hidrográfica
     * UPH_CD = Unidade Gestão Local
     * OBA_CD = Ottobacia
     * CD_SISTEMA_AQUIFERO = Aquífero
     * @param cruzamento
     */
    private void popularObjetoCruzamento(ResultadosPesquisa cruzamento) {
        List<String> colunas = cruzamento.getColunas();
        List<String> valores = cruzamento.getValores();

        for(int i = 0; i < colunas.size(); i++ ) {
            String coluna = colunas.get(i);
            String valor = valores.get(i);

            if(coluna.equals("MUN_UFD_CD")) {
                poco.setMunicipioCruzamento(valor);
            } else if(coluna.equals("PAI_CD")) {
                poco.setPaisCruzamento(valor);
            } else if(coluna.equals("RHI_CD")) {
                poco.setRegiaoHidrograficaCruzamento(valor);
            } else if(coluna.equals("UFD_CD")) {
                poco.setEstadoCruzamento(valor);
            } else if(coluna.equals("UHE_CD")) {
                poco.setUnidadeGestaoEstadualCruzamento(valor);
            } else if(coluna.equals("UHI_CD")) {
                poco.setUnidadeHidrograficaCruzamento(valor);
            } else if(coluna.equals("UPH_CD")) {
                poco.setUnidadeGestaoLocalCruzamento(valor);
            } else if(coluna.equals("OBA_CD")) {
                poco.setOttobaciaCruzamento(valor);
            } else if(coluna.equals("CD_SISTEMA_AQUIFERO")) {
                poco.setAquiferoCruzamento(valor);
            }
        }
    }
}
