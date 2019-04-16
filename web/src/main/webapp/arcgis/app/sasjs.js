/*global window, console, require, console, idServicoInit, define, alert, baseUrl*/

define([
    'dojo',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/xhr',
    'dojo/_base/json',
    'dojo/Evented',
    'dojo/on',
    'dojo/Deferred',
    'dojo/promise/all',

    'esri/map',
    'esri/geometry/Extent',
    "esri/dijit/Basemap",
    "esri/dijit/BasemapLayer",
    'esri/dijit/Scalebar',

    'app/sasjs-container',
    'app/widget-factory',
    'app/plugin-factory',
    'app/sasjs-registry',
    'app/statesManager'
], function (dojo, declare, lang, xhr, json, Evented, on, Deferred, promiseAll,
             Map, Extent, Basemap, BasemapLayer, Scalebar,
             SASJSContainer, WidgetFactory, PluginFactory, SASJSRegistry, statesManager) {
    'use strict';

    /**
     * Interface para comunicação com a aplicação.
     * Facade
     */
    var SASJS,
        EVENT_CREATED_WIDGET = 'createdWidgetEvent',
        EVENT_CREATED_ALL_WIDGETS = 'createdAllWidgetsEvent',
        EVENT_CREATED_PLUGIN = 'createPluginEvent',
        EVENT_CREATED_ALL_PLUGINS = 'createdAllPluginsEvent',
        EVENT_APPLICATION_FAULT = 'applicationFaultEvent',
        EVENT_READY = 'readyEvent',
        DIV_CONTAINER = 'divContainer',
        APP_CONTAINER = 'appContainer',
        MAP = 'map',

        /**
         * Cofiguração padrão da aplicação.
         */
        config,

        /**
         * Indica se as configurações foram carregadas
         */
        configLoaded,

        /**
         * Instância de <code>SASJSRegistry</code>.
         * Registro de elementos da aplicação
         */
        registry,

        appContainer;

    lang.mixin(window, {
        SASJS_DIV_CONTAINER : DIV_CONTAINER,
        SASJS_APP_CONTAINER : APP_CONTAINER,
        SASJS_MAP : MAP
    });


    /**
     * Realiza a requisição das dependencias e constroi o widget adicionando o ao container de widgets
     * @param {String} widgetName
     * @param {Object} config
     * @return {dojo.Deferred}
     */
    function buildWidget(widgetName, config) {
        var deferred = new Deferred(),
            sasjsRegistry = SASJSRegistry.getInstance();
        try {
            WidgetFactory.create(
                widgetName,
                function (widget) {
                    sasjsRegistry.set(widgetName, widget);
                    deferred.resolve({
                        widgetName: widgetName,
                        widget : widget,
                        config : config
                    });
                }
            );
        } catch (e) {
            deferred.cancel(e);
        }

        return deferred.promise;
    }

    /**
     * Realiza a requisição das dependencias e constroi o widget adicionando o ao container de widgets
     * @param {String} pluginName
     * @param {Boolean} active
     * @returns {promise|*|c.Deferred.promise|h.promise|b.Deferred.promise|f.promise}
     */
    function buildPlugin(pluginName, active) {
        var deferred = new Deferred();
        if (active === true) {
            try {
                PluginFactory.create(
                    pluginName,
                    function (plugin) {
                        deferred.resolve({
                            pluginName: pluginName,
                            plugin : plugin,
                            active : active
                        });
                    }
                );
            } catch (e) {
                deferred.cancel(e);
            }


        }
        return deferred.promise;
    }

    /**
     * Constroi o mapa da aplicação dentro do container parametrizado
     * @param {HTMLElement} mapContainer Container que conterá o mapa
     * @param {esri.geometry.Extent} initialExtent Extensão inicial do mapa
     * @param {String} baseMap Mapa base
     */
    function buildMap(mapContainer, initialExtent, baseMap) {
        var map,
            mapId = dojo.getAttr(mapContainer, 'id'),
            changeBaseMap,
            i,
            max,
            layer;

        if (!mapId) {
            mapId = 'SASJSMap';
            dojo.setAttr(mapContainer, 'id', mapId);
        }

        map = new Map(mapId);
        map.setExtent(initialExtent);
        for (i = 0, max = config.widgets.length; i < max; i += 1) {
            if (config.widgets[i].name === "change-basemap/main") {
                changeBaseMap = config.widgets[i];
                break;
            }
        }
        if (typeof changeBaseMap === "object" && changeBaseMap.config.showCustomBaseMap === true) {
            layer = new BasemapLayer({
                url : changeBaseMap.config.defaultBaseMap
            });
            if (/(streets|satellite|hybrid|topo|gray|oceans|national-geographic|osm)/.test(changeBaseMap.config.defaultBaseMap)) {
                map.setBasemap(changeBaseMap.config.defaultBaseMap);
            } else {
                map.setBasemap(new Basemap({ layers : [layer] }));
            }
        } else {
            map.setBasemap(baseMap);
        }

        on(map, 'click', lang.hitch(this, function () {
            statesManager.setWidgetVisibleAtList('List:WidgetsLeft', false);
        }));

        registry.set(MAP, map);
    }



    /**
     * Inicializa a construção da aplicação.
     * Chamado somente quando o arquivo de configuração for carregado corretamente.
     * @private
     */
    function buildApplication() {
        var divContainer = registry.get(DIV_CONTAINER);

        appContainer = new SASJSContainer();
        appContainer.placeAt(divContainer);

        registry.set(APP_CONTAINER, appContainer);

        buildMap(appContainer.mapContainer, new Extent(config.initialExtent), config.baseMap);
    }

    /**
     * Facade da aplicação SASJS
     * @class
     */
    SASJS = declare([Evented], {

        constructor : function () {
            registry = SASJSRegistry.getInstance();
        },

        /**
         * Resquisita o arquivo de configuração da URL parametrizada e carrega aplicação conforme a configuração.
         * @param {String} configURL
         */
        loadConfig : function (configURL) {
            xhr.get({
                url : configURL,
                handlerAs : 'json-comment-filtered',
                handle : lang.hitch(this, this.processLoadConfigHandler),
                failOK : true,
                preventCache : true
            });
        },

        /**
         * Inicializa a aplicação dentro da div parametrizada
         * @param appDivId
         */
        init : function (divId) {

            var divContainer = dojo.byId(divId);

            if (divContainer) {
                registry.set(DIV_CONTAINER, divContainer);
            }

            this.validateApplication();
        },

        /**
         * Verifica se todas os requisitos da aplicação foram supridos, caso sim,
         * inicializa a aplicação.
         * @private
         * @returns {*}
         */
        validateApplication : function () {
            var map, that = this;

            function loadWidgets() {
                var promises = that.buildWidgets(config.widgets);

                promiseAll(promises).then(
                    lang.hitch(that, that.buildWidgetsCompleteHandler),
                    lang.hitch(that, that.buildWidgetsFaultHandler)
                );
            }

            function loadPlugins() {
                var promises = that.buildPlugins(config.plugins);

                promiseAll(promises).then(
                    lang.hitch(that, that.buildPluginsCompleteHandler),
                    lang.hitch(that, that.buildPluginsFaultHandler)
                );
            }

            function loadScalebar() {
                var map = registry.get(MAP),
                    scalebar = new Scalebar({
                    map: map,
                    scalebarUnit: "dual",
                    attachTo: "bottom-left"
                });
            }

            function handleApplication() {
                loadWidgets();
                loadPlugins();
                loadScalebar();
            }

            if (configLoaded && registry.exists(DIV_CONTAINER)) {
                buildApplication();
                map = registry.get(MAP);

                if (map.loaded) {
                    handleApplication();
                } else {
                    // Ouvinte do carregamento do mapa
                    on(map, 'load', handleApplication);
                }
            }
        },
        /**
         * Inicializa a construção dos widgets.<br />
         * O processo de construção é assíncrono, com isso são retornados todos os <code>Promise</code> da construção
         * de cada widget.
         * @private
         * @param {Array} widgets
         * @return {Array} Instância de <code>dojo.promise.Promise</code>
         */
        buildWidgets : function (widgets) {
            var widgetInfo,
                promise,
                promises = [],
                index = widgets.length - 1;

            while (index >= 0) {
                widgetInfo = widgets[index];
                promise = buildWidget(widgetInfo.name, widgetInfo.config);
                promise.then(lang.hitch(this, this.buildWidgetCompleteHandler));
                promises.push(promise);
                index -= 1;
            }
            return promises;
        },

        /**
         * Inicializa a construção dos plugins.<br />
         * O processo de construção é assíncrono, com isso são retornados todos os <code>Promise</code> da construção
         * de cada plugin.
         * @param {Array} plugins
         * @returns {Array}
         */
        buildPlugins : function (plugins) {
            var pluginInfo,
                promise,
                promises = [],
                index = plugins.length - 1;

            while (index >= 0) {
                pluginInfo = plugins[index];
                promise = buildPlugin(pluginInfo.name, pluginInfo.active);
                promise.then(lang.hitch(this, this.buildPluginCompleteHandler));
                promises.push(promise);
                index -= 1;
            }
            return promises;
        },

        /**
         * Dispara o evento que indica a criação do widget na aplicação.
         *
         * @private
         * @param {dijit._WidgetBase} widget
         */
        emitCreatedWidgetEvent : function (info) {
            this.emit(EVENT_CREATED_WIDGET, info);
        },

        /**
         * Dispara o evento que indica a criação do plugin na aplicação.
         *
         * @param info
         */
        emitCreatedPluginEvent : function (info) {
            this.emit(EVENT_CREATED_PLUGIN, info);
        },

        /**
         * Dispara o evento que indica a criação de todos os widgets configurado na aplicação.
         *
         * @private
         */
        emitCreatedAllWidgetsEvent : function () {
            this.emit(EVENT_CREATED_ALL_WIDGETS);
        },

        /**
         * Dispara o evento que indica a criação de todos os plugins configurado na aplicação.
         *
         * @private
         */
        emitCreatedAllPluginsEvent : function () {
            this.emit(EVENT_CREATED_ALL_PLUGINS);
        },

        /**
         * Dispara o evento que indica que houve falha na inicialização da aplicação e não será possível continuar.
         *
         * @private
         */
        emitApplicationFaultEvent : function () {
            this.emit(EVENT_APPLICATION_FAULT);
        },

        /**
         * Ouvinte do processo de requisição e carregamento do arquivo com configurações da aplicação.
         * @private
         * @param {String} data
         * @param {Object} info
         */
        processLoadConfigHandler : function (data, info) {
            switch (info.xhr.status) {
            case 200:
                config = json.fromJson(data);
                configLoaded = true;

                this.validateApplication();
                break;

            default:
                alert('Não foi possível carregar o arquivo de configurações ' + info.args.url);
                break;
            }
        },

        /**
         * Ouveinte do processo de conclusão no carregamento dos widgets.
         * @private
         * @param {Array} result
         */
        buildWidgetsCompleteHandler : function (result) {
            this.emitCreatedAllWidgetsEvent();
        },

        /**
         * Ouvinte de falhas ao construir algum widget.
         * @private
         * @param {Object} fault
         */
        buildWidgetsFaultHandler : function (fault) {
            this.emitApplicationFaultEvent();
        },

        /**
         * Função de callback para construção de widgets
         * @private
         * @param {Object} info
         */
        buildWidgetCompleteHandler : function (info) {
            appContainer.addWidget(info.widget);
            info.widget.init(info.config);
            this.emitCreatedWidgetEvent(info);
        },

        /**
         * Função de callback para construção dos plugins
         * @private
         * @param {Object} info
         */
        buildPluginCompleteHandler : function (info) {
            info.plugin.init(info.active);
            this.emitCreatedPluginEvent(info);
        },

        /**
         * Ouveinte do processo de conclusão no carregamento dos plugins.
         * @private
         * @param {Array} result
         */
        buildPluginsCompleteHandler : function (result) {
            this.emitCreatedAllPluginsEvent();
        },

        /**
         * Ouvinte de falhas ao construir algum widget.
         * @private
         * @param {Object} fault
         */
        buildPluginsFaultHandler : function (fault) {
            this.emitApplicationFaultEvent();
        }
    });

    /**
     * Tipo de evento disparado quando cada widget for criado e adicionado ao container
     * @event
     */
    SASJS.EVENT_CREATED_WIDGET = EVENT_CREATED_WIDGET;

    /**
     * Tipo de evento quando todos os widgets forem criados.
     * @event
     */
    SASJS.EVENT_CREATED_ALL_WIDGETS = EVENT_CREATED_ALL_WIDGETS;

    /**
     * Tipo de evento disparado quando houve falha ao inicializar a aplicação.
     * @event
     */
    SASJS.EVENT_APPLICATION_FAULT = EVENT_APPLICATION_FAULT;

    /**
     * Tipo de evento disparado quando cada plugin for criado
     * @event
     */
    SASJS.EVENT_CREATED_PLUGIN = EVENT_CREATED_PLUGIN;

    /**
     * Tipo de evento quando todos os plugins forem criados.
     * @event
     */
    SASJS.EVENT_CREATED_ALL_PLUGINS = EVENT_CREATED_ALL_PLUGINS;

    return SASJS;
});
