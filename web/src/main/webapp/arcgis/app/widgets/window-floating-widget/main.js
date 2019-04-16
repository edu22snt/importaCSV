/**
 * Created by roger.silva on 12/11/13.
 */
/*global define, console*/
/*jslint nomen:true*/
define([
    "dojo/on",
    "dojo/query",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",

    "dojo/text!template/window-floating-view.html",

    "dojo/dnd/Moveable",

    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (
    on, query, domStyle, domClass, domGeometry, declare, lang, array,
    Template,
    Moveable,
    _WidgetBase, TemplatedMixin
    ) {
    'use strict';

    var titulo,
        conteudo,
        that,
        posX,
        ob_height,
        base,
        d;

    return declare('windowFloating', [_WidgetBase, TemplatedMixin], {

        templateString: Template,

        titleNode: null,

        baseClass: "windowFloating-widget",

        constructor : function (params) {
            titulo = params.title;

            this.titleNode = titulo;
        },

        postCreate : function () {
            that = this;
            posX = domGeometry.position(that.domNode).x;
            ob_height = domGeometry.position(this.containerNode).h;
            base = that.baseClass;
            d = that.domNode;
            this.titleNode.innerHTML = titulo;
            this._initDrag();

        },

        _initDrag : function () {
            console.log(that.domNode.parentNode);
            var move = Moveable(that.domNode, {
                handle : that.titleNode,
                constraints : {
                    l: 0,
                    t: 20,
                    w: 500,
                    h: 500
                }
            });
        },

        _onClick : function (evt) {
            var pai = evt.target.parentNode,
                z = domStyle.get(pai, 'z-index'),
                total = query('.' + base).length;

            posX = domGeometry.position(pai).x;

            array.forEach(query('.' + base), function (element, n) {
                domStyle.set(element, {
                    'z-index' : 100
                });
            });

            if (domStyle.get(pai,'right') !== 'auto') {
                domStyle.set(pai, {
                    left : posX + 'px',
                    right : "auto",
                    'z-index' : (total + 500)
                });
            } else {
                domStyle.set(pai, {
                    right : "auto",
                    'z-index' : (total + 500)
                });
            }


        },

        _minimize : function (evt) {

            if (domClass.contains(this.btnMinimize, 'fa-minus')) {
                domClass.remove(this.btnMinimize, 'fa-minus');
                domClass.add(this.btnMinimize, 'fa-plus');
                domClass.add(this.domNode, 'minimize');
                domStyle.set(this.containerNode, {
                    height : '0px',
                    padding : '0px 10px',
                    overflow : 'hidden'
                });
            } else {
                domClass.add(this.btnMinimize, 'fa-minus');
                domClass.remove(this.domNode, 'minimize');
                domClass.remove(this.btnMinimize, 'fa-plus');
                domStyle.set(this.containerNode, {
                    height : 'auto',
                    padding : '10px',
                    overflow : 'auto'
                });
            }
        }

    });
});