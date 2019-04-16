package importacsv.eao;

import java.util.List;

import br.com.edu.framework.excecao.EAOException;
import importacsv.entidade.TipoCultura;
import lombok.extern.log4j.Log4j;

/**
 * @author eduardo.andrade
 * @since 01/10/2015
 */
@Log4j
public class TipoCulturaEAO extends ImportaCsvEAO<TipoCultura, Long> {

    /**
     * Método responsável por recuperar todos os tipos de cultura.
     * @return
     * @throws EAOException
     */
    public List<TipoCultura> listarCultura() throws EAOException {
        try {
            return consultar("tipoCultura.listarTipoCultura");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrocsv.erro.pesquisar", e);
        }
    }
}
