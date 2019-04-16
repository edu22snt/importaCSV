/**
 * Created by isac.caja on 16/10/13.
 */
/*global baseUrl*/
"use strict";

define([],
    function () {
        /**
         *
         * @type {{create: Function}}
         */
        var WidgetFactory = {

            /**
             * Instância o widget, definindo a configuração no construtor do widget
             *
             * @param {String} widgetName
             * @param {Function} callback
             */
            create: function (widgetName, callback) {
                require(['widgets/' + widgetName], function (WidgetClass) {
                    var widget = new WidgetClass({baseUrl : baseUrl});
                    callback(widget);
                });
            }
        };

        return WidgetFactory;
    });