package importacsv.excecao;

import java.util.Iterator;

import javax.ejb.EJBException;
import javax.el.ELException;
import javax.faces.FacesException;
import javax.faces.application.NavigationHandler;
import javax.faces.application.ViewExpiredException;
import javax.faces.context.ExceptionHandler;
import javax.faces.context.ExceptionHandlerWrapper;
import javax.faces.context.FacesContext;
import javax.faces.event.ExceptionQueuedEvent;
import javax.faces.event.ExceptionQueuedEventContext;

import org.apache.log4j.Logger;

import br.com.edu.framework.excecao.NegocioException;
import br.com.edu.framework.excecao.ServicoRemotoException;
import br.com.edu.framework.faces.AbstractMB;
import br.com.edu.framework.faces.Mensagens;
import br.com.edu.framework.util.Constantes;
import importacsv.controle.ControleMB;

public class BaseExceptionHandler extends ExceptionHandlerWrapper {

    private static final Logger LOGGER = Logger.getLogger(BaseExceptionHandler.class.getName());

    private final ExceptionHandler wrapped;
    protected FacesContext fc;
    protected NavigationHandler nav;

    private final String URL_LOGIN = "/login.jsf";

    public BaseExceptionHandler(ExceptionHandler wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public ExceptionHandler getWrapped() {
        return this.wrapped;
    }

    /**
     * Extrai a stacktrace da exceção.
     *
     * @param t - {@link Throwable} Exception
     * @return - {@link String} Stack Trace
     */
    private String getStackTrace(Throwable t) {
        StringBuilder builder = new StringBuilder();
        builder.append(t.toString()).append("<br/>");
        for (StackTraceElement element : t.getStackTrace()) {
            builder.append(element).append("<br/>");
        }
        return builder.toString();
    }

    @Override
    public void handle() throws FacesException {

        // TRATAMENTO DAS EXCEÇÕES
        for (Iterator<ExceptionQueuedEvent> i = getUnhandledExceptionQueuedEvents().iterator(); i.hasNext();) {
            ExceptionQueuedEvent event = i.next();
            ExceptionQueuedEventContext context = (ExceptionQueuedEventContext) event.getSource();
            Throwable t = context.getException();

            while ((t instanceof FacesException || t instanceof EJBException || t instanceof ELException) && t.getCause() != null) {
               t = t.getCause();
            }

            try {

                FacesContext fc = FacesContext.getCurrentInstance();
                ControleMB controleMB = fc.getApplication().evaluateExpressionGet(fc, "#{controleMB}", ControleMB.class);

                LOGGER.error(t);

                // SESSÃO EXPIRADA
                if (t instanceof ViewExpiredException) {

                    ViewExpiredException vee = (ViewExpiredException) t;
                    controleMB.setCurrentViewId(vee.getViewId());
                    AbstractMB.adicionaMensagemAviso(Mensagens.SIS.get("sistema.erro.sessaoexpirada"));

                    NavigationHandler nav = fc.getApplication().getNavigationHandler();
                    nav.handleNavigation(fc, null, URL_LOGIN);
                    fc.renderResponse();

                // NEGOCIO EXCEPTION
                } else if (t instanceof NegocioException || t instanceof ServicoRemotoException) {

                    AbstractMB.adicionaMensagemErro(Mensagens.SIS.get(t.getMessage()));
                    fc.renderResponse();

                // OUTRAS EXCEÇÕES
                } else {

                    controleMB.setCurrentViewId(fc.getViewRoot().getViewId());
                    controleMB.setCausaErro(t.getMessage() != null ? t.getMessage() : t.toString());
                    controleMB.setStackErro(getStackTrace(t));

                    NavigationHandler nav = fc.getApplication().getNavigationHandler();
                    nav.handleNavigation(fc, null, Constantes.URL_ERRO);
                    fc.renderResponse();

                }

            } finally {
                i.remove();
            }
        }

        getWrapped().handle();

    }

}
