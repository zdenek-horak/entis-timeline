define(["require", "exports", "./timespecification"], function (require, exports, timespecification_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Timeline Model
     */
    var Timeline = /** @class */ (function () {
        /**
         * Create new timeline object
         * @param title timeline title
         * @param theme timeline theme configuration
         */
        function Timeline(title, theme) {
            /**
             * Timeline title description (plaintext with b/i/u tags support)
             */
            this.Description = '';
            /**
             * Flag if timeline should be rendered inside whole window or as a part of different page
             */
            this.SelfContained = false;
            this.Image = null;
            this.Title = title;
            this.Categories = [];
            this.Events = [];
            this.Theme = theme;
            this.Links = [];
        }
        /**
         * Compare timestamps of two occurences (used for sorting)
         * @param a first occurence
         * @param b second occurence
         */
        Timeline.prototype.CompareOccurencies = function (a, b) {
            var valA, valB;
            if ((a.Time.HasStart) && (b.Time.HasStart)) {
                valA = timespecification_1.TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
                valB = timespecification_1.TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
            }
            else if ((a.Time.HasEnd) && (b.Time.HasStart)) {
                valA = timespecification_1.TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
                valB = timespecification_1.TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
            }
            else if ((a.Time.HasStart) && (b.Time.HasEnd)) {
                valA = timespecification_1.TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
                valB = timespecification_1.TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
            }
            else if ((a.Time.HasEnd) && (b.Time.HasEnd)) {
                valA = timespecification_1.TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
                valB = timespecification_1.TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, b.Time.EndHour, b.Time.EndMinute, b.Time.StartSecond);
            }
            return (valA > valB ? 1 : (valA < valB ? -1 : 0));
        };
        /**
         * Compare timestamps of two events (used for sorting)
         * @param a first event
         * @param b second event
         */
        Timeline.prototype.CompareEvents = function (a, b) {
            var valA = a.FindRange(true);
            var valB = b.FindRange(true);
            if (valA == valB) {
                return 0;
            }
            else if (valA > valB) {
                return 1;
            }
            else
                return -1;
        };
        /**
         * Find numeric representation of timeline start timestamp
         */
        Timeline.prototype.FindStart = function () {
            return this.FindRange(true);
        };
        /**
         * Find numeric representation of timeline end timestamp
         */
        Timeline.prototype.FindEnd = function () {
            return this.FindRange(false);
        };
        /**
         * Find numeric representation of timeline start/end
         * @param start flag to check for start (true) or end (false) of timeline range
         */
        Timeline.prototype.FindRange = function (start) {
            if (this.Events.length > 0) {
                var borderEvent = this.Events[(start ? 0 : this.Events.length - 1)];
                return borderEvent.FindRange(start);
            }
            else {
                return null;
            }
        };
        /**
         * Sort events inside timeline according to their timestamps
         */
        Timeline.prototype.SortEvents = function () {
            var _this = this;
            for (var _i = 0, _a = this.Events; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                event_1.Occurences.sort(function (a, b) { return _this.CompareOccurencies(a, b); });
            }
            this.Events.sort(function (a, b) { return _this.CompareEvents(a, b); });
        };
        return Timeline;
    }());
    exports.Timeline = Timeline;
});
