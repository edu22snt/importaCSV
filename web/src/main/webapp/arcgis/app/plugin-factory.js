/**
 * Created by doncilio.silva on 10/01/14.
 */
/*global define, console, baseUrl, require*/
/*jslint nomen : true*/


define([],
    function () {
        "use strict";
        /**
         *
         * @type {{create: Function}}
         */
        var PluginFactory = {

            /**
             * Instância o plugin, definindo a configuração no construtor do plugin
             *
             * @param {String} pluginName
             * @param {Function} callback
             */
            create: function (pluginName, callback) {
                require(['plugins/' + pluginName], function (PluginClass) {
                    var plugin = new PluginClass();
                    callback(plugin);
                });
            }
        };

        return PluginFactory;
    });