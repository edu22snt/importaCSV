package br.gov.ana.importasiagas.controle;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.excecao.NegocioException;
import br.com.ctis.framework.excecao.ServicoRemotoException;
import br.com.ctis.framework.faces.Mensagens;
import br.gov.ana.importasiagas.dominio.SituacaoPocoEnum;
import br.gov.ana.importasiagas.entidade.MunicipioPoco;
import br.gov.ana.importasiagas.entidade.PocoValidacao;
import br.gov.ana.importasiagas.entidade.TipoAto;
import br.gov.ana.importasiagas.entidade.TipoCultura;
import br.gov.ana.importasiagas.entidade.TipoFinalidade;
import br.gov.ana.importasiagas.entidade.TipoSistemaIrrigacao;
import br.gov.ana.importasiagas.entidade.TipoSituacaoAto;
import br.gov.ana.importasiagas.entidade.TipoSituacaoInterferencia;
import br.gov.ana.importasiagas.service.CorporativoServiceLocal;
import br.gov.ana.importasiagas.service.ImportaSiagasServiceLocal;
import br.gov.ana.importasiagas.service.TiposServiceLocal;
import br.gov.ana.importasiagas.util.LimparCampos;
import br.gov.ana.wsclient.correios.service.CEP;
import br.gov.ana.wsclient.ig.municipio.service.Municipio;
import br.gov.ana.wsclient.ig.uf.service.UF;

/**
 * @author eduardo.andrade
 * @since 16/07/2014
 */
@Log4j
@Named
@SessionScoped
public class ImportaSiagasMB extends AbstractUFMB {

    private static final long serialVersionUID = -8673479349216367340L;

    @Inject
    private transient ImportaSiagasServiceLocal oes;

    @Inject
    private transient TiposServiceLocal oesTipo;

    @Inject
    private transient CorporativoServiceLocal corpService;

    @Getter @Setter
    private transient ImportaSiagasList registrosEmAnalise;

    @Getter @Setter
    private transient ImportaSiagasList registrosRetificados;

    @Getter @Setter
    private transient ImportaSiagasList registrosSincronizados;

    @Getter @Setter
    private transient ImportaSiagasList registrosNaoSincronizados;

    @Getter @Setter
    private PocoValidacao poco;

    @Getter @Setter
    private transient MunicipioPoco municipioProprietario;

    @Getter @Setter
    private Long ufEndereco;

    @Getter @Setter
    private transient List<Municipio> listaMunicipiosProprietario;

    @Getter @Setter
    private Long ultimoID;

    @Getter @Setter
    private String parametro;

    @Getter @Setter
    private boolean opAlterar;

    @Getter @Setter
    private String ufArgumento;

    public String init() throws NegocioException {
        poco = new PocoValidacao();
        pesquisar();
        return "/restrito/home.jsf";
    }

    public void pesquisar() throws NegocioException {
        pesquisarEmAnalise();
        pesquisarRetificados();
        pesquisarSincronizados();
        pesquisarNaoSincronizados();
    }

    public void pesquisarEmAnalise() {
        registrosEmAnalise = new ImportaSiagasList(oes, parametro, ufArgumento, SituacaoPocoEnum.EM_ANALISE.getOrd());
        registrosEmAnalise.init();
    }

    public void pesquisarRetificados() {
        registrosRetificados = new ImportaSiagasList(oes, parametro, ufArgumento, SituacaoPocoEnum.RETIFICADO.getOrd());
        registrosRetificados.init();
    }

    public void pesquisarSincronizados() {
        registrosSincronizados = new ImportaSiagasList(oes, parametro, ufArgumento, SituacaoPocoEnum.SINCRONIZADO.getOrd());
        registrosSincronizados.init();
    }

    public void pesquisarNaoSincronizados() {
        registrosNaoSincronizados = new ImportaSiagasList(oes, parametro, ufArgumento, SituacaoPocoEnum.NAOSINCRONIZADO.getOrd());
        registrosNaoSincronizados.init();
    }

    /**
     * Método responsável por popular a lista de finalidades.
     * @return
     * @throws NegocioException
     */
    public List<TipoFinalidade> listarFinalidade() throws NegocioException {
        return oesTipo.listarFinalidade();
    }

    /**
     * Método responsável por popular a lista de situação de regularização.
     * @return
     * @throws NegocioException
     */
    public List<TipoSituacaoAto> listarSituacaoAto() throws NegocioException {
        return oesTipo.listarSituacaoOutorga();
    }

    /**
     * Método responsável por popular a lista de situação de interferência.
     * @return
     * @throws NegocioException
     */
    public List<TipoSituacaoInterferencia> listarSituacaoInterferencia() throws NegocioException {
        return oesTipo.listarSituacaoInterferencia();
    }

    /**
     * Método responsável por popular a lista de situação do ato.
     * @return
     * @throws NegocioException
     */
    public List<TipoAto> listarAto() throws NegocioException {
        return oesTipo.listarSituacaoAto();
    }

    /**
     * Método responsável por popular a lista de sistema de irrigação.
     * @return
     * @throws NegocioException
     */
    public List<TipoSistemaIrrigacao> listarSistemaIrrigacao() throws NegocioException {
        return oesTipo.listarSistemaIrrigacao();
    }

    /**
     * Método responsável por popular a lista de sistema de irrigação.
     * @return
     * @throws NegocioException
     */
    public List<TipoCultura> listarCultura() throws NegocioException {
        return oesTipo.listarCultura();
    }

    /**
     * Método responsável por salvar as informações importadas da planilha siagas.
     * @return
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    public String salvar() throws NegocioException {
        if(poco.getSituacaoRegistro() != null) {
            if(poco.getSituacaoRegistro() == 1) {
                definirUfMunicipioSemCEP();
                oes.salvarPoco(poco);
                adicionaMensagemInfo(Mensagens.MSG.get("cadastrosiagas.sucesso.salvar"));
            }
        } else {
            adicionaMensagemErro(Mensagens.MSG.get("cadastrosiagas.erro.pocoexistente"));
        }
        return init();
    }

    /**
     * Método responsável por salvar as informações importadas da planilha siagas.
     * @return
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    public String cancelar() throws NegocioException {
        poco = null;
        ufArgumento = null;
        parametro = null;
        return init();
    }

    /**
     * Método responsável por editar as informações importadas da planilha siagas.
     * @param id
     * @return
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    public String editarPoco(Long idPoco) throws NegocioException {
        opAlterar = true;
        if(poco == null) {
            poco = new PocoValidacao();
        }
        poco = oes.carregarProprietario(idPoco);
        if (poco.getCpfCnpj() != null) {
            pesquisarCPFCNPJ();
        }
        return "/restrito/telas/dados_siagas.jsf";
    }

    /**
     * Método responsável por excluir as informações do poço.
     * @param poco
     * @throws NegocioException
     */
    public void excluir(PocoValidacao poco) throws NegocioException {
        oes.excluirPoco(poco);
        init();
        adicionaMensagemInfo(Mensagens.MSG.get("cadastrosiagas.sucesso.excluir"));
    }

    /**
     * Método responsável por visualizar as informações importadas da planilha siagas.
     * @param id
     * @return
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    public String visualizarPoco(Long idPoco) throws NegocioException {
        opAlterar = false;

        if(poco == null) {
            poco = new PocoValidacao();
        }

        poco = oes.carregarProprietario(idPoco);
        if (poco.getCpfCnpj() != null) {
            pesquisarCPFCNPJ();
        }
        return "/restrito/telas/dados_siagas.jsf";
    }

    public void limparPesquisaEmAnalise() throws NegocioException {
        ufArgumento = null;
        parametro = null;
        pesquisarEmAnalise();
        init();
    }

    public void limparPesquisaRetiricados() throws NegocioException {
        ufArgumento = null;
        parametro = null;
        pesquisarRetificados();
        init();
    }

    public void limparPesquisaSincronizados() throws NegocioException {
        ufArgumento = null;
        parametro = null;
        pesquisarSincronizados();
        init();
    }

    public void limparPesquisaNaoSincronizados() throws NegocioException {
        ufArgumento = null;
        parametro = null;
        pesquisarNaoSincronizados();
        init();
    }
    /**
     * Método responsável por recuperar o cep da nossa base de dados.
     */
    public void buscarCEP() {
        try {
            if(poco.getCepProprietario() == null) {
                poco = LimparCampos.limparEndereco(poco);
                return;
            }
            if(municipioProprietario == null) {
                municipioProprietario = new MunicipioPoco();
            }
            CEP cep = corpService.pesquisaPorCEP(poco.getCepProprietario().toString());
            if(cep == null && poco.getCepProprietario() == null) {
                poco.setBairroProprietario("");
                poco.setEnderecoProprietario("");
                ufEndereco = 0L;
                adicionaMensagemErro(Mensagens.SIS.get("sistema.erro.cepnaoencontrado"));
                return;
            }

            if(poco.getCepProprietario() != null &&
                poco.getUfProprietario() != null &&
                poco.getMunicipioProprietario() != null) {
                definirEnderecoRecuperadoSemUF();
            }

            if(cep != null) {
                poco.setEnderecoProprietario(cep.getLogradouro());
                poco.setBairroProprietario(cep.getBairro());
                poco.setMunicipioProprietario(getMunicipio(cep));
            }


        } catch(Exception e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.SIS.get("sistema.erro.problemapesquisacep"));
        }
    }

    /**
     * Método responsável por recuperar o municipio conforme o cep informado.
     * @param cep
     * @return
     * @throws NegocioException
     * @throws ServicoRemotoException
     */
    private String getMunicipio(CEP cep) throws NegocioException, ServicoRemotoException {
        for(UF uf : buscarUFs()) {

            if(verificarUF(cep, uf)) {
                ufEndereco = uf.getId();
                List<Municipio> municipioList = buscarMunicipios(ufEndereco);
                for(Municipio mun : municipioList) {
                    listaMunicipiosProprietario = municipioList;

                    if(verificarNomeCidade(cep, mun)) {
                        municipioProprietario.setIbgeCompleto(mun.getCodigoIBGE());
                        poco.setUfProprietario(uf.getCodigoIBGE());
                        return municipioProprietario.getIbgeCompleto();
                    }
                }
            }
        }
        return "";
    }

    private boolean verificarUF(CEP cep, UF uf) {
        return cep.getUf().equals(uf.getSigla());
    }

    private boolean verificarNomeCidade(CEP cep, Municipio mun) {
        return cep.getCidade().equalsIgnoreCase(mun.getNome().toUpperCase());
    }

    private void definirUfMunicipioSemCEP() {
        if(poco.getUfProprietario() == null && poco.getMunicipioProprietario() == null) {
            poco.setUfProprietario(ufEndereco.toString());
            poco.setMunicipioProprietario(municipioProprietario.getIbgeCompleto());
        }
    }

    private void definirEnderecoRecuperadoSemUF() throws NumberFormatException, ServicoRemotoException {
        ufEndereco = Long.valueOf(poco.getUfProprietario());
        listaMunicipiosProprietario = buscarMunicipios(ufEndereco);
        municipioProprietario.setIbgeCompleto(poco.getMunicipioProprietario());
    }

    /**
     * Método responsável por recuperar os Municipios da base de dados.
     */
    public List<Municipio> buscarMunicipiosProprietario() throws ServicoRemotoException {
        if (ufEndereco != null) {
            listaMunicipiosProprietario = buscarMunicipios(ufEndereco);
            return listaMunicipiosProprietario;
        }
        return Collections.<Municipio> emptyList();
    }

    /**
     * Método responsável por verificar se o CPF ou o CNPJ
     * existe em nossa base de dados.
     * @return
     * @throws ServicoRemotoException
     */
    public PocoValidacao pesquisarCPFCNPJ() {
        List<PocoValidacao> pocoValidacao = new ArrayList<PocoValidacao>();
        if (poco.getCpfCnpj().length() == 0) {
            poco = LimparCampos.limparBuscaCPFCNPJ(poco);
        }
        try {
            pocoValidacao = oes.pesquisarProprietario(poco.getCpfCnpj());
            incrementarID(pocoValidacao);
            definirInformacoesProprietario(pocoValidacao);

        } catch (NegocioException e) {
            log.error(e.getMessage(), e);
            adicionaMensagemErro(Mensagens.MSG.get("cadastrosiagas.erro.problemapesquisacpfcnpj"));
        }
        return poco;
    }

    /**
     * Método responsável por incrementar um ID caso
     * não exista nenhum proprietário.
     * @param pocoValidacao
     */
    private void incrementarID(List<PocoValidacao> pocoValidacao) {
        if (pocoValidacao.isEmpty()) {
            buscarMaxId();
            ultimoID++;
            poco.setIdProprietario(ultimoID);
        }
    }

    /**
     * Método reponsável por definir as informações no objeto proprietário
     * caso exista algum registro na pesquisa de proprietário.
     * @param pocoValidacao
     */
    private void definirInformacoesProprietario(List<PocoValidacao> pocoValidacao) {
        if (!pocoValidacao.isEmpty()) {
            int usuario = pocoValidacao.size() - 1;

            poco.setCpfCnpj(pocoValidacao.get(usuario).getCpfCnpj());
            poco.setNomeProprietario(pocoValidacao.get(usuario).getNomeProprietario());
            poco.setCepProprietario(pocoValidacao.get(usuario).getCepProprietario());
            poco.setEnderecoProprietario(pocoValidacao.get(usuario).getEnderecoProprietario());
            poco.setBairroProprietario(pocoValidacao.get(usuario).getBairroProprietario());
            poco.setUfProprietario(pocoValidacao.get(usuario).getUfProprietario());
            poco.setMunicipioProprietario(pocoValidacao.get(usuario).getMunicipioProprietario());
            poco.setTelefoneProprietario(pocoValidacao.get(usuario).getTelefoneProprietario());
            poco.setFaxProprietario(pocoValidacao.get(usuario).getFaxProprietario());
            poco.setCelularProprietario(pocoValidacao.get(usuario).getCelularProprietario());
            buscarCEP();
        }
    }

    /**
     * Método responsável por recuperar o ultimo ID
     * do proprietário na base de dados.
     * @return
     */
    public Long buscarMaxId() {
        try {
            ultimoID = Long.valueOf(oes.recuperarMaxIDProprietario());
            ultimoID = oes.recuperarMaxIDProprietario();
        } catch (NegocioException e) {
            log.error(e);
            adicionaMensagemErro(Mensagens.MSG.get("cadastrosiagas.erro.recuperarmaxid"));
        }
        return ultimoID;
    }

}