define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Timeline Image Model
     */
    var TimelineImage = /** @class */ (function () {
        /**
         * Create new image model
         * @param url image url
         * @param width source image width
         * @param height source image height
         */
        function TimelineImage(url, width, height) {
            this.Url = url;
            this.Width = width;
            this.Height = height;
        }
        return TimelineImage;
    }());
    exports.TimelineImage = TimelineImage;
});
