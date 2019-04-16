package br.gov.ana.importasiagas.controle;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j;

import org.apache.commons.lang3.StringUtils;
import org.primefaces.model.UploadedFile;

import br.com.ctis.framework.config.ConfigCache;
import br.com.ctis.framework.excecao.NegocioException;
import br.com.ctis.framework.faces.Mensagens;
import br.gov.ana.importasiagas.config.Configuracoes;
import br.gov.ana.importasiagas.dominio.ListaEnum;
import br.gov.ana.importasiagas.entidade.PlanilhaCardaDados;
import br.gov.ana.importasiagas.entidade.PocoValidacao;
import br.gov.ana.importasiagas.service.ImportaPlanilhaServiceLocal;
import br.gov.ana.importasiagas.util.PopulaObjetoPoco;

/**
 * @author eduardo.andrade
 * @since 06/10/2014
 */
@Named
@Log4j
@SessionScoped
public class ImportaPlanilhaMB extends AbstractUFMB {

    private static final long serialVersionUID = 4056484650717473900L;

    @Inject
    private transient ImportaPlanilhaServiceLocal oes;

    @Getter @Setter
    private PocoValidacao poco;

    @Getter @Setter
    private List<PocoValidacao> listaDePocosImportados;

    @Getter @Setter
    private transient UploadedFile arquivo;

    @Getter @Setter
    private boolean isValido;

    @Getter
    private boolean op;

    private PopulaObjetoPoco populaListaPoco;

    @Getter @Setter
    private transient List<PlanilhaCardaDados> registros;

    private int numeroRegistroTotal;

    private int numeroRegistroImportados;

    private transient PlanilhaCardaDados cp;

    public String init() throws NegocioException {
        registros = null;
        numeroRegistroTotal = 0;
        numeroRegistroImportados = 0;
        cp = null;
        oes.init();
        pesquisarCargas();
        return "/restrito/importa_poco.jsf";
    }

    /**
     * Método responsável por pesquisar a(s) quantidade(s) de carga(s) no banco de dados.
     * @throws NegocioException
     */
    public void pesquisarCargas() throws NegocioException {
        if(registros == null) {
            registros = oes.pesquisarCargasPlanilha();
        }
    }

    /**
     * Método responsável por ler o arquivo .CSV
     */
    public void lerArquivoCSV() throws NegocioException {

        if (validarExtencaoCSV()) {
            if(cp == null) {
                iniciarObjetoCarga();
            }
            BufferedReader br = null;
            String line = null;

            try {
            	br = new BufferedReader(new InputStreamReader(arquivo.getInputstream(), "ISO-8859-1"));
                lerLinhaDoArquivo(br, line);
                enviarLogImportacao();
                adicionaMensagemInfo(Mensagens.MSG.get("mensagem.sucesso.importarpocos"));
            } catch (IOException e) {
                log.error(e.getMessage(), e);
                adicionaMensagemErro(Mensagens.MSG.get("mensagem.erro.importarpocos"));
            } finally {
                if (br != null) {
                    try {
                        br.close();
                    } catch (IOException e) {
                        log.error(e);
                    }
                }
            }
            init();
        }
    }

    /**
     * Método responsável por ler linha a linha do arquivo e setar as informações na listaDeVazoesImportados.
     * @param br
     * @param line
     * @throws IOException
     * @throws NegocioException
     */
    private void lerLinhaDoArquivo(BufferedReader br, String line) throws IOException, NegocioException {
        try {
            while ((line = br.readLine()) != null) {
                String[] linha = line.split(";", -1);
                verificarLinhaNumerica(linha);
                linha = null;
            }
            verificarListaVazia();
        }catch(NumberFormatException e) {
            log.error(e.getMessage(), e);
            listaDePocosImportados.clear();
            adicionaMensagemErro(Mensagens.SIS.get(e.getMessage()));
        }
    }

    /**
     * Método responsável por verificar se a linha é numérica.
     * @param linha
     * @throws NegocioException
     */
    private void verificarLinhaNumerica(String[] linha) throws NegocioException {
        if (StringUtils.isNumeric(linha[0])) {
            numeroRegistroTotal ++;
            popularObjetoPoco(linha);
            compararTamanho();
        }
    }

    /**
     * Método responsável por comparar se a lista está no seu limite.
     * @throws NegocioException
     */
    private void compararTamanho() throws NegocioException {
        if (listaDePocosImportados.size() == ListaEnum.LIMITE_LISTA) {
            contarRegistrosImportados();
        }
    }

    /**
     * Método responsável por verificar se a lista está vazia.
     * @throws NegocioException
     */
    private void verificarListaVazia() throws NegocioException {
        if (!listaDePocosImportados.isEmpty()) {
            contarRegistrosImportados();
        }
    }

    /**
     * Método responsável por verificar se existe o código da vazão no banco de dados,
     * caso exista o atributo numeroRegistroImportados não é incrementado.
     * @throws NegocioException
     */
    private void contarRegistrosImportados() throws NegocioException {
        for(int i = 0; i < listaDePocosImportados.size(); i++) {
            if(oes.contarPocoPeloPonto(listaDePocosImportados.get(i).getPonto()) == 0 ){
                numeroRegistroImportados += listaDePocosImportados.size();
                gravarLogRegistroInexistente(listaDePocosImportados.get(i));
                persistirListaPocos();
            } else {
                gravarLogRegistroExistente(listaDePocosImportados.get(i));
            }
        }
    }

    /**
     * Método responsável por gravar (upload) no arquivo com as
     * informações das importações realizadas.
     * @param vazao
     */
    private void gravarLogRegistroInexistente(PocoValidacao poco){
        try {
            gravarArquivoInexistente(poco.getPonto());
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } catch (NegocioException e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("cargadados.erro.errogravacao"));
        }
    }

    /**
     * Método responsável por gravar no arquivo com as
     * informações das importações não realizadas pelo
     * fato de já existirem na base de dados.
     * @param vazao
     */
    private void gravarLogRegistroExistente(PocoValidacao poco){
        try {
            gravarArquivoExistente(poco.getPonto());
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } catch (NegocioException e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("cargadados.erro.errogravacao"));
        }
    }

    /**
     * Método responsável por realizar o download do log com as
     * informações da importação realizada.
     * @param cp
     * @throws NegocioException
     */
    public void downloadLog(PlanilhaCardaDados cp) throws NegocioException {
        try {
            String dir = getDir(Configuracoes.CARGAPLANILHA_IMPORTASIAGAS_CAMINHODOWNLOAD);
            String file = cp.getNomeArquivo();
            downloadFromFilesystem(file, dir + file);
        } catch(IOException e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("cargadados.erro.download"));
        }
    }

    private String getDir(Configuracoes config) {
        ConfigCache cc = ConfigCache.getInstance();
        String dir = cc.get(config.toString());
        if(!dir.trim().endsWith("/") && !dir.trim().endsWith("\\")) {
            dir += "/";
        }
        return dir;
    }

    /**
     * Método responsável por iniciar o objeto PlanilhaCardaDados.
     */
    private void iniciarObjetoCarga() {
        cp = new PlanilhaCardaDados();
        configurarData();
    }

    /**
     * Método responsável por preparando o nome do arquivo.
     */
    private void configurarData() {
        SimpleDateFormat df = new SimpleDateFormat();
        df.applyPattern("yyyyMMddHHmmssSSS");
        popularObjetoPoco(df);
    }

    /**
     * Método responsável por gravar registro de envio.
     * GRAVAR ARQUIVO COM O FORMATO yyyyMMddHHmmssSSS.txt
     * @param df
     */
    private void popularObjetoPoco(SimpleDateFormat df) {
        cp.setDataEnvio(new Date(System.currentTimeMillis()));
        cp.setNomeArquivo(df.format(cp.getDataEnvio()) + ".txt");
    }

    /**
     * Método responsável por salvar a carga da planilha
     * o atributo op = true exibe a mensagem de sucesso.
     */
    public void enviarLogImportacao() {
        try {
            cp.setTotalRegistrosImportados(Long.parseLong(String.valueOf(numeroRegistroImportados)));
            cp.setTotalRegistrosLidos(Long.parseLong(String.valueOf(numeroRegistroTotal)));
            oes.salvarCargaPlanilha(cp);
            op = true;

        } catch(Exception e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("cargadados.erro.erroenvio"));
            return;

        } finally {
            op = false;
            arquivo = null;
        }
    }

    /**
     * Método responsável por gravar no log a mensagem de já existe em nossa base de dados.
     * @param ponto
     * @throws IOException
     * @throws NegocioException
     */
    private void gravarArquivoExistente(Long ponto) throws IOException, NegocioException {
        String dirup = getDir(Configuracoes.CARGAPLANILHA_IMPORTASIAGAS_CAMINHOUPLOAD);
        oes.gerarLogImportacaoRegistroExistente(ponto, dirup, cp.getNomeArquivo());
    }

    /**
     * Método responsável por gravar no log a mensagem de arquivo inserido com sucesso.
     * @param ponto
     * @throws IOException
     * @throws NegocioException
     */
    private void gravarArquivoInexistente(Long ponto) throws IOException, NegocioException {
        String dirup = getDir(Configuracoes.CARGAPLANILHA_IMPORTASIAGAS_CAMINHOUPLOAD);
        oes.gerarLogImportacaoRegistroInexistente(ponto, dirup, cp.getNomeArquivo());
    }

    /**
     * Método responsável por validar a extenção do arquivo carregado.
     * @return
     */
    public boolean validarExtencaoCSV() {
        isValido = false;
        String nome = arquivo.getFileName();
        String extencao = nome.substring(nome.lastIndexOf('.') + 1);

        if (extencao.equals("csv")) {
            isValido = true;
        } else {
            isValido = false;
            adicionaMensagemErro(Mensagens.MSG.get("mensagem.erro.tipoarquivoincompativel"));
        }
        return isValido;
    }

    public void popularObjetoPoco(String[] linha) {
        if(listaDePocosImportados == null) {
            listaDePocosImportados = new ArrayList<PocoValidacao>();
        }
        if(populaListaPoco == null) {
            populaListaPoco = new PopulaObjetoPoco();
        }
       listaDePocosImportados.add(populaListaPoco.popularObjetoPoco(linha));
    }

    /**
     * Método responsável por encaminhar o objeto populado para a persistência.
     */
    private void persistirListaPocos() {
        try {
            oes.salvarPocosImportados(listaDePocosImportados);
        } catch (NegocioException e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("mensagem.erro.importarpocos"));
        }
        listaDePocosImportados.clear();
    }

}
