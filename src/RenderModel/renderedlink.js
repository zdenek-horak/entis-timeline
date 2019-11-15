var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./renderedelement"], function (require, exports, renderedelement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Link Representation
     */
    var RenderedLink = /** @class */ (function (_super) {
        __extends(RenderedLink, _super);
        /**
         * Create new rendered link representation
         * @param link link url
         * @param target link target (eg. _blank, optional)
         * @param tooltip link tooltip (optional)
         * @param childrenElements link children (usualy RenderedText instances)
         * @param element related timeline element model (optional)
         */
        function RenderedLink(link, target, tooltip, childrenElements, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Link tooltip (optional)
             */
            _this.Tooltip = null;
            /**
             * Link target (eg. _blank, optional)
             */
            _this.Target = null;
            _this.Children = childrenElements;
            _this.Link = link;
            _this.Tooltip = tooltip;
            _this.Target = target;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedLink.prototype.moveVertically = function (amount) {
            for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.moveVertically(amount);
            }
        };
        return RenderedLink;
    }(renderedelement_1.RenderedElement));
    exports.RenderedLink = RenderedLink;
});
