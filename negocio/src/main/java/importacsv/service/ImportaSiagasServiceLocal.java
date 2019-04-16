package importacsv.service;

import java.util.List;

import javax.ejb.Local;

import br.com.edu.framework.excecao.NegocioException;
import importacsv.entidade.PocoValidacao;

/**
 * @author eduardo.andrade
 * @since 28/07/2014
 */
@Local
public interface ImportaCsvServiceLocal {

    /**
     * Método responsável por verificar as permissões do sistema pelo CPF.
     * @param cpf
     * @throws NegocioException
     */
    void verificarPermissoes(String cpf) throws NegocioException;

    /**
     * Método responsável por recuperar o último ID do proprietário.
     * @return
     * @throws NegocioException
     */
    Long recuperarMaxIDProprietario() throws NegocioException;

    /**
     * Método responsável por carregar o proprietário pelo id do poço.
     * @param idPoco
     * @return
     * @throws NegocioException
     */
    PocoValidacao carregarProprietario(Long idPoco) throws NegocioException;

    /**
     * Método responsável por pesquisar os poços existentes na base de dados.
     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws NegocioException
     */
    List<PocoValidacao> pesquisarPoco(String parametro, String uf, int situacao, int inicio, int pagina) throws NegocioException;

    /**
     * Método responsável por pesquisar o proprietário pelo CPF e CNPJ.
     * @param cpf_cnpj
     * @return
     * @throws NegocioException
     */
    List<PocoValidacao> pesquisarProprietario(String cpf_cnpj) throws NegocioException;

    /**
     * Método responsável por recuperar a quantidade de poços pelos parâmetros.
     * @param parametro
     * @param uf
     * @param situacao
     * @return
     * @throws NegocioException
     */
    Long contarPocos(String parametro, String uf, int situacao) throws NegocioException;

    /**
     * Método responsável por persistir os poços na base de dados.
     * @param poco
     * @throws NegocioException
     */
    void salvarPoco(PocoValidacao  poco) throws NegocioException;

    /**
     * Método responsável por excluir poço.
     * @param poco
     * @throws NegocioException
     */
    void excluirPoco(PocoValidacao  poco) throws NegocioException;

}