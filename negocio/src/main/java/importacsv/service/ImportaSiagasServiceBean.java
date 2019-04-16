package importacsv.service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.inject.Inject;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.EAOException;
import br.com.edu.framework.excecao.NegocioException;
import br.com.edu.framework.excecao.ServicoRemotoException;
import importacsv.entidade.PocoValidacao;
import br.gov.edu.wsclient.ig.uf.service.UF;
import br.gov.edu.wsclient.snirh.administracao.Atividade;
import br.gov.edu.wsclient.snirh.administracao.Autorizacao;
import br.gov.edu.wsclient.snirh.administracao.Modulo;
import br.gov.edu.wsclient.snirh.administracao.Restricao;
import br.gov.edu.wsclient.snirh.administracao.Usuario;
import importacsv.config.Credenciais;
import importacsv.eao.PocoValidacaoEAO;
import importacsv.util.VerificaParametro;

/**
 * @author eduardo.andrade
 * @since 25/07/2014
 */
@Log4j
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class ImportaCsvServiceBean implements ImportaCsvServiceLocal {

    @Inject
    private Credenciais credenciais;

    @Inject
    private PocoValidacaoEAO cadastroEAO;

    @EJB
    private CorporativoServiceLocal corporativoService;

    @Override
    public List<PocoValidacao> pesquisarPoco(String parametro, String uf, int situacao, int inicio, int pagina) throws NegocioException {
        if(credenciais.getUf() != null) {
            String ufEstadual = credenciais.getUf().getSigla();
            uf = ufEstadual;
        }
        if(!VerificaParametro.ehNulo(parametro)) {
            if (VerificaParametro.ehNumeroCsv(parametro)) {
                return pesquisarPocoPeloNumeroCsv(parametro, uf, situacao, inicio, pagina);
            } else if(VerificaParametro.ehCpfCnpj(parametro)) {
                return pesquisarPocoPeloCpfCnpj(parametro, uf, situacao, inicio, pagina);
            } else {
                return pesquisarPocoPeloArgumento(parametro, uf, situacao, inicio, pagina);
            }
        } else {
            return pesquisarTodos(uf, situacao, inicio, pagina);
        }
    }

    /**
     * método responsável por pesquisar o poço pelo numero siacsv     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws NegocioException
     */
    private List<PocoValidacao> pesquisarPocoPeloNumeroSiaCsvring parametro, String uf, int situacao, int inicio, int pagina) throws NegocioException {
        try {
            return cadastroEAO.pesquisarPocoPeloNumeroSiaCsvrametro, uf, situacao, inicio, pagina);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiacsvro.pesquisapeloponto", e);
        }
    }

    /**
     * método responsável por pesquisar o poço pelo cpf ou cnpj.
     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws NegocioException
     */
    private List<PocoValidacao> pesquisarPocoPeloCpfCnpj(String parametro, String uf, int situacao, int inicio, int pagina) throws NegocioException {
        try {
            return cadastroEAO.pesquisarPocoPeloCpfCnpj(parametro, uf, situacao, inicio, pagina);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagascsvpesquisapelocpfcnpj", e);
        }
    }

    /**
     * método responsável por pesquisar o poço pelo argumento.
     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws NegocioException
     */
    private List<PocoValidacao> pesquisarPocoPeloArgumento(String parametro, String uf, int situacao, int inicio, int pagina) throws NegocioException {
        try {
            return cadastroEAO.pesquisarPocoPeloArgumento(parametro, uf, situacao, inicio, pagina);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.ercsvquisapeloargumento", e);
        }
    }

    /**
     * método responsável por pesquisar todos os poço.
     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws NegocioException
     */
    private List<PocoValidacao> pesquisarTodos(String uf, int situacao, int inicio, int pagina) throws NegocioException {
        try {
            return cadastroEAO.pesquisarTodos(uf, situacao, inicio, pagina);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvsa", e);
        }
    }

    @Override
    public Long contarPocos(String parametro, String uf, int situacao) throws NegocioException {
        try {
            if(credenciais.getUf() != null) {
                String ufEstadual = credenciais.getUf().getSigla();
                uf = ufEstadual;
            }
            return cadastroEAO.contarPocos(uf, situacao, parametro);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvpocos", e);
        }
    }

    @Override
    public List<PocoValidacao> pesquisarProprietario(String cpf_cnpj) throws NegocioException {
        try {
            return cadastroEAO.pesquisarProprietario(cpf_cnpj);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvsaproprietario", e);
        }
    }

    @Override
    public Long recuperarMaxIDProprietario() throws NegocioException {
        try {
            return cadastroEAO.recuperarMaxIDProprietario();
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvrarmaxid", e);
        }
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void salvarPoco(PocoValidacao poco) throws NegocioException {
        try {
            if(validarVazao(poco)) {
                if (VerificaParametro.ehCpf(poco.getCpfCnpj())) {
                    poco.setTipoCpfCnpj(1);
                } else {
                    poco.setTipoCpfCnpj(2);
                }
                poco.setSituacaoRegistro(2);
                cadastroEAO.salvar(poco);
            } else {
                return;
            }
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csv", e);
        }
    }

    @Override
    public void excluirPoco(PocoValidacao poco) throws NegocioException {
        try {
            cadastroEAO.excluir(poco);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvr", e);
        }
    }

    @Override
    public PocoValidacao carregarProprietario(Long idPoco) throws NegocioException {
        try {
            return cadastroEAO.consultarPorPk(idPoco);
        } catch (EAOException e) {
            log.error(e);
            throw new NegocioException("cadastrosiagas.erro.csvarpoco", e);
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void verificarPermissoes(String cpf) throws NegocioException {
        try {
            Usuario usuario = corporativoService.pesquisarUsuarioComAutorizacoesPorCPF(cpf);
            credenciais.setUsuarioANA(usuario.isUsuarioANA());
            String[] nomes = usuario.getNomeCompleto().split(" ");
            setarNomeObjeto(nomes);
            recuperarNomeDoModulo(usuario);
            if(credenciais.tamanhoPermissoes() == 0) {
                throw new NegocioException("sistema.login.erro.pesquisausuarioestadual");
            }
        } catch(ServicoRemotoException ex) {
            log.error(ex);
            throw new NegocioException("cadastrointerferencia.erro.pesquisausuarioestadual");
        }
    }

    /**
     * Método responsável por definir o nome no objeto.
     * @param nomes
     */
    @SuppressWarnings("deprecation")
    private void setarNomeObjeto(String[] nomes) {
        if(nomes.length == 1) {
            credenciais.setNome(nomes[0]);
        } else {
            credenciais.setNome(nomes[0] + " " + nomes[nomes.length-1]);
        }
        credenciais.limparPermissoes();
    }

    /**
     * Método responsável por recuperar o nome do módulo.
     * @param usuario
     * @throws ServicoRemotoException
     */
    private void recuperarNomeDoModulo(Usuario usuario) throws ServicoRemotoException {
        String modPattern = "Importa SIAGAS";
        String norestPattern = "Importa SIAGAS";
        verificarAutorizacao(usuario, modPattern, norestPattern);
    }

    /**
     * Método responsável por verificas se a autorização faz parte do módulo Importa SIAGAS
     * @param usuario
     * @param modPattern
     * @param norestPattern
     * @throws ServicoRemotoException
     */
    private void verificarAutorizacao(Usuario usuario, String modPattern, String norestPattern) throws ServicoRemotoException {
        for(Autorizacao aut : usuario.getAutorizacoes().getAutorizacao()) {
            if(aut.getNome().contains("Importa SIAGAS")) {
                for(Modulo mod : aut.getPerfil().getModulos().getModulo()) {
                    Pattern pattern = Pattern.compile(modPattern);
                    Matcher matcher = pattern.matcher(mod.getNome());
                    if(matcher.matches()) {
                        adicionarPermissoes(aut);
                        recuperarPerfilAcesso(aut);
                        definirUF(pattern, matcher, norestPattern, aut);
                    }
                }
            }
        }
    }

    /**
     * Método responsável por adicionar as atividades à lista de permissoes.
     * @param aut
     */
    @SuppressWarnings("deprecation")
    private void adicionarPermissoes(Autorizacao aut) {
        for(Atividade at : aut.getPerfil().getAtividades().getAtividade()) {
            credenciais.adicionaPermissao(at.getSigla());
        }
    }

    /**
     * Método responsável por recuperar o perfil de acesso.
     * @param aut
     */
    private void recuperarPerfilAcesso(Autorizacao aut) {
        if(aut.getNome().trim().equals("Gestor Fed - Importa SIAGAS")) {
            credenciais.setPerfilAcesso("Gestor Federal");
        } else if(!aut.getNome().trim().equals("Gestor Fed - Importa SIAGAS")) {
            credenciais.setPerfilAcesso("Gestor Estadual ");
        }
    }

    /**
     * método responsável por definir o nome da UF.
     * @param pattern
     * @param matcher
     * @param norestPattern
     * @param aut
     * @throws ServicoRemotoException
     */
    private void definirUF(Pattern pattern, Matcher matcher, String norestPattern, Autorizacao aut) throws ServicoRemotoException {
        Restricao rest = aut.getRestricao();
        pattern = Pattern.compile(norestPattern);
        matcher = pattern.matcher(rest.getNome());

        if(matcher.matches()) {
            credenciais.setUf(null);

        } else if(aut.getNome().trim().equals("Gestor Fed - Importa SIAGAS")) {
            credenciais.setUf(null);

        } else {
            for(UF uf : corporativoService.pesquisaUnidadesFederacao()) {
                if(rest.getNome() != null && rest.getNome().equals(uf.getSigla())) {
                    credenciais.setUf(uf);
                    break;
                }
            }
        }
    }

    private boolean validarVazao(PocoValidacao poco) {
        boolean isValido = false;
        if(poco.getTempoDiaMes() > 30) {
            isValido = false;
        }
        if(poco.getTempoHoraDia() > 24) {
            isValido = false;
        } else {
            isValido = true;
        }
        return isValido;
    }

}
