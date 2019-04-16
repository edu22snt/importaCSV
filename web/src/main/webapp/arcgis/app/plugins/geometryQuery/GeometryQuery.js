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
    "esri/geometry/Polygon",
    "esri/graphicsUtils",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "dojo/_base/Color",

    "esri/tasks/query",
    "esri/tasks/QueryTask",
    'app/app-helper',
    "dojo/domReady!"
], function (on,
             declare,
             lang,
             Deferred,
             DeferredList,
             all,
             Polygon,
             graphicsUtils,

             SimpleMarkerSymbol,
             SimpleLineSymbol,
             Graphic,
             GraphicsLayer,
             Color,

             Query,
             QueryTask,
             appHelper

    ) {
    "use strict";
    var

        /**
         * objeto do plugin
         */
            that,
            mapa;

    return declare("GeometryQuery", null, {

        /**
         * Contém os objetos localizados
         */
        allObject: null,

        /**
         * verifica se o plugin está ou não ativo
         */
        active: true,

        init : function (data) {
            that = this;
            mapa = appHelper.getMap();
        },

        _graphicLayerWells : new GraphicsLayer(),

        /***************************************************
         * Properties Methods
         ***************************************************/

        /**
         * setter para setar se o plugin está ativo ou não
         * @param a true/false para ativo
         */
        setActive: function(active) {
            this.active = active;

        },

        /**
         * getter parar verificar a situação de ativo do plugin
         */
        getActive: function () {
            return that.active;
        },

        /**************************************
         * Public Methods
         **************************************/

        clearGraphics: function() {
            mapa.graphics.clear();
        },

        /**
         * Recupera todos os objetos de acordo com a consulta
         * @param fn função de callback que retorna o resultado da consulta
         * @param url caminho do serviço
         * @param where parametro de consulta
         * @param geometry  geometria que deve ser consultada
         * @param zoom true/false para aproximar no resultado da consulta
         * @param showResults true/false mostrar no mapa o resultado da consulta
         * @returns {Array}
         */
        getValues: function(fn, url, where, geometry, zoom, showResults) {
            var queryTask,
                feature,
                data = [],
                query;

            queryTask = new QueryTask(url);
            query = new Query();
            queryTask.outSpatialReference = mapa.spatialReference;
            query.outSpatialReference = mapa.spatialReference;
            query.where = "1=1";
            query.returnGeometry = true;
            query.outFields = ["*"];

            if (typeof(where) !== "undefined" && where !== "") {
                query.where = where;
            }

            if (typeof(geometry) !== "undefined" && geometry !== "" ) {
                query.geometry = geometry;
            }

            queryTask.execute(query, resultComplete, showError);

            /**
             * função de callback caso o metodo execute da queryTask ocorra sem erros, preenche um objeto Memory com o resultado da consulta
             *
             * @param results
             */
            function resultComplete(results) {
                var i,
                    x,
                    myFeatureExtent,
                    symbol,
                    outline = new esri.symbol.SimpleLineSymbol().setColor('blue');

                if (typeof(zoom) !== "undefined" && zoom !== false) {
                    if(results.features.length > 1) {
                        myFeatureExtent  = graphicsUtils.graphicsExtent(results.features);
                        myFeatureExtent = myFeatureExtent.expand(2.2);
                        mapa.setExtent(myFeatureExtent);
                    } else if(results.features.length == 1){
                        if (results.features[0].geometry.getExtent() !== null) {
                            mapa.setExtent(results.features[0].geometry.getExtent());
                        } else {
                            mapa.centerAndZoom(results.features[0].geometry,10);
                        }

                    }
                }

                if (typeof(showResults) !== "undefined" && showResults !== false) {
                    symbol = new SimpleMarkerSymbol(
                        SimpleMarkerSymbol.STYLE_CIRCLE,
                        8,
                        new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SOLID,
                            new Color([0, 0, 255, 0.5]),
                            5
                        ),
                        new Color([0, 0, 255])
                    );

                    mapa.graphics.clear();

                    if (results.features[0].geometry.getExtent() === null) {
                        for (x = 0; x < results.features.length; x += 1) {
                            mapa.graphics.add(new Graphic(results.features[x].geometry, symbol));
                        }
                    } else {
                        for (x = 0; x < results.features.length; x += 1) {
                            mapa.graphics.add(new Graphic(results.features[x].geometry, outline));
                        }
                    }
                }

                for (i = 0; i < results.features.length; i += 1) {
                    feature = results.features[i];
                    data.push(feature);
                }
                fn(data);
            }

            /**
             * função de callback caso ocorra erro no metodo execute da queryTask, apresenta uma mensagem de erro para o usuário caso não consiga carregar o serviço
             * @param error
             */
            function showError(error) {
                console.log(error);
            }

            return data;
        }

    });
});