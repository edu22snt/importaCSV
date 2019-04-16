/*global define*/
/*jslint nomen : true*/

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom",
    "dojox/fx/style",
    "dojo/text!template/full-screen.html",
    "dojo/on",
    "dojo/mouse",
    "app/app-helper",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Tooltip",
    "dojo/domReady!"], function (
    Declare,
    domConstruct,
    win,
    style,
    domGeometry,
    dom,
    fxStyle,
    View,
    on,
    mouse,
    appHelper,
    _WidgetBase,
    _TemplatedMixin,
    Tooltip
) {
    "use strict";

    return new Declare("fullScreen", [_WidgetBase, _TemplatedMixin], {

        templateString : View,

        btnFullScreen : null,

        /**
         * metodo para inicialização do widget
         * @param data
         */
        init: function (data) {

            /**
             * variaveis utilizadas durante a inicialização do widget:
             * map: objeto mapa
             * container: container do aplicativo
             * cont: flag utilizado para alternar o fullscreen
             * containerMap: container do mapa
             * @type {a|*}
             */
            var btn_fullscreen = this.btnFullScreen,
                map = appHelper.getMap(),
                container = appHelper.getAppContainer(),
                cont = 0,
                containerMap = appHelper.getDivContainer(),
                h_containerDiv = domGeometry.position(container.id).h;

            ///----------------------------------------------------------------------------------------------------------
            // Listeners
            //----------------------------------------------------------------------------------------------------------

            /**
             * Ouvinte para redimensionar o mapa no clique do botão fullscreen
             */
            on(btn_fullscreen, mouse.enter, function (evt) {
                Tooltip.show('Full Screen', btn_fullscreen);
            });
            on(btn_fullscreen, mouse.leave, function (evt) {
                Tooltip.hide(btn_fullscreen);
            });
            on(btn_fullscreen, "click", function (evt) {
                Tooltip.hide(btn_fullscreen);
                style.set('dijit__MasterTooltip_0', 'display', 'none');
            });

            on(btn_fullscreen, "click", function (evt) {
                /**
                 * flag para verificar se o mapa está em fullscreen
                 */
                if (cont === 0) {
                    style.set(container.id, 'position', 'absolute');
                    style.set(container.id, 'top', '0');
                    style.set(container.id, 'left', '0');
                    style.set(container.id, 'z-index', '1000');
                    style.set(win.body(), 'overflow', 'hidden');
                    domConstruct.place(container.id, win.body());
                    map.reposition();
                    map.resize();
                    cont = 1;
                } else {
                    //dom.byId("img_fullscreen").src = "images/full.png";
                    style.set(container.id, 'position', 'relative');
                    style.set(win.body(), 'overflow', 'auto');
                    style.set(containerMap.id, 'height', h_containerDiv + 'px');
                    domConstruct.place(container.id, containerMap.id);
                    map.reposition();
                    map.resize();
                    cont = 0;
                }
                /**
                 * alterna o CSS para o mapa e o seu container ficarem fullscreen
                 */
                fxStyle.toggleClass("mapContainer", "classFull").play();
                fxStyle.toggleClass(container.id, "classFull").play();


            });

            /**
             * Ouvinte para quando for pressionada a tecla ESC voltar o mapa para o tamanho padrão (default)
             */
            on(win.body(), "keyup", function (key) {
                if (key.keyCode === 27 && cont === 1) {
                    style.set(container.id, 'position', 'relative');
                    domConstruct.place(container.id, containerMap.id);
                    map.reposition();
                    map.resize();
                    cont = 0;

                    fxStyle.toggleClass("mapContainer", "classFull").play();
                    fxStyle.toggleClass(container.id, "classFull").play();
                }
            });


            /**
             * Ouvinte executado quando o mapa é redimensionado
             */
            on(map, "resize", function () {
                map.resize();
                map.reposition();
            });
        }

    });
});