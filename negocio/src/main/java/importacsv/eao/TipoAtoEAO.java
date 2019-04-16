package importacsv.eao;

import java.util.List;

import br.com.ctis.framework.excecao.EAOException;
import importacsv.entidade.TipoAto;
import lombok.extern.log4j.Log4j;

/**
 * @author eduardo.andrade
 * @since 30/09/2015
 */
@Log4j
public class TipoAtoEAO extends ImportaCsvEAO<TipoAto, Long> {

    /**
     * Método responsável por recuperar todos os tipos de finalidades.
     * @return
     * @throws EAOException
     */
    public List<TipoAto> listarSituacaoAto() throws EAOException {
        try {
            return consultar("tipoAto.listarAto");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrocsv.erro.pesquisar", e);
        }
    }
}
