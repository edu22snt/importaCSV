/*global define, console, parseInt*/
/*jslint nomen : true*/

define([
    "dojo/text!template/toc-tree-widget-view.html",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/Color",
    "dojo/_base/fx",
    "dojo/_base/xhr",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/dom-style",
    'dojo/Deferred',
    'dojo/promise/all',

    "esri",
    'esri/request',
    'esri/InfoTemplate',
    'esri/geometry/Extent',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/renderers/ClassBreaksRenderer",
    'esri/layers/GraphicsLayer',
    "agsjs/dijit/TOC",

    "esri/config",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "app/app-helper",
    "app/statesManager",
    "plugins/popupTOC/main",

    "dojo/domReady!"
], function (Template, declare, lang, array, Color, fx, xhr, dom, on, query, domConstruct, domStyle, Deferred, promiseAll,
             esri, esriRequest, InfoTemplate, Extent, Query, QueryTask, ArcGISDynamicMapServiceLayer, FeatureLayer, ClassBreaksRenderer, GraphicsLayer, TOC,
             EsriConfig, Popup, PopupTemplate,
             WidgetBase, TemplatedMixin, AppHelper, statesManager, PopupTOCPlugin
    ) {
    'use strict';

    return declare("TocTreeWidget", [WidgetBase, TemplatedMixin], {

        /**
         * Template da Template
         */
        templateString : Template,

        /**
         * Class css da Template
         */
        baseClass : "_toc-tree-widget",

        /**
         * Node da Tree / TOC
         */
        tree : "_tree",

        /**
         * Node do container do TOC
         */
        containerTOC : "_containerTOC",

        /**
         * Node do botão que abre / esconde o widget
         */
        btnOpen : "btnOpenToc",

        /**
         * Largura do widget
         */
        widthWidget : "200",

        /**
         * baseURL da aplicação
         * @public
         */
        baseUrl : '',

        /**
         * Habilita ou desabilita os 'title' do TOC
         */
        TOC_titleEnabled : true,

        /**
         * Configura se as layers do TOC já estarão abertas/fechadas ao carregar a App
         */
        TOC_collapsed : false,

        /**
         * Mapa da aplicação
         */
        _map : null,

        /**
         * Buffer Gráfico
         */
        _buffer : null,

        /**
         * Propriedade que receberá uma instância de <code>agsjs.dijit.TOC</code>
         */
        _toc : null,

        /**
         * Visibilidade do Widget
         */
        _visible : false,

        /**
         * Manipulador de evento de click no mapa
         */
        _eventHandle_mapClick : null,

        /**
         * Parametros passados no método init
         */
        _params : null,

        /**
         * Url do Serviço de Poços
         */
        _urlWells : null,

        constructor : function () {
            this._map = AppHelper.getMap();
            statesManager.addWidgetAtList('List:WidgetsLeft', 'toc-tree-widget/main');
        },

        /**
         * Inicia o Widget
         * @param {Object} data
         * @public
         */
        init : function (data) {
            var i = 0,
                count = 0,
                total = data.urlServices.length,
                configData = {},
                vetor = [],
                patt = /poco|po\ço/g;

            this._params = data;

            this.TOC_titleEnabled = data.titleEnabled;
            this._buffer = new GraphicsLayer();
            this._map.addLayer(this._buffer);

            configData.titleEnabled = data.titleEnabled;
            configData.urlServices = [];

            while (i < total) {
                var config = data.urlServices[i],
                    layer_url = config.url,
                    layer_type = config.type,
                    layer;

                if (patt.test(layer_url.toLowerCase()) || config.title === 'Poços') {
                    this._urlWells = layer_url;
                }

                if (layer_type.toLowerCase() === 'dynamiclayer') {
                    layer = new ArcGISDynamicMapServiceLayer(layer_url);
                } else {
                    layer = new FeatureLayer(layer_url);
                }

                var a = (function () {
                    var deferred = new Deferred();

                    on.once(layer, 'load', lang.hitch(this, function (evt) {
                        deferred.resolve(true);
                    }));

                    on.once(layer, 'error', lang.hitch(this, function (evt) {
                        AppHelper.showError("TOC ERROR: Erro na requisição da camada: " + evt.target.url);
                        deferred.resolve(false);
                    }));

                    return deferred.promise;
                }());

                vetor.push(a);

                i = i + 1;
            }

            promiseAll(vetor).then(lang.hitch(this, function (promise) {
                var n_data = {
                    open : data.open,
                    urlServices : []
                },
                i = 0;

                while(i < promise.length) {
                    if (promise[i]) {
                        n_data.urlServices.push(data.urlServices[i]);
                    }
                    i++;
                }

                this._constructBase(n_data);
            }));


            this.setVisible(data.open);
            this._listenEvents();

        },

        /**
         * Seta a visibilidade do widget
         * @param state
         */
        setVisible : function (state) {
            var that = this,
                time,
                myEvent = function (n) {
                    if (!n) {
                        domStyle.set(that.containerTOC, {
                            width : '0px',
                            padding : '0px'
                        });
                        domStyle.set(that.btnOpen, {
                            'border-color' : "#777",
                            'background-color' : '#fff'
                        });
                    } else {
                        clearTimeout(time);
                        domStyle.set(that.containerTOC, {
                            display : 'block',
                            width : '' + that.widthWidget + 'px',
                            padding : '10px'
                        });
                        domStyle.set(that.btnOpen, {
                            'border-color' : "#fff",
                            'background-color' : '#eee'
                        });
                    }
                };

            if (state) {
                myEvent(true);
                this._visible = true;
            } else{
                myEvent(false);
                this._visible = false;
            }
        },

        /**
         * Retorna a visibilidade do widget
         * @returns {*}
         */
        getVisible : function () {
            return this._visible;
        },

        /**
         * Ouvintes
         * @private
         */
        _listenEvents : function () {
            var that = this;

            on(that.btnOpen, "click", function () {
                var visibility = that.getVisible();

                if (!visibility) {
                    statesManager.setWidgetVisibleAtList('List:WidgetsLeft', 'toc-tree-widget/main');
                } else {
                    that.setVisible(false);
                }
            });
        },

        /**
         * Método que inicia a chamada e consumo das layers
         * @param data
         * @private
         */
        _constructBase : function (data) {
            var _layersInfo = [],
                _subLayers = [],
                _titleEnabled = true,
                _collapsed = true,
                i = 0,
                vetor = [],
                that = this;

            while (i < data.urlServices.length) {
                var config = data.urlServices[i],
                    n = i,
                    layer_title = config.title,
                    layer_type = config.type,
                    layer_url = config.url,
                    layer_legendsEnabled = config.legendsEnabled,
                    layer_visibleLayers = config.visibleLayers,
                    layer_subLayers = config.subLayers;

                if (layer_type.toLowerCase() === "featurelayer") {
                    _layersInfo.push({
                        title : layer_title,
                        layer : new FeatureLayer(layer_url),
                        legendsEnabled : layer_legendsEnabled,
                        collapsed : _collapsed,
                        titleEnabled: _titleEnabled
                    });
                } else if (layer_type.toLowerCase() === "dynamiclayer") {
                    _layersInfo.push({
                        title : layer_title,
                        layer : new ArcGISDynamicMapServiceLayer(layer_url),
                        legendsEnabled : layer_legendsEnabled,
                        subLayers: layer_subLayers,
                        collapsed : _collapsed,
                        titleEnabled : _titleEnabled
                    });
                }

                if (layer_subLayers) {
                    array.forEach(layer_subLayers, function (subLayer, j) {
                        _subLayers.push({
                            urlParent : layer_url,
                            indexParent : n,
                            id : subLayer['id'],
                            label : subLayer['label'],
                            popupConfig : subLayer['popupConfig'],
                            url : layer_url + '/' + subLayer['id']
                        });
                    });
                }

                if (layer_visibleLayers) {
                    _layersInfo[n].layer.setVisibleLayers(layer_visibleLayers);
                    _layersInfo[n].layer.visible = true;
                } else if (layer_type.toLowerCase() === "dynamiclayer") {
                    _layersInfo[n].layer.visible = false;
                }

                on(_layersInfo[n].layer, 'visibility-change', lang.hitch(this, function (evt) {
                    if (evt.target.url === that._urlWells) {
                        if (!evt.visible) {
                            this._map.infoWindow.hide();
                        }
                    }
                }));

                this._map.addLayer(_layersInfo[n].layer);

                var a = (function () {
                    var deferred = new Deferred();

                    on.once(_layersInfo[n].layer, 'load', lang.hitch(this, function () {
                        deferred.resolve();
                    }));

                    return deferred.promise;
                }());

                vetor.push(a);

                i = i + 1;
            }

            promiseAll(vetor).then(lang.hitch(this, function () {
                this._toc = new TOC({
                    map : this._map,
                    layerInfos : _layersInfo
                }, this.tree);
                this._toc.startup();

                on.once(this._toc, 'load', lang.hitch(this, function () {
                    this.set('class', 'loaded');

                    var popupPlugin = new PopupTOCPlugin(),
                        i = 0,
                        params = [],
                        _layer;

                    while (i < data.urlServices.length) {
                        _layer = data.urlServices[i];
                        if (_layer.subLayers) {
                            var n = 0,
                                subLayers = _layer.subLayers;
                            while (n < subLayers.length) {
                                params.push({
                                    title : _layer.title,
                                    url : _layer.url,
                                    popupConfig : subLayers[n].popupConfig
                                });
                                n += 1;
                            }
                        }
                        i += 1;
                    }
                    popupPlugin.startup(params);
                }));
            }));
        }
    });
});