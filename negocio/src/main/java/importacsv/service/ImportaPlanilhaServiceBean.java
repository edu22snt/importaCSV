package importacsv.service;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.inject.Inject;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.excecao.EAOException;
import br.com.ctis.framework.excecao.NegocioException;
import br.gov.ana.importasiagas.entidade.PlanilhaCardaDados;
import br.gov.ana.importasiagas.entidade.PocoValidacao;
import importacsv.eao.PlanilhaCardaDadosEAO;
import importacsv.eao.PocoValidacaoEAO;

/**
 * @author eduardo.andrade
 * @since 09/10/2014
 */
@Stateless
@Log4j
@TransactionManagement(TransactionManagementType.CONTAINER)
public class ImportaPlanilhaServiceBean implements ImportaPlanilhaServiceLocal {

    @Inject
    private PocoValidacaoEAO pocoEAO;

    @Inject
    private PlanilhaCardaDadosEAO cargaPlanilhaEAO;

    private FileWriter logImportacao;
    private PrintWriter gravarArquivoImportacao;

    private static String oPonto = "O ponto ";
    private static String pontoExistente = " já existe em nossa base de dados.";
    private static String pontoInexistente = " foi inserido com sucesso.";

    @Override
    public void init() {
        logImportacao = null;
        gravarArquivoImportacao = null;
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public List<PocoValidacao> salvarPocosImportados(List<PocoValidacao> lista) throws NegocioException {
        try {
            for (int i = 0; i < lista.size(); i++) {
                pocoEAO.salvar(lista.get(i));
            }
        } catch (EAOException e) {
            log.error(e);
        }
        return lista;
    }

    /**
     * Método responsável por recuperar a quantidade de poço(s) da base de dados.
     */
    @Override
    public Long contarPocoPeloPonto(Long ponto) throws NegocioException {
        try{
            return pocoEAO.contarPocoPorPonto(ponto);
        }catch(EAOException e){
            log.error(e);
            return 0L;
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public List<PlanilhaCardaDados> pesquisarCargasPlanilha() throws NegocioException {
        try {
            return cargaPlanilhaEAO.pesquisarCargasPlanilha();
        } catch(EAOException ex) {
            log.error(ex);
            throw new NegocioException("cargadados.erro.pesquisacargas", ex);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void salvarCargaPlanilha(PlanilhaCardaDados cp) throws NegocioException {
    try {
        cargaPlanilhaEAO.salvar(cp);
    } catch(EAOException ex) {
        log.error(ex);
        throw new NegocioException("cargadados.erro.pesquisacargas", ex);
    }

    }

    @Override
    public void gerarLogImportacaoRegistroExistente(Long ponto, String dir, String filename) {
        try {
            if(logImportacao == null){
                logImportacao = new FileWriter(dir + filename);
            }
            if(gravarArquivoImportacao == null) {
                gravarArquivoImportacao = new PrintWriter(logImportacao);
            }
            gravarArquivoImportacao.println(oPonto + ponto + pontoExistente);
        } catch (IOException e) {
            log.error(e);
        }
    }

    @Override
    public void gerarLogImportacaoRegistroInexistente(Long ponto, String dir, String filename) {
        try {
            if(logImportacao == null){
                logImportacao = new FileWriter(dir + filename);
            }
            if(gravarArquivoImportacao == null) {
                gravarArquivoImportacao = new PrintWriter(logImportacao);
            }
            gravarArquivoImportacao.println(oPonto + ponto + pontoInexistente);
        } catch (IOException e) {
            log.error(e);
        }
    }

}