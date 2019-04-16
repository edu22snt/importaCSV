package br.gov.ana.importasiagas.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DataUtil {

    private static final String FORMATO_TRADICIONAL = "dd/MM/yyyy";

    /**
     * @param data
     * @return <code>data formatada</code>
     */
    public static String formatarDataTradicional(Date data) {
	if (data != null) {
	    return new SimpleDateFormat(FORMATO_TRADICIONAL).format(data);
	}
	return "";
    }

    public static String formatarDataTradicional(String data) {
        if (data != null && data.trim().length() > 0) {
            return new SimpleDateFormat(FORMATO_TRADICIONAL).format(data);
        }
        return "";
    }

}
