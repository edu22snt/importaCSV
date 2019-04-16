package importacsv.dominio;

import br.com.edu.framework.util.Resources;

/**
 * @author eduardo.andrade
 * @since 22/09/2015
 */
public enum SituacaoPocoEnum {

    EM_ANALISE(1),
    RETIFICADO(2),
    SINCRONIZADO(3),
    NAOSINCRONIZADO(4);

    private final int ord;

    private SituacaoPocoEnum(int v) {
        ord = v;
    }

    public int getOrd() {
        return ord;
    }

    @Override
    public String toString() {
        return toString(ord);
    }

    public static String toString(int ord) {
        Resources r = new Resources("ImportaCSVMessages");
        switch (ord) {
            case 1:
                return r.get("dominio.situacaooutorga.emanalise");
            case 2:
                return r.get("dominio.situacaooutorga.retificado");
            case 3:
                return r.get("dominio.situacaooutorga.sincronizado");
            case 4:
                return r.get("dominio.situacaooutorga.naosincronizado");
            default:
                return null;
        }
    }

    public static SituacaoPocoEnum toEnum(int ord) {
        for(SituacaoPocoEnum e : values()) {
            if(e.getOrd() == ord) {
                return e;
            }
        }
        return null;
    }
}