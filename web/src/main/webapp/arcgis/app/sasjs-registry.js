/**
 * Created by isac.caja on 17/10/13.
 */
"use strict";

define([
    'dojo/_base/declare'
], function (declare) {

    /**
     * Classe singleton para armazenamento de registros da aplicação
     */
    var SASJSRegistry = (function () {

        /**
         * Instância singleton
         */
        var instance,

            /**
             * Itens registrados na classe.
             * Os registros armazendos por chave -> valor
             */
            registry = {},

            /**
             * Classe de registro.
             * @type {*}
             */
            SASJSRegistry = declare(null, {

                /**
                 * Verifica se há registro na respectiva chave
                 * @param key
                 * @returns {boolean}
                 */
                exists : function (key) {
                    return registry.hasOwnProperty(key);
                },

                /**
                 * Registra o item na respectiva chave
                 * @param key
                 * @param item
                 */
                set : function (key, item) {
                    registry[key] = item;
                },

                /**
                 * Retorna o item respectivo a chave parametrizada
                 * @param key
                 * @returns {*}
                 */
                get : function (key) {
                    var item;
                    if (this.exists(key)) {
                        item = registry[key];
                    }
                    return item;
                },

                /**
                 * Remove o registro especificado por key
                 * @param key
                 */
                remove : function (key) {
                    delete registry[key];
                }
            });


        function getInstance() {
            if (!instance) {
                instance = new SASJSRegistry();
            }

            return instance;
        }

        return {getInstance: getInstance};
    }());

    return SASJSRegistry;
});