/*global define, console, Proj4js*/
/*jslint nomen : true*/

define([
    "dojo/text!template/coordinate.html",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/Color",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/mouse",
    "dojo/query",

    "esri",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Tooltip",
    "dijit/form/Select",
    "app/app-helper",
    "app/statesManager",

    "proj4js/lib/defsProj4js",

    "dojo/domReady!"
], function (Template, declare, lang, array, Color, dom, domStyle, on, mouse, query,
             esri,
             WidgetBase, TemplatedMixin, Tooltip, Select, AppHelper, statesManager
    ) {
    'use strict';

    var mapa,
        that;

    return declare("Coordinate", [WidgetBase, TemplatedMixin], {

        /**
         * Template da Template
         */
        templateString : Template,

        /**
         * Class css da Template
         */
        baseClass : "coordinate",

        /**
         * Node do container do Datum
         */
        containerCoordinate : "containerCoordinate",

        /**
         * Node do botão que abre / esconde o widget
         */
        btnOpen : "btnOpenCoordinate",

        /**
         * Node do container com as opções para selecionar
         */
        coordinateOptions : "coordinateOptions",

        /**
         * Largura do widget
         */
        widthWidget : "220",

        /**
         * baseURL da aplicação
         * @public
         */
        baseUrl : '',

        /**
         * Select com as opções de Datum
         */
        selectDatum : null,

        /**
         * Select com opções da projeção
         */
        selectProjection : null,

        /**
         * Select com as opções de formato de entrada
         */
        selectFormat : null,

        /**
         * Div que recebe os pontos do mapa
         */
        legendCoordinate : null,

        init : function (data) {
            that = this;
            mapa = AppHelper.getMap();

            that._constructBase(data);

            that.setVisible(data.open);

            that._mouseOver(mapa, data);

            that._onChangeSelectProjection();

            that._listenEvents();

            statesManager.addWidgetAtList('List:WidgetsLeft', 'coordinate/main');
        },

        /**
         * Chamada do método que mostra todos os mapas no container
         * @param data
         * @private
         */
        _constructBase : function (data) {
            that.selectDatum = new Select({
                name: "datum",
                style: "width: 200px; padding: 4px;",
                options: data.datum
            }).placeAt(that.selectDatum);
            that.selectProjection = new Select({
                name: "projection",
                style: "width: 200px; padding: 4px;",
                options: data.projection
            }).placeAt(that.selectProjection);
            that.selectFormat = new Select({
                name: "format",
                style: "width: 200px; padding: 4px;",
                options: data.format
            }).placeAt(that.selectFormat);
            if (that.selectProjection.get('value') === "utm") {
                that.selectFormat.set('value', 'decimalDegrees');
                that.selectFormat.set('disabled', true);
            }
        },

        /**
         * Método que faz a interatividade de abrir/esconder o widget
         * @param {Boolean} state
         * @public
         */
        setVisible : function (state) {
            var myEvent = function (n) {
                if (!n) {
                    domStyle.set(that.containerCoordinate, {
                        width : '0px',
                        padding : '0px'
                    });
                    domStyle.set(that.btnOpen, {
                        'border-color' : "#777",
                        'background-color' : '#fff'
                    });
                } else {
                    domStyle.set(that.containerCoordinate, {
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

            if (state === true) {
                myEvent(true);
                this._visible = true;
            } else if (state === false) {
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
                    statesManager.setWidgetVisibleAtList('List:WidgetsLeft', 'coordinate/main');
                } else {
                    that.setVisible(false);
                }
            });
        },

        /**
         * Ouvinte para pegar a posição no mapa quando passar o mouse sobre o mesmo
         *
         * @param mapa
         * @private
         */
        _mouseOver : function (mapa, data) {
            mapa.on("mouse-move", function (evt) {
                var src,
                    dst,
                    point,
                    finalPoint,
                    objUtm,
                    content,
                    def;

                /**
                 * Setando a definição de acordo com a projeção selecionada
                 * @type {string}
                 */
                def = (that.selectProjection.get('value') === "utm") ? "EPSG:UTM": "EPSG:" + that.selectDatum.get('value');
                if (that.selectProjection.get('value') === "latLong") {
                    Proj4js.defs[def] = "+proj=longlat " + data.definition[that.selectDatum.get('value')];
                } else if (that.selectProjection.get('value') === "utm") {
                    objUtm = that._parseUTMZone(data.definition[that.selectDatum.get('value')], evt.mapPoint.getLongitude(), evt.mapPoint.getLatitude());
                    Proj4js.defs[def] = objUtm.def;
                }

                src = new Proj4js.Proj("EPSG:" + mapa.spatialReference.wkid);
                dst = new Proj4js.Proj(def);

                if (/\+proj=merc/.test(src.defData)) {
                    point = new Proj4js.Point(evt.mapPoint.x, evt.mapPoint.y);
                } else {
                    point = new Proj4js.Point(evt.mapPoint.getLongitude(), evt.mapPoint.getLatitude());
                }

                finalPoint = Proj4js.transform(src, dst, point);

                if (that.selectProjection.get('value') === "latLong") {
                    if (that.selectFormat.get('value') === "decimalDegrees") {
                        content = "Lat: " + finalPoint.y.toFixed(6) + " Lon: " + finalPoint.x.toFixed(6);
                    } else if (that.selectFormat.get('value') === "dms") {
                        content = "Lat: " + that._dd2dms(finalPoint.y, "lat") + " Lon: " + that._dd2dms(finalPoint.x, "long");
                    }
                } else if (that.selectProjection.get('value') === "utm") {
                    content = "X: " + finalPoint.x.toFixed(6) + "  Y: " + finalPoint.y.toFixed(6) + " Zona " + objUtm.zona + objUtm.pos;
                }
                that.legendCoordinate.innerHTML = content;
            });
        },

        /**
         * Função para converter Grau-decimal para Grau/minuto/segundo
         *
         * @param dd ponto lat ou long
         * @param type {String} "lat" ou "long"
         * @returns type {String} com a coordenada Lat ou Long
         */
        _dd2dms : function (dd, type) {
            var d,
                nFract,
                m,
                s,
                cardinalPoint,
                dms;
            d = parseInt(dd, 10);
            nFract = Math.abs(dd - d);
            m = parseInt(nFract * 60, 10);
            s = Math.round(nFract * 3600 - m * 60);

            if (type === "lat") {
                cardinalPoint = (dd > 0) ? 'N' : 'S';
            } else if (type === "long") {
                cardinalPoint = (dd > 0) ? 'E' : 'W';
            }
            d = Math.abs(d);
            dms = {
                "d" : (d < 10) ? "0" + d : d,
                "m" : (m < 10) ? "0" + m : m,
                "s" : (s < 10) ? "0" + s : s,
                "cardinalPoint" : cardinalPoint
            };
            return dms.d + "º " + dms.m + "' " + dms.s + "\" " + dms.cardinalPoint;
        },

        /**
         * Parse da string longlat para UTM
         *
         * @param definition
         * @param x Longitude padrão do mapa
         * @param y Latitude padrão do mapa
         * @returns {Object} Objeto com o definition, zona e posição
         * @private
         */
        _parseUTMZone : function (definition, x, y) {
            var drad,
                phi,
                utmz,
                zona,
                pos,
                obj = {};

            drad = Math.PI / 180;
            phi = y * drad;
            utmz = 1 + Math.floor((x + 180) / 6);

            zona = "+zone=" + utmz + " ";
            pos = (phi < 0) ? "+south " : "";
            obj.def = "+proj=utm " + zona + pos + definition;
            obj.zona = utmz;
            obj.pos = (phi < 0) ? "S" : "N";
            return obj;
        },

        /**
         * Ouvinte para desabilitar o formato de entrada
         * @private
         */
        _onChangeSelectProjection : function () {
            that.selectProjection.on('change', function (evt) {
                if (evt === "utm") {
                    that.selectFormat.set('value', 'decimalDegrees');
                    that.selectFormat.set('disabled', true);
                } else {
                    that.selectFormat.set('disabled', false);
                }
            });
        }
    });
});