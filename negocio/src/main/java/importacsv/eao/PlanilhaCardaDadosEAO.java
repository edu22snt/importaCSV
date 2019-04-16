package importacsv.eao;

import java.util.List;

import javax.management.Query;

import br.com.edu.framework.excecao.EAOException;
import importacsv.entidade.PlanilhaCardaDados;
import lombok.extern.log4j.Log4j;

/**
 * @author eduardo.andrade
 * @since 17/03/2015
 */
@Log4j
public class PlanilhaCardaDadosEAO extends ImportaCsvEAO<PlanilhaCardaDados, Long> {

    @SuppressWarnings("unchecked")
    public List<PlanilhaCardaDados> pesquisarCargasPlanilha() throws EAOException {
        try {

            StringBuilder hql = new StringBuilder().append("SELECT c FROM PlanilhaCardaDados c ");

            hql.append(" ORDER BY c.dataEnvio DESC");

            Query query = getEntityManager().createQuery(hql.toString());

            return query.getResultList();

        } catch(RuntimeException ex) {
            log.error(ex);
            throw new EAOException("cargadados.erro.pesquisacargas", ex);
        }
    }

}


