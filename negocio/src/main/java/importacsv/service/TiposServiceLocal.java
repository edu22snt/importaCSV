package importacsv.service;

import java.util.List;

import javax.ejb.Local;

import br.com.ctis.framework.excecao.NegocioException;
import br.gov.ana.importasiagas.entidade.TipoCultura;
import br.gov.ana.importasiagas.entidade.TipoFinalidade;
import br.gov.ana.importasiagas.entidade.TipoSistemaIrrigacao;
import br.gov.ana.importasiagas.entidade.TipoAto;
import br.gov.ana.importasiagas.entidade.TipoSituacaoInterferencia;
import br.gov.ana.importasiagas.entidade.TipoSituacaoAto;

/**
 * @author eduardo.andrade
 * @since 02/10/2015
 */
@Local
public interface TiposServiceLocal {


    /**
     * Método responsável por listar os tipos de finalidades.
     * @return
     * @throws NegocioException
     */
    List<TipoFinalidade> listarFinalidade()throws NegocioException;

    /**
     * Método responsável por listar os tipos de situação de outorga.
     * @return
     * @throws NegocioException
     */
    List<TipoSituacaoAto> listarSituacaoOutorga()throws NegocioException;

    /**
     * Método responsável por listar os tipos de situação de interferência.
     * @return
     * @throws NegocioException
     */
    List<TipoSituacaoInterferencia> listarSituacaoInterferencia()throws NegocioException;

    /**
     * Método responsável por listar os tipos de situação de Atos.
     * @return
     * @throws NegocioException
     */
    List<TipoAto> listarSituacaoAto()throws NegocioException;

    /**
     * Método responsável por listar os tipos de sistema irrigação.
     * @return
     * @throws NegocioException
     */
    List<TipoSistemaIrrigacao> listarSistemaIrrigacao()throws NegocioException;

    /**
     * Método responsável por listar os tipos de cultura.
     * @return
     * @throws NegocioException
     */
    List<TipoCultura> listarCultura()throws NegocioException;
}
