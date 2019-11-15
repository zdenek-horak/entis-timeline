define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Hyperlink Model
     */
    var TimelineLink = /** @class */ (function () {
        /**
         * Create hyperlink model
         * @param url hyperlink url
         * @param text hyperlink text
         * @param target hyperlink target
         * @param tooltip hyperlink tooltip
         */
        function TimelineLink(url, text, target, tooltip) {
            this.Url = url;
            this.Text = text;
            this.Target = target;
            this.Tooltip = tooltip;
        }
        return TimelineLink;
    }());
    exports.TimelineLink = TimelineLink;
});
