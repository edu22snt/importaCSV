package importacsv.eao;

import java.util.List;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.EAOException;
import importacsv.entidade.TipoFinalidade;

/**
 * @author eduardo.andrade
 * @since 24/09/2015
 */
@Log4j
public class TipoFinalidadeEAO extends ImportaCsvEAO<TipoFinalidade, Long> {

    /**
     * Método responsável por recuperar todos os tipos de finalidades.
     * @return
     * @throws EAOException
     */
    public List<TipoFinalidade> listarFinalidade() throws EAOException {
        try {
            return consultar("tipoFinalidade.listarFinalidade");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrosiagas.erro.pesquisar", e);
        }
    }
}
