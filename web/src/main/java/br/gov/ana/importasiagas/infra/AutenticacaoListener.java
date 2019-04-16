package br.gov.ana.importasiagas.infra;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.PhaseEvent;
import javax.faces.event.PhaseId;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.faces.AbstractMB;
import br.com.ctis.framework.faces.Mensagens;
import br.com.ctis.framework.util.Constantes;
import br.gov.ana.importasiagas.config.Credenciais;

@Log4j
public class AutenticacaoListener implements javax.faces.event.PhaseListener {

    private static final long serialVersionUID = 4896928475663466076L;

    private final String URL_LOGIN = "/login.jsf";

    private final String VAR_PAGINA = "pagina";

    @Override
    public PhaseId getPhaseId() {
        return PhaseId.RESTORE_VIEW;
    }

    @Override
    public void beforePhase(PhaseEvent event) {
    }

    @Override
    public void afterPhase(PhaseEvent event) {

        FacesContext fc = event.getFacesContext();
        ExternalContext ec = fc.getExternalContext();

        String currentPage = fc.getViewRoot().getViewId();

        Credenciais credenciais = (Credenciais)getBean(fc, "credenciais", Credenciais.class);

        try {
            if(currentPage.startsWith(Constantes.AREA_RESTRITA)) {

                if(credenciais == null || !credenciais.isAutenticado()) {

                    ec.getSessionMap().put(VAR_PAGINA, currentPage);
                    AbstractMB.adicionaMensagemErro(Mensagens.SIS.get("sistema.erro.usuarionaoautenticado"));
                    AbstractMB.redirect(URL_LOGIN + "?faces-redirect=true&pagina=" + currentPage);

                }
            }

        } catch(Exception ex) {
            log.error(ex);
            AbstractMB.redirect(Constantes.URL_ERRO);
        }
    }

    @SuppressWarnings("el-syntax")
    private Object getBean(FacesContext fctx, String elName, Class<?> clazz) {
        return fctx.getApplication().evaluateExpressionGet(fctx, "#{" + elName + "}", clazz);
    }

}
