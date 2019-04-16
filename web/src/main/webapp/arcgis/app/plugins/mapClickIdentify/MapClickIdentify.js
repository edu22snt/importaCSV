/**
 * Created by irian.villalba on 23/01/14.
 */

/*global define, console*/
/*jslint nomen : true*/

define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/DeferredList",
    "dojo/promise/all",

    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",

    "app/app-helper",

    "dojo/domReady!"
], function (on,
             declare,
             lang,
             Deferred,
             DeferredList,
             all,

             IdentifyTask,
             IdentifyParameters,

             AppHelper
    ) {
    "use strict";
    var
        /**
         * Mapa utilizado pelo plugin
         */
            mapa,

        /**
         * objeto do plugin
         */
            that,

        /**
         * Vetor com as URLs dos serviços a serem consultados
         */
            urlMapa,

        /**
         * camadas a serem consultadas: visible/invisible/all
         */
            type;




    return declare("MapClickIdentify", null, {

        /**
         * Contém as geometrias localizadas pelo identify
         */
        allGeometry: null,

        /**
         * Ouvinte do click no mapa
         */
        handleMapClick: null,

        /**
         * Receberá os valores do Identify
         */
        _valuesIdentify : null,

        /**
         * verifica se o plugin está ou não ativo
         */
        active: false,

        /**
         * Objeto que é retornardo junto ao callback do evento de click no mapa
         */
        valuesMapClick : null,

        init : function (param) {
            that = this;
            mapa = AppHelper.getMap();
            this.setActive(param);
        },

        /***************************************************
         *
         * Properties Methods 
         *
         ***************************************************/

        /**
         * setter para setar se o plugin está ativo ou não
         * @param a true/false para ativo
         */
        setActive: function(active) {
            that.active = (active === true) ? true : false;
            if (active) {
                console.log('Plugin MapClickIdentify ativado');
                if (that.handleMapClick) {
                    that.handleMapClick.resume();
                }
            } else {
                console.log('Plugin MapClickIdentify desativado');
                if (that.handleMapClick) {
                    that.handleMapClick.pause();
                }
            }
        },

        /**
         * getter parar verificar a situação de ativo do plugin
         */
        getActive: function () {
            return that.active;
        },

        /**
         * setter para os parametros de configuração do plugin
         * @param view camadas que devem ser identificadas: visible / invisible /all
         * @param urlAdd urls que devem ser adicionadas para pesquisa do identify
         */
        setIdentify: function(view, urlAdd) {
            type = view;
            lang.mixin(urlMapa, urlAdd);
        },

        /**************************************
         *
         * Private Methods
         *
         **************************************/

        /**
         * Ouvinte para executar uma {function} ao clicar no mapa
         * @private
         */
        _onMapClick : function () {
            var y,
                z;

            if (active) {

            }
        },

        /**
         * Monta o vetor com as URLs a serem pesquisadas pelo identify
         * @param map mapa que contém as camadas
         * @private
         */
        _getLayerProperties: function(map) {
            var layer,
                j;

            urlMapa = [];

            for(j = 0; j < map.layerIds.length; j++) {

                layer = map.getLayer(map.layerIds[j]);
                if (layer.id !== 'layer0') {
                    switch (type) {
                        case 'visible':
                            if (layer.visible) {
                                urlMapa.push(layer.url);
                            }
                            break;
                        case 'invisible':
                            if (!layer.visible) {
                                urlMapa.push(layer.url);
                            }
                            break;
                        case 'all':
                            urlMapa.push(layer.url);
                            break;
                        default:
                            urlMapa.push(layer.url);
                            break;
                    }
                }
            }
        },

        getValues: function(fn) {
            if (that.handleMapClick) {
                that.handleMapClick.remove();
            }

            if (that.getActive() === true) {
                that.handleMapClick = on.pausable(mapa, 'click', lang.hitch(this, function (evt) {
                    var allGeometry = [],
                        values = [],
                        resultado = that.executeIdentifyTask(evt);

                    all(resultado).then(lang.hitch(this, function(result) {

                        // Laço para pegar as geometrias dentro de cada serviço
                        for (var y = 0; y < result.length; y += 1) {
                            for (var z = 0; z < result[y].length; z += 1) {
                                allGeometry.push(result[y][z].feature);
                                values.push(result[y][z]);
                            }
                        }
                        this._setValuesIdentify({
                            evtMapClick : evt,
                            all : values
                        });
                        fn(allGeometry);
                    }));
                }));
            }
        },

        /**
         * Seta os valores depois de fazer o Identify
         * @param {Object} obj
         * @private
         */
        _setValuesIdentify : function (obj) {
            this._valuesIdentify = obj;
        },

        /**
         * Retorna um objeto com os valores do Identify
         * @returns {Object}
         */
        getValuesIdentify : function () {
            return this._valuesIdentify;
        },

        /**
         * Método para obter as geometrias de todas as camadas onde o usuário clicou
         * @param evt objeto retornado no local onde o usuário clicou
         * @private
         */
        executeIdentifyTask: function (evt) {
            var identifyTask,
                identifyParams,
                x,
                vetor = [];

            that._getLayerProperties(mapa, type);

            for (x = 0; x < urlMapa.length; x += 1) {
                var a;

                identifyTask = new IdentifyTask(urlMapa[x]);
                identifyParams = new IdentifyParameters();
                identifyParams.tolerance = 3;
                identifyParams.returnGeometry = true;
                identifyParams.layerIds = [0];
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
                identifyParams.width  = mapa.width;
                identifyParams.height = mapa.height;

                identifyParams.geometry = evt.mapPoint;
                identifyParams.mapExtent = mapa.extent;

                a = identifyTask.execute(identifyParams, function(response) {
                    return response;
                });

                vetor.push(a.promise);
            }

            return vetor;
        }

    });
});