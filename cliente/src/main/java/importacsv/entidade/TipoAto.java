package importacsv.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import br.com.ctis.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 30/09/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoAto.listarAto", query = "SELECT t FROM TipoAto t "),
})
@Entity
@Table(name = "RGLTP_ATO")
public class TipoAto extends GenericEntity<Long> {

    private static final long serialVersionUID = 4497309611345446784L;

    @Id
    @Getter @Setter
    @Column(name = "TAT_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "TAT_DS")
    private String descricao;

}
