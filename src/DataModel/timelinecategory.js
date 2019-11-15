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
define(["require", "exports", "./timelineelement"], function (require, exports, timelineelement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Timeline Category Model
     */
    var TimelineCategory = /** @class */ (function (_super) {
        __extends(TimelineCategory, _super);
        /**
         * Create new timeline category
         * @param id category unique id
         * @param title category title
         */
        function TimelineCategory(id, title) {
            var _this = _super.call(this) || this;
            /**
             * Visual representation of the category (used during placing/rendering phase)
             */
            _this.TagLine = null;
            _this.Id = id;
            _this.Title = title;
            _this.Events = new Array();
            return _this;
        }
        return TimelineCategory;
    }(timelineelement_1.TimelineElement));
    exports.TimelineCategory = TimelineCategory;
});
