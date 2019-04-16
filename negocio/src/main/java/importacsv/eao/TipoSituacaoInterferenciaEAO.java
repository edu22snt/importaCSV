package importacsv.eao;

import java.util.List;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.excecao.EAOException;
import br.gov.ana.importasiagas.entidade.TipoSituacaoInterferencia;

/**
 * @author eduardo.andrade
 * @since 25/09/2015
 */
@Log4j
public class TipoSituacaoInterferenciaEAO extends ImportaCsvEAO<TipoSituacaoInterferencia, Long> {

    /**
     * Método responsável por recuperar todos os tipos de Situação Interferência.
     * @return
     * @throws EAOException
     */
    public List<TipoSituacaoInterferencia> listarSituacaoInterferencia() throws EAOException {
        try {
            return consultar("tipoSituacaoInterferencia.listarSituacaoInterferencia");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrosiagas.erro.pesquisar", e);
        }
    }
}
