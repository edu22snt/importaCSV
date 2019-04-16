package importacsv.eao;

import java.io.Serializable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import br.com.ctis.framework.modelo.GenericEntity;
import br.com.ctis.framework.modelo.GenericJPAEAO;


public class ImportaCsvEAO <E extends GenericEntity<ID>, ID extends Serializable> extends GenericJPAEAO<E, ID>  {

    @PersistenceContext(unitName="importacsvPU")
    private EntityManager em;

    @Override
    public EntityManager getEntityManager() {
        return em;
    };

}
