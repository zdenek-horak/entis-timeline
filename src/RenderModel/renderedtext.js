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
     * Text Align Enum
     */
    var TextAlign;
    (function (TextAlign) {
        /**
         * Align to start (left/top)
         */
        TextAlign[TextAlign["Start"] = 0] = "Start";
        /**
         * Align to center
         */
        TextAlign[TextAlign["Middle"] = 1] = "Middle";
        /**
         * Align to end (right/bottom
         */
        TextAlign[TextAlign["End"] = 2] = "End";
    })(TextAlign || (TextAlign = {}));
    exports.TextAlign = TextAlign;
    /**
     * Rendered Text Model
     */
    var RenderedText = /** @class */ (function (_super) {
        __extends(RenderedText, _super);
        /**
         * Create new rendered text representation
         * @param text Plain text to be rendered
         * @param posX left offset
         * @param posY top offset
         * @param horizontalAlign horizontal align
         * @param verticalAlign vertical align
         * @param element related timeline element model
         * @param fontFamily font family (HTML/SVG format)
         * @param fontSize font size (in target units)
         * @param fontColor font color (hex/rgba/color name)
         * @param rotate text rotation (in degrees, -180 ... 180)
         * @param fontWeight font weight (eg. bold/100/200/300)
         * @param justifyWidth width to be used when justifying text (not used for the moment)
         */
        function RenderedText(text, posX, posY, horizontalAlign, verticalAlign, element, fontFamily, fontSize, fontColor, rotate, fontWeight, justifyWidth) {
            var _this = _super.call(this, element) || this;
            /**
             * Contained text (wrapped for rich-text support)
             */
            _this.StructuredText = [];
            /**
             * Width to be used when justifying text (not used for the moment)
             */
            _this.JustifyWidth = null;
            _this.Text = text;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.HorizontalAlign = horizontalAlign;
            _this.VerticalAlign = verticalAlign;
            _this.FontColor = fontColor;
            _this.FontFamily = fontFamily;
            _this.FontSize = fontSize;
            _this.Rotate = rotate;
            _this.FontWeight = fontWeight;
            _this.JustifyWidth = justifyWidth;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedText.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedText;
    }(renderedelement_1.RenderedElement));
    exports.RenderedText = RenderedText;
});
