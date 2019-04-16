package importacsv.entidade;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import br.com.edu.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 29/07/2014
 */
@Entity
@Table(name = "GEOFT_MUNICIPIO")
public class MunicipioPoco extends GenericEntity<Long> {

    private static final long serialVersionUID = -3375766233679110389L;

    @Id
    @Column(name = "MUN_CD")
    @Getter @Setter
    private Long id;

    @Column(name = "MUN_NM")
    @Getter @Setter
    private String nome;

    @Column(name = "MUN_NU_IBGE7_RESUMIDO")
    @Getter @Setter
    private String ibgeResumido;

    @Column(name = "MUN_NU_IBGE_COMPLETO")
    @Getter @Setter
    private String ibgeCompleto;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "MUN_UFD_CD", referencedColumnName = "UFD_CD")
    private UnidadeFederacao munUf;

}