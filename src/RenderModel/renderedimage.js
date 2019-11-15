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
     * Rendered Image Model
     */
    var RenderedImage = /** @class */ (function (_super) {
        __extends(RenderedImage, _super);
        /**
         * Create new rendered image representation
         * @param imageUrl image url
         * @param posX image left offset
         * @param posY image top offset
         * @param width image width
         * @param height image height
         * @param enableBorderRadius flag if image should have cut-out corners
         * @param enableBgMask flag if image should have fade-out vertical mask (as used for background images)
         * @param element related timeline element model (optional)
         */
        function RenderedImage(imageUrl, posX, posY, width, height, enableBorderRadius, enableBgMask, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Flag if image should have cut-out corners
             */
            _this.EnableBorderRadius = false;
            /**
             * Flag if image should have fade-out vertical mask (as used for background images)
             */
            _this.EnableBgMask = false;
            _this.ImageUrl = imageUrl;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.Width = width;
            _this.Height = height;
            _this.EnableBgMask = enableBgMask;
            _this.EnableBorderRadius = enableBorderRadius;
            return _this;
        }
        /**
         * Move element vertically (for adjusting position during cuts, etc.)
         * @param amount amount of movement
         */
        RenderedImage.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedImage;
    }(renderedelement_1.RenderedElement));
    exports.RenderedImage = RenderedImage;
});
