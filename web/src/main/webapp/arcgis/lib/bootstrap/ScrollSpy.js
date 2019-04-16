/* ==========================================================
 * ScrollSpy.js v2.0.0
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
    "./Support",
    "./_BootstrapWidget",
    "dojo/_base/declare",
    "dojo/query",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-attr",
    "dojo/dom-geometry",
    "dojo/NodeList-traverse"
], function (support, _BootstrapWidget, declare, query, on, lang, win, domAttr, domGeom) {
    "use strict";

    // module:
    //      ScrollSpy

    var _offsets, _targets;

    return declare("ScrollSpy", [_BootstrapWidget], {
        // summary:
        //      Bootstrap Widget for automatically updating nav target based on scroll position.
        // description:
        //      This widget will add an active class to .nav elements based on the scroll
        //      position of a target element or the document body.
        //
        //      ## Events ##
        //		Call `widget.on("activate", func)` to monitor when ScrollSpy activates an element.
        //

        // offset: Integer
        //      distance from scroll top which triggers selection of corresponding anchor
        offset: 10,

        // target: String
        //      the navigation controls to activate
        target: "",
        _setTargetAttr: function (val) {
            if (val) {
                this._set("target", val);
            } else {
                this._set("target", support.hrefValue(this.domNode));
            }
            this.target += ' li > a';
        },

        postCreate: function () {
            // summary:
            //      sets the target node used setting the scroll event. Calls the refresh and
            //      process methods.
            // tags:
            //		private
            this.scrollNode = this.domNode.tagName === 'BODY' ? win.global : this.domNode;
            this.own(on(this.scrollNode, 'scroll', lang.hitch(this, 'process')));
            this.refresh();
            this.process();
        },

        process: function () {
            // summary:
            //      sets the active nav element based on the current scroll position.
            var domPos = domGeom.position(this.domNode, false);
            var scrollTop = this.domNode.scrollTop + parseInt(this.offset, 10);
            var scrollHeight = this.domNode.scrollHeight || win.body().scrollHeight;
            //TODO: Test across all browsers
            var domHeight = (this.domNode.tagName === "BODY") ? this.scrollNode.innerHeight : domPos.h;
            var maxScroll = scrollHeight - domHeight;
            var activeTarget = this.activeTarget;
            var i;
            if (scrollTop >= maxScroll) {
                return activeTarget !== (i = _targets[_targets.length - 1]) && this.activate(i);
            }
            for (i = _offsets.length; i--;) {
                if (activeTarget !== _targets[i] && scrollTop >= _offsets[i] && (!_offsets[i + 1] || scrollTop <= _offsets[i + 1])) {
                    this.activate(_targets[i]);
                }
            }
        },

        refresh: function () {
            // summary:
            //      creates an in-memory store of the offsets and targets used when
            //      determining when a nav element (target) should be activated.
            _offsets = [];
            _targets = [];
            var container_offset = domGeom.position(this.domNode, false).y;
            query(this.target).map(function (node) {
                var href = support.getData(node, 'target') || domAttr.get(node, 'href');
                var target = /^#\w/.test(href) && query(href);
                var pos;
                if (target[0]) {
                    pos = domGeom.position(target[0], false);
                }
                return (target && target.length && [ pos.y - container_offset, href ] ) || null;
            })
            .filter(function (item) {
                return item;
            })
            .sort(function (a, b) {
                return a[0] - b[0];
            })
            .forEach(function (item) {
                _offsets.push(item[0]);
                _targets.push(item[1]);
            }, this);
        },

        activate: function (/*HTMLElement*/ element) {
            // summary:
            //      makes a nav element active. Emits an `activate` event and passes
            //      event.relatedTarget for the current scroll item and event.target
            //      for the nav element.
            this.activeTarget = element;
            query(this.target).parent('.active').removeClass('active');
            var selector = this.target + '[data-target="' + element + '"],' + this.target + '[href="' + element + '"]';
            var active = query(selector).parent('li').addClass('active');
            if (active.parent('.dropdown-menu').length) {
                active = active.closest('li.dropdown').addClass('active');
            }
            if(active && active[0]){
                this.emit('activate', lang.mixin(support.eventObject, {relatedTarget: query(element)[0], target: active[0]}));
            }
        }

    });
});