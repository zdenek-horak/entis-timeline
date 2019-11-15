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
define(["require", "exports", "./timespecification", "./timelineelement", "../RenderModel/eventrenderwrapper"], function (require, exports, timespecification_1, timelineelement_1, eventrenderwrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Timeline Event Model
     */
    var TimelineEvent = /** @class */ (function (_super) {
        __extends(TimelineEvent, _super);
        /**
         * Create new event
         * @param id event unique id
         * @param title event title
         */
        function TimelineEvent(id, title) {
            var _this = _super.call(this) || this;
            /**
             * Event Image
             */
            _this.Image = null;
            /**
             * Event Link
             */
            _this.Link = null;
            /**
             * Visual representation of the event (used during placing/rendering phase)
             */
            _this.Tag = null;
            _this.Id = id;
            _this.Title = title;
            _this.Occurences = new Array();
            _this.Tag = new eventrenderwrapper_1.EventRenderWrapper();
            return _this;
        }
        /**
         * Find event start/end timestamp numeric representation
         * @param start true if start timestamp should be found, false for end timestamp
         */
        TimelineEvent.prototype.FindRange = function (start) {
            if (this.Occurences.length > 0) {
                var borderEvent = this.Occurences[(start ? 0 : this.Occurences.length - 1)];
                if (borderEvent.Time.HasStart) {
                    return timespecification_1.TimeSpecification.CalcTimeVal(borderEvent.Time.StartYear, borderEvent.Time.StartMonth, borderEvent.Time.StartDay, borderEvent.Time.StartHour, borderEvent.Time.StartMinute, borderEvent.Time.StartSecond);
                }
                else if (borderEvent.Time.HasEnd) {
                    return timespecification_1.TimeSpecification.CalcTimeVal(borderEvent.Time.EndYear, borderEvent.Time.EndMonth, borderEvent.Time.EndDay, borderEvent.Time.EndHour, borderEvent.Time.EndMinute, borderEvent.Time.EndSecond);
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        };
        return TimelineEvent;
    }(timelineelement_1.TimelineElement));
    exports.TimelineEvent = TimelineEvent;
});
