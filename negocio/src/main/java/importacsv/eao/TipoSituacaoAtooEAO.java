package importacsv.eao;

import java.util.List;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.EAOException;
import importacsv.entidade.TipoSituacaoAto;

/**
 * @author eduardo.andrade
 * @since 25/09/2015
 */
@Log4j
public class TipoSituacaoAtooEAO extends ImportaCsvEAO<TipoSituacaoAto, Long> {

    /**
     * Método responsável por recuperar todos os tipos de Situação.
     * @return
     * @throws EAOException
     */
    public List<TipoSituacaoAto> listarSituacaoAtoo() throws EAOException {
        try {
            return consultar("tipoSituacaoAto.listarSituacaoAto");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrocsv.erro.pesquisar", e);
        }
    }
}
