/*global define, console*/
/*jslint nomen : true*/

define([
    "app/app-helper",
    "dojo/text!template/draw-tool-widget-view.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Tooltip",

    "dojo/dom",
    "dojo/_base/fx",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dojo/query",
    "dojo/on",
    "dojo/mouse",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/Evented",

    "esri/config",

    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    "esri/SpatialReference",

    "esri/toolbars/draw",
    "esri/graphic",
    "esri/layers/GraphicsLayer",

    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/CartographicLineSymbol"
], function (AppHelper, View, WidgetBase, TemplatedMixin, Tooltip,
             dom, fx, declare, array, event, lang, Color,  query, on, mouse, domGeometry, domStyle, domClass, domAttr, Evented,
             EsriConfig,
             ProjectParameters, GeometryService, SpatialReference,
             Draw, Graphic, GraphicsLayer,
             Point, Polygon, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, CartographicLineSymbol
    ) {

    'use strict';

    var open,
        pos,
        myMarker,
        myLine,
        myFill;

    /**
     * Criação da classe 'DrawToolWidget'
     */
    return declare('DrawToolWidget', [WidgetBase, TemplatedMixin, Evented], {

        /**
         * Objeto que conterá as geometrias dos gráficos desenhados
         */
        objectGeometries : [],

        /**
         * Objeto que conterá todos os gráficos desenhados
         */
        myGraphics : null,

        /**
         * Node do widget
         */
        drawToolWidget : null,

        /**
         * Template deste Widget
         */
        templateString : View,

        /**
         * Classe css do template
         */
        baseClass : "draw-tool-widget",

        /**
         * Node do botão que abre/esconde o widget
         */
        btnOpen : "btn-open-toolbar",

        /**
         * Classes css que configura a posição do widget,
         * configura se o widget estará ao lado esquerdo ou direito da aplicação
         */
        posLeft : 'draw-tool-pos-left',
        posRight : 'draw-tool-pos-right',

        /**
         * Limitar o número de graphics que poderão ser feitos no mapa
         */
        limitGraphics : false,

        /**
         * baseURL da aplicação
         * @public
         */
        baseUrl : '',

        _symbolPoint : null,

        //NOVO
        _map : null,
        _divContainer : null,
        _pos : null,
        _geometryServiceURL : null,
        _tb : null,

        /**
         * Método que inicia o Widget
         * @param {Object} data
         * @public
         */
        init : function (data) {
            lang.mixin(this, data);

            this._map = AppHelper.getMap();
            this._divContainer = AppHelper.getDivContainer().id;
            this._pos = this.posLeft;
            this._geometryServiceURL = this.geometryServiceURL;
            this.myGraphics = new GraphicsLayer();
            this._map.addLayer(this.myGraphics);

            /**
             * Habilita o consumo dos serviços JSON de URLs externas
             */
            EsriConfig.defaults.io.corsEnabledServers = [this._geometryServiceURL];

            /**
             * Verifica qual a configuração JSON para 'position' e configura o posicionamento do widget
             */
            if (data.position === 'left') {
                this._pos = this.posLeft;
            } else if (data.position === 'right') {
                this._pos = this.posRight;
            }
            domClass.add(this.drawToolWidget, this._pos);

            this.setSymbolPoint(data.symbolPoint.type, data.symbolPoint);

            /**
             * Customização da linha do gráfico desenhado
             * @type {esri.symbols.CartographicLineSymbol}
             */
            myLine = new CartographicLineSymbol(
                CartographicLineSymbol.STYLE_SOLID,
                new Color("#000"),
                1,
                CartographicLineSymbol.CAP_ROUND,
                CartographicLineSymbol.JOIN_MITER,
                1
            );

            /**
             * Customização da Marcação/Ponto do gráfico desenhado
             * @type {esri.symbols.SimpleMarkerSymbol}
             */
            myMarker = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                10,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 102, 153, 0.5]),
                    8
                ),
                new Color([0, 102, 153, 0.9])
            );

            /**
             * Customização do preenchimento do gráfico desenhado
             * @type {esri.symbols.PictureFillSymbol}
             */
            myFill = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                new Color([0, 0, 255, 0.5]));

            this._tb = new Draw(this._map);
            on(this._tb, "draw-end", lang.hitch(this, this._addMyGraphic));

        },

        /**
         * Seta uma simbologia para o point
         * @param {String} type
         * @param {Object} options
         */
        setSymbolPoint : function (type, options) {
            var pictureSymbol, simpleSymbol;

            if (type === 'simple') {
                simpleSymbol = new SimpleMarkerSymbol(options.style, options.size,
                    new SimpleLineSymbol(options.outline.style,
                        new Color(options.outline.color),
                        options.outline.size
                    ),
                    new Color(options.color)
                )
                this._symbolPoint = simpleSymbol;
            } else if (type === 'image') {
                pictureSymbol = new PictureMarkerSymbol(options.url, options.width, options.height);
                this._symbolPoint = pictureSymbol;
            }
        },


        /**
         * Evento de clique em algumas das ferramentas de desenho
         * @param evt
         * @private
         */
        _clickEvent_drawTool : function (evt) {
            var type;

            type = evt.target.id.toUpperCase();

            if (evt.target.id === "info") {
                return;
            }

            this._map.disableMapNavigation();
            this._tb.activate(Draw[type]);

            /**
             * Verifica se a configuração limita a fazer um único desenho,
             * se estiver 'true' ele apaga todos os graphics desenhados
             */
            if (this.limitGraphics) {
                this.clearGraphics();
            }
        },

        /**
         * MouseOver em alguma das ferramentas de desenho
         * @param evt
         * @private
         */
        _mouseOver_drawTool : function (evt) {
            var text = domAttr.get(evt.target, 'name');
            Tooltip.show(text, evt.target.id, ['above']);
        },

        /**
         * MouseOut em alguma das ferramentas de desenho
         * @param evt
         * @private
         */
        _mouseOut_drawTool : function (evt) {
            Tooltip.hide(evt.target.id);
        },

        /**
         * Método que adiciona no this._map o gráfico depois de desenhado
         * @param obj
         * @private
         */
        _addMyGraphic : function (obj) {
            var symbol;

            /**
             * Evento que desabilita a drawtool
             */
            this._tb.deactivate();

            /**
             * Evento que reativa a navegação do this._map
             */
            this._map.enableMapNavigation();

            /**
             * Verifica qual o tipo de símbolo que será inserido no gráfico
             */
            if (obj.geometry.type === "point" || obj.geometry.type === "multipoint") {
                if (this._symbolPoint !== null) {
                    symbol = this._symbolPoint;
                } else {
                    symbol = myMarker;
                }
            } else if (obj.geometry.type === "line" || obj.geometry.type === "polyline") {
                symbol = myLine;
            } else {
                symbol = myFill;
            }


            /**
             * Adiciona e fixa o gráfico ao this._map
             */
            this.myGraphics.add(new Graphic(obj.geometry, symbol));

            this.objectGeometries.push(obj.geometry);

            on.emit(this, 'draw-end', obj.geometry);

        },

        /**
         * Método usado para pegar as geometrias dos gráficos desenhados.
         * Espera receber uma função de sucesso(como argumento do método) ao completar a operação
         * @param {Function} sucess
         * @param {Function} error
         */
        getData : function () {
            return this.objectGeometries;
        },

        getDataSIRGAS2000 : function (sucess, error) {
            var objetoRetorno = [],
                polygono,
                projectParams = new ProjectParameters();
            projectParams.geometries = this.objectGeometries;
            projectParams.outSR = new SpatialReference({wkid : '4674'});

            var geometryService = new GeometryService(this._geometryServiceURL);
            geometryService.project(projectParams, function (objeto) {

                /**
                 * Insere geometrias do gráfico criado ao 'objectGeometries'
                 */
                switch (objeto[0].type) {
                    case 'point':
                        objetoRetorno.push({
                            "type" : objeto[0].type,
                            "geometry" : [objeto[0].x, objeto[0].y],
                            "spatialReference" : objeto[0].spatialReference
                        });
                        break;
                    case 'polyline':
                        objetoRetorno.push({
                            "type" : objeto[0].type,
                            "geometry" : objeto[0].paths[0],
                            "spatialReference" : objeto[0].spatialReference
                        });
                        break;
                    case 'extent':
                        polygono = new Polygon();
                        polygono.rings = [
                            [objeto[0].xmax, objeto[0].ymax],
                            [objeto[0].xmax, objeto[0].ymin],
                            [objeto[0].xmin, objeto[0].ymax],
                            [objeto[0].xmin, objeto[0].ymin],
                            [objeto[0].xmax, objeto[0].ymax]
                        ];
                        objetoRetorno.push({
                            "type" : polygono.type,
                            "geometry" : polygono.rings,
                            "spatialReference" : objeto[0].spatialReference
                        });
                        break;
                    case 'polygon':
                        objetoRetorno.push({
                            "type" : objeto[0].type,
                            "geometry" : objeto[0].rings[0],
                            "spatialReference" : objeto[0].spatialReference
                        });
                        break;
                    default :
                        objetoRetorno.push({
                            "type" : objeto[0].type,
                            "geometry" : objeto[0].rings[0],
                            "spatialReference" : objeto[0].spatialReference
                        });
                        break;
                }

                if (sucess) {
                    sucess(objetoRetorno);
                } else {
                    console.log('Não há uma função de sucesso ao completar a requisição definida');
                }

            }, function (fail) {
                error(fail);
            });
        },

        /**
         * Limpa todos os gráficos desenhados e retira tudo do 'myGraphics'
         * @public
         */
        clearGraphics : function () {
            this.myGraphics.clear();
            this.objectGeometries = [];
        }
    });
});