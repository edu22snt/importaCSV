/*global define, require, module, exports, console*/

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/json',
    'dojo/on',
    'dojo/_base/Color',

    'dijit/_WidgetBase',
    'app/app-helper',

    'esri/tasks/Geoprocessor',
    'esri/tasks/IdentifyParameters',
    'esri/tasks/IdentifyTask',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/geometry/Point',
    'esri/geometry/Circle',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/units'
], function (declare, lang, JSON, on, Color,
    _WidgetBase, AppHelper,
    GeoProcessor, IdentifyParameters, IdentifyTask, GraphicsLayer, Graphic, Point, Circle, SimpleMarkerSymbol, SimpleLineSymbol, Units
) {
    'use strict';

    var identifyWell;

    identifyWell = declare('ValidatePoint', [_WidgetBase], {


        //PROPERTIES

        /**
         * Ponto analisado
         */
        _point : null,

        /**
         * Mapa da aplicação
         */
        _map : AppHelper.getMap(),

        /**
         * Manipulador do evento de click no Mapa
         */
        _handleMap_click : null,

        _handleInfoWindow_hide : null,

        /**
         * Power on/off deste plugin
         */
        _active : false,

        /**
         * Camada gráfica
         */
        _graphicLayer : null,

        //DEFAULT METHODS

        init : function (active) {
            this._graphicLayer = new GraphicsLayer();
            this._map.addLayer(this._graphicLayer);
            this.setActive(active);
        },


        //PUBLICS METHODS

        /**
         * Retorna o ponto que será analisado
         * @returns {null}
         */
        getPoint : function () {
            return this._point;
        },

        /**
         * Mostra um popup com informações setadas no param values
         * @param {Object} params Options: pointCoordinates, title, content
         */
        showPopup : function (params) {
            var text = '',
                _pointSpatialReference = params.pointCoordinates.spatialReference ? params.pointCoordinates.spatialReference : this._map.spatialReference,
                point = new Point(params.pointCoordinates, _pointSpatialReference);

            if (params.content instanceof Object) {
                for (var prop in params.content) {
                    text += '<b>' + prop + ': </b> ' + params.content[prop] + '<p></p>';
                }
            } else {
                text = params.content;
            }

            if (!this._map.infoWindow.isShowing) {
                this._map.infoWindow.setTitle(params.title);
                this._map.infoWindow.setContent(text);
                this._map.infoWindow.show(point);

                this._handleInfoWindow_hide = this._handleInfoWindow_hide ? this._handleInfoWindow_hide.remove : null;

                this._handleInfoWindow_hide = on.once(this._map.infoWindow, 'hide', lang.hitch(this, function () {
                    this._graphicLayer.clear();
                }));

                this._fixedGraphicPoint(point);
            }
        },

        /**
         * Seta a disponibilização deste plugin
         * @param {Boolean} active
         */
        setActive : function (active) {
            this._active = active;
            console.log('ValidatePlugin - status: ' + active);
        },

        /**
         * Retorna a disponibiização do plugin
         * @returns {Boolean}
         */
        getActive : function () {
            return this._active;
        },

        /**
         * Retorna os dados do ponto analisado
         * @param {Object} params Options: type, url, gpParams, pointCoordinates, success, error
         * @returns {boolean}
         */
        validate : function (params) {
            var _type = params.type ? params.type : 'layer',
                _gpParams = params.gpParams ? params.gpParams : null,
                fn = function (value) { console.log(value); },
                _success = params.success ? params.success : fn,
                _error = params.error ? params.error : fn,
                _pointSpatialReference = params.pointCoordinates.spatialReference ? params.pointCoordinates.spatialReference : this._map.spatialReference;

            this._point = new Point(params.pointCoordinates, _pointSpatialReference);

            if (!params.url) {
                console.log('ValidatePlugin: url not defined!');
                return false;
            }

            if (!this.getActive()) {
                return false;
            }

            if (_type === 'layer') {
                this._identifyLayer(params.url, _success, _error);
            } else if (_type === 'geoprocessor') {
                this._identifyGeoProcessor(params.url, _gpParams, _success, _error);
            }
        },

        //PRIVATE METHODS

        /**
         * Este método será chamado caso o tipo de validação seja uma layer
         * @param url
         * @param success
         * @param error
         * @private
         */
        _identifyLayer : function (url, success, error) {
            var identifyParams = new IdentifyParameters(),
                identify = new IdentifyTask(url),
                area = new Circle({
                    center: this._point,
                    geodesic: true,
                    radius: 10,
                    spatialReference: this._map.spatialReference,
                    radiusUnit: Units.METERS
                })

            identifyParams.tolerance = 0;
            identifyParams.returnGeometry = false;
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            identifyParams.width  = this._map.width;
            identifyParams.height = this._map.height;

            identifyParams.geometry = area;
            identifyParams.mapExtent = this._map.extent;

            //this._fixedGraphicPoint(area);

            identify.execute(identifyParams, success, error);
        },

        /**
         * Este método será chamado caso o tipo de validação seja por um GeoProcessor
         * @param url
         * @param paramsGeoProcessor
         * @param success
         * @param error
         * @private
         */
        _identifyGeoProcessor : function (url, paramsGeoProcessor, success, error) {
            var gp = new GeoProcessor(url);

            for (var key in paramsGeoProcessor) {
                var strPoint = paramsGeoProcessor[key].replace(/ /g, '');
                if (strPoint === '%point%'){
                    paramsGeoProcessor[key] = this._point;
                }
            }

            gp.execute(paramsGeoProcessor, success, error);
        },

        /**
         * Plota um gráfico de ponto no mapa
         * @private
         */
        _fixedGraphicPoint : function (point) {
            var feature = new Graphic(point),
                lineSymbol = new SimpleLineSymbol(),
                markerSymbol = new SimpleMarkerSymbol();

            lineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
            lineSymbol.setColor(new Color([191, 13, 12, 0.5]));
            lineSymbol.setWidth(7);

            markerSymbol.setSize(10);
            markerSymbol.setColor(new Color([191, 13, 12, 0.9]));
            markerSymbol.setOutline(lineSymbol);

            feature.setSymbol(markerSymbol);

            this._graphicLayer.clear();
            this._graphicLayer.add(feature);
        }

    });

    return identifyWell;
});