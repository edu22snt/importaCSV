package importacsv.service;

import java.util.List;

import javax.ejb.Local;

import br.com.ctis.framework.excecao.ServicoRemotoException;
import br.gov.ana.wsclient.correios.service.CEP;
import br.gov.ana.wsclient.ig.municipio.service.Municipio;
import br.gov.ana.wsclient.ig.uf.service.UF;
import br.gov.ana.wsclient.receitafederal.service.ReceitaFederalVO;
import br.gov.ana.wsclient.snirh.administracao.Usuario;

@Local
public interface CorporativoServiceLocal {

    /**
     * Método responsável por recuperar a lista das UF.
     */
    List<UF> pesquisaUnidadesFederacao() throws ServicoRemotoException;

    /**
     * Método responsável por recuperar a lista de municípios.
     * @param ufId
     * @return
     * @throws ServicoRemotoException
     */
    List<Municipio> pesquisaMunicipios(long ufId) throws ServicoRemotoException;

    /**
     * Método responsável por recuperar o município pelo código IBGE.
     * @param codigoIGBE
     * @return
     * @throws ServicoRemotoException
     */
    Municipio pesquisaMunicipioPorIBGE(String codigoIGBE) throws ServicoRemotoException;

    /**
     * Método responsável por autenticar usuário.
     * @param cnarh
     * @param senha
     * @return
     * @throws ServicoRemotoException
     */
    boolean autenticar(String cnarh, String senha) throws ServicoRemotoException;

    /**
     * Método responsável por alterar a senha.
     * @param identificador
     * @param senhaAtual
     * @param senhaNova
     * @throws ServicoRemotoException
     */
    void alterarSenha(String identificador, String senhaAtual, String senhaNova) throws ServicoRemotoException;

    /**
     * Método responsável por recuperar a senha.
     * @param identificador
     * @param email
     * @throws ServicoRemotoException
     */
    void esqueciMinhaSenha(String identificador, String email) throws ServicoRemotoException;

    /**
     * Método responsável por recuperar as autorizações do usuário.
     * @param cpf
     * @return
     * @throws ServicoRemotoException
     */
    Usuario pesquisarUsuarioComAutorizacoesPorCPF(String cpf) throws ServicoRemotoException;

    /**
     * Método responsável por recuperar o CEP.
     * @param cep
     * @return
     * @throws ServicoRemotoException
     */
    CEP pesquisaPorCEP(String cep) throws ServicoRemotoException;

    /**
     * Método responsável por validar o CPF.
     * @param cpf
     * @return
     * @throws ServicoRemotoException
     */
    ReceitaFederalVO pesquisaCPF(String cpf) throws ServicoRemotoException;

    /**
     * Método responsável por validar o CNPJ.
     * @param cnpj
     * @return
     * @throws ServicoRemotoException
     */
    ReceitaFederalVO pesquisaCNPJ(String cnpj) throws ServicoRemotoException;

}