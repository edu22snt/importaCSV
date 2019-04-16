/**
 * Created by doncilio.silva on 13/01/14.
 */
/*global define, console, Proj4js*/
/*jslint nomen : true*/

define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",

    'dijit/_WidgetBase',

    "app/app-helper",

    "proj4js/lib/proj4js-combined",
    "dojo/domReady!"
], function (on, declare, lang, _WidgetBase,
             AppHelper
    ) {
    "use strict";
    var mapa,
        that,
        mapClick;

    mapClick = declare([_WidgetBase], {

        /**
         * Ativa ou desativa o plugin
         * {boolean}
         */
        active : true,

        /**
         * Propriedade com a longitude do ponto selecionado no mapa
         * {Number}
         */
        longitude : null,

        /**
         * Propriedade com a latitude do ponto selecionado no mapa
         * {Number}
         */
        latitude : null,

        /**
         * Retorna a posição do ponto selecionado (Latitude e Longitude)
         * {object}
         */
        position : null,

        /**
         * Ouvinte do click no mapa
         */
        handleMapClick : null,

        init : function () {
            that = this;
            mapa = AppHelper.getMap();
        },

        /**
         * Define o valor de active e pause e resume o ouvinte
         * @param active
         */
        setActive : function (active) {
            that.active = active;
            if (active) {
                if (that.handleMapClick) {
                    that.handleMapClick.resume();
                }
            } else {
                if (that.handleMapClick) {
                    that.handleMapClick.pause();
                }
            }
        },

        /**
         * Retorna o valor definido no setActive
         * @returns {boolean|active}
         */
        getActive : function () {
            return that.active;
        },

        /**
         * Define o valor de Longitude
         * @param longitude
         */
        _setLongitude : function (longitude) {
            that.longitude = longitude;
        },

        /**
         * Recupera o valor definido no _setLongitude
         * @returns {longitude}
         */
        getLongitude : function () {
            return that.longitude;
        },

        /**
         * Define o valor de Latitude
         * @param latitude
         */
        _setLatitude : function (latitude) {
            that.latitude = latitude;
        },

        /**
         * Recupera o valor definido no setY
         * @returns {latitude}
         */
        getLatitude : function () {
            return that.latitude;
        },

        /**
         * Define position como um objeto e passa valores de lat / lon
         * @param ponto
         */
        _setPosition : function (ponto) {
            that.position = {
                "latitude" : ponto.y,
                "longitude" : ponto.x
            };
        },

        /**
         * Recupera o objeto com Lattitude e Longitude
         * @returns {object}
         */
        getPosition : function () {
            return that.position;
        },

        /**
         * Retorna os valores na função parametrizada depois do evento de click no mapa
         * @param {Function} fn
         */
        getValues : function (fn) {
            if (that.handleMapClick) {
                that.handleMapClick.remove();
            }
            if (that.getActive() === true) {
                that.handleMapClick = on.pausable(mapa, 'click', lang.hitch(this, function (evt) {
                    var point = that.convertPoint(evt);
                    this._setLongitude(point.x);
                    this._setLatitude(point.y);
                    this._setPosition(point);

                    fn({
                        latitude : this.getLatitude(),
                        longitude : this.getLongitude(),
                        position : this.getPosition()
                    });
                }));
            }

        },

        /**
         * Método para converter o ponto em SIRGAS 2000
         * @param evt
         * @returns {Object} Objeto com o ponto convertido para SIRGAS 2000
         */
        convertPoint : function (evt) {
            var src,
                dst,
                point,
                finalPoint;
            Proj4js.defs["EPSG:4674"] = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";

            //Define the source Coord Sys
            src = new Proj4js.Proj("EPSG:4326");

            //Define the destination Coord Sys
            dst = new Proj4js.Proj("EPSG:4674");

            point = new Proj4js.Point(evt.mapPoint.getLongitude(), evt.mapPoint.getLatitude());
            //Do your conversion
            finalPoint = Proj4js.transform(src, dst, point);

            return finalPoint;
        }
    });

    return mapClick;
});