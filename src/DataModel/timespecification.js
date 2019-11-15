define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Event Timestamp Model
     */
    var TimeSpecification = /** @class */ (function () {
        /**
         * Create new timestamp model
         * @param startYear year of start
         * @param startMonth month of start (indexed from 1)
         * @param startDay day of start (indexed from 1)
         * @param startHour hour of start (indexed from 0)
         * @param startMinute minute of start (indexed from 0)
         * @param startSecond second of start (indexed from 0)
         * @param endYear year of end
         * @param endMonth month of end (indexed from 1)
         * @param endDay day of end (indexed from 1)
         * @param endHour hour of end (indexed from 0)
         * @param endMinute minute of end (indexed from 0)
         * @param endSecond second of end (indexed from 0)
         * @param title timestamp alternative textual description (optional)
         */
        function TimeSpecification(startYear, startMonth, startDay, startHour, startMinute, startSecond, endYear, endMonth, endDay, endHour, endMinute, endSecond, title) {
            this.StartYear = startYear;
            this.StartMonth = startMonth;
            this.StartDay = startDay;
            this.StartHour = startHour;
            this.StartMinute = startMinute;
            this.StartSecond = startSecond;
            this.EndYear = endYear;
            this.EndMonth = endMonth;
            this.EndDay = endDay;
            this.EndHour = endHour;
            this.EndMinute = endMinute;
            this.EndSecond = endSecond;
            this.HasStart = (startYear != null) || (startMonth != null) || (startDay != null) || (startHour != null) || (startMinute != null) || (startSecond != null);
            this.HasEnd = (endYear != null) || (endMonth != null) || (endDay != null) || (endHour != null) || (endMinute != null) || (endSecond != null);
            this.Title = title;
        }
        /**
         * Return numeric representation of given timestamp
         * @param year
         * @param month
         * @param day
         * @param hour
         * @param minute
         * @param second
         */
        TimeSpecification.CalcTimeVal = function (year, month, day, hour, minute, second) {
            return TimeSpecification.ConstructTimeVal(year, month, day, hour, minute, second).getTime();
        };
        /**
         * Return JS date representation of given timestamp
         * @param year
         * @param month
         * @param day
         * @param hour
         * @param minute
         * @param second
         */
        TimeSpecification.ConstructTimeVal = function (year, month, day, hour, minute, second) {
            return new Date((year != null ? year : 2000), (month != null ? (month - 1) : 0), (day != null ? day : 1), (hour != null ? hour : 0), (minute != null ? minute : 0), (second != null ? second : 0), 0);
        };
        /**
         * Pad string with given string (usualy leading zeros, etc.)
         * @param paddingValue leading zeros, etc.
         * @param paddedValue value being padded
         */
        TimeSpecification.prototype.padLeft = function (paddingValue, paddedValue) {
            return String(paddingValue + paddedValue).slice(-paddingValue.length);
        };
        /**
         * Return JS date representation of start timestamp
         */
        TimeSpecification.prototype.GetStartDate = function () {
            return TimeSpecification.ConstructTimeVal(this.StartYear, this.StartMonth, this.StartDay, this.StartHour, this.StartMinute, this.StartSecond);
        };
        /**
         * Return JS date representation of end timestamp
         */
        TimeSpecification.prototype.GetEndDate = function () {
            return TimeSpecification.ConstructTimeVal(this.EndYear, this.EndMonth, this.EndDay, this.EndHour, this.EndMinute, this.EndSecond);
        };
        /**
         * Return textual description of timestamp
         * @param year timestamp year
         * @param month timestamp month (indexed from 1)
         * @param day timestamp day (indexed from 1)
         * @param hour timestamp hour (indexed from 0)
         * @param minute timestmap minute (indexed from 0)
         * @param second timestamp second (indexed from 0)
         * @param includeDate flag if date (year/month/day) info should be included
         */
        TimeSpecification.prototype.GetDateTimeDescription = function (year, month, day, hour, minute, second, includeDate) {
            if ((year != null) && (month == null))
                return year.toString();
            if ((year != null) && (month != null) && (day == null))
                return month.toString() + "/" + year.toString();
            if ((year != null) && (month != null) && (day != null) && (hour == null))
                return day.toString() + "." + month + "." + year.toString();
            if ((year != null) && (month != null) && (day != null) && (hour != null) && (minute == null))
                return hour.toString() + "h" + (includeDate ? " " + day.toString() + "." + month.toString() + "." + year.toString() : "");
            if ((year != null) && (month != null) && (day != null) && (hour != null) && (minute != null) && (second == null))
                return this.padLeft("00", hour.toString()) + ":" + this.padLeft("00", minute.toString()) + (includeDate ? " " + day.toString() + "." + month.toString() + "." + year.toString() : "");
            if ((year != null) && (month != null) && (day != null) && (hour != null) && (minute != null) && (second != null))
                return this.padLeft("00", hour.toString()) + ":" + this.padLeft("00", minute.toString()) + ":" + this.padLeft("00", second.toString()) + (includeDate ? " " + day.toString() + "." + month.toString() + "." + year.toString() : "");
            return "";
        };
        /**
         * Return textual description of timestamp
         * @param timestamp
         */
        TimeSpecification.prototype.GetTimeDescription = function (timestamp) {
            if (this.Title != null) {
                return this.Title;
            }
            var result = "";
            var includeDate = true;
            if (timestamp != null) {
                if ((timestamp.StartDay == this.StartDay) && (timestamp.StartYear == this.StartYear) && (timestamp.StartMonth == this.StartMonth)) {
                    includeDate = false;
                }
            }
            var includeFirstDate = true;
            if ((this.StartYear == this.EndYear) && (this.StartMonth == this.EndMonth) && (this.StartDay == this.EndDay))
                includeFirstDate = false;
            result += this.GetDateTimeDescription(this.StartYear, this.StartMonth, this.StartDay, this.StartHour, this.StartMinute, this.StartSecond, includeDate && includeFirstDate);
            if (this.HasEnd) {
                result += " - ";
                result += this.GetDateTimeDescription(this.EndYear, this.EndMonth, this.EndDay, this.EndHour, this.EndMinute, this.EndSecond, includeDate);
            }
            return result;
        };
        return TimeSpecification;
    }());
    exports.TimeSpecification = TimeSpecification;
});
