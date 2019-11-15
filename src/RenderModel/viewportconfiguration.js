define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Viewport Model
     */
    var ViewportConfiguration = /** @class */ (function () {
        /**
         * Create new viewport model
         * @param isVertical flag of viewport orientation, only true supported for the moment
         * @param width viewport width (in pixels)
         * @param height viewpoert height (in pixels)
         */
        function ViewportConfiguration(isVertical, width, height) {
            this.IsVertical = isVertical;
            this.Width = width;
            this.Height = height;
        }
        return ViewportConfiguration;
    }());
    exports.ViewportConfiguration = ViewportConfiguration;
});
