/*global define, console*/
/*jslint nomen : true*/

define([
    "dojo/text!template/change-basemap.html",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/Color",
    "dojo/_base/fx",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/mouse",
    "dojo/query",

    "esri",
    "esri/dijit/BasemapLayer",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapGallery",
    "esri/layers/ArcGISTiledMapServiceLayer",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Tooltip",
    "app/app-helper",
    "app/statesManager",

    "dojo/domReady!"
], function (Template, declare, lang, array, Color, fx, dom, domStyle, on, mouse, query,
             esri, BasemapLayer, Basemap, BasemapGallery, ArcGISTiledMapServiceLayer,
             WidgetBase, TemplatedMixin, Tooltip, AppHelper, statesManager
    ) {
    'use strict';

    var mapa,
        that,
        basemapGallery,
        div;

    return declare("ChangeBaseMap", [WidgetBase, TemplatedMixin], {

        /**
         * Template da Template
         */
        templateString : Template,

        /**
         * Class css da Template
         */
        baseClass : "_change-basemap",


        /**
         * Node do container do BasemapGallery
         */
        containerChangeBaseMap : "_containerChangeBaseMap",

        /**
         * Node do botão que abre / esconde o widget
         */
        btnChangeBaseMap : "btnOpenChangeBaseMap",

        /**
         * Node do container do basemapGallery
         */
        basemapGallery : "basemapGallery",

        /**
         * Largura do widget
         */
        widthWidget : "380",

        /**
         * baseURL da aplicação
         * @public
         */
        baseUrl : '',

        /**
         * Inicia o Widget
         * @param {Object} data
         * @public
         */
        init : function (data) {
            that = this;
            div = this.id;
            mapa = AppHelper.getMap();

            statesManager.addWidgetAtList('List:WidgetsLeft', 'change-basemap/main');

            that._constructBase(data);

            that.setVisible(data.open);

            this._listenEvents();

            that._tooltip(data);
        },

        /**
         * Seta a visibilidade do widget
         * @param state
         */
        setVisible : function (state) {
            var that = this,
                time,
                myEvent;

            myEvent = function (n) {
                if (!n) {
                    domStyle.set(that.containerChangeBaseMap, {
                        width : '0px',
                        padding : '0px'
                    });
                    domStyle.set(that.btnChangeBaseMap, {
                        'border-color' : "#777",
                        'background-color' : '#fff'
                    });
                } else {
                    clearTimeout(time);
                    domStyle.set(that.containerChangeBaseMap, {
                        display : 'block',
                        width : '' + that.widthWidget + 'px',
                        padding : '10px'
                    });
                    domStyle.set(that.btnChangeBaseMap, {
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

            on(that.btnChangeBaseMap, "click", function () {
                var visibility = that.getVisible();
                if (!visibility) {
                    statesManager.setWidgetVisibleAtList('List:WidgetsLeft', 'change-basemap/main');
                } else {
                    that.setVisible(false);
                }
            });

            basemapGallery.on('selection-change', function () {
                that.setVisible(false);
            });
        },

        /**
         * Mostra / esconde o tooltip
         * @private
         */
        _tooltip : function () {
            on(that.btnChangeBaseMap, mouse.enter, function () {
                Tooltip.show('Mapa base', that.btnChangeBaseMap);
            });
            on(that.btnChangeBaseMap, mouse.leave, function () {
                Tooltip.hide(that.btnChangeBaseMap);
            });
        },

        /**
         * Chamada do método que mostra todos os mapas no container
         * @param data
         * @private
         */
        _constructBase : function (data) {
            var layer;
            basemapGallery = new BasemapGallery({
                showArcGISBasemaps: data.showArcGISBasemaps,
                map: mapa
            }, that.basemapGallery);

            /**
             * Executa o bloco se showCustomMap for true no arquivo configuracoes.json
             */
            if (data.showCustomMap) {
                /**
                 * Adiciona os mapas setados no configuracoes.json
                 * no basemapGallery
                 */
                array.forEach(data.baseMaps, function (config) {
                    layer = new BasemapLayer({
                        url : config.url
                    });
                    var baseMap = new Basemap({
                        layers : [layer],
                        title : config.title,
                        thumbnailUrl : config.thumbnailUrl
                    });
                    basemapGallery.add(baseMap);
                });
            }
            basemapGallery.startup();
        }
    });
});