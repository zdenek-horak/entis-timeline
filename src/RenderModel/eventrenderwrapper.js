define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Wrapper object for rendered elements related to timeline event
     */
    var EventRenderWrapper = /** @class */ (function () {
        /**
         * Create new event render wrapper
         */
        function EventRenderWrapper() {
            /**
             * Related elements
             */
            this.Elements = [];
        }
        /**
         * Add new event-related rendered element
         * @param element rendered element
         */
        EventRenderWrapper.prototype.add = function (element) {
            this.Elements.push(element);
        };
        /**
         * Move all event-related elements vertically (used for extending/cutting timeline)
         * @param amount amount of movement
         */
        EventRenderWrapper.prototype.moveVertically = function (amount) {
            this.PosY += amount;
            this.StartY += amount;
            for (var _i = 0, _a = this.Elements; _i < _a.length; _i++) {
                var element = _a[_i];
                element.moveVertically(amount);
            }
        };
        return EventRenderWrapper;
    }());
    exports.EventRenderWrapper = EventRenderWrapper;
});
