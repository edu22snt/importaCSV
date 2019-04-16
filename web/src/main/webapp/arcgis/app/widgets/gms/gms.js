/**
 * Created by irian.villalba on 17/10/13.
 */

define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/text!template/gms.html",
    "dojo/store/Memory",
    "dojo/parser",
    "dojo/Evented",
    "dijit/registry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/form/Select",
    "dijit/form/TextBox"
], function (
    declare,
    dom,
    on,
    lang,
    domStyle,
    domConstruct,
    view,
    Memory,
    parser,
    Evented,
    registry,
    WidgetBase,
    TemplatedMixin,
    Select,
    TextBox
) {
    "use strict";

    var
        localeDegreeLimit,
        GMS = declare([WidgetBase, TemplatedMixin, Evented], {

            templateString: view,

            ///----------------------------------------------------------------------------------------------------------
            // Components from template
            //----------------------------------------------------------------------------------------------------------

            degree: null,
            minute: null,
            second: null,
            cardinalPoint: null,
            locale: "",
            localeDegreeLimit: null,

            ///----------------------------------------------------------------------------------------------------------
            // Override methods
            //----------------------------------------------------------------------------------------------------------

            /**
             * @private
             */
            postCreate : function () {
                var degreeContainer = this.degree,
                    minuteContainer = this.minute,
                    secondContainer = this.second,
                    cardinalPointContainer = this.cardinalPoint;

                this.degree = new TextBox();
                this.minute = new TextBox();
                this.second = new TextBox();
                this.cardinalPoint = new Select();

                this.updateLocaleDegree(this.locale);

                this.degree.placeAt(degreeContainer);
                this.minute.placeAt(minuteContainer);
                this.second.placeAt(secondContainer);
                this.cardinalPoint.placeAt(cardinalPointContainer);

                domStyle.set(this.degree.domNode, 'width', "30px");
                domStyle.set(this.minute.domNode, 'width', "30px");
                domStyle.set(this.second.domNode, 'width', "30px");
                domStyle.set(this.cardinalPoint.containerNode, 'width', "20px");

                this.own(on(this.degree, 'keyup', lang.hitch(this, this.onKeyUp)));
                this.own(on(this.minute, 'keyup', lang.hitch(this, this.onKeyUp)));
                this.own(on(this.second, 'keyup', lang.hitch(this, this.onKeyUp)));

                this.own(on(this.cardinalPoint, 'change', lang.hitch(this, this.onChangeSelect)));
            },

            ///----------------------------------------------------------------------------------------------------------
            // Public methods
            //----------------------------------------------------------------------------------------------------------

            setLocale: function (locale) {
                this.locale = locale;
            },

            getLocale: function () {
                return this.locale;
            },

            /**
             * Valida se os campos foram preenchidos.
             *
             * @public
             * @return Boolean
             */
            validate : function () {
                return this.getDegree() && this.getMinutes() && this.getSeconds() && this.cardinalPoint.get('value').length;
            },

            getDegree : function () {
                return parseInt(this.degree.get("value"), 10);
            },

            getMinutes : function () {
                return parseInt(this.minute.get('value'), 10);
            },

            getSeconds : function () {
                return parseInt(this.second.get('value'), 10);
            },

            getIsNegative : function () {
                return ['S', 'W'].indexOf(this.cardinalPoint.get('value')) !== -1;

            },

            updateLocaleDegree: function (locale) {
                var data;
                if (locale === "longitude") {
                    this.localeDegreeLimit = 180;
                    data = [
                        {label: "--", value: ""},
                        {label: "E", value: "E"},
                        {label: "W", value: "W"}
                    ];
                } else if (locale === "latitude") {
                    this.localeDegreeLimit = 90;
                    data = [
                        {label: "--", value: ""},
                        {label: "N", value: "N"},
                        {label: "S", value: "S"}
                    ];
                }

                this.cardinalPoint.set('options', data);
                this.cardinalPoint.reset();
            },

            setEnterTab: function (key, component, inputValue, length) {
                if (key === 13 || inputValue.length === length) {
                    component.focus();
                }
            },

            setLimit: function (component, value, max, min) {
                var intValue = parseInt(value, 10);
                if (isNaN(intValue)) {
                    component.value = '';
                } else if (String(value).length) {
                    if (value > max || value < min) {
                        component.value = max;
                    }
                    if (value < min) {
                        component.value = min;
                    }
                }
            },

            emitChangedEvent : function () {
                this.emit(GMS.CHANGED_EVENT, {});
            },

            ///----------------------------------------------------------------------------------------------------------
            // Listeners
            //----------------------------------------------------------------------------------------------------------

            onKeyUp: function (event) {
                console.log(this.locale);
                switch (event.target.id) {
                case this.degree.id:

                    //this.updateLocaleDegree(this.locale);
                    this.setLimit(event.target, event.target.value, this.localeDegreeLimit, 0);
                    this.setEnterTab(event.keyCode, this.minute, event.target.value, String(this.localeDegreeLimit).length);
                    break;
                case this.minute.id:
                    this.setLimit(event.target, event.target.value, 60, 0);
                    this.setEnterTab(event.keyCode, this.second, event.target.value, 2);
                    break;
                case this.second.id:
                    this.setLimit(event.target, event.target.value, 60, 0);
                    this.setEnterTab(event.keyCode, this.cardinalPoint, event.target.value, 2);
                    break;
                }

                this.emitChangedEvent();
            },

            onChangeSelect : function (event) {
                this.emitChangedEvent();
            }
        });

    /**
     * Tipo de evento disparado quando o usuário concluir o preenchimento do componente.
     *
     * @static
     * @type {string}
     */
    GMS.CHANGED_EVENT = 'completedEvent';

    return GMS;

});