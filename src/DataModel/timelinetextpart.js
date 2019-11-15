define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rich Text Part Model
     */
    var TimelineTextPart = /** @class */ (function () {
        /**
         * Create new rich text model
         * @param text text
         * @param isBold flag for bold text
         * @param isItalic flag for italic text
         * @param isUnderline flag for underlined text
         * @param separator separator to be prepended before the text
         */
        function TimelineTextPart(text, isBold, isItalic, isUnderline, separator) {
            this.IsBold = isBold;
            this.IsItalic = isItalic;
            this.IsUnderline = isUnderline;
            this.Text = text;
            this.Separator = separator;
        }
        return TimelineTextPart;
    }());
    exports.TimelineTextPart = TimelineTextPart;
});
