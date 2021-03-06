package importacsv.controle;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.enterprise.context.SessionScoped;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.NegocioException;
import br.com.edu.framework.excecao.ServicoRemotoException;
import br.com.edu.framework.faces.Mensagens;
import br.com.edu.framework.util.Constantes;
import importacsv.config.Credenciais;
import importacsv.dominio.PaginasEnum;
import importacsv.service.CorporativoServiceLocal;
import importacsv.service.ImportaCsvServiceLocal;
import br.gov.edu.wsclient.snirh.administracao.Restricao;

@Log4j
@Named
@SessionScoped
public class AutenticarMB extends AbstractUFMB {

    private static final long serialVersionUID = -6502384447945194256L;

    @Inject
    private transient CorporativoServiceLocal corporativoService;

    @Inject
    @Getter @Setter
    private transient Credenciais credenciais;

    @Inject
    private ControleMB controleMB;

    @Inject
    @Getter @Setter
    private ImportaCsvMB cadastroCargaDadosMB;

    @EJB
    private transient ImportaCsvServiceLocal importaCsvService;

    @Getter @Setter
    private transient Restricao rest;

    @Getter @Setter
    private int tipoPessoa = 0;

    @Getter @Setter
    private String senha;

    @Getter @Setter
    private String email;

    /**
     * Método responsável por enviar a senha para o email cadastrado.
     * @return
     * @throws ServicoRemotoException
     */
    public String reenviarSenha() throws ServicoRemotoException {
        try {
            corporativoService.esqueciMinhaSenha(credenciais.getIdentificador(), email);
            adicionaMensagemInfo(Mensagens.MSG.get("reenviarsenha.ok.senhaenviada"));
        } catch (Exception e) {
            log.info(e);
            adicionaMensagemErro(Mensagens.MSG.get("reenviarsenha.erro.emailnaoconfere"));
        }
        return PaginasEnum.URL_LOGIN;
    }

    /**
     * Método responsável por autenticar o usuário no sistema.
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    public void autenticar() throws NegocioException {
        try {
            boolean auth = corporativoService.autenticar(credenciais.getIdentificador(), senha);
            credenciais.setAutenticado(auth);

            if (auth) {
                importaCsvService.verificarPermissoes(credenciais.getIdentificador());
                cadastroCargaDadosMB.init();
                String pagina = Constantes.URL_HOME;
                redirect(pagina);

            } else {
                adicionaMensagemErro(Mensagens.MSG.get("autenticar.erro.logininvalido"));
                logout();
            }

        } catch (ServicoRemotoException ex) {
            log.info(ex);
            adicionaMensagemErro(Mensagens.SIS.get(ex.getMessage()));
            logout();
        }
    }

    public String logout() {
        FacesContext fc = FacesContext.getCurrentInstance();
        ExternalContext ec = fc.getExternalContext();
        ec.invalidateSession();
        return PaginasEnum.URL_LOGIN;
    }

    @PostConstruct
    public void init() {
        Object pagina = controleMB.getCurrentViewId();
        pagina = pagina == null ? PaginasEnum.URL_INDEX : pagina;
        pagina = pagina.toString().replaceAll(".xhtml", ".jsf");
    }

}