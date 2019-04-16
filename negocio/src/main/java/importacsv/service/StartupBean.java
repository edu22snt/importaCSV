package importacsv.service;

import java.io.IOException;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.inject.Inject;

import lombok.extern.log4j.Log4j;
import br.com.ctis.framework.config.ConfigCache;
import br.com.ctis.framework.util.StartupUtil;
import importacsv.config.Configuracoes;
import importacsv.eao.ParametroConfiguracaoEAO;

@Log4j
@Startup
@Singleton
@TransactionManagement(TransactionManagementType.CONTAINER)
public class StartupBean {

    @Inject
    private ParametroConfiguracaoEAO configuracaoEAO;

    @PostConstruct
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    private void startup() {
        try {

            log.debug("[STARTUP SERVICE] Bootstrap");

            // CRIANDO O BEAN DE CONFIGURACAOO
            ConfigCache.getInstance().setSource(configuracaoEAO);

            // DEFININDO O AMBIENTE DE EXECUÇÃO
            ConfigCache cc = ConfigCache.getInstance();
            StartupUtil.inicializarAmbiente(cc.get(Configuracoes.AMBIENTE.toString()));

            // CONFIGURANDO O LOG4J
            inicializarLog4J();

        } catch(Exception ex) {
            log.error(ex);
        }
    }

    private void inicializarLog4J() throws IOException {
        String logDir = StartupUtil.inicializarLog4jDir("importasiagas");

        Properties log4jConfig = new Properties();
        log4jConfig.load(getClass().getResourceAsStream("/log4j.properties"));

        log4jConfig.put("log4j.appender.file.File", logDir);
        org.apache.log4j.PropertyConfigurator.configure(log4jConfig);
    }

}