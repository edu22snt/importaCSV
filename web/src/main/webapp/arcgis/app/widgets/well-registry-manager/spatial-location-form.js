/**
 * Created by Isac Cajá on 18/10/13.
 */
/*global define, console*/
/*jslint nomen : true*/


define([
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/store/Memory',
    'dojo/data/ObjectStore',
    'dojo/Evented',

    'app/app-helper',

    "esri/geometry/Geometry",

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/text!template/spatial-location-form.html',
    'app/widgets/gms/gms',

    "proj4js/lib/defsProj4js",

    'dijit/form/RadioButton',
    'dijit/form/Select',
    'dijit/form/TextBox'
], function (on, lang, declare, domConstruct, domStyle, domClass, Memory, ObjectStore, Evented,
             AppHelper,
             Geometry,
             WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             template, GMS) {
    "use strict";
    /**
     * Cria Formulário com campos para informar a localização geográfica de um ponto.
     * @class Representa um fomulário.
     */
    var SpatialLocationForm,
        that,
        DMS_FORMAT = 'gmsFormat',
        DEGREE_FORMAT = 'degreeFormat';
    /**
     * Converte a notação de grau-minuto-segundo (GMS/DMS) para grau-decimal.
     *
     * @private
     * @param {Number} degree Valor referente a grau da notação grau-minuto-segundo
     * @param {Number} minutes Valor referente a minuto da notação grau-minuto-segundo
     * @param {Number} seconds Valor referente a segundo da notação grau-minuto-segundo
     * @return Number valor em grau decimal
     */
    function toDegreeFromDMS(degree, minutes, seconds, isNegative) {
        return (degree + (minutes / 60) + (seconds / 3600)) * (isNegative ? -1 : 1);
    }

    SpatialLocationForm = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        /**
         * Classe CSS base do componente
         *
         * @private
         */
        BASE_CLASS : 'well-registry',

        /**
         * Identificador base dos elementos/componentes do template
         * @private
         */
        ID_BASE : 'wellRegistry',

        /**
         * largura padrão do template
         * @private
         */
        width : '220px',

        ///----------------------------------------------------------------------------------------------------------
        // Components from template
        //----------------------------------------------------------------------------------------------------------

        /**
         * Opção radio button para sistema de coordenadas geográfica.
         *
         * @protected
         * @type dijit.form.RadioButton
         */
        geographicCoordSystemRadioButton : null,

        /**
         * Opção radio button para sistema de coordenadas projetada.
         *
         * @protected
         * @type dijit.form.RadioButton
         */
        projectedCoordSystemRadioButton : null,

        /**
         * Opção Combobox para selecionar o sistema de projeção.
         *
         * @protected
         * @type dijit.form.Select
         */
        projectionSystemSelect : null,

        /**
         * Opção radio button para definir o formato de entrada das coordenadas em grau (degree).
         *
         * @protected
         * @type dijit.form.RadioButton
         */
        degreeFormatRadioButton : null,

        /**
         * Opção radio button para definir o formato de entrada das coordenadas em grau-minuto-segundo (GMS).
         *
         * @protected
         * @type dijit.form.RadioButton
         */
        dmsFormatRadioButton : null,

        /**
         * Campo de entrada da coordenda latitude no formato grau-minuto-segundo.
         *
         * @protected
         * @type widgets.gms.gms
         */
        latitudeDMSInput : null,

        /**
         * Campo de entrada da coordenada longitude no formato grau-minuto-segundo.
         *
         * @protected
         * @type widgets.gms.gms
         */
        longitudeDMSInput : null,

        /**
         * Campo de entrada da coordenda latitude no formato Grau-decimal.
         *
         * @protected
         * @type dijit.form.TextBox
         */
        latitudeTextBox : null,

        /**
         * Campo de entrada da coordenada longitude no formato Grau-decimal.
         *
         * @protected
         * @type dijit.form.TextBox
         */
        longitudeTextBox : null,

        lastCoordinateFormat : null,

        lastCoordinateSystem : null,

        lastProjectionSystem : null,

        nodeLocateButton : null,

        locateButton : null,

        //----------------------------------------------------------------------------------------------------------
        // Private properties
        //----------------------------------------------------------------------------------------------------------

        /**
         * Opções de DATUMs para cordenadas projetadas
         *
         * @private
         * @type Array
         */
        projectedSystemOptions : null,

        /**
         * Opções de DATUMs para coordenadas geográficas
         *
         * @private
         * @type Array
         */
        geographicSystemOptions : null,

        /**
         * Template da aplicação.
         *
         * @protected
         */
        templateString : template,

        coordinateFormatChangedFlag : false,
        coordinateSystemChangedFlag : false,
        projectionSystemChangedFlag : false,

        //----------------------------------------------------------------------------------------------------------
        // Override methods
        //----------------------------------------------------------------------------------------------------------

        /**
         * @private
         */
        postCreate : function () {
            that = this;
            this.own(on(this.latitudeDMSInput, GMS.CHANGED_EVENT, lang.hitch(this, this.onChangeCoordinateDMSInput)));
            this.own(on(this.longitudeDMSInput, GMS.CHANGED_EVENT, lang.hitch(this, this.onChangeCoordinateDMSInput)));

            //Força atualização do estado do template
            this.coordinateFormatChangedFlag = true;

            this.validateTemplate(false);
        },

        //----------------------------------------------------------------------------------------------------------
        // Public methods
        //----------------------------------------------------------------------------------------------------------

        /**
         * Define as opções que serão apresentadas no campo de Sistema de Projeções.
         *
         * @public
         * @param {Objct} projection Objeto contendo as seguintes propriedades:
         * <ul>
         *  <li><code>geographic</code>: <code>Array</code> com instãncias de <code>Object</code> contendo as propriedades
         *  <code>label</code> e <code>value</code> para descrever os DATUMs para coordenadas geográficas,</li>
         *  <li><code>projected</code>: <code>Array</code> com instãncias de <code>Object</code> contendo as propriedades
         *  <code>label</code> e <code>value</code> para descrever os DATUMs para coordenadas projetadas.</li>
         * </ul>
         */
        setProjectionSystems : function (projections) {
            this.geographicSystemOptions = projections.geographic;
            this.projectedSystemOptions = projections.projected;

            // Força a atualização das opções no projectionSystemSelect
            this.coordinateSystemChangedFlag = true;
            this.coordinateFormatChangedFlag = true;
            this.validateTemplate(false);
        },

        /**
         * Método que habilita ou desabilita preencher o formulário quando clicar no mapa
         *
         * @param value {Boolean}
         */
        showCoordinatesOnClick : function (value) {
            if (value) {
                AppHelper.getMap().on("click", this.onMapClick);
            }
        },

        showLocateButton : function (value) {
            if (value === false) {
                domStyle.set(this.nodeLocateButton, 'display', 'none');
            }
        },

        /**
         * Preenche o formulário com os valores setados no arquivo de configurações
         *
         * @param values
         */
        setDefaultValuesForm : function (values) {
            /**
             * Selecionando o radio button das coordenadas DD / DMS
             */
            if (values.coordinates === "dms") {
                this.dmsFormatRadioButton.set('checked', true);
            } else if (values.coordinates === "degree") {
                this.degreeFormatRadioButton.set('checked', true);
            }

            /**
             * Adicionando os valores nos inputs Lat/Long
             */
            this.latitudeTextBox.set('value', values.degreeLat);
            this.longitudeTextBox.set('value', values.degreeLong);

            /**
             * Adicionando os valores nos inputs DMS latitude
             */
            this.latitudeDMSInput.degree.set('value', values.dmsLatDegree);
            this.latitudeDMSInput.minute.set('value', values.dmsLatMinute);
            this.latitudeDMSInput.second.set('value', values.dmsLatSecond);
            this.latitudeDMSInput.cardinalPoint.set('value', values.dmsLatCardinalPoint);

            /**
             * Adicionando os valores nos inputs DMS longitude
             */
            this.longitudeDMSInput.degree.set('value', values.dmsLongDegree);
            this.longitudeDMSInput.minute.set('value', values.dmsLongMinute);
            this.longitudeDMSInput.second.set('value', values.dmsLongSecond);
            this.longitudeDMSInput.cardinalPoint.set('value', values.dmsLongCardinalPoint);

            /**
             * Selecionando o radio button do sistema de coordenadas
             */
            if (values.coordinateSystem === "geographic") {
                this.geographicCoordSystemRadioButton.set('checked', true);
            } else if (values.coordinateSystem === "projected") {
                this.projectedCoordSystemRadioButton.set('checked', true);
            }

            /**
             * Setando valor para o sistema de projeção
             */
            if (values.projectionSystem !== "") {
                this.projectionSystemSelect.set('value', values.projectionSystem);
            }
        },

        /**
         * Carrega a localização geográfica preenchendo os campos no formulário.
         *
         * @param {esri.geometry.Point} location
         */
        loadCoordinates : function (location) {
            this.latitudeTextBox.set('value', location.y);
            this.longitudeTextBox.set('value', location.x);
            
            
        },

        /**
         * Define a projeção a ser utilizada no formulário.
         *
         * @public
         * @param {Object} opção a ser selecionada
         */
        setSelectedProjectionSystem : function (option) {
            this.projectionSystemSelect.set('value', option);
            this.projectionSystemSelect.reset();
        },

        /**
         * Retorna o WKID do sistema de projeção selecionado pelo usuário.
         *
         * @public
         * @return String
         */
        getSelectedProjectionSystem : function () {
            return this.projectionSystemSelect.get('value');
        },

        /**
         * Notação selecionada para informar as coordenadas.
         *
         * @public
         * @return String
         */
        getSelectedCoordinateFormat : function () {
            var degreeIsChecked = this.degreeFormatRadioButton.get('checked'),
                degreeValue = this.degreeFormatRadioButton.get('value'),
                dmsValue  = this.dmsFormatRadioButton.get('value');

            return degreeIsChecked ? degreeValue : dmsValue;
        },

        /**
         * Sistema de coordenadas selecionada
         *
         * @public
         * @return String
         */
        getSelectedCoordinateSystem : function () {
            var geographicIsChecked = this.geographicCoordSystemRadioButton.get('checked'),
                geographicValue = this.geographicCoordSystemRadioButton.get('value'),
                projectedValue = this.projectedCoordSystemRadioButton.get('value');

            return geographicIsChecked ? geographicValue : projectedValue;
        },

        /**
         * Verifica se o preenchimento do fomulário foi concluído e é válido.
         *
         * @public
         * @return Boolean
         */
        validateForm : function () {
            var result = true;
            if (this.dmsFormatRadioButton.get('checked')) {
                if (!this.latitudeDMSInput.validate()) {
                    result = false;
                } else if (!this.longitudeDMSInput.validate()) {
                    result = false;
                }
            } else if (!this.latitudeTextBox.get('value') || !this.longitudeTextBox.get('value')) {
                result = false;
            }

            return result;
        },

        /**
         * Retorna a coordenda latitude (y) em notação grau-decimal conforme definida no formulário.
         *
         * @public
         * @return Number
         */
        getLatitude : function () {
            var latitude,
                latitudeDMS = this.latitudeDMSInput;

            if (this.degreeFormatRadioButton.get('checked')) {
                latitude = this.latitudeTextBox.get('value').replace(',', '.');
            } else {
                latitude = toDegreeFromDMS(latitudeDMS.getDegree(), latitudeDMS.getMinutes(), latitudeDMS.getSeconds(), latitudeDMS.getIsNegative());
            }

            return parseFloat(latitude);
        },

        /**
         * Retorna a coordenada longitude (x) em notação grau-decimaldefinida no formulário.
         *
         * @public
         * @return number
         */
        getLongitude : function () {
            var longitude,
                longitudeDMS = this.longitudeDMSInput;

            if (this.degreeFormatRadioButton.get('checked')) {
                longitude = this.longitudeTextBox.get('value').replace(',', '.');
            } else {
                longitude = toDegreeFromDMS(longitudeDMS.getDegree(), longitudeDMS.getMinutes(), longitudeDMS.getSeconds(), longitudeDMS.getIsNegative());
            }

            return parseFloat(longitude);
        },

        //----------------------------------------------------------------------------------------------------------
        // Private methods
        //----------------------------------------------------------------------------------------------------------

        /**
         * Dispara o evento informando que o formulário foi alterado
         *
         * @private
         * @emits SpatialLocationForm.FORM_CHANGED_EVENT
         * @param {String} propertyName Nome da propriedade do widget que foi modificado.
         * @param {Function} callback
         */
        emitFormChangedEvent : function (propertyName, value, callback) {
            var event = {
                propertyName : propertyName,
                value : value
            };
            this.emit(SpatialLocationForm.FORM_CHANGED_EVENT, event, callback);
        },

        /**
         * Dispara o evento informando que o formulário foi preenchido e validado por completo
         *
         * @private
         * @emits SpatialLocationForm.FORM_COMPLETED_EVENT
         * @param {Function} callback
         */
        emitFormCompletedEvent : function (callback) {
            this.emit(SpatialLocationForm.FORM_COMPLETED_EVENT, {bubbles: true, cancelable: true}, callback);
        },

        /**
         * Valida a apresentação dos elementos do template aplicando regras de negócio e regras visuais.
         *
         * @private
         * @param {Boolean} animation Efetuar Atualização com animação
         */
        validateTemplate : function (animation) {

            if (this.coordinateSystemChangedFlag) {
                if (this.geographicCoordSystemRadioButton.get('checked')) {
                    this.projectionSystemSelect.set('options', this.geographicSystemOptions);
                } else {
                    this.projectionSystemSelect.set('options', this.projectedSystemOptions);
                }

                if (this.projectedCoordSystemRadioButton.get('checked')) {

                    domClass.add(this.domNode, this.projectedCoordSystemRadioButton.get('value'));

                    if (this.dmsFormatRadioButton.get('checked')) {
                        this.degreeFormatRadioButton.set('checked', true);
                        this.coordinateFormatChangedFlag = true;
                    }
                } else {
                    domClass.remove(this.domNode, this.lastCoordinateSystem);
                }

                this.lastCoordinateSystem = this.getSelectedCoordinateSystem();
                this.projectionSystemSelect.reset();
                this.coordinateSystemChangedFlag = false;
            }
            if (this.coordinateFormatChangedFlag) {
                domClass.remove(this.domNode, this.lastCoordinateFormat);
                domClass.add(this.domNode, this.getSelectedCoordinateFormat());

                this.lastCoordinateFormat = this.getSelectedCoordinateFormat();
                this.coordinateFormatChangedFlag = false;
            }
        },

        //----------------------------------------------------------------------------------------------------------
        // Listeners
        //----------------------------------------------------------------------------------------------------------

        /**
         * Função ouvinte do evento ao modificar o sistema de coordenadas.
         *
         * @private
         * @param {*} value Valor definido no elemento
         */
        onChangeCoordSystemRadioButtons : function (value) {
            if (this.lastCoordinateSystem !== this.getSelectedCoordinateSystem()) {
                this.coordinateSystemChangedFlag = true;
                this.emitFormChangedEvent();
                this.validateTemplate();
            }
        },

        /**
         * Função ouvinte do evento disparado ao modificar o sistema de projeção.
         *
         * @private
         * @param event Valor definido no elemento
         */
        onChangeProjectionSystemSelect : function (value) {
            this.emitFormChangedEvent();
        },

        /**
         * Função ouvinte do evento de alteração do valor de cada RadioButton que define a notação
         * para definição das coordenadas
         *
         * @private
         * @param value Valor definido no elemento
         */
        onChangeCoordFormatRadioButton : function (value) {
            if (this.lastCoordinateFormat !== this.getSelectedCoordinateFormat()) {
                this.coordinateFormatChangedFlag = true;
                this.emitFormChangedEvent();
                this.validateTemplate();
            }
        },

        /**
         * Função
         *
         * @private
         * @param value Valor atribuído ao campo
         */
        onChangeCoordinateDMSInput : function (value) {
            this.emitFormChangedEvent();

            if (this.validateForm()) {
                this.emitFormCompletedEvent();
            }
        },

        /**
         * Ouvinte do evento ao clicar no mapa e adicionar os valores no inputs
         * @param evt
         */
        onMapClick : function (evt) {
            var finalPoint,
                latDms,
                longDms,
                src,
                dst,
                point,
                defs;

            defs = "EPSG:" + that.projectionSystemSelect.get('value');
            Proj4js.defs["EPSG:4225"] = "+proj=longlat +a=6378388 +rf=297.00 +towgs84=-205.57,168.77,-4.12";
            Proj4js.defs["EPSG:4674"] = "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
            Proj4js.defs["EPSG:4326"] = "+proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees";
            Proj4js.defs["EPSG:5527"] = "+proj=longlat +a=6378160 +rf=298.25 +towgs84=-66.87,4.37,-38.52";
            //Proj4js.defs["EPSG:31983"] = "+title=SIRGAS 2000 +proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
            //Define the source Coord Sys
            src = new Proj4js.Proj("EPSG:" + AppHelper.getMap().spatialReference.wkid);
            //Define the destination Coord Sys
            dst = new Proj4js.Proj(defs);

            if (/\+proj=merc/.test(src.defData)) {
                point = new Proj4js.Point(evt.mapPoint.x, evt.mapPoint.y);
            } else {
                point = new Proj4js.Point(evt.mapPoint.getLongitude(), evt.mapPoint.getLatitude());
            }

            finalPoint = Proj4js.transform(src, dst, point);
            /**
             * Adicionando os valores nos inputs de Grau-decimal
             */
            that.latitudeTextBox.set('value', finalPoint.y);
            that.longitudeTextBox.set('value', finalPoint.x);

            /**
             * Função para converter Grau-decimal para Grau/minuto/segundo
             * @param dd
             * @param type
             * @returns {{d: number, m: Number, s: number, cardinalPoint: *}}
             */
            function dd2dms(dd, type) {
                var d,
                    nFract,
                    m,
                    s,
                    cardinalPoint,
                    dms;
                d = parseInt(dd, 10);
                nFract = Math.abs(dd - d);
                m = parseInt(nFract * 60, 10);
                s = Math.round(nFract * 3600 - m * 60);

                if (type === "lat") {
                    cardinalPoint = (dd > 0) ? 'N' : 'S';
                } else if (type === "long") {
                    cardinalPoint = (dd > 0) ? 'E' : 'W';
                }

                dms = {
                    "d" : Math.abs(d),
                    "m" : m,
                    "s" : s,
                    "cardinalPoint" : cardinalPoint
                };
                return dms;
            }

            /**
             * Pegando os objetos convertidos em DMS (Degree / Minute / Second)
             * @type Object
             */
            latDms  = dd2dms(finalPoint.y, "lat");
            longDms = dd2dms(finalPoint.x, "long");

            /**
             * Adicionando os valores nos inputs DMS latitude
             */
            that.latitudeDMSInput.degree.set('value', latDms.d);
            that.latitudeDMSInput.minute.set('value', latDms.m);
            that.latitudeDMSInput.second.set('value', latDms.s);
            that.latitudeDMSInput.cardinalPoint.set('value', latDms.cardinalPoint);

            /**
             * Adicionando os valores nos inputs DMS longitude
             */
            that.longitudeDMSInput.degree.set('value', longDms.d);
            that.longitudeDMSInput.minute.set('value', longDms.m);
            that.longitudeDMSInput.second.set('value', longDms.s);
            that.longitudeDMSInput.cardinalPoint.set('value', longDms.cardinalPoint);
        }

    });

    /**
     * Tipo de evento que indica a modificação do formulário.
     *
     * @static
     * @type {string}
     */
    SpatialLocationForm.FORM_CHANGED_EVENT = 'formChangedEvent';

    /**
     * Tipo de evento que indica que o usuário preencheu corretamente o formulário.
     *
     * @static
     * @type {string}
     */
    SpatialLocationForm.FORM_COMPLETED_EVENT = 'formCompletedEvent';

    /**
     * Diparado quando o usuário alterar algum dado do formulário.
     *
     * @event SpatialLocationForm#formChanged
     * @type {object} Informações do evento
     * @property {string} name Nome da propriedade
     * @property {*} valor definido
     */

    return SpatialLocationForm;
});