package importacsv.controle;

import java.io.Serializable;

import javax.enterprise.context.SessionScoped;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import br.com.edu.framework.faces.AbstractMB;

@Named
@SessionScoped
public class ControleMB extends AbstractMB implements Serializable {

    private static final long serialVersionUID = -4558501970279758988L;

    @Getter @Setter
    private String currentViewId;
    @Getter @Setter
    private String causaErro;
    @Getter @Setter
    private String stackErro;

}