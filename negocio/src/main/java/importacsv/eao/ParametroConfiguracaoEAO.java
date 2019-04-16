package importacsv.eao;

import javax.inject.Named;
import javax.management.Query;
import javax.persistence.NoResultException;

import br.com.ctis.framework.config.ConfigSource;
import importacsv.entidade.ParametroConfiguracao;
import lombok.extern.log4j.Log4j;

@Log4j
@Named
public class ParametroConfiguracaoEAO extends ImportaCsvEAO<ParametroConfiguracao, Long> implements ConfigSource {

    @Override
    public String pesquisar(String chave) {
        try {

            Query q = getEntityManager().createNamedQuery("configuracao.pesquisa");
            q.setParameter("chave", chave);
            Object saida = q.getSingleResult();
            return saida != null ? saida.toString() : null;
        } catch(NoResultException e) {
            log.error(e);
            return null;
        } catch(RuntimeException ex) {
            log.error(ex);
            return null;
        }
    }
}
