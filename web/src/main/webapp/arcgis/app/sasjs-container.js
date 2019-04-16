/**
 * Created by Isac Cajá on 17/10/13.
 */
"use strict";

define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin'
], function (declare, WidgetBase, TemplatedMixin) {

    var widgets = [],

        /**
         * Container da aplicação.
         * @type {*}
         */
        SASContainer = declare([WidgetBase, TemplatedMixin], {

            baseClass : 'sas-container',

            /**
             * Template do container da aplicação
             */
            templateString :
                '<div class="${baseClass}"data-dojo-attach-point="containerNode">' +
                '   <div id="mapContainer" class="${baseClass}-map" data-dojo-attach-point="mapContainer"></div>' +
                '</div>',

            /**
             * Container para inserção do mapa da aplicação.
             */
            mapContainer : null,

            /**
             * Container da aplicação
             */
            containerNode : null,

            /**
             * Adiciona um widget
             * @param {dijit._WidgetBase} widget
             */
            addWidget :  function (widget) {
                widgets.push(widget);
                widget.placeAt(this.containerNode);
            },

            /**
             * Remove o widget.
             * <p>Retorna <code>true</code> se o widget for encontrado e removido, senão retorna <code>false</code></p>
             * @param {dijit._WidgetBase} widget
             * @returns {boolean}
             */
            removeWidget : function (widget) {
                var currentWidget,
                    found = false,
                    index = widgets.length - 1;

                while (index >= 0) {
                    currentWidget = widgets[index];

                    if (currentWidget === widget) {
                        found = true;
                        break;
                    }
                    index--;
                }

                if (found) {
                    widgets.splice(index, 1);
                    this.containerNode.removeChild(widget);
                }

                return found;
            }
        });

    return SASContainer;
});