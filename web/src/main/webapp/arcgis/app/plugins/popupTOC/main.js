/*global define, require, module, exports, console*/

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/Deferred',
    'dojo/promise/all',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    "esri",
    'esri/request',
    'esri/InfoTemplate',
    'esri/geometry/Extent',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/renderers/ClassBreaksRenderer',
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",

    'esri/config',
    'esri/dijit/Popup',
    'esri/dijit/PopupTemplate',

    'app/app-helper',
], function (declare, lang, on, domConstruct, Deferred, promiseAll,
             _WidgetBase, _TemplatedMixin,
             esri, esriRequest, InfoTemplate, Extent, Query, QueryTask, ArcGISDynamicMapServiceLayer, FeatureLayer, ClassBreaksRenderer, IdentifyTask, IdentifyParameters,
             EsriConfig, Popup, PopupTemplate,
             appHelper
    ) {
    'use strict';

    var popupMainPlugin;

    popupMainPlugin = declare([], {

        //PROPERTIES

        /**
         * Mapa da aplicação
         */
        _map : appHelper.getMap(),
        handleMapClick : null,

        /**
         * Valores do Identify
         */
        _valuesIdentify : null,

        /**
         * Plugin do Identify
         */
        _identifyPlugin : null,

        _urlMapa : null,

        /**
         * Div que conterá os dados dos features
         */
        _div : domConstruct.create('div'),

        /**
         * Parametros passados no startup
         */
        _params : null,

        //MAIN METHODS
        startup : function (params) {
            this._params = params;
            this._listenEvents();
        },

        //PUBLIC METHODS


        //PRIVATE METHODS

        _listenEvents : function () {
            on(this._map, 'click', lang.hitch(this, this._eventClick_map));
        },

        _eventClick_map : function (evt) {
            var layers = this._map.layerIds,
                i = 0,
                promises = [],
                allGeometry = [],
                values = [];

            while (i < layers.length) {
                var layer = this._map.getLayer(layers[i]),
                    j = 0;

                while (j < this._params.length) {
                    var param = this._params[j];

                    if (layer.url === param.url) {
                        var visibleLayer = layer.visible;
                        if (visibleLayer) {
                            var promise;
                            promise = this._identify({
                                url : param.url,
                                evt : evt
                            });
                            promises.push(promise);
                        }
                        j = this._params.length;
                    }
                    j += 1;
                }

                i += 1;
            }

            promiseAll(promises).then(lang.hitch(this, function(result) {
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

                if (allGeometry.length > 0) {
                    this._getFeaturesIdentifyPlugin(allGeometry);
                }
            }));
        },

        _identify : function (params) {
            var identifyExecute,
                identifyTask,
                identifyParams;

            identifyTask = new IdentifyTask(params.url);
            identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 3;
            identifyParams.returnGeometry = true;
            identifyParams.layerIds = [0];
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.width  = this._map.width;
            identifyParams.height = this._map.height;

            identifyParams.geometry = params.evt.mapPoint;
            identifyParams.mapExtent = this._map.extent;

            identifyExecute = identifyTask.execute(identifyParams, function(response) {
                return response;
            });

            return identifyExecute.promise;
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
        _getValuesIdentify : function () {
            return this._valuesIdentify;
        },

        /**
         * Função encapsulada dentro do contexto do IdentifyPlugin, no evento de click do mapa
         * @param featuresAll
         * @private
         */
        _getFeaturesIdentifyPlugin : function (featuresAll) {
            var infoTemplate,
                contentTemplate = null,
                evt = this._getValuesIdentify().evtMapClick,
                all = this._getValuesIdentify().all,
                i = 0,
                promises = [];

            while (i < all.length) {
                var n = 0;
                contentTemplate = '';

                infoTemplate = new InfoTemplate();

                while (n < this._params.length) {
                    var title = new RegExp(this._params[n].title, 'gi'),
                        regExp = new RegExp(all[i].layerName, 'gi');

                    if (title.test(all[i].layerName) || regExp.test(this._params[n].title)) {
                        var j = 0;
                        while (j < this._params[n].popupConfig.length) {
                            var config = this._params[n].popupConfig[j];
                            if(config['alias']){
                                contentTemplate += "<b>" + config['alias'] + "</b>: ${" + config['name'] +"} <p></p>";
                            }
                            j += 1;
                        }
                    }
                    n += 1;
                }

                if (contentTemplate !== null && contentTemplate !== ''){
                    infoTemplate.content = contentTemplate;
                    infoTemplate.title = all[i].layerName;
                    featuresAll[i].setInfoTemplate(infoTemplate);
                }

                i += 1;
            }

            var n_featuresAll = [];

            i = 0;
            while (i < featuresAll.length) {
                if(featuresAll[i].infoTemplate) {
                    n_featuresAll.push(featuresAll[i]);
                }
                i += 1;
            }

            if (n_featuresAll.length > 0) {
                this._map.infoWindow.setFeatures(n_featuresAll);
                this._map.infoWindow.show(evt.screenPoint, this._map.getInfoWindowAnchor(evt.screenPoint));
            }
        }

        //PRIVATE METHODS : CALLBACKS

    });

    return popupMainPlugin;
});