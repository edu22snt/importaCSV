package importacsv.controle;

import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.extern.log4j.Log4j;
import br.com.edu.framework.excecao.NegocioException;
import br.com.edu.framework.lazy.PaginatedArrayList;
import br.com.edu.framework.util.ConverterUtil;
import importacsv.entidade.PocoValidacao;
import importacsv.service.ImportaSiagasServiceLocal;

/**
 * @author eduardo.andrade
 * @since 06/10/2014
 */
@Log4j
public class ImportaSiagasList extends PaginatedArrayList<PocoValidacao> {

    private String parametro;
    private String uf;
    private int situacao;

    public ImportaSiagasList(ImportaSiagasServiceLocal datasource, String parametros, String uf, int situacao, int pageSize) {
        super(datasource, pageSize);
        this.parametro = parametros;
        this.uf = uf;
        this.situacao = situacao;
    }

    public ImportaSiagasList(ImportaSiagasServiceLocal datasource, String parametros, String uf, int situacaoPoco) {
        this(datasource, parametros, uf, situacaoPoco, 10);
    }

    @Override
    public int count() throws RuntimeException {
        try {
            limparMascaras();
            Long count = ((ImportaSiagasServiceLocal)getDatasource()).contarPocos(parametro, uf, situacao);
            return count.intValue();
        } catch (NegocioException e) {
            log.error(e);
            return 0;
        }
    }

    @Override
    public List<PocoValidacao> load(int inicio, int pagina) throws RuntimeException {
        try {
            limparMascaras();
            return ((ImportaSiagasServiceLocal)getDatasource()).pesquisarPoco(parametro, uf, situacao, inicio, pagina);
        } catch (NegocioException e) {
            log.error(e);
            return Collections.emptyList();
        }
    }

    private void limparMascaras() {
        if (parametro != null && parametro.trim().length() != 0) {
            limparMascaraCPF();
            limparMascaraCNPJ();
        }
    }

    private void limparMascaraCPF() {
        final String PADRAO_CPF = "[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}";
        Matcher mcpf = Pattern.compile(PADRAO_CPF).matcher(parametro);
        if (mcpf.matches()) {
            parametro = ConverterUtil.limpaMascara(parametro);
        }
    }

    private void limparMascaraCNPJ() {
        final String PADRAO_CNPJ = "[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{4}-[0-9]{2}";
        Matcher mcnpj = Pattern.compile(PADRAO_CNPJ).matcher(parametro);
        if (mcnpj.matches()) {
            parametro = ConverterUtil.limpaMascara(parametro);
        }
    }

}
