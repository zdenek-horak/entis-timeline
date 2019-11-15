define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Base class for rendered elements
     */
    var RenderedElement = /** @class */ (function () {
        /**
         * Create new rendered element
         * @param element
         */
        function RenderedElement(element) {
            /**
             * Id of rendered element group (groups are rendered in one layer)
             */
            this.GroupId = null;
            this.Element = element;
        }
        return RenderedElement;
    }());
    exports.RenderedElement = RenderedElement;
});
