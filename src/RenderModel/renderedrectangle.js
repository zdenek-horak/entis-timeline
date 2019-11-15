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
     * Rendered Rectangle Representation */
    var RenderedRectangle = /** @class */ (function (_super) {
        __extends(RenderedRectangle, _super);
        /**
         * Create new rendered rectangle representation
         * @param lineWidth border line width (textual representation using any HTML/SVG units)
         * @param lineColor border line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param posX left offset
         * @param posY top offset
         * @param width rectangle width
         * @param height rectangle height
         * @param rx corner horizontal radius
         * @param ry corner vertical radius
         * @param element related timeline element model (optional)
         */
        function RenderedRectangle(lineWidth, lineColor, fillColor, posX, posY, width, height, rx, ry, element) {
            var _this = _super.call(this, element) || this;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.RX = rx;
            _this.RY = ry;
            _this.Width = width;
            _this.Height = height;
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedRectangle.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedRectangle;
    }(renderedelement_1.RenderedElement));
    exports.RenderedRectangle = RenderedRectangle;
});
