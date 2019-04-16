package importacsv.service;

import java.util.List;

import javax.ejb.Local;

import br.com.edu.framework.excecao.NegocioException;
import importacsv.entidade.TipoCultura;
import importacsv.entidade.TipoFinalidade;
import importacsv.entidade.TipoSistemaIrrigacao;
import importacsv.entidade.TipoAto;
import importacsv.entidade.TipoSituacaoInterferencia;
import importacsv.entidade.TipoSituacaoAto;

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
