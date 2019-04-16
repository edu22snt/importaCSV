package importacsv.service;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.inject.Inject;

import br.com.ctis.framework.excecao.EAOException;
import br.com.ctis.framework.excecao.NegocioException;
import br.gov.ana.importasiagas.entidade.TipoCultura;
import br.gov.ana.importasiagas.entidade.TipoFinalidade;
import br.gov.ana.importasiagas.entidade.TipoSistemaIrrigacao;
import br.gov.ana.importasiagas.entidade.TipoAto;
import br.gov.ana.importasiagas.entidade.TipoSituacaoInterferencia;
import importacsv.eao.TipoAtoEAO;
import importacsv.eao.TipoCulturaEAO;
import importacsv.eao.TipoFinalidadeEAO;
import importacsv.eao.TipoSistemaIrrigacaoEAO;
import importacsv.eao.TipoSituacaoAtooEAO;
import importacsv.eao.TipoSituacaoInterferenciaEAO;
import br.gov.ana.importasiagas.entidade.TipoSituacaoAto;

/**
 * @author eduardo.andrade
 * @since 02/10/2015
 */
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class TiposServiceBean implements TiposServiceLocal {

    @Inject
    private TipoFinalidadeEAO finalidadeEAO;

    @Inject
    private TipoSituacaoAtooEAO situacaoOutorgaEAO;

    @Inject
    private TipoSituacaoInterferenciaEAO situacaoInterferenciaEAO;

    @Inject
    private TipoAtoEAO situacaoAtoEAO;

    @Inject
    private TipoSistemaIrrigacaoEAO sistemaIrrigacaoEAO;

    @Inject
    private TipoCulturaEAO tipoCulturaEAO;

    @Override
    public List<TipoFinalidade> listarFinalidade() throws NegocioException {
        try {
            return finalidadeEAO.listarFinalidade();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }

    @Override
    public List<TipoSituacaoAto> listarSituacaoOutorga() throws NegocioException {
        try {
            return situacaoOutorgaEAO.listarSituacaoAtoo();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }

    @Override
    public List<TipoSituacaoInterferencia> listarSituacaoInterferencia() throws NegocioException {
        try {
            return situacaoInterferenciaEAO.listarSituacaoInterferencia();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }

    @Override
    public List<TipoAto> listarSituacaoAto() throws NegocioException {
        try {
            return situacaoAtoEAO.listarSituacaoAto();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }

    @Override
    public List<TipoSistemaIrrigacao> listarSistemaIrrigacao() throws NegocioException {
        try {
            return sistemaIrrigacaoEAO.listarSistemaIrrigacao();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }

    @Override
    public List<TipoCultura> listarCultura() throws NegocioException {
        try {
            return tipoCulturaEAO.listarCultura();
        } catch (EAOException e) {
            throw new NegocioException("cadastrosiagas.erro.pesquisar", e);
        }
    }
}
