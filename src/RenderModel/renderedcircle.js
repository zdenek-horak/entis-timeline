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
     * Rendered Circle Model
     */
    var RenderedCircle = /** @class */ (function (_super) {
        __extends(RenderedCircle, _super);
        /**
         * Create new circle representation
         * @param lineWidth border line width (might use HTML/SVG units for now)
         * @param lineColor border line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param center circle center
         * @param radius circle radius
         * @param element related timeline model element (usually event, optional)
         */
        function RenderedCircle(lineWidth, lineColor, fillColor, center, radius, element) {
            var _this = _super.call(this, element) || this;
            _this.Center = center;
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            _this.Radius = radius;
            return _this;
        }
        /**
         * Move element vertically
         * @param amount amount of movement
         */
        RenderedCircle.prototype.moveVertically = function (amount) {
            this.Center.PosY += amount;
        };
        return RenderedCircle;
    }(renderedelement_1.RenderedElement));
    exports.RenderedCircle = RenderedCircle;
});
