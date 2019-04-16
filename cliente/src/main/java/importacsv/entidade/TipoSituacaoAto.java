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
 * @since 25/09/2015
 */
@NamedQueries({
    @NamedQuery(name = "tipoSituacaoAto.listarSituacaoAto", query = "SELECT t FROM TipoSituacaoAto t "),
})
@Entity
@Table(name = "RGLTP_SITUACAOATO")
public class TipoSituacaoAto extends GenericEntity<Long> {

    private static final long serialVersionUID = 93848615262498134L;

    @Id
    @Getter @Setter
    @Column(name = "TSA_CD")
    private Long id;

    @Getter @Setter
    @Column(name = "TSA_DS")
    private String descricao;

}
