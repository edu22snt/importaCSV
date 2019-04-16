package importacsv.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import br.com.edu.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 01/10/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoCultura.listarTipoCultura", query = "SELECT t FROM TipoCultura t "),
})
@Entity
@Table(name = "RGLTP_CULTURA")
public class TipoCultura extends GenericEntity<Long> {

    private static final long serialVersionUID = 3816571385282039157L;

    @Id
    @Getter @Setter
    @Column(name = "TCT_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "TCT_DS")
    private String descricao;

}
