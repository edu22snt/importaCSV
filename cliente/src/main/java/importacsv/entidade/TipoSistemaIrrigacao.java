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
 * @since 01/10/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoSistemaIrrigacao.listarSistemaIrrigacao", query = "SELECT t FROM TipoSistemaIrrigacao t "),
})
@Entity
@Table(name = "RGLTP_SISTEMAIRRIGACAO")
public class TipoSistemaIrrigacao extends GenericEntity<Long> {

    private static final long serialVersionUID = 4497309611345446784L;

    @Id
    @Getter @Setter
    @Column(name = "TSI_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "TSI_DS")
    private String descricao;

    @Getter @Setter
    @Column(name = "TSI_PC_EFICIENCIA")
    private Double eficiencia;

}
