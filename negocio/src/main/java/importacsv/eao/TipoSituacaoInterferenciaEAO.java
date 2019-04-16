package importacsv.eao;

import java.util.List;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.EAOException;
import importacsv.entidade.TipoSituacaoInterferencia;

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
            throw new EAOException("cadastrocsv.erro.pesquisar", e);
        }
    }
}
