/**
 * Created by isac.caja on 17/10/13.
 */
/*global SASJS_DIV_CONTAINER, SASJS_MAP, SASJS_APP_CONTAINER, setTimeout, console*/
"use strict";

define([
    "app/sasjs-registry",
    "dojo/dom-construct",
    "dojo/_base/fx",
    "dojo/_base/window",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style"
], function (SASJSRegistry, domConstruct, fx, win, on, dom, domStyle) {

    var registry = SASJSRegistry.getInstance(),

        /**
         * Objeto com referências de elementos da aplicação.
         */
        AppHelper = (function () {

            var _div_sasjsError, _div_sasjsInfo;

            _div_sasjsError = domConstruct.create('div', {
                id : 'sasjs_error'
            }, win.body());

            _div_sasjsInfo = domConstruct.create('div', {
                id : 'sasjs_info'
            }, win.body());

            return {
                /**
                 * Retorna o mapa utilizado na aplicação
                 *
                 * @public
                 * @return {esri.Map}
                 */
                getMap : function () {
                    return registry.get(SASJS_MAP);
                },

                /**
                 * Retorna o elemento HTML no qual a aplicação está inserida
                 *
                 * @public
                 * @return {HTMLElement}
                 */
                getAppContainer : function () {
                    return registry.get(SASJS_APP_CONTAINER);
                },

                /**
                 * Retorna o container (elemento HTML) parametrizada para a construção de toda a aplicação
                 *
                 * @public
                 * @return {HTMLElement}
                 */
                getDivContainer : function () {
                    return registry.get(SASJS_DIV_CONTAINER);
                },

                /**
                 * Apresenta uma mensagem de erro ao usuário.
                 *
                 * @public
                 * @param {string} msg
                 */
                showError : function (msg) {
                    var div_msgError, btnClose;

                    div_msgError = domConstruct.create('div', {class : 'msg-error', innerHTML : msg});
                    btnClose = domConstruct.create('button', {
                        class : 'msg-error-close fa fa-times',
                        onclick : function () {
                            domConstruct.destroy(div_msgError);
                        }
                    });

                    domConstruct.place(btnClose, div_msgError);
                    domConstruct.place(div_msgError, _div_sasjsError);
                },

                showInfo : function (msg) {
                    var div_msgInfo, btnClose;

                    div_msgInfo = domConstruct.create('div', {class : 'msg-info', innerHTML : msg});
                    btnClose = domConstruct.create('button', {
                        class : 'msg-info-close fa fa-times',
                        onclick : function () {
                            domConstruct.destroy(div_msgInfo);
                        }
                    });

                    domConstruct.place(btnClose, div_msgInfo);
                    domConstruct.place(div_msgInfo, _div_sasjsInfo);
                }
            };
        }());

    return AppHelper;
})