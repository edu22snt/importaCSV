package importacsv.eao;

import java.util.List;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.excecao.EAOException;
import br.gov.ana.importasiagas.entidade.TipoSistemaIrrigacao;

/**
 * @author eduardo.andrade
 * @since 01/10/2015
 */
@Log4j
public class TipoSistemaIrrigacaoEAO extends ImportaCsvEAO<TipoSistemaIrrigacao, Long> {

    /**
     * Método responsável por recuperar todos os tipos de sistema de irrigação.
     * @return
     * @throws EAOException
     */
    public List<TipoSistemaIrrigacao> listarSistemaIrrigacao() throws EAOException {
        try {
            return consultar("tipoSistemaIrrigacao.listarSistemaIrrigacao");
        } catch(RuntimeException e) {
            log.error(e);
            throw new EAOException("cadastrosiagas.erro.pesquisar", e);
        }
    }
}
