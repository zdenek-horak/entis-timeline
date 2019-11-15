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
     * Rendered Line Model
     */
    var RenderedLine = /** @class */ (function (_super) {
        __extends(RenderedLine, _super);
        /**
         * Create new line representation
         * @param lineWidth line width (textual representation using any HTML/SVG units)
         * @param lineColor line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param element related timeline element model (optional)
         */
        function RenderedLine(lineWidth, lineColor, fillColor, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Line stroke cap (eg. round)
             */
            _this.StrokeCap = null;
            _this.Points = [];
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            return _this;
        }
        /**
         * Move element vertically (for adjusting position during cuts, etc.)
         * @param amount amount of movement
         */
        RenderedLine.prototype.moveVertically = function (amount) {
            for (var _i = 0, _a = this.Points; _i < _a.length; _i++) {
                var point = _a[_i];
                point.PosY += amount;
            }
        };
        return RenderedLine;
    }(renderedelement_1.RenderedElement));
    exports.RenderedLine = RenderedLine;
});
