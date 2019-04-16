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
 * @since 25/09/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoSituacaoInterferencia.listarSituacaoInterferencia",
        query = "SELECT t FROM TipoSituacaoInterferencia t "),
})
@Entity
@Table(name = "RGLTP_SITUACAOINTERFENCIA")
public class TipoSituacaoInterferencia extends GenericEntity<Long> {

    private static final long serialVersionUID = 93848615262498134L;

    @Id
    @Getter @Setter
    @Column(name = "STI_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "STI_DS")
    private String descricao;

}
