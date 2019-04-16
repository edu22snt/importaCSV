package importacsv.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class UsuarioEstadualVO {

    @Getter @Setter
    private String identificacao;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String perfilAcesso;

    @Getter @Setter
    private String siglaUF;

    @Getter @Setter
    private boolean usuarioANA;

    @Getter @Setter
    private List<String> permissoes;
}
