package importacsv.config;

import javax.enterprise.context.SessionScoped;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.permissoes.PermissoesCache;
import br.gov.ana.wsclient.ig.uf.service.UF;
import importacsv.permissoes.Permissoes;

@Log4j
@Named
@SessionScoped
public class Credenciais extends PermissoesCache {

    private static final long serialVersionUID = -9174189182192495643L;

    @Getter @Setter
    private boolean autenticado = false;

    @Getter @Setter
    private String identificador;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String perfilAcesso;

    @Getter @Setter
    private UF uf;

    @Getter @Setter
    private boolean usuarioANA;

    @Override
    public boolean pode(String permissao) {
        String val = null;
        try {
            val = Permissoes.valueOf(permissao).toString();
        } catch (IllegalArgumentException ex) {
            val = permissao;
            log.info(ex);
        }
        return super.pode(val);
    }

    public boolean pode(Permissoes permissao) {
        return pode(permissao.toString());
    }

}
