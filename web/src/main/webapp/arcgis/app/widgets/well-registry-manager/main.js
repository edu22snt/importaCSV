/**
 * Created by Isac Cajá on 18/10/13.
 */
/*global define, console*/

define([
    'dojo/_base/declare',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/_base/Color',
    'dojo/promise/all',
    'dojo/json',
    'dojo/Evented',

    'app/app-helper',

    "esri/tasks/query",
    "esri/tasks/QueryTask",

    'esri/graphic',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/SpatialReference',
    'esri/geometry/Point',
    'esri/geometry/ScreenPoint',
    'esri/tasks/GeometryService',
    'esri/tasks/ProjectParameters',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/text!template/well-registry-view.html',
    'app/widgets/well-registry-manager/spatial-location-form',
    'dojo/text!template/well-popup.html',

    "widgets/window-floating-widget/main"
], function (declare, on, lang, domClass, Color, promiseAll, JSON, Evented,
             AppHelper,
             Query, QueryTask,
             Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SpatialReference, Point, ScreenPoint, GeometryService, ProjectParameters,
             WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             template, SpatialLocationForm, popupTemplate
    ) {

    "use strict";

    var DEFAULT_MODE = 'defaultMode',
        EVENT_FORM_CHANGED = 'eventFormChanged',
        STATUS_PROCESSING = 'statusProcessing',
        STATUS_VALID = 'statusValid',
        STATUS_INVALID = 'statusInvalid',
        EVENT_COMPLETED_PROCESSING = 'eventCompletedProvessing',
        LOADING_MODE = 'loadingMode',
        LEFT_POSITION = 'left',
        RIGHT_POSITION = 'right',
        geometryService,

        /**
         * Conteúdo da <code>infoWindow</code> para apresentar informações do poço.
         *
         * @class
         */
        WellInfoWindowContent = declare([WidgetBase, TemplatedMixin], {
            BASE_CLASS : 'well-info-window',
            LOADING_CLASS : 'loading',

            templateString : popupTemplate,

            ///----------------------------------------------------------------------------------------------------------
            // Components from template
            //----------------------------------------------------------------------------------------------------------

            /**
             * Estado
             * @private
             * @type HtmlElement
             */
            stateDisplay : null,

            /**
             * Município
             * @private
             * @type HtmlElement
             */
            countyDisplay : null,

            /**
             * Provincia
             * @private
             * @type HtmlElement
             */
            provinceDisplay : null,

            /**
             * Aquífero
             * @private
             * @type HTMLElement
             */
            aquiferDisplay : null,

            /**
             * Região Hidrográfica (N1)
             * @private
             * @type HTMLElement
             */
            hydroN1Display : null,

            /**
             * Unidade Hidrográfica (N2)
             * @private
             * @type HTMLElement
             */
            hydroN2Display : null,

            /**
             * Unidade de Gestão Local (N3)
             * @private
             * @type HTMLElement
             */
            localManagementUnitDisplay : null,

            /**
             * Unidade de Gestão Estadual
             * @private
             * @type HTMLElement
             */
            stateManagementUnitDisplay : null,

            /**
             * Ottobacia
             * @private
             * @type HTMLElement
             */
            ottobaciaDisplay : null,

            /**
             * Estado de apresentação do popup. As opções possíveis são:
             * <ul>
             *     <li><code>WellInfoWindowContent.DEFAULT_STATE</code>: Apresenta um formulário com os dados</li>
             *     <li><code>WellInfoWindowContent.DEFAULT_STATE</code>: Indica que está em processo de carregamento das informações</li>
         *     </ul>
             *
             *
             * @type String
             */
            state : null,

            /**
             *
             * @param state
             */
            setMode : function (state) {
                switch (state) {
                case LOADING_MODE:
                    domClass.add(this.domNode, this.LOADING_CLASS);
                    break;

                default:
                    domClass.remove(this.domNode, this.LOADING_CLASS);
                    break;
                }
            },

            /**
             * Apresenta o nome do Estado no template.
             * @param {String} stateName
             */
            setStateName : function (stateName) {
                this.stateDisplay.innerHTML = stateName;
            },

            /**
             * Apresenta o nome do Município no template.
             * @param {String} stateName
             */
            setCountyName : function (countyName) {
                this.countyDisplay.innerHTML = countyName;
            },

            /**
             * Apresenta o nome da Província no template.
             * @param {String} stateName
             */
            setProvinceName : function (provinceName) {
                this.provinceDisplay.innerHTML = provinceName;
            },

            /**
             * Apresenta o nome do Aquíufero no template.
             * @param {String} stateName
             */
            setAquiferName : function (aquiferName) {
                this.aquiferDisplay.innerHTML = aquiferName;
            },

            /**
             * Apresenta o nome da Região Hidrográfica no template.
             * @param {String} stateName
             */
            setHydroN1Name : function (hydroName) {
                this.hydroN1Display.innerHTML = hydroName;
            },

            /**
             * Apresenta o nome da Unidade Hidrográfica no template.
             * @param {String} stateName
             */
            setHydroN2Name : function (hydroName) {
                this.hydroN2Display.innerHTML = hydroName;
            },

            /**
             * Apresenta o nome da Unidade de gestão local no template.
             * @param {String} stateName
             */
            setLocalManagementUnitName : function (localManagementUnitName) {
                this.localManagementUnitDisplay.innerHTML = localManagementUnitName;
            },

            /**
             * Apresenta o nome da Unidade de Gestaão Estadual no template.
             * @param {String} stateName
             */
            setStateManagementUnitName : function (stateManagementUnitName) {
                this.stateManagementUnitDisplay.innerHTML = stateManagementUnitName;
            },

            /**
             * Apresenta o código de Ottobacia no template.
             * @param {String} stateName
             */
            setOttobaciaName : function (ottobaciaName) {
                this.ottobaciaDisplay.innerHTML = ottobaciaName;
            }
        }),


        /**
         *  Cria intância de gerenciador de registro de poços.
         *
         * @class Gerencia o cadastro e edição de informações de poços
         */
        WellRegistryManager = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

            BASE_CLASS : 'well-registry-manager',
            templateString : template,

            /**
             * Feição do poço (instância de esri.Graphic) apresentado no mapa
             *
             * @private
             * @type esri.Graphic
             */
            wellFeature : null,

            /**
             * Popup para apresentação das informações de poço.
             *
             * @private
             * @type WellInfoWindowContent
             */
            wellPopup : null,

            /**
             * Posicionamento do widget. Os valores possíveis são:
             *  <ul>
             *      <li><code>WellRegistryManager.LEFT_POSITION</code></li>
             *      <li><code>WellRegistryManager.RIGHT_POSITION</code></li>
             *  </ul>
             *
             * @private
             * @type String
             */
            position : null,

            /**
             * Dados da última consulta realizada
             * @private
             * @type dojox.collections.Dictionary
             */
            lastResult : null,

            /**
             * Última localização indicado pelo usuário.
             * @private
             * @type esri.geometry.Point
             */
            lastLocation : null,

            /**
             * Objeto ouvinte do processo de conclusão das requisições dos
             * dados referente ao poço.
             *
             * @private
             * @type dojo/promise/Promise
             */
            currentPromise : null,

            //Informações do arquivo de configuração
            stateServiceInfo : null,
            countyServiceInfo : null,
            provinceServiceInfo :  null,
            hydroN1ServiceInfo : null,
            stateManagementUnit : null,
            localManagementUnit : null,
            hydroN2ServiceInfo : null,
            aquiferServiceInfo : null,
            ottobaciaServiceInfo : null,
            defaultValuesForm : null,

            ///----------------------------------------------------------------------------------------------------------
            // Components from template
            //----------------------------------------------------------------------------------------------------------

            /**
             * Formulário com campos relacionados a dados espaciais (localização).
             *
             * @protected
             * @type widgets.SpatialLocationForm
             */
            spatialForm : null,

            ///----------------------------------------------------------------------------------------------------------
            // Override Methods
            //----------------------------------------------------------------------------------------------------------

            /**
             * Chamado após ser criado os components
             *
             * @protected
             */
            postCreate : function () {
                //this.own(on(this.spatialForm, SpatialLocationForm.FORM_COMPLETED_EVENT, lang.hitch(this, this.onCompletedSpatialForm)));
                this.own(on(this.spatialForm, SpatialLocationForm.FORM_CHANGED_EVENT, lang.hitch(this, this.onChangedSpatialForm)));
            },

            ///----------------------------------------------------------------------------------------------------------
            // Public Methods
            //----------------------------------------------------------------------------------------------------------

            /**
             * Inicializa o widget.
             *
             * @public
             * @param {Object} params
             */
            init : function (params) {
                var position = params.position.toLowerCase(), w;

                this.stateServiceInfo = params.stateService;
                this.countyServiceInfo = params.countyService;
                this.provinceServiceInfo = params.provinceService;
                this.aquiferServiceInfo = params.aquiferService;
                this.hydroN1ServiceInfo = params.hydroN1Service;
                this.hydroN2ServiceInfo = params.hydroN2Service;
                this.localManagementUnit = params.localManagementUnitService;
                this.stateManagementUnit = params.stateManagementUnitService;
                this.ottobaciaServiceInfo = params.ottobaciaService;
                this.defaultValuesForm = params.defaultValuesForm;

                if ([LEFT_POSITION, RIGHT_POSITION].indexOf(position) !== -1) {
                    this.setPosition(position);
                } else {
                    this.setPosition(RIGHT_POSITION);
                }
                geometryService = new GeometryService(params.geometryServiceURL);

                this.spatialForm.setProjectionSystems(params.projections);
                this.spatialForm.setDefaultValuesForm(this.defaultValuesForm);
                this.spatialForm.showCoordinatesOnClick(this.defaultValuesForm.showCoordinatesOnClick);
                this.spatialForm.showLocateButton(params.showLocateButton);
            },

            /**
             * Carrega a localização do ponto e requisita suas informações apresentando as no mapa.
             *
             * @param {esri.geometry.Point} location localização geográfica.
             */
            loadLocation : function (location) {
                var map = AppHelper.getMap();
                this.spatialForm.loadCoordinates(location);
                this.projectGeometry(location, map.spatialReference, this.onProjectSuccess, this.onProjectFault);
            },

            /**
             * Define a localização do componente. Os parâmetros possíveis são:
             * <ul>
             *     <li><code>WellRegistryManager.LEFT_POSITION</code></li>
             *     <li><code>WellRegistryManager.RIGHT_POSITION</code></li>
             * </ul>
             *
             * @private
             * @param {String} position
             */
            setPosition : function (position) {
                this.position = position;

                if (domClass.contains(this.domNode, this.position)) {
                    domClass.remove(this.domNode, this.position);
                }

                domClass.add(this.domNode, position);
                this.position = position;
            },

            /**
             * Carrega as informações preenchidas no formulário e as apresenta no mapa.
             *
             * @public
             * @param {Function} result Função chamada ao concluir com sucesso o processo.
             * @param {Function} fault Função chamada ao identificar algum erro no processo.
             */
            loadSpatialForm : function (result, fault) {
                var map = AppHelper.getMap(),
                    that = this,
                    local,
                    wkid,
                    lat,
                    lon;

                /**
                 * Função de callback no caso de sucesso no carregamento das informações da localização
                 * dispostas no formulário
                 *
                 * @param result
                 */
                function requestInfoResultHandler() {
                    if (result) {
                        result();
                    }
                }

                /**
                 * Função de callback no caso de falha no carregamento das informações
                 *
                 * @param info
                 */
                function requestInfoFaultHandler(info) {
                    if (fault) {
                        fault(info);
                    }
                }

                try {
                    wkid = parseInt(this.spatialForm.getSelectedProjectionSystem(), 10);

                    lon = parseFloat(this.spatialForm.getLongitude(), 10);
                    lat = parseFloat(this.spatialForm.getLatitude(), 10);
                    local = new Point({longitude : lon, latitude : lat, spatialReference : new SpatialReference({wkid : wkid})});

                    this.lastLocation = local;

                    if (wkid !== map.spatialReference.wkid) {
                        this.projectGeometry(local, map.spatialReference).then(function (result) {
                            that.requestInfoFromLocation(result.shift()).then(requestInfoResultHandler, requestInfoFaultHandler);
                        }, function () {
                            var map = AppHelper.getMap();
                            AppHelper.showError('Falha ao projetar localização para o DATUM: ' + JSON.stringify(map.spatialReference.toJson()));
                            if (fault) {
                                fault();
                            }
                        });
                    } else {
                        this.requestInfoFromLocation(local).then(requestInfoResultHandler, requestInfoFaultHandler);
                    }
                } catch (error) {
                    AppHelper.showError(error.message);
                }
            },

            /**
             * Retorna as informações descrita no widget atualmente.
             *
             * @public
             * @param {esri.SpatialReference} spatialReference Referência espacial que o ponto deve ser projetado.
             * @param {Function} result Função chamada ao finalizar o processo de projeção.
             * O objeto retornado possui as seguintes propriedades:
             * <ul>
             *     <li><code>location</code>: Instância de <code>esri.geometry.Point</code> indicando a localização na
             *     projeção indicada por parâmetro</li>
             *     <li><code>data</code>: Instância de <code>dojox.collections.Dictionary</code> com as informações
             *     requisitadas nos serviços e apresentados no infoWindow</li>
             * </ul>
             * @param {Function} fault Função chamada caso haja falha ao projetar geometria.
             * @return {Object}
             */
            getData : function (wkid, result, fault) {
                var coordinates,
                    that = this;
                if (this.currentPromise) {
                    result({location : {}, data : {}, status : STATUS_PROCESSING});
                }
                if (this.lastLocation.spatialReference.wkid !== wkid) {
                    this.projectGeometry(this.lastLocation, new SpatialReference({wkid : wkid})).then(function (geometries) {
                        var point = geometries.shift();
                        coordinates = {x : point.x, y : point.y};
                        result({
                            location : coordinates,
                            data : that.lastResult,
                            status : that.lastResult ? STATUS_VALID : STATUS_INVALID
                        });
                    }, function (info) {
                        fault(info);
                        AppHelper.showError("Falha ao projetar geometria para a referencia espacial:" + wkid);
                    });
                } else {
                    coordinates = { x : that.lastLocation.x, y : that.lastLocation.y};
                    result({
                        location : coordinates,
                        data : this.lastResult,
                        status : this.lastResult ? STATUS_VALID : STATUS_INVALID
                    });
                }
            },

            /**
             * Remove as informações do mapa
             */
            clear : function () {
                var map = AppHelper.getMap();
                if (this.wellFeature) {
                    map.graphics.remove(this.wellFeature);
                    this.wellFeature = null;
                }
                map.infoWindow.hide();
            },

            //----------------------------------------------------------------------------------------------------------
            // Private Methods
            //----------------------------------------------------------------------------------------------------------

            /**
             * Requisita as informações da localização e as apresenta no mapa.
             *
             * @private
             * @param {esri.geometry.Point} location
             *
             * @return {dojo.promise.Promise}
             */
            requestInfoFromLocation : function (location) {
                var map = AppHelper.getMap(),
                    feature = this.doFeature(location),
                    promises = [],
                    data = {},
                    isValidCoordinates = true,
                    deferred,
                    canceled;

                /**
                 * Verifica se a requisição ainda é válida para
                 * aplicar as respectivas alterações.
                 *
                 * @return Boolean
                 */
                function validateQuery() {
                    return !canceled;
                }

                if (this.currentPromise && !this.currentPromise.isFulfilled()) {
                    this.currentPromise.cancel();
                    this.currentPromise = null;
                }

                if (this.wellFeature) {
                    map.graphics.remove(this.wellFeature);
                }
                this.wellFeature = feature;

                if (this.wellPopup) {
                    this.wellPopup.destroy();
                }
                this.wellPopup = new WellInfoWindowContent();
                this.wellPopup.setMode(LOADING_MODE);

                map.graphics.add(feature);
                map.infoWindow.setContent(this.wellPopup.domNode);
                map.infoWindow.show(location);

                // Requisita as informações sobre o estado
                deferred = this.queryState(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.estado = item;
                            this.wellPopup.setStateName(item[this.stateServiceInfo.name]);
                        } else {
                            isValidCoordinates = false;
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre municipio
                deferred = this.queryCounty(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.municipio = item;
                            this.wellPopup.setCountyName(item[this.countyServiceInfo.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisira as informações sobre a província
                deferred = this.queryProvince(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.provincia = item;
                            this.wellPopup.setProvinceName(item[this.provinceServiceInfo.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre a unidade Administrativa estadual
                deferred = this.queryStateManagementUnit(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.unidadeGestaoEstadual = item;
                            this.wellPopup.setStateManagementUnitName(item[this.stateManagementUnit.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre Unidade hidrográfica N1
                deferred = this.queryHydroN1(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.regiaoHidrografica = item;
                            this.wellPopup.setHydroN1Name(item[this.hydroN1ServiceInfo.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre Unidade hidrográfica N2
                deferred = this.queryHydroN2(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.unidadeHidrografica = item;
                            this.wellPopup.setHydroN2Name(item[this.hydroN2ServiceInfo.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre Inidade de Gestão local N3
                deferred = this.queryLocalManagementUnit(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.unidadeGestaoLocal = item;
                            this.wellPopup.setLocalManagementUnitName(item[this.localManagementUnit.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre Aquífero
                deferred = this.queryAquifer(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.aquifero = item;
                            this.wellPopup.setAquiferName(item[this.aquiferServiceInfo.name]);
                        }
                    }
                }));
                promises.push(deferred.promise);

                // Requisita as informações sobre Ottobacia
                deferred = this.queryOttobacia(location);
                deferred.then(lang.hitch(this, function (featureSet) {
                    var item;
                    if (validateQuery()) {
                        if (featureSet.features.length) {
                            item = featureSet.features.shift().attributes;

                            data.ottobacia = item;
                            this.wellPopup.setOttobaciaName(item[this.ottobaciaServiceInfo.id]);
                        }
                    }
                }));

                this.currentPromise = promiseAll(promises);
                this.currentPromise.then(
                    lang.hitch(this, function (result) {
                        this.wellPopup.setMode(DEFAULT_MODE);
                        this.lastResult = isValidCoordinates ? data : null;
                        this.currentPromise = null;
                        if (!isValidCoordinates) {
                            AppHelper.showInfo('As coordenadas definidas não são válidas');
                            this.clear();
                        }
                        this.emit(EVENT_COMPLETED_PROCESSING);
                    }),
                    lang.hitch(this, function (info) {
                        canceled = true;
                        this.lastResult = null;
                        AppHelper.showError("Falha ao consultar informações com a localização indicada.");
                        this.clear();
                        this.currentPromise = null;
                        this.emit(EVENT_COMPLETED_PROCESSING);
                    })
                );

                return this.currentPromise;
            },

            /**
             * Constroi e retorna a feição para apresentação no mapa.
             *
             * @private
             * @return {esri.Graphic}
             */
            doFeature : function (geometry) {
                var feature = new Graphic(geometry),
                    lineSymbol = new SimpleLineSymbol(),
                    markerSymbol = new SimpleMarkerSymbol();

                lineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
                lineSymbol.setColor(new Color([0, 0, 190, 0.5]));
                lineSymbol.setWidth(4);

                markerSymbol.setSize(15);
                markerSymbol.setColor(new Color([0, 0, 190, 0.9]));
                markerSymbol.setOutline(lineSymbol);

                feature.setSymbol(markerSymbol);

                return feature;
            },

            /**
             * Reprojeta a geometria para a referência espacial.
             *
             * @public
             * @param {esri.geometry.Geometry} geometry Geometria que será reprojetada
             * @param {esri.SparialReference} outSpatialReference Referência espacial que a geometria deve ser projetada
             * @param {Function} result Função de callback no caso de haver sucesso na operação
             * @param {Function} error Função chamada em caso de falha
             *
             * @return {dojo.promise.Promise}
             */
            projectGeometry : function (geometry, outSpatialReference) {
                var projectParams = new ProjectParameters();
                projectParams.geometries = [geometry];
                projectParams.outSR = new SpatialReference({wkid : outSpatialReference.wkid});

                return geometryService.project(projectParams);
            },

            /**
             * Pesquisa as informações sobre o estado da localização indicada.
             *
             * @private
             * @param {esri.form.Point} location
             * @return {dojo.Deferred}
             */
            queryState : function (location) {
                var fields = [
                    this.stateServiceInfo.idFied,
                    this.stateServiceInfo.name
                ];
                return this.queryData(this.stateServiceInfo.url, fields, location);
            },

            /**
             * Pesquisa as informações sobre o municipio da localização indicada.
             *
             * @private
             * @param {esri.form.Point} location
             * @return {dojo.Deferred}
             */
            queryCounty : function (location) {
                var fields = [
                    this.countyServiceInfo.id,
                    this.countyServiceInfo.name
                ];
                return this.queryData(this.countyServiceInfo.url, fields, location);
            },

            /**
             * Pesquisa os dados referente a província da localização indicada.
             *
             * @private
             * @param {esri.geometry.Point} location
             * @return {dojo.Deferred}
             */
            queryProvince : function (location) {
                var fields = [
                    this.provinceServiceInfo.id,
                    this.provinceServiceInfo.name
                ];
                return this.queryData(this.provinceServiceInfo.url, fields, location);
            },

            /**
             * Pesquisa as informações sobre a unidade de gestão estadual.
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryStateManagementUnit : function (location) {
                var fields = [
                    this.stateManagementUnit.id,
                    this.stateManagementUnit.name
                ];
                return this.queryData(this.stateManagementUnit.url, fields, location);
            },

            /**
             * Requisita informações sobre a unidade hidrográfica.
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryHydroN1 : function (location) {
                var fields = [
                    this.hydroN1ServiceInfo.id,
                    this.hydroN1ServiceInfo.name
                ];
                return this.queryData(this.hydroN1ServiceInfo.url, fields, location);
            },

            /**
             * Requisita informações sobre a regiaão hidrográfica.
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryHydroN2 : function (location) {
                var fields = [
                    this.hydroN2ServiceInfo.id,
                    this.hydroN2ServiceInfo.name
                ];
                return this.queryData(this.hydroN2ServiceInfo.url, fields, location);
            },

            /**
             * Requisita informações sobre a unidade de gestão local.
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryLocalManagementUnit : function (location) {
                var fields = [
                    this.localManagementUnit.id,
                    this.localManagementUnit.name
                ];
                return this.queryData(this.localManagementUnit.url, fields, location);
            },

            /**
             * Requisita informações sobre o aquífero
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryAquifer : function (location) {
                var fields = [
                    this.aquiferServiceInfo.id,
                    this.aquiferServiceInfo.name
                ];
                return this.queryData(this.aquiferServiceInfo.url, fields, location);
            },

            /**
             * Requisita informações de ottobacia
             *
             * @private
             * @param {esri.geometry.Point} location
             * @returns {dojo.Deferred}
             */
            queryOttobacia : function (location) {
                var fields = [this.ottobaciaServiceInfo.id];
                return this.queryData(this.ottobaciaServiceInfo.url, fields, location);
            },

            /**
             * Requisita informações de em determinado serviço de acordo com a geometria parametrizada
             *
             * @private
             * @param {String} url URL da camada com informações a ser pesquisada
             * @param {esri.geometry.Geometry} geometry Geometria da localização geográfica a ser pesquisada
             * @param {Array} fields Lista de campos que devem retornar
             */
            queryData : function (url, fields, geometry) {
                var query = new Query(),
                    queryTask = new QueryTask(url);

                query.geometry = geometry;
                query.returnGeometry = false;
                query.outFields = fields;
                //query.where = '1=1';

                return queryTask.execute(query);
            },

            ///----------------------------------------------------------------------------------------------------------
            // Listeners
            //----------------------------------------------------------------------------------------------------------

            /**
             * Ouvinte do evento de conclusão do preenchimento dos dados do formulário.
             *
             * @private
             * @param event
             */
            /*
            onCompletedSpatialForm : function (event) {
                this.loadSpatialForm();
            },
            */

            /**
             * Ouvinte da conclusão do processo para reprojeção da localização para a projeção do mapa
             *
             * @private
             * @param value
             */
            onProjectSuccess : function (value) {
                this.requestInfoFromLocation(value.shift());
            },

            /**
             * Ouvinte da conclusão do processo para reprojeção da localização para a projeção do mapa
             *
             * @private
             * @param error
             */
            onProjectFault : function (error) {
                var map = AppHelper.getMap();
                AppHelper.showError('Falha ao projetar localização para o DATUM: ' + JSON.stringify(map.spatialReference.toJson()));
            },

            /**
             * Ouvinte do evento que indica a modificação de campos no formulário.
             *
             * @private
             * @param event
             */
            onChangedSpatialForm : function (event) {
                this.clear();
                this.emit(EVENT_FORM_CHANGED, event);
            }

        });

    WellRegistryManager.LEFT_POSITION = LEFT_POSITION;
    WellRegistryManager.RIGHT_POSITION = RIGHT_POSITION;

    /**
     * Tipo de evento disparado quando o formulário for alterado.
     *
     * @event
     */
    WellRegistryManager.EVENT_FORM_CHANGED = EVENT_FORM_CHANGED;

    WellRegistryManager.EVENT_COMPLETED_PROCESSING = EVENT_COMPLETED_PROCESSING;

    WellRegistryManager.STATUS_PROCESSING = STATUS_PROCESSING;

    WellRegistryManager.STATUS_VALID = STATUS_VALID;

    WellRegistryManager.STATUS_INVALID = STATUS_INVALID;

    return WellRegistryManager;
});
