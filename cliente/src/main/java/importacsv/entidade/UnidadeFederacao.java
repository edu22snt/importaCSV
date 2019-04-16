package importacsv.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import br.com.ctis.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 29/07/2014
 */
@Entity
@Table(name = "GEOFT_UNIDADE_FEDERACAO")
public class UnidadeFederacao extends GenericEntity<Long> {

    private static final long serialVersionUID = -8200136579991964258L;

    @Id
    @Column(name = "UFD_CD")
    @Getter @Setter
    private Long id;

    @Column(name = "UFD_RPA_CD")
    @Getter @Setter
    private Integer rpaCD;

    @Column(name = "UFD_NU_IBGE2_UF")
    @Getter @Setter
    private Integer nuIBGE;

    @Column(name = "UFD_NM")
    @Getter @Setter
    private String nome;

    @Column(name = "UFD_SG")
    @Getter @Setter
    private String sigla;

    @Column(name = "UFD_AR_KM2")
    @Getter @Setter
    private Double areaKM;

    @Column(name = "UFD_QT_POPULACAO")
    @Getter @Setter
    private Double populacao;
}
