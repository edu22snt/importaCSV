package importacsv.entidade;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;
import br.com.ctis.framework.modelo.GenericEntity;

/**
 * @author eduardo.andrade
 * @since 22/04/2015
 */
@Entity
@Table(name = "RGLTB_PLANILHACARGADADOS")
@SequenceGenerator(name = "CARGASEQ", sequenceName = "SEQ_PLANILHACARGADADOS", initialValue = 1, allocationSize = 1)
public class PlanilhaCardaDados extends GenericEntity<Long> {

    private static final long serialVersionUID = 1788895148988556113L;

    @Id
    @Getter @Setter
    @Column(name = "PCG_CD")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CARGASEQ")
    private Long id;

    @Getter @Setter
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="PCG_DT_ENVIO")
    private Date dataEnvio;

    @Getter @Setter
    @Column(name="PCG_NU_REGISTROSIMPORTADOS")
    private Long totalRegistrosImportados;

    @Getter @Setter
    @Column(name="PCG_NU_REGISTROSLIDOS")
    private Long totalRegistrosLidos;


    @Getter @Setter
    @Column(name="PCG_NM_ARQUIVO")
    private String nomeArquivo;

}
