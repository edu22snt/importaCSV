package importacsv.service;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.ServicoRemotoException;
import br.gov.ana.wsclient.cruzamentoespacial.service.ProcessadorDeNegocio;
import br.gov.ana.wsclient.cruzamentoespacial.service.ResultadosPesquisa;
import br.gov.ana.wsclient.ig.PesquisaCoordenadas;
import br.gov.ana.wsclient.ig.PesquisaDominio;
import br.gov.ana.wsclient.ig.coordenadas.service.JobCoordenada;
import br.gov.ana.wsclient.ig.dominio.service.JobDominio;

@Log4j
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class InteligenciaGeograficaServiceBean implements InteligenciaGeograficaServiceLocal {

    private ProcessadorDeNegocio cruzamentoEspacialService;
    private final PesquisaDominio dominioService = new PesquisaDominio();
    private final PesquisaCoordenadas coordenadasService = new PesquisaCoordenadas();

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public JobCoordenada consultaCoordenadas(Double latitude, Double longitude) throws ServicoRemotoException {
        return coordenadasService.consultaCoordenadas(latitude, longitude);
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public JobDominio consultaDominio(Double latitude, Double longitude) throws ServicoRemotoException {
        return dominioService.consultaDominio(latitude, longitude);
    }

    @Override
    public ResultadosPesquisa cruzamentoEspacial(String dataSource, String temaDePonto, String temasInteresse,
        String raioCruzamento, String unidMedida, String coordenadas)throws ServicoRemotoException {
        try {
            return cruzamentoEspacialService.efetuarCruzamentoEspacial(dataSource, temaDePonto, temasInteresse, raioCruzamento, unidMedida, coordenadas);
        } catch (Exception e) {
            log.error(e);
            return null;
        }
    }
}
