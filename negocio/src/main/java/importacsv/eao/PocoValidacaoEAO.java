package importacsv.eao;

import java.util.List;

import javax.management.Query;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;

import org.apache.commons.lang3.StringUtils;

import br.com.ctis.framework.excecao.EAOException;
import br.com.ctis.framework.modelo.JPAParameter;
import importacsv.entidade.PocoValidacao;
import importacsv.util.VerificaParametro;
import lombok.extern.log4j.Log4j;

/**
 * @author eduardo.andrade
 * @since 24/07/2014
 */
@Log4j
public class PocoValidacaoEAO extends ImportaCsvEAO<PocoValidacao, Long> {

    /**
     * Método responsável por pesquisar todos os poços.
     * pesquisarSemUF = GESTOR FEDERAL.
     * pesquisarComUF = GESTOR ESTADUAL.
     * @param parametro
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws EAOException
     */
    @SuppressWarnings("unchecked")
    public List<PocoValidacao> pesquisarTodos(String uf, int situacao, int inicio, int pagina) throws EAOException {
        try {
            StringBuffer sql = new StringBuffer()
            .append(" SELECT * FROM RGLTB_POCO_VALIDACAO P ")
            .append(" WHERE P.SITUACAO_REGISTRO = " + situacao);

            if(uf != null) {
                sql.append(" AND P.UF = '" + uf + "'");
            }
            sql.append(" ORDER BY P.UF");

            String nsql = transformOraclePagingQuery(sql.toString());

            Query q = getEntityManager().createNativeQuery(nsql, PocoValidacao.class);

            q.setParameter("inicio", inicio);
            q.setParameter("pagina", pagina);

            return q.getResultList();
        } catch(RuntimeException ex) {
            log.error(ex);
            throw new EAOException("cadastrosiagas.erro.pesquisa", ex);
        }
    }

    /**
     * Método repsonsável por recuperar as informações do poço pelo número do ponto.
     * @param argumento
     * @param uf
     * @param situacao
     * @return
     * @throws EAOException
     */
    @SuppressWarnings("unchecked")
    public List<PocoValidacao> pesquisarPocoPeloNumeroSiagas(String argumento, String uf, int situacao, int inicio, int pagina) throws EAOException {
        try {
            Long ponto = Long.parseLong(argumento);
            inicio--;

            StringBuffer sql = new StringBuffer()
            .append(" SELECT * FROM RGLTB_POCO_VALIDACAO P ")
            .append(" WHERE P.SITUACAO_REGISTRO = " + situacao)
            .append(" AND P.PONTO = " + ponto);

            if(uf != null) {
                sql.append(" AND P.UF = '" + uf + "'");
            }
            sql.append(" ORDER BY P.UF");

            String nsql = transformOraclePagingQuery(sql.toString());

            Query q = getEntityManager().createNativeQuery(nsql, PocoValidacao.class);

            q.setParameter("inicio", inicio);
            q.setParameter("pagina", pagina);

            return q.getResultList();

        } catch (RuntimeException rex) {
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.pesquisar", rex);
        }
    }

    /**
     * Método responsável por recuperar os poços pelo CPF ou CNPJ.
     * @param cpfCnpj
     * @param uf
     * @param situacao
     * @param inicio
     * @param pagina
     * @return
     * @throws EAOException
     */
    @SuppressWarnings("unchecked")
    public List<PocoValidacao> pesquisarPocoPeloCpfCnpj(String cpfCnpj, String uf, int situacao, int inicio, int pagina) throws EAOException {
        try {
            inicio--;

            StringBuffer sql = new StringBuffer()
            .append(" SELECT * FROM RGLTB_POCO_VALIDACAO P ")
            .append("WHERE P.SITUACAO_REGISTRO = " + situacao)
            .append("AND (P.CPF_CNPJ_PROPRIETARIO = '" + cpfCnpj + "'")
            .append("OR P.CPF_CNPJ_PROPRIETARIO LIKE '%" + cpfCnpj + "%')");

            if(uf != null) {
                sql.append(" AND P.UF = '" + uf + "'");
            }
            sql.append(" ORDER BY P.UF");

            String nsql = transformOraclePagingQuery(sql.toString());

            Query q = getEntityManager().createNativeQuery(nsql, PocoValidacao.class);

            q.setParameter("inicio", inicio);
            q.setParameter("pagina", pagina);

            return q.getResultList();
        } catch (RuntimeException rex) {
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.pesquisar", rex);
        }
    }

    /**
     * Método responsável por pesquisar informações do poço pelos parâmetros argumento, UF e situação.
     * @param argumento
     * @param uf
     * @param situacao
     * @return
     * @throws EAOException
     */
    @SuppressWarnings("unchecked")
    public List<PocoValidacao> pesquisarPocoPeloArgumento(String argumento, String uf, int situacao, int inicio, int pagina) throws EAOException {
        try {
            inicio--;

            StringBuffer sql = new StringBuffer()
            .append(" SELECT * FROM RGLTB_POCO_VALIDACAO P ")
            .append(" WHERE P.SITUACAO_REGISTRO = " + situacao);

            if(uf != null) {
                sql.append(" AND P.UF = '" + uf + "'");
            }
            sql.append(" AND (P.MUNICIPIO = '" + argumento + "'")
               .append(" OR P.NOME_PROPRIETARIO = '" + argumento + "'")
               .append(" OR P.MUNICIPIO LIKE '%" + argumento + "%'")
               .append(" OR P.NOME_PROPRIETARIO LIKE '%" + argumento + "%')");

            sql.append(" ORDER BY P.UF");

            String nsql = transformOraclePagingQuery(sql.toString());

            Query q = getEntityManager().createNativeQuery(nsql, PocoValidacao.class);

            q.setParameter("inicio", inicio);
            q.setParameter("pagina", pagina);

            return q.getResultList();
        } catch (RuntimeException rex) {
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.pesquisa", rex);
        }
    }

    /**
     * Método responsável por recuperar a quantidade de poços por parâmetros.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     * @throws EAOException
     */
    public Long contarPocos(String uf, int situacao, String argumento) throws EAOException {
        try {

            if (validarPelaSituacao(uf, situacao, argumento)) {
                return contarPocoPelaSituacao(situacao);

            } else if(validarSituacaoEhArgumento(uf, situacao, argumento)) {
                return contarPocoPelaSituacaoEhArgumento(situacao, argumento);

            } else if (validarSituacaoEhUf(uf, situacao, argumento)) {
                return contarPocoPelaSituacaoEhUF(situacao, uf);

            } else if (validarPocoPorPontoUFSituacao(uf, situacao, argumento)) {
                return contarPocoPorPontoUFSituacao(situacao, uf, argumento);

            }else if(validarPocoPeloPontoEhSituacao(uf, situacao, argumento)) {
                return contarPocoPeloPontoEhSituacao(situacao, argumento);

            }else {
                return contarPocoPelaSituacaoUFEhArgumento(situacao, uf, argumento);
            }
        } catch (NoResultException e) {
            log.error(e);
            return 0L;
        } catch (NonUniqueResultException e) {
            log.error(e);
            return 0L;
        } catch (RuntimeException ex) {
            log.error(ex);
            throw new EAOException("cadastrosiagas.erro.pesquisa", ex);
        }
    }

    /**
     * Método responsável por recuperar a quantidade de poços pela situação.
     * @param situacao
     * @return
     */
    private Long contarPocoPelaSituacao(int situacao){
        Query query = getEntityManager().createNamedQuery("importa.contarPoco");
        query.setParameter("situacao", situacao);
        return (Long) query.getSingleResult();
    }

    /**
     * Método responsável por recuperar a quantidade de poços pela situação e argumento.
     * @param situacao
     * @param argumento
     * @return
     */
    private Long contarPocoPelaSituacaoEhArgumento(int situacao, String argumento) {
        Query query = getEntityManager().createNamedQuery("importa.contarPorArgumentoSituacao");
        query.setParameter("situacao", situacao);
        query.setParameter("argumento", argumento);
        query.setParameter("argumentoLike", "%" + argumento + "%");
        return (Long) query.getSingleResult();
    }

    /**
     * Método responsável por recuperar a quantidade de poços pela situação e unidade federativa.
     * @param situacao
     * @param uf
     * @return
     */
    private Long contarPocoPelaSituacaoEhUF(int situacao, String uf) {
        Query query = getEntityManager().createNamedQuery("importa.contarPorUFSituacao");
        query.setParameter("situacao", situacao);
        query.setParameter("uf", uf);
        return (Long) query.getSingleResult();
    }

    /**
     * Método responsável por recuperar a quantidade de poços pelo ponto, unidade federativa e situação.
     * @param situacao
     * @param uf
     * @param argumento
     * @return
     */
    private Long contarPocoPorPontoUFSituacao(int situacao, String uf, String argumento) {
        Query query = getEntityManager().createNamedQuery("importa.contarPorPontoUFSituacao");
        query.setParameter("uf", uf);
        query.setParameter("situacao", situacao);
        query.setParameter("argumento", Long.parseLong(argumento));
        return (Long) query.getSingleResult();
    }

    /**
     * Método responsável por recuperar a quantidade de poços pelo ponto e situação.
     * @param situacao
     * @param argumento
     * @return
     */
    private Long contarPocoPeloPontoEhSituacao(int situacao, String argumento) {
        Query query = getEntityManager().createNamedQuery("importa.contarPorPontoSituacao");
        query.setParameter("situacao", situacao);
        query.setParameter("argumento", Long.parseLong(argumento));
        return (Long) query.getSingleResult();
    }

    /**
     * Método responsável por recuperar a quantidade de poços pela situação, unidade federação e argumento.
     * @param situacao
     * @param uf
     * @param argumento
     * @return
     */
    private Long contarPocoPelaSituacaoUFEhArgumento(int situacao, String uf, String argumento) {
        Query query = getEntityManager().createNamedQuery("importa.contarPorArgumentoUFSituacao");
        query.setParameter("uf", uf);
        query.setParameter("situacao", situacao);
        query.setParameter("argumento", argumento);
        query.setParameter("argumentoLike", "%" + argumento + "%");
        return (Long) query.getSingleResult();
    }

    /**
     * Método repsonsável por recuperar a quantidade de poço pelo ponto.
     * @param ponto
     * @return
     * @throws EAOException
     */
    public Long contarPocoPorPonto(Long ponto) throws EAOException{
        try{
            Query query = getEntityManager().createNamedQuery("importa.contarPocoPorPonto");
            query.setParameter("ponto", ponto);
            return (Long) query.getSingleResult();
        }catch(RuntimeException rex){
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.pesquisa", rex);
        }
    }

    /**
     * Método responsável por pesquisar o proprietário existente.
     * @param cpfCnpj
     * @return
     * @throws EAOException
     */
    public List<PocoValidacao> pesquisarProprietario(String cpfCnpj) throws EAOException {
        try {
            return consultar("importa.PesquisarProprietario", new JPAParameter("cpfCnpj", cpfCnpj));
        } catch (RuntimeException rex) {
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.pesquisa", rex);
        }
    }

    /**
     * Método responsável por recuperar o último ID do proprietário.
     * @return
     * @throws EAOException
     */
    public Long recuperarMaxIDProprietario() throws EAOException {
        try {
            Query query = getEntityManager().createNamedQuery("importa.recuperarMaxIdProprietario");
            return (Long) query.getSingleResult();
        } catch (RuntimeException rex) {
            log.error(rex);
            throw new EAOException("cadastrosiagas.erro.recuperarmaxid", rex);
        }
    }

    /**
     * Método responsável por validar pela situação.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     */
    private boolean validarPelaSituacao(String uf, int situacao, String argumento) {
        return (VerificaParametro.ehNulo(argumento)) && (VerificaParametro.ehNulo(uf));
    }

    /**
     * Método responsável por validar pela situação e argumento.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     */
    private boolean validarSituacaoEhArgumento(String uf, int situacao, String argumento) {
        return (!VerificaParametro.ehNulo(argumento)) && (VerificaParametro.ehNulo(uf));
    }

    /**
     * Método responsável por validar pela situação e UF.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     */
    private boolean validarSituacaoEhUf(String uf, int situacao, String argumento) {
        return (VerificaParametro.ehNulo(argumento)) && (!VerificaParametro.ehNulo(uf));
    }

    /**
     * Método responsável por validar pela situação, UF e pelo ponto.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     */
    private boolean validarPocoPorPontoUFSituacao(String uf, int situacao, String argumento) {
        return ((!VerificaParametro.ehNulo(argumento)) && StringUtils.isNumeric(argumento)) && (argumento.length() <= 10) && (!VerificaParametro.ehNulo(uf));
    }

    /**
     * Método responsável por validar pela situação e ponto.
     * @param uf
     * @param situacao
     * @param argumento
     * @return
     */
    private boolean validarPocoPeloPontoEhSituacao(String uf, int situacao, String argumento){
        return (StringUtils.isNumeric(argumento)) && (!VerificaParametro.ehNulo(argumento)) && (argumento.length() <= 10) && (VerificaParametro.ehNulo(uf));
    }

}
