package importacsv.permissoes;

public enum Permissoes {

    ALTERAR_POCO("APC"),
    VISUALIZAR_POCO("VPC"),
    VISUALIZAR_ESTADOS("VES"),
    CARREGAR_DADOS_PLANILHA("CDP");

    private String value;

    private Permissoes(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
