package importacsv.controle;

import javax.ejb.EJB;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.extern.log4j.Log4j;

import org.hibernate.validator.constraints.Length;

import br.com.edu.framework.excecao.NegocioException;
import br.com.edu.framework.excecao.ServicoRemotoException;
import br.com.edu.framework.faces.AbstractMB;
import br.com.edu.framework.faces.Mensagens;
import importacsv.config.Credenciais;
import importacsv.service.CorporativoServiceLocal;

@Log4j
@Named
@SessionScoped
public class AlterarSenhaMB extends AbstractMB {

    private static final long serialVersionUID = 6989982077433146095L;

    @EJB
    private transient CorporativoServiceLocal corporativoService;

    @Inject
    private transient Credenciais credenciais;

    private String identificador;

    @Length(min=8, max=15)
    private String senha;

    @Length(min=8, max=15)
    private String novaSenha;

    @Length(min=8, max=15)
    private String confirmaSenha;

    private boolean op = false;

    public String init() {
        op = false;

        if(credenciais.isUsuarioANA()) {
            adicionaMensagemAviso(Mensagens.SIS.get("sistema.alterarsenha.erro.usuariorede"));
        }
        return "/restrito/alterar_senha.jsf";
    }

    public void alterarSenha() throws NegocioException {

        try {
            op = false;
            if(novaSenha.equals(confirmaSenha)) {

                if(!validarTamanhoSenha()) {
                    adicionaMensagemErro(Mensagens.MSG.get("alterarsenha.tamanho"));
                    return;
                }
                corporativoService.alterarSenha(credenciais.getIdentificador(), senha, novaSenha);
                adicionaMensagemInfo(Mensagens.MSG.get("alterarsenha.ok.senhaalterada"));
                op = true;
            } else {
                throw new NegocioException("sistema.alterarsenha.erro.senhasnaoconferem");
            }
        } catch(ServicoRemotoException srex) {
            log.info(srex.getMessage(), srex);
            throw new NegocioException(srex.getMessage());
        }
    }

    private boolean validarTamanhoSenha() {
        if(novaSenha.trim().length() < 8 || novaSenha.trim().length() > 15) {
            return false;
        }
        return true;
    }

    public boolean isOp() {
        return op;
    }

    public void setOp(boolean op) {
        this.op = op;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }

    public String getConfirmaSenha() {
        return confirmaSenha;
    }

    public void setConfirmaSenha(String confirmaSenha) {
        this.confirmaSenha = confirmaSenha;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

}