package importacsv.service;

import javax.ejb.Local;

import br.com.edu.framework.excecao.ServicoRemotoException;
import br.gov.ana.wsclient.cruzamentoespacial.service.ResultadosPesquisa;
import br.gov.ana.wsclient.ig.coordenadas.service.JobCoordenada;
import br.gov.ana.wsclient.ig.dominio.service.JobDominio;

/**
 * @author eduardo.andrade
 * @since 02/10/2015
 */
@Local
public interface InteligenciaGeograficaServiceLocal {

    /**
     * Método responsável por recuperar o cruzamento espacial.
     * @param dataSource
     * @param temaDePonto
     * @param temasInteresse
     * @param raioCruzamento
     * @param unidMedida
     * @param coordenadas
     * @return
     * @throws ServicoRemotoException
     */
    ResultadosPesquisa cruzamentoEspacial(String dataSource, String temaDePonto,
        String temasInteresse, String raioCruzamento, String unidMedida, String coordenadas)throws ServicoRemotoException;

    /**
     * Método responsável por recuperar  a coordenada pelo Lat e Long.
     * @param latitude
     * @param longitude
     * @return
     * @throws ServicoRemotoException
     */
    JobCoordenada consultaCoordenadas(Double latitude, Double longitude) throws ServicoRemotoException;

    /**
     * Método responsável por recuperar o domínio.
     * @param latitude
     * @param longitude
     * @return
     * @throws ServicoRemotoException
     */
    JobDominio consultaDominio(Double latitude, Double longitude) throws ServicoRemotoException;
}
