package importacsv.service;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

import br.com.edu.framework.excecao.ServicoRemotoException;
import br.gov.edu.wsclient.correios.service.CEP;
import br.gov.edu.wsclient.dne.PesquisaDNE;
import br.gov.edu.wsclient.ig.PesquisaUFMunicipio;
import br.gov.edu.wsclient.ig.municipio.service.Municipio;
import br.gov.edu.wsclient.ig.uf.service.UF;
import br.gov.edu.wsclient.receitafederal.PesquisaReceita;
import br.gov.edu.wsclient.receitafederal.service.ReceitaFederalVO;
import br.gov.edu.wsclient.snirh.AdministracaoSNIRH;
import br.gov.edu.wsclient.snirh.AutenticacaoSNIRH;
import br.gov.edu.wsclient.snirh.administracao.Usuario;

@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class CorporativoServiceBean implements CorporativoServiceLocal {

    private final PesquisaUFMunicipio ufService = new PesquisaUFMunicipio();
    private final PesquisaDNE cepService = new PesquisaDNE();
    private final PesquisaReceita receitaService = new PesquisaReceita();
    private final AutenticacaoSNIRH authService = AutenticacaoSNIRH.getInstance();
    private final AdministracaoSNIRH adminService = AdministracaoSNIRH.getInstance();

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void esqueciMinhaSenha(String identificador, String email) throws ServicoRemotoException {
        try {
            adminService.esqueciMinhaSenha(identificador, email);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.esqueciminhasenha", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void alterarSenha(String identificador, String senhaAtual, String senhaNova) throws ServicoRemotoException {
        try {
            adminService.alterarSenha(identificador, senhaAtual, senhaNova);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.alterarSenha", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public Usuario pesquisarUsuarioComAutorizacoesPorCPF(String cpf) throws ServicoRemotoException {
        try {
            Usuario s = adminService.consultarUsuarioPorCPF(cpf);
            s = adminService.consultarUsuarioComAutorizacoesPorLogin(s.getCodigoIdentificacao());
            return s;
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisarUsuarioComAutorizacoesPorCPF", e);
        }
    }

    // ----------------------------

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public List<UF> pesquisaUnidadesFederacao() throws ServicoRemotoException {
        try {
            return ufService.pesquisarUF();
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaUnidadesFederacao", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public List<Municipio> pesquisaMunicipios(long ufId) throws ServicoRemotoException {
        try {
            return ufService.pesquisarMunicipioPorUF(ufId);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaMunicipios", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public Municipio pesquisaMunicipioPorIBGE(String codigoIGBE) throws ServicoRemotoException {
        try {
            return ufService.pesquisarMunicipioPorIBGE(codigoIGBE);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaMunicipioPorIBGE", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public CEP pesquisaPorCEP(String cep) throws ServicoRemotoException {
        try {
            return cepService.consultarPorCEP(cep);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaPorCEP", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public ReceitaFederalVO pesquisaCPF(String cpf) throws ServicoRemotoException {
        try {
            return receitaService.consultarPorCPF(cpf);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaCPF", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public ReceitaFederalVO pesquisaCNPJ(String cnpj) throws ServicoRemotoException {
        try {
            return receitaService.consultarPorCNPJ(cnpj);
        } catch(ServicoRemotoException e) {
            throw new ServicoRemotoException("corporativo.erro.pesquisaCNPJ", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public boolean autenticar(String cnarh, String senha) throws ServicoRemotoException {
        Usuario u = adminService.consultarUsuarioPorCPF(cnarh);
        if(u == null || u.getId() == 0) {
            return false;
        }
        return authService.autenticarUsuario(u.getCodigoIdentificacao(), senha);
    }

}
