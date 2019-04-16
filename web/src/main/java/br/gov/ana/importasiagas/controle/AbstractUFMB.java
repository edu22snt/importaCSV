package importacsv.controle;

import java.util.List;

import javax.ejb.EJB;
import javax.enterprise.context.SessionScoped;
import javax.inject.Named;

import br.com.edu.framework.excecao.ServicoRemotoException;
import br.com.edu.framework.faces.AbstractMB;
import importacsv.service.CorporativoServiceLocal;
import br.gov.edu.wsclient.ig.municipio.service.Municipio;
import br.gov.edu.wsclient.ig.uf.service.UF;

@Named
@SessionScoped
public class AbstractUFMB extends AbstractMB {

    private static final long serialVersionUID = -727240680975388163L;

    @EJB
    private transient CorporativoServiceLocal corporativoServiceLocal;

    public List<Municipio> buscarMunicipios(Long ufId) throws ServicoRemotoException {
        return corporativoServiceLocal.pesquisaMunicipios(ufId.intValue());
    }

    public Municipio buscarMunicipio(String codigoIBGE) throws ServicoRemotoException {
        return corporativoServiceLocal.pesquisaMunicipioPorIBGE(codigoIBGE);
    }

    public List<UF> buscarUFs() throws ServicoRemotoException {
        return corporativoServiceLocal.pesquisaUnidadesFederacao();
    }

}