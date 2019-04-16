package importacsv.config;

public enum Configuracoes {

    AMBIENTE("sistema.ambiente"),
    CARGAPLANILHA_IMPORTACSV_CAMINHOUPLOAD("importacsv.cargaplanilha.caminhoupload"),
    CARGAPLANILHA_IMPORTACSV_CAMINHODOWNLOAD("importacsv.cargaplanilha.caminhodownload");

    private String value;

    private Configuracoes(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
