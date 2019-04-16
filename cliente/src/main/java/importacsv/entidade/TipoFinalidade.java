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
 * @since 24/09/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoFinalidade.listarFinalidade", query = "SELECT t FROM TipoFinalidade t "),
})
@Entity
@Table(name = "RGLTP_FINALIDADE")
public class TipoFinalidade extends GenericEntity<Long> {

    private static final long serialVersionUID = 2524351779444694680L;

    @Id
    @Getter @Setter
    @Column(name = "TFN_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "TFN_DS")
    private String descricao;

}
