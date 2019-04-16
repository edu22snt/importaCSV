/* ==========================================================
 * PopOver.js v2.0.0
 * ==========================================================
 * Copyright 2012 xsokev
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

define([
    "./_PopupBase",
    "dojo/_base/declare",
    "dojo/query",
    "dojo/dom-class"
], function (PopupBase, declare, query, domClass) {
    "use strict";

    // module:
    //      Popover

    return declare("Popover", [PopupBase], {
        // summary:
        //      Displays iPad-like overlays of content.
        //
        // example:
        // |	<div data-dojo-type="Popover" data-dojo-props="title:'My Popover'">
        // |        <p>Body...</p>
        // |	</div>

        // template: String
        //      template used to construct the popover
        template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>',

        // placement: String|Function
        //      where the popover should be displayed. Values are top, bottom, left, right
        placement: "right",

        // trigger: String
        //      what event causes the popover to be displayed
        trigger: "click",

        // type: String
        //      what type of popover style widget to display
        type: "popover",

        // title: String|Function
        //      content for the popover
        title: "",
        _setTitleAttr: function(val){
            this._set("title", (typeof val === 'function' ? val.call(this) : val));
        },

        // content: String|Function
        //      content for the popover
        content: "",
        _setContentAttr: function(val){
            this._set("content", (typeof val === 'function' ? val.call(this) : val));
        },

        _resetContent: function(){
            // summary:
            //      reset the popup content for the Popover widget. The Popover title and content
            //      is also set. This method should not be overridden.
            // tags:
            //      protected extension

            var popup = this._popup.call(this);
            query('.popover-title', popup)[0].innerHTML = this.title;
            query('.popover-content', popup)[0].innerHTML = this.content;
            domClass.remove(popup, 'fade in top bottom left right');
        }
    });
});
