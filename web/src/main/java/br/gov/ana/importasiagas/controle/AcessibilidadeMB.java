package br.gov.ana.importasiagas.controle;

import java.io.Serializable;
import java.util.Locale;

import javax.enterprise.context.SessionScoped;
import javax.faces.context.FacesContext;
import javax.inject.Named;

import br.com.ctis.framework.faces.AbstractMB;

@Named
@SessionScoped
public class AcessibilidadeMB extends AbstractMB implements Serializable {

    private static final long serialVersionUID = -6559371212957261219L;

    private Locale locale = FacesContext.getCurrentInstance().getViewRoot().getLocale();

    public void defineIdioma(String lang) {
        locale = new Locale(lang);
        setIdioma(locale);
    }

    public void defineIdioma(String lang, String country) {
        locale = new Locale(lang, country);
        setIdioma(locale);
    }

    private void setIdioma(Locale loc) {
        FacesContext.getCurrentInstance().getViewRoot().setLocale(loc);
        Locale.setDefault(loc);
    }

    public String getIdioma() {
        return locale.getLanguage();
    }
}