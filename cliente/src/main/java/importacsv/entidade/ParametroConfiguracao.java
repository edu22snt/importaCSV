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

@NamedQueries({
    @NamedQuery(name = "configuracao.pesquisa", query =
        "SELECT c.valor FROM ParametroConfiguracao c WHERE c.chave = :chave")
})
@Entity
@Table(name = "RGLTB_PARAMETROCONFIGURACAO")
public class ParametroConfiguracao extends GenericEntity<Long> {

    private static final long serialVersionUID = -1532124910714584530L;

    @Id
    @Column(name = "PAC_CD")
    @Getter @Setter
    private Long id;

    @Column(name="PAC_CD_CHAVE")
    @Getter @Setter
    private String chave;

    @Column(name="PAC_VL")
    @Getter @Setter
    private String valor;

}
