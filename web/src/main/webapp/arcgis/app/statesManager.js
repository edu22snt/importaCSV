/*global define*/
/*jslint nomen:true*/

define([
    'dojo/on',
    'dojo/_base/lang',
    'app/sasjs-registry'
], function (on, lang, SASJSRegistry) {
    'use strict';

    var statesManager;

    statesManager = (function () {
        var
            /**
             * Listas
             * @type {{}}
             * @private
             */
            _lists = {
                'List:WidgetsLeft' : []
            },

            /**
             * Singleton do sasjs-registry
             * @type {*}
             */
            sasjsRegistry = SASJSRegistry.getInstance();

        return {

            /**
             * Adiciona um widget a uma lista de estados
             * @param {String} listName
             * @param {String} widgetName
             */
            addWidgetAtList : function (listName, widgetName) {
                var widget = sasjsRegistry.get(widgetName);
                _lists[listName].push(widgetName);
            },

            /**
             * Seta a visibilidade de todos os widgets de uma lista como false, deixando visível somente o widget parametrizado
             * @param {String} listName
             * @param {String} widgetName
             */
            setWidgetVisibleAtList : function (listName, widgetName) {
                var i = 0,
                    list,
                    widgetVisible;

                list = _lists[listName];

                if (widgetName) {
                    i = 0;
                    while (i < list.length) {
                        if (list[i] === widgetName) {
                            widgetVisible = sasjsRegistry.get(list[i]);
                        }
                        i++;
                    }
                }

                i = 0;
                while (i < list.length) {
                    var _widget = sasjsRegistry.get(list[i]);
                    _widget.setVisible(false);
                    i++;
                }

                widgetName ? widgetVisible.setVisible(true) : null;
            }
        }
    }());

    return statesManager;
});