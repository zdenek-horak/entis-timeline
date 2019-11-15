define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Point Specification Model Helper
     */
    var PointSpec = /** @class */ (function () {
        /**
         * Create new point specification
         * @param posX left offset
         * @param posY top offset
         */
        function PointSpec(posX, posY) {
            this.PosX = posX;
            this.PosY = posY;
        }
        return PointSpec;
    }());
    exports.PointSpec = PointSpec;
});
