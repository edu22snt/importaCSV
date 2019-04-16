package importacsv.service;

import java.util.List;

import javax.ejb.Local;

import br.com.edu.framework.excecao.NegocioException;
import importacsv.entidade.PlanilhaCardaDados;
import importacsv.entidade.PocoValidacao;

/**
 * @author eduardo.andrade
 * @since 09/10/2014
 */
@Local
public interface ImportaPlanilhaServiceLocal {

    List<PocoValidacao> salvarPocosImportados(List<PocoValidacao> lista) throws NegocioException;
    Long contarPocoPeloPonto(Long ponto) throws NegocioException;
    List<PlanilhaCardaDados> pesquisarCargasPlanilha() throws NegocioException;
    void salvarCargaPlanilha(PlanilhaCardaDados cp) throws NegocioException;
    void gerarLogImportacaoRegistroExistente(Long ponto, String dir, String filename);
    void gerarLogImportacaoRegistroInexistente(Long ponto, String dir, String filename);
    void init();

}
