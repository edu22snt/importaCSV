/**
 * Created by irian.villalba on 17/10/13.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "dojo/json",
    "dojo/on",
    "dojo/Evented",
    "dojo/text!template/search.html",
    "esri/layers/GraphicsLayer",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/graphicsUtils",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "dojo/_base/Color",
    "dojo/_base/lang",
    "dojo/store/Memory",
    "app/app-helper",
    "dojo/_base/array",
    "dojox/collections/Dictionary",
    "dijit/form/ComboBox",
    "dijit/form/TextBox",
    "esri/geometry/Multipoint",
    "dijit/form/FilteringSelect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "widgets/window-floating-widget/main",

    "dojo/domReady!"], function (
    declare,
    Style,
    json,
    on,
    Evented,
    View,
    GraphicsLayer,
    Query,
    QueryTask,
    graphicsUtils,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Graphic,
    Color,
    lang,
    Memory,
    appHelper,
    array,
    Dictionary,
    ComboBox,
    TextBox,
    Multipoint,
    FilteringSelect,
    _WidgetBase,
    TemplatedMixin,
    WidgetsInTemplateMixin){
    "use strict";

    var data,
        mp = new Multipoint(),
        that;

    return declare("search", [_WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        ///----------------------------------------------------------------------------------------------------------
        // Components from template
        //----------------------------------------------------------------------------------------------------------


        templateString: View,
        baseClass : "search-widget",
        state: null,
        city: null,
        stateManagement: null,
        localManagement: null,
        regionRiverSystem: null,
        unitRiverSystem: null,
        aquifer: null,
        ottobacia: null,
        province: null,
        _graphicLayerWells : new GraphicsLayer(),
        _map : appHelper.getMap(),

        /**
         * metodo para inicialização do widget
         * @param data
         */
        init: function (data) {

            that = this;

            this.data = data;


            this.state.store = this.queryService(this.data.state[0].url, "1=1", this.data.state[0].name, this.data.state[0].id, null, 'state');
            this.regionRiverSystem.store = this.queryService(this.data.regionRiverSystem[0].url, "1=1",this.data.regionRiverSystem[0].name, this.data.regionRiverSystem[0].id, null, 'regionRiverSystem');
            this.aquifer.store = this.queryService(this.data.aquifer[0].url, "1=1", this.data.aquifer[0].name, this.data.aquifer[0].id, null, 'aquifer');
            this.province.store = this.queryService(this.data.province[0].url, "1=1", this.data.province[0].name1, this.data.province[0].id, this.data.province[0].name2, 'province');


            /**
             * tamanho do drop down do Combobox
             * @type {number}
             */
            this.state.maxHeight = 200;
            this.stateManagement.maxHeight = 200;
            this.city.maxHeight = 200;
            this.regionRiverSystem.maxHeight = 200;
            this.unitRiverSystem.maxHeight = 200;
            this.aquifer.maxHeight = 200;
            this.province.maxHeight = 200;
            this.localManagement.maxHeight = 200;


            /**
             * Campo obrigatorio do Combobox
             * @type {boolean}
             */
            this.state.required = false;
            this.stateManagement.required = false;
            this.city.required = false;
            this.regionRiverSystem.required = false;
            this.unitRiverSystem.required = false;
            this.ottobacia.required = false;
            this.aquifer.required = false;
            this.province.required = false;
            this.localManagement.required = false;

            this.setPosition(data.position);

            this._map.addLayer(this._graphicLayerWells);

            //this.getDataJSON();
        },

        ///----------------------------------------------------------------------------------------------------------
        // Listeners
        //----------------------------------------------------------------------------------------------------------

        /**
         * Ouvinte do evento de filtro de municipio
         * @param event
         */
        onFilterCity: function(event) {

            /*var points;
             points = [22366, 22367, 22368, 22370, 22337, 26865, 26866, 27640];
             this.pointsGeometry(points, "http://www.snirh.gov.br/arcgis/rest/services/SIP/Poco/MapServer/0");*/

            this.city.set('value','');
            this.city.store = this.queryService(this.data.city[0].url, this.data.city[0].cod + " = '" + this.state.get('value') + "'", this.data.city[0].name, this.data.city[0].id, null, 'city');
            this.stateManagement.set('value', '');
            this.stateManagement.store = this.queryService(this.data.stateManagement[0].url, this.data.stateManagement[0].cod + "= '" + this.state.get('value') + "'", this.data.stateManagement[0].name, this.data.stateManagement[0].id, null, 'stateManagement');
            this.getData();
        },

        /**
         * Ouvinte do evento de filtro da Região Hidrografica (N2)
         * @param event
         */
        onFilterUnitRiverSystem: function(event) {
            this.unitRiverSystem.set('value', '');
            this.unitRiverSystem.store = this.queryService(this.data.unitRiverSystem[0].url, this.data.unitRiverSystem[0].cod + "= '" + this.regionRiverSystem.get('value') + "'", this.data.unitRiverSystem[0].name, this.data.unitRiverSystem[0].id, null, 'unitRiverSystem');
        },

        /**
         * Ouvinte do evento de filtro da Unidade de gestão Local (N3)
         * @param event
         */
        onFilterLocalManagement: function(event) {
            this.localManagement.set('value', '');
            this.localManagement.store = this.queryService(this.data.localManagement[0].url, this.data.localManagement[0].cod + "= '" + this.regionRiverSystem.get('value') + "'", this.data.localManagement[0].name, this.data.localManagement[0].id, null, 'localManagement');
        },

        //----------------------------------------------------------------------------------------------------------
        // Private Methods
        //----------------------------------------------------------------------------------------------------------



        /**
         * receba uma lista de id de poços, e realiza a busca espacial e aplica um zoom na extensão dos pontos encontrados.
         * @param url
         * @param points
         */
        getPocos: function(points, url)
        {
            var x,
                where,
                myFeatureExtent,
                markerSymbol = new SimpleMarkerSymbol(),
                symbol,
                map = this._map,
                queryTask = new QueryTask(url),
                query = new Query();

            this._graphicLayerWells.clear();

            where = this.data.codeWell + ' in (';
            for(x = 0; x < points.length; x += 1) {
                where += points[x] + ",";
            }
            where = where.substring(0,(where.length - 1));
            where += ")";

            console.log(where);
            query.returnGeometry = true;
            query.outSpatialReference = map.spatialReference;
            query.where = where;

            queryTask.execute(query, resultComplete, resultError);

            function resultComplete(results) {
                if(results.features.length > 1) {
                    myFeatureExtent  = graphicsUtils.graphicsExtent(results.features);
                    myFeatureExtent = myFeatureExtent.expand(1.6);
                    map.setExtent(myFeatureExtent);
                } else if(results.features.length == 1){
                    map.centerAndZoom(results.features[0].geometry,12);
                }

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

                for (x = 0; x < results.features.length; x += 1) {
                    that._graphicLayerWells.add(new Graphic(results.features[x].geometry, symbol));
                    //map.graphics.add(new graphic(results.features[x].geometry, symbol));
                }
            }

            function resultError(error) {
                appHelper.showError("Ocorreu um erro ao consumir o serviço");
            }
        },

        /**
         * CONSULTA O SERVIÇO E RETORNA OS DADOS DA CONSULTA EM UM MEMORY
         * @param url
         * @param where
         * @param campo
         * @param id
         * @returns {dojo.store.Memory}
         */
        queryService: function (url, where, field, id, extraField, type) {
            var featureAttributes,
                i = 0,
                data = new Memory(),
                queryTask = new QueryTask(url),
                query = new Query();

            query.returnGeometry = false;
            query.where = where;
            query.orderByFields = [field];
            if (extraField !== undefined && extraField !== null) {
                query.outFields = [id, field, extraField];
            } else {
                query.outFields = [id, field];
            }

            /**
             * EXECUTA A CONSULTA E RETORNA OS DADOS DO JSON
             */

            queryTask.execute(query, lang.hitch(this, resultComplete, type), showError);

            /**
             * função de callback caso o metodo execute da queryTask ocorra sem erros, preenche um objeto Memory com o resultado da consulta
             * @param results
             */
            function resultComplete(type, results) {
                var extra;

                data.put({id: "-1", name: "--- Selecione ---"});

                for (i = 0; i < results.features.length; i += 1) {
                    featureAttributes = results.features[i].attributes;
                    if (featureAttributes[field] !== null) {
                        if (extraField !== undefined && extraField !== null) {
                            if (featureAttributes[extraField] === null) {
                                extra = "";
                            } else {
                                extra = " / " + featureAttributes[extraField];
                            }
                            data.put({id: featureAttributes[id], name: featureAttributes[field] + extra});
                        } else {
                            data.put({id: featureAttributes[id], name: featureAttributes[field]});
                        }
                    }
                }

                switch (type) {
                    case 'state' :
                        on.emit(this, 'state-defined', data);
                        break;
                    case 'city' :
                        on.emit(this, 'city-defined', data);
                        break;
                    case 'province' :
                        on.emit(this, 'province-defined', data);
                        break;
                    case 'aquifer' :
                        on.emit(this, 'aquifer-defined', data);
                        break;
                    case 'regionRiverSystem' :
                        on.emit(this, 'regionRiverSystem-defined', data);
                        break;
                    case 'unitRiverSystem' :
                        on.emit(this, 'unitRiverSystem-defined', data);
                        break;
                    case 'localManagement' :
                        on.emit(this, 'localManagement-defined', data);
                        break;
                    case 'stateManagement' :
                        on.emit(this, 'stateManagement-defined', data);
                        break;
                    case 'ottobacia' :
                        on.emit(this, 'ottobacia-defined', data);
                        break;
                }
            }

            /**
             * função de callback caso ocorra erro no metodo execute da queryTask, apresenta uma mensagem de erro para o usuário caso não consiga carregar o serviço
             * @param error
             */
            function showError(error)
            {
                appHelper.showError("Ocorreu um erro ao consumir o serviço");
            }

            return data;
        },

        /**
         * Posiciona o formulário de pesquisa a esquerda do Mapa
         * @constructor
         */
        POSITION_LEFT: function () {
            Style.set(that.domNode, "left", "60px");
        },

        /**
         * Posiciona o formulário de pesquisa a direnta do Mapa
         * @constructor
         */
        POSITION_RIGHT: function() {
            /* var map = appHelper.getMap(),
             right;

             right = map.width - 270;*/
            //Style.set("div_pesq", "left", right + "px");
            Style.set(that.domNode, "right", "30px");

            /*on(map, "resize", function () {
             right = map.width - 245;
             Style.set("div_pesq", "left", right + "px");
             });*/

        },

        /**
         * Metodo para Adicionar um objeto dentro do outro
         * @param myObject objeto que receberá outros objetos
         * @param methods objetos que serão adicionados
         */
        addObject: function (myObject, methods) {
            for (var property in methods) {
                myObject[property] = methods[property];
            }
        },

        ///----------------------------------------------------------------------------------------------------------
        // Public Methods
        //----------------------------------------------------------------------------------------------------------

        /**
         * metodo que retorna os valores do formulário em formato de objeto
         * @returns object
         */
        getData: function () {

            var obj = new Object();

            this.addObject(obj, {
                estado: this.state.item,
                municipio: this.city.item,
                unidadeGestaoEstadual: this.stateManagement.item,
                regiaoHidrografica: this.regionRiverSystem.item,
                unidadeHidrografica: this.unitRiverSystem.item,
                unidadeGestaoLocal: this.localManagement.item,
                aquifero: this.aquifer.item,
                ottobacia: this.ottobacia.get('value'),
                provincia: this.province.item
            })

            return obj;
        },

        /**
         * Seta a posição do formulário de pesquisa sobre o mapa, os valores possiveis são
         * POSITION_LEFT: posiciona a esquerda
         * POSITION_RIGHT: posiciona a direita
         *
         * @param position
         */

        setPosition: function (position) {
            switch (position) {
                case 'left':
                    this.POSITION_LEFT();
                    break;
                case 'right':
                    this.POSITION_RIGHT();
                    break;
                default:
                    this.POSITION_LEFT();
                    break;
            }
        }
    });
});