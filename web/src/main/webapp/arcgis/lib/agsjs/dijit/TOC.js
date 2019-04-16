/*built on 2013-10-17 12:06:12.13*/
/*global console, define*/

define("agsjs/dijit/TOC",
    [

        "dijit/Tooltip",
        "dijit/form/CheckBox",
        "dojo/mouse",
        "dojo/query",
        "dojo/on",
        "dojo/dom-geometry",

        "dojo/_base/declare",
        "dojo/has",
        "dojo/aspect",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-attr",
        "dijit/_Widget",
        "dijit/_Templated",
        "dojo/Evented",
        "dojox/gfx",
        "dojo/fx",
        "dojo/fx/Toggler",
        "esri/symbols/jsonUtils",
        "esri/geometry/scaleUtils",
        "esri/config",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "dojo/_base/sniff"
    ],
    function (Tooltip, myCheckBox, mouse, query, on, domGeometry,
              declare, q, v, j, array, domConstruct, domClass, domStyle, domAttr, _Widget, _Templated, Evented, gfx, fx, fxToggler, EsriJSONUtils, B, t, p, C) {
        'use strict';

        var legendsEnabled;
        var u = declare([_Widget, _Templated], {
                templateString: '<div data-dojo-attach-point="cc" class="agsjsTOCNode"><div data-dojo-attach-point="rowNode" data-dojo-attach-event="onclick:_onClick"><span data-dojo-attach-point="contentNode" class="agsjsTOCContent"><span data-dojo-attach-point="checkContainerNode"></span><img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" /><span data-dojo-attach-event="onmouseenter:_initTooltip, onmouseleave:_endTooltip" data-dojo-attach-point="labelNode"></span></span></div><div id="subLayers" data-dojo-attach-point="containerNode" style="display: none;"> </div></div>',
                rootLayer: null,
                serviceLayer: null,
                legend: null,
                rootLayerTOC: null,
                data: null,
                _childTOCNodes: [],
                constructor: function (a) {
                    j.mixin(this, a);
                },

                /**
                 * Criação de um método customizado
                 */
                myMethod : function () {
                    var config = this.rootLayerTOC.config;

                    /**
                     * Verifica se está visível ou nao o 'title'
                     */
                    if (!config.titleEnabled && this.containerNode !== null) {
                        domStyle.set(this.contentNode, 'display', "none");
                    }
                },

                _initTooltip : function (evt) {
                    Tooltip.show(evt.target.textContent, evt.target);
                    domStyle.set(evt.target, {
                        "backgroundColor" : "#ddd"
                    });
                },

                _endTooltip : function (evt) {
                    Tooltip.hide(evt.target);
                    domStyle.set(evt.target, {
                        "backgroundColor" : "#fff"
                    });
                },

                postCreate: function () {
                    /**
                     * Seta um paddingLeft para identar cada node do TOC,
                     * verificando se o title está habilitado ou não
                     */
                    if (this.rootLayerTOC.config.titleEnabled) {
                        domStyle.set(this.rowNode, "paddingLeft", " " + this.rootLayerTOC.tocWidget.indentSize * this.rootLayerTOC._currentIndent + "px");
                    } else {
                        domStyle.set(this.rowNode, "paddingLeft", " " + this.rootLayerTOC.tocWidget.indentSize * (this.rootLayerTOC._currentIndent - 1) + "px");
                    }

                    this.data = this.legend || this.serviceLayer || this.rootLayer;
                    this.blank = this.iconNode.src;
                    if (this.legend) this._createLegendNode(this.legend);
                    else if (this.serviceLayer) this._createServiceLayerNode(this.serviceLayer);
                    else this.rootLayer && this._createRootLayerNode(this.rootLayer); if (this.containerNode &&
                        fxToggler) this.toggler = new fxToggler({
                        node: this.containerNode,
                        showFunc: fx.wipeIn,
                        hideFunc: fx.wipeOut
                    });
                    if (!this._noCheckNode) {
                        var a;
                        if (dijit.form && dijit.form.CheckBox) {
                            a = new dijit.form.CheckBox({
                                checked: this.data.visible
                            });
                            a.placeAt(this.checkContainerNode);
                            a.startup()
                        } else a = domConstruct.create("input", {
                            type: "checkbox",
                            checked: this.data.visible
                        }, this.checkContainerNode);
                        this.checkNode = a
                    }
                    a = this.data.visible;
                    if (this.data._subLayerInfos) {
                        var b = true;
                        array.every(this.data._subLayerInfos, function (d) {
                            if (d.visible) return b = false;
                            return true
                        });
                        if (b) a = false
                    }
                    if (this.data.collapsed) a = false;
                    //notoriun
                    if (this.iconNode && this.iconNode.src === this.blank) {
                        if (this.labelNode.getAttribute('data-parent')) {
                            domClass.add(this.iconNode, "dijitTreeExpando");
                            domClass.add(this.iconNode, a ? "dijitTreeExpandoOpened" : "dijitTreeExpandoClosed");

                        } else if (this.rootLayerTOC.config.legendsEnabled) {
                            domClass.add(this.iconNode, "dijitTreeExpando");
                            domClass.add(this.iconNode, a ? "dijitTreeExpandoOpened" : "dijitTreeExpandoClosed");
                        }

                    } else if (!this.rootLayerTOC.config.legendsEnabled) {
                        /**
                         * Se os ícones de legenda não estiverem habilitadas, ele add a classe 'none' no ícone
                         */
                        domStyle.set(this.iconNode, 'display', "none");
                    }
                    this.iconNode && domClass.add(this.iconNode, "agsjsTOCIcon");
                    if (this.containerNode) domStyle.set(this.containerNode, "display", a ? "block" : "none");
                    this.domNode.id = "TOCNode_" + this.rootLayer.id + (this.serviceLayer ? "_" + this.serviceLayer.id : "") + (this.legend ? "_" + this.legend.id : "")
                },

                _createRootLayerNode: function (a) {
                    domClass.add(this.rowNode,
                        "agsjsTOCRootLayer");
                    domClass.add(this.labelNode, "agsjsTOCRootLayerLabel");

                    this.labelNode.setAttribute('data-parent', true);

                    var b = this.rootLayerTOC.config.title;
                    if (b === "") {
                        esri.hide(this.rowNode);
                        a.show();
                        this.rootLayerTOC._currentIndent--
                    } else if (b === undefined)
                        if (a.name) b = a.name;
                        else {
                            b = a.url.toLowerCase().indexOf("/rest/services/");
                            var d = a.url.toLowerCase().indexOf("/mapserver", b);
                            b = a.url.substring(b + 15, d)
                        }
                    a.collapsed = this.rootLayerTOC.config.collapsed;
                    if (this.rootLayerTOC.config.slider) {
                        this.sliderNode = domConstruct.create("div", {
                                "class": "agsjsTOCSlider"
                            }, this.rowNode,
                            "last");
                        var e = this;
                        require(["dijit/form/HorizontalSlider", "dojo/domReady!"], function (k) {
                            e.slider = new k({
                                showButtons: false,
                                value: a.opacity * 100,
                                intermediateChanges: true,
                                tooltip: "adjust transparency",
                                onChange: function (m) {
                                    a.setOpacity(m / 100)
                                },
                                layoutAlign: "right"
                            });
                            e.slider.placeAt(e.sliderNode);
                            a.on("opacity-change", function (m) {
                                e.slider.setValue(m.opacity * 100)
                            })
                        })
                    }

                    if (this.rootLayerTOC.config.noLegend) {
                        domStyle.set(this.iconNode, "visibility", "hidden");
                    }
                    else if (a._tocInfos) this._createChildrenNodes(a._tocInfos,
                        "serviceLayer");
                    else if (a.renderer) {
                        var c = a.renderer;
                        if (c.infos) {
                            d = c.infos;
                            c.defaultSymbol && d.length > 0 && d[0].label != "[all other values]" && d.unshift({
                                label: "[all other values]",
                                symbol: c.defaultSymbol
                            });
                            var g = c.attributeField + (c.normalizationField ? "/" + c.normalizationField : "");
                            g += (c.attributeField2 ? "/" + c.attributeField2 : "") + (c.attributeField3 ? "/" + c.attributeField3 : "");
                            c = domConstruct.create("div", {}, this.containerNode);
                            domStyle.set(c, "paddingLeft", "" + this.rootLayerTOC.tocWidget.indentSize * (this.rootLayerTOC._currentIndent +
                                2) + "px");
                            c.innerHTML = g;
                            this._createChildrenNodes(d, "legend")
                        } else {
                            this._setIconNode(a.renderer, this.iconNode, this);
                            domConstruct.destroy(this.containerNode);
                            this.containerNode = null
                        }
                    } else domStyle.set(this.iconNode, "visibility", "hidden");
                    this.labelNode.innerHTML = b;
                    domAttr.set(this.rowNode, "title", b);

                    //Chamada do meu método custom
                    this.myMethod();
                },
                _createServiceLayerNode: function (a) {
                    this.labelNode.innerHTML = a.name;
                    if (a._subLayerInfos) {
                        domClass.add(this.rowNode, "agsjsTOCGroupLayer");
                        domClass.add(this.labelNode, "agsjsTOCGroupLayerLabel");
                        this._createChildrenNodes(a._subLayerInfos, "serviceLayer")
                    } else {
                        domClass.add(this.rowNode,
                            "agsjsTOCServiceLayer");
                        domClass.add(this.labelNode, "agsjsTOCServiceLayerLabel");
                        if (this.rootLayer.tileInfo) this._noCheckNode = true;
                        if (a._legends && !this.rootLayerTOC.config.noLegend)
                            if (a._legends.length == 1) {
                                this.iconNode.src = this._getLegendIconUrl(a._legends[0]);
                                domConstruct.destroy(this.containerNode);
                                this.containerNode = null
                            } else this._createChildrenNodes(a._legends, "legend");
                        else {
                            domConstruct.destroy(this.iconNode);
                            this.iconNode = null;
                            domConstruct.destroy(this.containerNode);
                            this.containerNode = null
                        }
                    }
                },
                _createLegendNode: function (a) {
                    if (this.rootLayerTOC.config.legendsEnabled) {
                        this._noCheckNode =
                            true;
                        domConstruct.destroy(this.containerNode);
                        domClass.add(this.labelNode, "agsjsTOCLegendLabel");
                        this._setIconNode(a, this.iconNode, this);
                        var b = a.label;
                        if (a.label === undefined) {
                            if (a.value !== undefined) b = a.value;
                            if (a.maxValue !== undefined) b = "" + a.minValue + " - " + a.maxValue
                        }
                        this.labelNode.appendChild(document.createTextNode(b))
                    }
                },
                _setIconNode: function (a, b, d) {
                    var e = this._getLegendIconUrl(a);
                    if (e) {
                        b.src = e;
                        if (a.symbol && a.symbol.width && a.symbol.height) {
                            b.style.width = a.symbol.width;
                            b.style.height = a.symbol.height
                        }
                    } else if (a.symbol) {
                        e =
                            this.rootLayerTOC.tocWidget.swatchSize[0];
                        var c = this.rootLayerTOC.tocWidget.swatchSize[1];
                        if (a.symbol.width && a.symbol.height) {
                            e = a.symbol.width;
                            c = a.symbol.height
                        }
                        var g = domConstruct.create("span", {});
                        domStyle.set(g, {
                            width: e + "px",
                            height: c + "px",
                            display: "inline-block"
                        });
                        domConstruct.place(g, b, "replace");
                        d.iconNode = g;
                        a = EsriJSONUtils.getShapeDescriptors(a.symbol);
                        b = gfx.createSurface(g, e, c);
                        if (a) q("ie") ? window.setTimeout(j.hitch(this, "_createSymbol", b, a, e, c), 500) : this._createSymbol(b, a, e, c)
                    } else console && console.log("no symbol in renderer")
                },
                _createSymbol: function (a,
                                         b, d, e) {
                    a = a.createShape(b.defaultShape);
                    b.fill && a.setFill(b.fill);
                    b.stroke && a.setStroke(b.stroke);
                    a.applyTransform({
                        dx: d / 2,
                        dy: e / 2
                    })
                },
                _getLegendIconUrl: function (a) {
                    var b = a.url;
                    if (b != null && b.indexOf("data") == -1)
                        if (!q("ie") && a.imageData && a.imageData.length > 0) b = "data:image/png;base64," + a.imageData;
                        else {
                            if (b.indexOf("http") !== 0) b = this.rootLayer.url + "/" + this.serviceLayer.id + "/images/" + b;
                            if (this.rootLayer.credential && this.rootLayer.credential.token) b = b + "?token=" + this.rootLayer.credential.token;
                            else if (t.defaults.io.alwaysUseProxy) b =
                                t.defaults.io.proxyUrl + "?" + b
                        }
                    return b
                },
                _createChildrenNodes: function (a, b) {
                    var i = 0,
                        that = this;
                    this.rootLayerTOC._currentIndent++;
                    for (var d = [], e = 0, c = a.length; e < c; e++) {
                        var g = a[e],
                            k = {
                                rootLayerTOC: this.rootLayerTOC,
                                rootLayer: this.rootLayer,
                                serviceLayer: this.serviceLayer,
                                legend: this.legend
                            },
                            sub = that.rootLayerTOC.config.subLayers;

                        /**
                         * Verifica se há configuração do config.json nomeando as labels das sublayers
                         */
                        if (sub) {
                            for (i = 0; i < sub.length; i = i + 1) {
                                if (parseInt(sub[i].id) === a[e].id) {
                                    a[e].name = sub[i].label;
                                }
                            }
                        }

                        k[b] = g;
                        k.data = g;
                        if (b == "legend") g.id = "legend" + e;
                        g = new u(k);
                        g.placeAt(this.containerNode);
                        d.push(g);
                    }

                    this._childTOCNodes = d;
                    this.rootLayerTOC._currentIndent--;
                },
                _toggleContainer: function (a) {
                    if (domClass.contains(this.iconNode, "dijitTreeExpandoClosed") ||
                        domClass.contains(this.iconNode, "dijitTreeExpandoOpened")) {
                        if (a) {
                            domClass.remove(this.iconNode, "dijitTreeExpandoClosed");
                            domClass.add(this.iconNode, "dijitTreeExpandoOpened")
                        } else if (a === false) {
                            domClass.remove(this.iconNode, "dijitTreeExpandoOpened");
                            domClass.add(this.iconNode, "dijitTreeExpandoClosed")
                        } else {
                            domClass.toggle(this.iconNode, "dijitTreeExpandoClosed");
                            domClass.toggle(this.iconNode, "dijitTreeExpandoOpened")
                        } if (domClass.contains(this.iconNode, "dijitTreeExpandoOpened")) this.toggler ? this.toggler.show() : esri.show(this.containerNode);
                        else this.toggler ?
                                this.toggler.hide() : esri.hide(this.containerNode); if (this.rootLayer && !this.serviceLayer && !this.legend) this.rootLayerTOC.config.collapsed = domClass.contains(this.iconNode, "dijitTreeExpandoClosed")
                    }
                },
                expand: function () {
                    this._toggleContainer(true)
                },
                collapse: function () {
                    this._toggleContainer(false)
                },
                show: function () {
                    esri.show(this.domNode)
                },
                hide: function () {
                    esri.hide(this.domNode)
                },
                _adjustToState: function () {
                    if (this.checkNode) {
                        var a = this.legend ? this.legend.visible : this.serviceLayer ? this.serviceLayer.visible : this.rootLayer ?
                            this.rootLayer.visible : false;
                        if (this.checkNode.set) this.checkNode.set("checked", a);
                        else this.checkNode.checked = a
                    }
                    if (this.serviceLayer) {
                        a = B.getScale(this.rootLayerTOC.tocWidget.map);
                        (a = this.serviceLayer.maxScale != 0 && a < this.serviceLayer.maxScale || this.serviceLayer.minScale != 0 && a > this.serviceLayer.minScale) ? domClass.add(this.domNode, "agsjsTOCOutOfScale") : domClass.remove(this.domNode, "agsjsTOCOutOfScale");
                        if (this.checkNode)
                            if (this.checkNode.set) this.checkNode.set("disabled", a);
                            else this.checkNode.disabled = a
                    }
                    this._childTOCNodes.length >
                        0 && array.forEach(this._childTOCNodes, function (b) {
                        b._adjustToState()
                    })
                },

                _onClick: function (a) {
                    a = a.target;
                    if (a == this.checkNode || dijit.getEnclosingWidget(a) == this.checkNode) {
                        if (this.serviceLayer) {
                            this.serviceLayer.visible = this.checkNode && this.checkNode.checked;
                            if (this.serviceLayer.visible)
                                for (a = this.serviceLayer; a._parentLayerInfo;) {
                                    if (!a._parentLayerInfo.visible) a._parentLayerInfo.visible = true;
                                    a = a._parentLayerInfo
                                }
                            this.serviceLayer.visible && !this.rootLayer.visible && this.rootLayer.show();
                            this.serviceLayer._subLayerInfos &&
                            this._setSubLayerVisibilitiesFromGroup(this.serviceLayer);
                            this.rootLayer.setVisibleLayers(this._getVisibleLayers(), true);
                            this.rootLayerTOC._refreshLayer()
                        } else {
                            if (this.rootLayer){
                                this.rootLayer.setVisibility(this.checkNode && this.checkNode.checked);
                                if (this.checkNode.checked) {
                                    //this._childTOCNodes[0].checkNode.set('value', 'on');
                                }
                            }
                        }
                        this.rootLayerTOC.config.autoToggle !== false && this._toggleContainer(this.checkNode && this.checkNode.checked);
                        this.rootLayerTOC._adjustToState();
                    } else a == this.iconNode && this._toggleContainer()
                },
                _setSubLayerVisibilitiesFromGroup: function (a) {
                    a._subLayerInfos && a._subLayerInfos.length >
                        0 && array.forEach(a._subLayerInfos, function (b) {
                        b.visible = a.visible;
                        b._subLayerInfos && b._subLayerInfos.length > 0 && this._setSubLayerVisibilitiesFromGroup(b)
                    }, this)
                },
                _getVisibleLayers: function () {
                    var a = [];
                    array.forEach(this.rootLayer.layerInfos, function (b) {
                        b.subLayerIds || b.visible && a.push(b.id)
                    });
                    if (a.length === 0) a.push(-1);
                    else this.rootLayer.visible || this.rootLayer.show();
                    return a
                },
                _findTOCNode: function (a) {
                    if (this.serviceLayer && this.serviceLayer.id == a) return this;
                    if (this._childTOCNodes.length > 0)
                        for (var b = null,
                                 d = 0, e = this._childTOCNodes.length; d < e; d++)
                            if (b = this._childTOCNodes[d]._findTOCNode(a)) return b;
                    return null
                }
            }),
            D = declare([_Widget], {
                _currentIndent: 0,
                rootLayer: null,
                tocWidget: null,
                constructor: function (a) {
                    this.config = a.config || {};
                    this.rootLayer = a.config.layer;
                    this.tocWidget = a.tocWidget
                },
                postCreate: function () {
                    if (this.rootLayer instanceof p || this.rootLayer instanceof C) this._legendResponse ? this._createRootLayerTOC() : this._getLegendInfo();
                    else this._createRootLayerTOC()
                },
                _getLegendInfo: function () {
                    var a = "";
                    if (this.rootLayer.version >=
                        10.01) a = this.rootLayer.url + "/legend";
                    else {
                        a = "http://www.arcgis.com/sharing/tools/legend";
                        var b = this.rootLayer.url.toLowerCase().indexOf("/rest/");
                        b = this.rootLayer.url.substring(0, b) + this.rootLayer.url.substring(b + 5);
                        a = a + "?soapUrl=" + escape(b)
                    }
                    esri.request({
                        url: a,
                        content: {
                            f: "json"
                        },
                        callbackParamName: "callback",
                        handleAs: "json",
                        load: j.hitch(this, this._processLegendInfo),
                        error: j.hitch(this, this._processLegendError)
                    })
                },
                _processLegendError: function () {
                    this._createRootLayerTOC()
                },
                _processLegendInfo: function (a) {
                    this._legendResponse =
                        a;
                    var b = this.rootLayer;
                    if (!b._tocInfos) {
                        var d = {};
                        array.forEach(b.layerInfos, function (c) {
                            d["" + c.id] = c;
                            c.visible = c.defaultVisibility;
                            if (b.visibleLayers && !c.subLayerIds) c.visible = array.indexOf(b.visibleLayers, c.id) == -1 ? false : true
                        });
                        a.layers && array.forEach(a.layers, function (c) {
                            var g = d["" + c.layerId];
                            if (g && c.legend) g._legends = c.legend
                        });
                        array.forEach(b.layerInfos, function (c) {
                            if (c.subLayerIds) {
                                var g = [];
                                array.forEach(c.subLayerIds, function (k, m) {
                                    g[m] = d[k];
                                    g[m]._parentLayerInfo = c
                                });
                                c._subLayerInfos = g
                            }
                        });
                        var e = [];
                        array.forEach(b.layerInfos,
                            function (c) {
                                c.parentLayerId == -1 && e.push(c)
                            });
                        b._tocInfos = e
                    }
                    this._createRootLayerTOC()
                },
                _createRootLayerTOC: function () {
                    if (this.rootLayer.loaded) {
                        this._rootLayerNode = new u({
                            rootLayerTOC: this,
                            rootLayer: this.rootLayer
                        });
                        this._rootLayerNode.placeAt(this.domNode);
                        this._visHandler = this.rootLayer.on("visibility-change", j.hitch(this, this._adjustToState));
                        if (this.rootLayer instanceof p) this._visLayerHandler = v.after(this.rootLayer, "setVisibleLayers", j.hitch(this, this._onSetVisibleLayers), true);
                        this._adjustToState();
                        this._loaded = true;
                        this.onLoad()
                    } else this.rootLayer.on("load", j.hitch(this, this._createRootLayerTOC))
                },
                onLoad: function () { },
                _refreshLayer: function () {
                    var a = this.rootLayer,
                        b = this.tocWidget.refreshDelay;
                    if (this._refreshTimer) {
                        window.clearTimeout(this._refreshTimer);
                        this._refreshTimer = null
                    }
                    this._refreshTimer = window.setTimeout(function () {
                        a.setVisibleLayers(a.visibleLayers)
                    }, b)
                },
                _onSetVisibleLayers: function (a, b) {
                    if (!b) {
                        array.forEach(this.rootLayer.layerInfos, function (d) {
                            if (array.indexOf(a, d.id) != -1) d.visible = true;
                            else if (!d._subLayerInfos) d.visible = false
                        });
                        this._adjustToState()
                    }
                },
                _adjustToState: function () {
                    this._rootLayerNode._adjustToState()
                },
                destroy: function () {
                    if (this._visHandler) {
                        this._visHandler.remove();
                        this._visHandler = null
                    }
                    if (this._visLayerHandler) {
                        this._visLayerHandler.remove();
                        this._visLayerHandler = null
                    }
                }
            });
        return declare("agsjs.dijit.TOC", [_Widget, Evented], {
            indentSize: 18,
            swatchSize: [30, 30],
            refreshDelay: 500,
            layerInfos: null,
            constructor: function (a) {
                a = a || {};
                if (!a.map) throw new Error("no map defined in params for TOC");
                this.layerInfos = a.layerInfos;
                j.mixin(this, a)
            },
            postCreate: function () {
                this._createTOC()
            },
            onLoad: function () {
                var i = 0;

                while (i < this._rootLayerTOCs.length) {
                    var childs = this._rootLayerTOCs[i]._rootLayerNode._childTOCNodes,
                        childsTotal = this._rootLayerTOCs[i]._rootLayerNode._childTOCNodes.length,
                        child = this._rootLayerTOCs[i]._rootLayerNode;

                    if (childsTotal <= 1 && this._rootLayerTOCs[i].params.config.legendsEnabled === false) {
                        domConstruct.destroy(child._childTOCNodes[0].domNode);
                        domStyle.set(child.iconNode, {
                            display : 'none'
                        });
                    }
                    i++;
                }
            },
            _createTOC: function () {
                domConstruct.empty(this.domNode);
                this._rootLayerTOCs = [];
                for (var a = 0, b = this.layerInfos.length; a < b; a++) {
                    var d = new D({
                        config: this.layerInfos[a],
                        tocWidget: this
                    });

                    this._rootLayerTOCs.push(d);
                    this._checkLoadHandler = d.on("load", j.hitch(this, "_checkLoad"));

                    d.placeAt(this.domNode);
                    this._checkLoad();
                }

                if (!this._zoomHandler) this._zoomHandler = this.map.on("zoom-end", j.hitch(this, "_adjustToState"))
            },
            _checkLoad: function () {
                var a = true;
                array.every(this._rootLayerTOCs, function (b) {
                    if (!b._loaded){
                        return a = false;
                    } else {
                        return true
                    }
                });
                if (a) {
                    this.onLoad();
                    this.emit("load")
                }
            },
            _adjustToState: function () {
                array.forEach(this._rootLayerTOCs, function (a) {
                    a._adjustToState()
                })
            },
            refresh: function () {
                this._createTOC()
            },
            destroy: function () {
                this._zoomHandler.remove();
                this._zoomHandler = null;
                this._checkLoadHandler.remove();
                this._checkLoadHandler = null
            },
            findTOCNode: function (a, b) {
                var d;
                array.every(this._rootLayerTOCs, function (e) {
                    if (e.rootLayer ==
                        a) {
                        d = e;
                        return false
                    }
                    return true
                });
                if (b !== null && b !== undefined && d.rootLayer instanceof p) return d._rootLayerNode._findTOCNode(b);
                else if (d) return d._rootLayerNode;
                return null
            }
        })
    });