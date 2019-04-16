package importacsv.util;

import org.apache.commons.lang3.StringUtils;

/**
 * @author eduardo.andrade
 * @since 01/10/2015
 */
public class VerificaParametro {

    /**
     * Método responsável para verificar se o parametro é nulo.
     * @param arg1
     * @return
     */
    public static boolean ehNulo(String arg1) {
        boolean isNulo;
        if(arg1 == null || arg1.trim().length() == 0) {
            isNulo = true;
        } else {
            isNulo = false;
        }
        return isNulo;
    }

    /**
     * Método responsável para verificar se o parametro é numérico.
     * @param arg1
     * @return
     */
    public static boolean ehNumerico(String arg1) {
        boolean isNumerico;
        if(StringUtils.isNumeric(arg1)) {
            isNumerico = true;
        } else {
            isNumerico = false;
        }
        return isNumerico;
    }

    /**
     * Método responsável para verificar se o parametro é um número siagas.
     * @param arg1
     * @return
     */
    public static boolean ehNumeroSiagas(String arg1) {
        boolean isNumeroSiagas = false;
        if(ehNumerico(arg1)) {
            if(arg1.trim().length() < 11) {
                isNumeroSiagas = true;
            } else {
                isNumeroSiagas = false;
            }
        }
        return isNumeroSiagas;
    }

    /**
     * Método responsável para verificar se o parametro é um CPF ou CNPJ.
     * @param arg1
     * @return
     */
    public static boolean ehCpfCnpj(String arg1) {
        boolean isCpfCnpj = false;
        if(ehNumerico(arg1)) {
            if(arg1.trim().length() >= 11) {
                isCpfCnpj = true;
            } else {
                isCpfCnpj = false;
            }
        }
        return isCpfCnpj;
    }

    /**
     * Método responsável para verificar se o parametro é um CPF.
     * @param arg1
     * @return
     */
    public static boolean ehCpf(String arg1) {
        boolean isCpf = false;
        if(ehNumerico(arg1)) {
            if(arg1.trim().length() == 11) {
                isCpf = true;
            } else {
                isCpf = false;
            }
        }
        return isCpf;
    }

    /**
     * Método responsável para verificar se o parametro é um CNPJ.
     * @param arg1
     * @return
     */
    public static boolean ehCnpj(String arg1) {
        boolean isCnpj = false;
        if(ehNumerico(arg1)) {
            if(arg1.trim().length() == 14) {
                isCnpj = true;
            } else {
                isCnpj = false;
            }
        }
        return isCnpj;
    }
}
