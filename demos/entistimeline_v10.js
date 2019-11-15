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
define("DataModel/timelineelement", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Base Model Class
     */
    var TimelineElement = /** @class */ (function () {
        function TimelineElement() {
        }
        return TimelineElement;
    }());
    exports.TimelineElement = TimelineElement;
});
define("RenderModel/renderedelement", ["require", "exports"], function (require, exports) {
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
define("RenderModel/viewportconfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Viewport Model
     */
    var ViewportConfiguration = /** @class */ (function () {
        /**
         * Create new viewport model
         * @param isVertical flag of viewport orientation, only true supported for the moment
         * @param width viewport width (in pixels)
         * @param height viewpoert height (in pixels)
         */
        function ViewportConfiguration(isVertical, width, height) {
            this.IsVertical = isVertical;
            this.Width = width;
            this.Height = height;
        }
        return ViewportConfiguration;
    }());
    exports.ViewportConfiguration = ViewportConfiguration;
});
define("DataModel/timelinecategory", ["require", "exports", "DataModel/timelineelement"], function (require, exports, timelineelement_1) {
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
define("DataModel/timespecification", ["require", "exports"], function (require, exports) {
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
define("DataModel/timelineoccurence", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Event Occurence (binding event with time and category
     */
    var TimelineOccurence = /** @class */ (function () {
        function TimelineOccurence() {
        }
        return TimelineOccurence;
    }());
    exports.TimelineOccurence = TimelineOccurence;
});
define("DataModel/timelineimage", ["require", "exports"], function (require, exports) {
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
define("DataModel/timelinelink", ["require", "exports"], function (require, exports) {
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
define("RenderModel/eventrenderwrapper", ["require", "exports"], function (require, exports) {
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
define("DataModel/timelineevent", ["require", "exports", "DataModel/timespecification", "DataModel/timelineelement", "RenderModel/eventrenderwrapper"], function (require, exports, timespecification_1, timelineelement_2, eventrenderwrapper_1) {
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
    }(timelineelement_2.TimelineElement));
    exports.TimelineEvent = TimelineEvent;
});
define("entistimeline_theme", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Visual Theme Configuration Model
     */
    var TimelineTheme = /** @class */ (function () {
        /**
         * Create new timeline configuration
         * @param defaultFont Default font family
         * @param defaultFontColor Default font color (hex/rgba/color name)
         * @param defaultFontInverseColor Default font inverse color (hex/rgba/color name)
         * @param defaultFontNoteColor DefaultNoteFontColor: string;
         * @param defaultMinFontSize DefaultMinFontSize: number;
         * @param defaultMaxFontSize DefaultMaxFontSize: number;
         * @param defaultBackgroundColor Default background color (hex/rgba/color name)
         * @param defaultPadding Default padding (being used between events, titles, etc.)
         * @param googleFonts Google font names to be loaded
         * @param categoryColors List of colors to be used for particular categories (cycling is used if more categories than colors specified)
         * @param eventBgColor Event rectangle background color (hex/rgba/color name)
         * @param eventTitleLineColor Event title color (hex/rgba/color name)
         * @param defaultEventLineColor Event line (below title) color (hex/rgba/color name)
         * @param defaultEventPointColor Event circle color (fill color, border color is taken from category, hex/rgba/color name)
         * @param headerLinkColor Color for links in header (hex/rgba/color name)
         * @param defaultImageRadius Default radius for event images (corners can be cut-out)
         * @param emptySpaceThreshold Threshold of empty space between events which is being collapsed to empty space placeholder
         * @param cutPlaceholderBorder Empty space placeholder border color (hex/rgba/color name)
         * @param titleImageOpacity Opacity of image used as background (usualy for title, 0 ... 1)
         */
        function TimelineTheme(defaultFont, defaultFontColor, defaultFontInverseColor, defaultFontNoteColor, defaultMinFontSize, defaultMaxFontSize, defaultBackgroundColor, defaultPadding, googleFonts, categoryColors, eventBgColor, eventTitleLineColor, defaultEventLineColor, defaultEventPointColor, headerLinkColor, defaultImageRadius, emptySpaceThreshold, cutPlaceholderBorder, titleImageOpacity) {
            /**
             * Google font names to be loaded
             */
            this.GoogleFonts = [];
            this.DefaultFont = defaultFont;
            this.DefaultFontInverseColor = defaultFontInverseColor;
            this.DefaultFontColor = defaultFontColor;
            this.DefaultNoteFontColor = defaultFontNoteColor;
            this.DefaultMinFontSize = defaultMinFontSize;
            this.DefaultMaxFontSize = defaultMaxFontSize;
            this.DefaultPadding = defaultPadding;
            this.GoogleFonts = googleFonts;
            this.DefaultBackgroundColor = defaultBackgroundColor;
            this.CategoryColors = categoryColors;
            this.EventBgColor = eventBgColor;
            this.EventTitleLineColor = eventTitleLineColor;
            this.DefaultEventLineColor = defaultEventLineColor;
            this.DefaultEventPointColor = defaultEventPointColor;
            this.HeaderLinkColor = headerLinkColor;
            this.DefaultImageRadius = defaultImageRadius;
            this.EmptySpaceThreshold = emptySpaceThreshold;
            this.CutPlaceholderBorder = cutPlaceholderBorder;
            this.TitleImageOpacity = titleImageOpacity;
        }
        return TimelineTheme;
    }());
    exports.TimelineTheme = TimelineTheme;
});
define("DataModel/timeline", ["require", "exports", "DataModel/timespecification"], function (require, exports, timespecification_2) {
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
                valA = timespecification_2.TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
                valB = timespecification_2.TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
            }
            else if ((a.Time.HasEnd) && (b.Time.HasStart)) {
                valA = timespecification_2.TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
                valB = timespecification_2.TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
            }
            else if ((a.Time.HasStart) && (b.Time.HasEnd)) {
                valA = timespecification_2.TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
                valB = timespecification_2.TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
            }
            else if ((a.Time.HasEnd) && (b.Time.HasEnd)) {
                valA = timespecification_2.TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
                valB = timespecification_2.TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, b.Time.EndHour, b.Time.EndMinute, b.Time.StartSecond);
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
define("RenderModel/renderedtimeline", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Timeline Model
     */
    var RenderedTimeline = /** @class */ (function () {
        /**
         * Create new rendered timeline representation
         * @param timeline timeline model
         * @param viewport viewport information
         * @param bgColor background color (hex/rgba/color name)
         */
        function RenderedTimeline(timeline, viewport, bgColor) {
            this.ParentTimeline = timeline;
            this.TotalWidth = 500;
            this.TotalHeight = 1000;
            this.Viewport = viewport;
            this.BackgroundColor = bgColor;
            this.Elements = new Array();
            this.Groups = new Array();
        }
        /**
         * Create new group
         * @param groupId unique group id
         */
        RenderedTimeline.prototype.AddGroup = function (groupId) {
            this.Groups.push(groupId);
        };
        /**
         * Add new element and assign corresponding group
         * @param element rendered element
         * @param groupId group id to assing
         */
        RenderedTimeline.prototype.AddElement = function (element, groupId) {
            element.GroupId = groupId;
            this.Elements.push(element);
        };
        return RenderedTimeline;
    }());
    exports.RenderedTimeline = RenderedTimeline;
});
define("DataModel/timelinetextpart", ["require", "exports"], function (require, exports) {
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
define("RenderModel/renderedtext", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Text Align Enum
     */
    var TextAlign;
    (function (TextAlign) {
        /**
         * Align to start (left/top)
         */
        TextAlign[TextAlign["Start"] = 0] = "Start";
        /**
         * Align to center
         */
        TextAlign[TextAlign["Middle"] = 1] = "Middle";
        /**
         * Align to end (right/bottom
         */
        TextAlign[TextAlign["End"] = 2] = "End";
    })(TextAlign || (TextAlign = {}));
    exports.TextAlign = TextAlign;
    /**
     * Rendered Text Model
     */
    var RenderedText = /** @class */ (function (_super) {
        __extends(RenderedText, _super);
        /**
         * Create new rendered text representation
         * @param text Plain text to be rendered
         * @param posX left offset
         * @param posY top offset
         * @param horizontalAlign horizontal align
         * @param verticalAlign vertical align
         * @param element related timeline element model
         * @param fontFamily font family (HTML/SVG format)
         * @param fontSize font size (in target units)
         * @param fontColor font color (hex/rgba/color name)
         * @param rotate text rotation (in degrees, -180 ... 180)
         * @param fontWeight font weight (eg. bold/100/200/300)
         * @param justifyWidth width to be used when justifying text (not used for the moment)
         */
        function RenderedText(text, posX, posY, horizontalAlign, verticalAlign, element, fontFamily, fontSize, fontColor, rotate, fontWeight, justifyWidth) {
            var _this = _super.call(this, element) || this;
            /**
             * Contained text (wrapped for rich-text support)
             */
            _this.StructuredText = [];
            /**
             * Width to be used when justifying text (not used for the moment)
             */
            _this.JustifyWidth = null;
            _this.Text = text;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.HorizontalAlign = horizontalAlign;
            _this.VerticalAlign = verticalAlign;
            _this.FontColor = fontColor;
            _this.FontFamily = fontFamily;
            _this.FontSize = fontSize;
            _this.Rotate = rotate;
            _this.FontWeight = fontWeight;
            _this.JustifyWidth = justifyWidth;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedText.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedText;
    }(renderedelement_1.RenderedElement));
    exports.RenderedText = RenderedText;
});
define("RenderModel/pointspec", ["require", "exports"], function (require, exports) {
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
define("RenderModel/renderedcircle", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Circle Model
     */
    var RenderedCircle = /** @class */ (function (_super) {
        __extends(RenderedCircle, _super);
        /**
         * Create new circle representation
         * @param lineWidth border line width (might use HTML/SVG units for now)
         * @param lineColor border line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param center circle center
         * @param radius circle radius
         * @param element related timeline model element (usually event, optional)
         */
        function RenderedCircle(lineWidth, lineColor, fillColor, center, radius, element) {
            var _this = _super.call(this, element) || this;
            _this.Center = center;
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            _this.Radius = radius;
            return _this;
        }
        /**
         * Move element vertically
         * @param amount amount of movement
         */
        RenderedCircle.prototype.moveVertically = function (amount) {
            this.Center.PosY += amount;
        };
        return RenderedCircle;
    }(renderedelement_2.RenderedElement));
    exports.RenderedCircle = RenderedCircle;
});
define("RenderModel/renderedrectangle", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Rectangle Representation */
    var RenderedRectangle = /** @class */ (function (_super) {
        __extends(RenderedRectangle, _super);
        /**
         * Create new rendered rectangle representation
         * @param lineWidth border line width (textual representation using any HTML/SVG units)
         * @param lineColor border line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param posX left offset
         * @param posY top offset
         * @param width rectangle width
         * @param height rectangle height
         * @param rx corner horizontal radius
         * @param ry corner vertical radius
         * @param element related timeline element model (optional)
         */
        function RenderedRectangle(lineWidth, lineColor, fillColor, posX, posY, width, height, rx, ry, element) {
            var _this = _super.call(this, element) || this;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.RX = rx;
            _this.RY = ry;
            _this.Width = width;
            _this.Height = height;
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedRectangle.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedRectangle;
    }(renderedelement_3.RenderedElement));
    exports.RenderedRectangle = RenderedRectangle;
});
define("RenderModel/renderedline", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Line Model
     */
    var RenderedLine = /** @class */ (function (_super) {
        __extends(RenderedLine, _super);
        /**
         * Create new line representation
         * @param lineWidth line width (textual representation using any HTML/SVG units)
         * @param lineColor line color (hex/rgba/color name)
         * @param fillColor fill color (hex/rgba/color name)
         * @param element related timeline element model (optional)
         */
        function RenderedLine(lineWidth, lineColor, fillColor, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Line stroke cap (eg. round)
             */
            _this.StrokeCap = null;
            _this.Points = [];
            _this.LineWidth = lineWidth;
            _this.LineColor = lineColor;
            _this.FillColor = fillColor;
            return _this;
        }
        /**
         * Move element vertically (for adjusting position during cuts, etc.)
         * @param amount amount of movement
         */
        RenderedLine.prototype.moveVertically = function (amount) {
            for (var _i = 0, _a = this.Points; _i < _a.length; _i++) {
                var point = _a[_i];
                point.PosY += amount;
            }
        };
        return RenderedLine;
    }(renderedelement_4.RenderedElement));
    exports.RenderedLine = RenderedLine;
});
define("RenderModel/renderedimage", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Image Model
     */
    var RenderedImage = /** @class */ (function (_super) {
        __extends(RenderedImage, _super);
        /**
         * Create new rendered image representation
         * @param imageUrl image url
         * @param posX image left offset
         * @param posY image top offset
         * @param width image width
         * @param height image height
         * @param enableBorderRadius flag if image should have cut-out corners
         * @param enableBgMask flag if image should have fade-out vertical mask (as used for background images)
         * @param element related timeline element model (optional)
         */
        function RenderedImage(imageUrl, posX, posY, width, height, enableBorderRadius, enableBgMask, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Flag if image should have cut-out corners
             */
            _this.EnableBorderRadius = false;
            /**
             * Flag if image should have fade-out vertical mask (as used for background images)
             */
            _this.EnableBgMask = false;
            _this.ImageUrl = imageUrl;
            _this.PosX = posX;
            _this.PosY = posY;
            _this.Width = width;
            _this.Height = height;
            _this.EnableBgMask = enableBgMask;
            _this.EnableBorderRadius = enableBorderRadius;
            return _this;
        }
        /**
         * Move element vertically (for adjusting position during cuts, etc.)
         * @param amount amount of movement
         */
        RenderedImage.prototype.moveVertically = function (amount) {
            this.PosY += amount;
        };
        return RenderedImage;
    }(renderedelement_5.RenderedElement));
    exports.RenderedImage = RenderedImage;
});
define("RenderModel/renderedlink", ["require", "exports", "RenderModel/renderedelement"], function (require, exports, renderedelement_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Link Representation
     */
    var RenderedLink = /** @class */ (function (_super) {
        __extends(RenderedLink, _super);
        /**
         * Create new rendered link representation
         * @param link link url
         * @param target link target (eg. _blank, optional)
         * @param tooltip link tooltip (optional)
         * @param childrenElements link children (usualy RenderedText instances)
         * @param element related timeline element model (optional)
         */
        function RenderedLink(link, target, tooltip, childrenElements, element) {
            var _this = _super.call(this, element) || this;
            /**
             * Link tooltip (optional)
             */
            _this.Tooltip = null;
            /**
             * Link target (eg. _blank, optional)
             */
            _this.Target = null;
            _this.Children = childrenElements;
            _this.Link = link;
            _this.Tooltip = tooltip;
            _this.Target = target;
            return _this;
        }
        /**
        * Move element vertically (for adjusting position during cuts, etc.)
        * @param amount amount of movement
        */
        RenderedLink.prototype.moveVertically = function (amount) {
            for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.moveVertically(amount);
            }
        };
        return RenderedLink;
    }(renderedelement_6.RenderedElement));
    exports.RenderedLink = RenderedLink;
});
define("entistimeline_renderer", ["require", "exports", "RenderModel/renderedtext", "RenderModel/renderedcircle", "RenderModel/renderedrectangle", "RenderModel/renderedline", "RenderModel/renderedimage", "RenderModel/renderedlink", "RenderModel/viewportconfiguration"], function (require, exports, renderedtext_1, renderedcircle_1, renderedrectangle_1, renderedline_1, renderedimage_1, renderedlink_1, viewportconfiguration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Allows timeline rendering using SVG
     */
    var TimelineRenderer = /** @class */ (function () {
        /**
         * Create new renderer
         * @param parent DOM container
         */
        function TimelineRenderer(parent) {
            /**
             * Default SVG namespaces
             */
            this.SVGNS = 'http://www.w3.org/2000/svg';
            /**
             * XLink namespaces (for hyperlinks inside SVG)
             */
            this.XLINKNS = 'http://www.w3.org/1999/xlink';
            /**
             * Rendered elements
             */
            this.Elements = [];
            this.Parent = parent;
            // We need the container physically injected into DOM&Visible because of the BBox measurements
            this.Container = document.createElementNS(this.SVGNS, "svg");
            this.Container.setAttribute('xmlns', this.SVGNS);
            this.Container.setAttribute('xmlns:xlink', this.XLINKNS);
            this.Parent.appendChild(this.Container);
            this.SVGDefs = document.createElementNS(this.SVGNS, 'defs');
            this.Container.appendChild(this.SVGDefs);
        }
        /**
         * Get viewport configuration (used during placing phase)
         */
        TimelineRenderer.prototype.GetViewportConfiguration = function () {
            var viewport = new viewportconfiguration_1.ViewportConfiguration(true, Math.min(window.innerWidth, window.outerWidth), Math.min(window.innerHeight, window.outerHeight));
            viewport.Width = this.Parent.offsetWidth;
            return viewport;
        };
        /**
         * Preload Google Fonts (need to do this because of text measurements during placing phase)
         * @param googleFontName requested Google font name
         */
        TimelineRenderer.prototype.InjectGoogleFont = function (googleFontName) {
            var sheet = document.createElementNS(this.SVGNS, 'style');
            sheet.setAttribute("type", 'text/css');
            sheet.textContent = "@import url('https://fonts.googleapis.com/css?family=" + googleFontName + "&display=swap');"
                + ".fadeIn {opacity: 0; animation-fill-mode: forwards; animation-delay: 0.5s; animation-name: fadeinFrames;animation-duration: 0.5s;}"
                + "@keyframes fadeinFrames { from { opacity: 0; } to { opacity: 1; } }";
            this.SVGDefs.appendChild(sheet);
        };
        /**
         * Show error message cause of init/loading error
         */
        TimelineRenderer.prototype.RenderError = function () {
            this.Parent.append("Ooops, something went wrong. You may look into the console if you're a developer.");
        };
        /**
         * Render given timeline
         * @param renderedTimeline
         */
        TimelineRenderer.prototype.Render = function (renderedTimeline) {
            this.Timeline = renderedTimeline;
            // Clear elements (from previous renders)
            for (var _i = 0, _a = this.Elements; _i < _a.length; _i++) {
                var element = _a[_i];
                this.Container.removeChild(element);
            }
            this.Elements = [];
            // Prepare SVG element (update width/height which might have changed)
            this.Container.setAttribute("height", this.Timeline.TotalHeight.toString());
            this.Container.setAttribute("width", this.Timeline.TotalWidth.toString());
            this.Container.setAttribute("style", "background: " + this.Timeline.ParentTimeline.Theme.DefaultBackgroundColor);
            // Set requested sizing
            var parentStyle = "padding: 0; margin: 0; font-size: 0px; ";
            if (this.Timeline.Viewport.IsVertical)
                parentStyle = parentStyle + "; overflow-x: hidden";
            else
                parentStyle = parentStyle + "; overflow-y: hidden";
            this.Parent.setAttribute("style", parentStyle);
            this.SVGNS = this.Container.namespaceURI;
            // Create individual elements
            this.Construct();
        };
        /**
         * Render hyperlink
         * @param linkUrl link url
         * @param linkTarget link target
         * @param tooltip link tooltip
         */
        TimelineRenderer.prototype.createLinkElement = function (linkUrl, linkTarget, tooltip) {
            var link = document.createElementNS(this.SVGNS, 'a');
            link.setAttribute('class', 'fadeIn');
            if (tooltip != null) {
                var title = document.createElementNS(this.SVGNS, 'title');
                title.innerHTML = tooltip;
                link.appendChild(title);
            }
            if (linkTarget != null) {
                link.setAttribute('target', linkTarget);
            }
            link.setAttributeNS(this.XLINKNS, 'href', linkUrl);
            return link;
        };
        /**
         * Render text
         * @param textEl rendered text element
         * @param allowJustify flag for text justification, not used for the moment
         */
        TimelineRenderer.prototype.createTextElement = function (textEl, allowJustify) {
            var text = document.createElementNS(this.SVGNS, 'text');
            text.setAttribute('x', textEl.PosX.toString());
            text.setAttribute('style', 'font-size: ' + textEl.FontSize + 'px; ' + (textEl.FontWeight != null ? 'font-weight: ' + textEl.FontWeight + ';' : '') + 'font-family: ' + textEl.FontFamily);
            text.setAttribute("fill", textEl.FontColor);
            text.setAttribute('class', 'fadeIn');
            if (textEl.HorizontalAlign == renderedtext_1.TextAlign.Start)
                text.setAttribute('text-anchor', "start");
            else if (textEl.HorizontalAlign == renderedtext_1.TextAlign.Middle)
                text.setAttribute('text-anchor', "middle");
            else if (textEl.HorizontalAlign == renderedtext_1.TextAlign.End)
                text.setAttribute('text-anchor', "end");
            // Structured text support
            if (textEl.StructuredText.length > 0) {
                var dy = 0;
                // structured text consists of separate lines, each line might consist of differently formated parts
                for (var _i = 0, _a = textEl.StructuredText; _i < _a.length; _i++) {
                    var line = _a[_i];
                    var newLine = true;
                    //let lineWidth = 0;
                    var currentLine = [];
                    for (var i = 0; i < line.length; i++) {
                        var tspan = document.createElementNS(this.SVGNS, 'tspan');
                        if (newLine) {
                            tspan.setAttribute('x', textEl.PosX.toString());
                            tspan.setAttribute('dy', dy + "em");
                            newLine = false;
                        }
                        dy = 1.6; // line height
                        //tspan.innerHTML = stringParts[i];
                        if (line[i].IsBold) {
                            tspan.style.fontWeight = "bold";
                        }
                        if (line[i].IsItalic) {
                            tspan.style.fontStyle = "italic";
                        }
                        if (line[i].IsUnderline) {
                            tspan.style.textDecoration = "underline";
                        }
                        tspan.textContent = line[i].Separator + line[i].Text;
                        text.appendChild(tspan);
                        currentLine.push(tspan);
                        //lineWidth += tspan.getBBox().width
                    }
                    //if (allowJustify && textEl.HorizontalAlign == TextAlign.Justify) {
                    //    let availableSpace = textEl.JustifyWidth - lineWidth;
                    //    let spaceForEvery = availableSpace / (currentLine.length - 1);
                    //    for (let k = 1; k < currentLine.length; k++) {
                    //        // currentLine[k].setAttribute('dx', spaceForEvery + "px");
                    //    }
                    //}
                }
            }
            else { // plain text, just multiple lines supported
                var stringParts = textEl.Text.split('\n');
                var dy = 0;
                for (var i = 0; i < stringParts.length; i++) {
                    var tspan = document.createElementNS(this.SVGNS, 'tspan');
                    tspan.setAttribute('x', textEl.PosX.toString());
                    tspan.setAttribute('dy', dy + "em");
                    dy = 1.6; // line height
                    tspan.textContent = stringParts[i];
                    text.appendChild(tspan);
                }
            }
            return text;
        };
        /**
         * Render rectangle
         * @param rectEl rectangle to be rendered
         */
        TimelineRenderer.prototype.createRectangleElement = function (rectEl) {
            var path = document.createElementNS(this.SVGNS, 'rect');
            path.setAttribute('class', 'fadeIn');
            path.setAttribute("stroke", rectEl.LineColor);
            path.setAttribute("stroke-width", rectEl.LineWidth);
            path.setAttribute("fill", rectEl.FillColor);
            path.setAttribute('rx', rectEl.RX.toString());
            path.setAttribute('ry', rectEl.RY.toString());
            path.setAttribute('x', rectEl.PosX.toString());
            path.setAttribute('y', rectEl.PosY.toString());
            path.setAttribute('width', rectEl.Width.toString());
            path.setAttribute('height', rectEl.Height.toString());
            return path;
        };
        /**
         * Render circle
         * @param circleEl circle to be rendered
         */
        TimelineRenderer.prototype.createCircleElement = function (circleEl) {
            var path = document.createElementNS(this.SVGNS, 'circle');
            path.setAttribute('class', 'fadeIn');
            path.setAttribute("stroke", circleEl.LineColor);
            path.setAttribute("stroke-width", circleEl.LineWidth);
            path.setAttribute("fill", circleEl.FillColor);
            path.setAttribute('cx', circleEl.Center.PosX.toString());
            path.setAttribute('cy', circleEl.Center.PosY.toString());
            path.setAttribute('r', circleEl.Radius.toString());
            return path;
        };
        /**
         * Render line
         * @param lineEl line to be rendered
         */
        TimelineRenderer.prototype.createLineElement = function (lineEl) {
            var path = document.createElementNS(this.SVGNS, 'path');
            path.setAttribute('class', 'fadeIn');
            if (lineEl.FillColor != null) {
                path.setAttribute("fill", lineEl.FillColor);
            }
            if (lineEl.StrokeCap != null) {
                path.setAttribute("stroke-linecap", lineEl.StrokeCap);
            }
            path.setAttribute("stroke", lineEl.LineColor);
            path.setAttribute("stroke-width", lineEl.LineWidth);
            var pathDesc = "";
            var first = true;
            for (var _i = 0, _a = lineEl.Points; _i < _a.length; _i++) {
                var point = _a[_i];
                var letter = "L";
                if (first) {
                    first = false;
                    letter = "M";
                }
                pathDesc += letter + " " + point.PosX + " " + point.PosY + " ";
            }
            path.setAttribute('d', pathDesc);
            return path;
        };
        /**
         * Render image
         * @param el
         */
        TimelineRenderer.prototype.createImageElement = function (el) {
            // preloading not used anymore, width and height are specified inside timeline configuration
            //// preload image
            //let img = new Image();
            //img.src = el.ImageUrl;
            //img.onload = () => {
            //};
            var text = document.createElementNS(this.SVGNS, 'image');
            text.setAttribute('class', 'fadeIn');
            if (el.EnableBorderRadius) {
                text.setAttribute('clip-path', "url(#c1)");
            }
            if (el.EnableBgMask) {
                text.setAttribute('mask', "url(#m1)");
            }
            text.setAttribute('x', el.PosX.toString());
            text.setAttribute('y', el.PosY.toString());
            text.setAttribute('width', el.Width.toString());
            text.setAttribute('height', el.Height.toString());
            text.setAttribute('preserveAspectRatio', "xMidYMid  meet");
            text.setAttributeNS(this.XLINKNS, 'href', el.ImageUrl);
            return text;
        };
        /**
         * Perform vertical alignment of given texts (as a workaround for weird SVG baseline align support)
         * @param text text SVG element
         * @param textEl rendered text element
         */
        TimelineRenderer.prototype.alignTextElement = function (text, textEl) {
            var targetY = textEl.PosY;
            var bbox = text.getBBox();
            if (textEl.VerticalAlign == renderedtext_1.TextAlign.Start)
                targetY += 0;
            else if (textEl.VerticalAlign == renderedtext_1.TextAlign.Middle)
                targetY += bbox.height / 2;
            else if (textEl.VerticalAlign == renderedtext_1.TextAlign.End)
                targetY += textEl.FontSize * 1.2; // line height?
            // we just need to shift the first line
            text.setAttribute('y', targetY.toString());
            if (textEl.Rotate != 0) {
                text.setAttribute('transform', "rotate(" + textEl.Rotate.toString() + ", " + textEl.PosX + ", " + textEl.PosY + ")");
            }
        };
        /**
         * Return { width, height} of rendered text
         * @param textEl rendered text element
         */
        TimelineRenderer.prototype.measureTextElement = function (textEl) {
            // Create element, inject it into SVG, measure it, remove (otherwise BBox is 0)
            var text = this.createTextElement(textEl, true);
            this.Container.appendChild(text);
            var bbox = text.getBBox();
            this.Container.removeChild(text);
            return { width: bbox.width, height: bbox.height };
        };
        /**
         * Add child to internal collection and SVG parent
         * @param element
         */
        TimelineRenderer.prototype.addChild = function (element) {
            this.Elements.push(element);
            this.Container.appendChild(element);
        };
        /**
         * Rendering loop for different rendered elements
         * @param element rendered element
         * @param textElementAggregator aggregates all text elements for subsequent alignment workaround
         */
        TimelineRenderer.prototype.ConstructChild = function (element, textElementAggregator) {
            // Render links
            if (element instanceof renderedlink_1.RenderedLink) {
                var rLink = element;
                var link = this.createLinkElement(rLink.Link, rLink.Target, rLink.Tooltip);
                for (var _i = 0, _a = element.Children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    link.appendChild(this.ConstructChild(child, textElementAggregator));
                }
                return link;
            }
            else if (element instanceof renderedtext_1.RenderedText) {
                // Create SVG Text element, insert it into DOM and align it (alignment needs BBOX which needs the DOM presence)
                var textEl = this.createTextElement(element, true);
                textElementAggregator.push({ "Description": element, "Element": textEl });
                return textEl;
            }
            else if (element instanceof renderedline_1.RenderedLine) {
                return this.createLineElement(element);
            }
            else if (element instanceof renderedcircle_1.RenderedCircle) {
                return this.createCircleElement(element);
            }
            else if (element instanceof renderedrectangle_1.RenderedRectangle) {
                return this.createRectangleElement(element);
            }
            else // Render images
             if (element instanceof renderedimage_1.RenderedImage) {
                return this.createImageElement(element);
            }
        };
        /**
         * Render elements
         */
        TimelineRenderer.prototype.Construct = function () {
            // Background rectangle
            var rect = document.createElementNS(this.SVGNS, 'rect');
            rect.setAttribute('x', "0");
            rect.setAttribute('y', "0");
            rect.setAttribute('width', this.Timeline.TotalWidth.toString());
            rect.setAttribute('height', this.Timeline.TotalHeight.toString());
            rect.setAttribute('fill', this.Timeline.BackgroundColor);
            this.addChild(rect);
            // Main image background mask (vertical fade-out)
            var maskEl = document.createElementNS(this.SVGNS, 'mask');
            maskEl.setAttribute("maskUnits", "objectBoundingBox");
            maskEl.setAttribute("maskContentUnits", "objectBoundingBox");
            maskEl.setAttribute("id", "m1");
            var gradient = document.createElementNS(this.SVGNS, 'linearGradient');
            gradient.setAttribute("id", "lgF1");
            gradient.setAttribute("gradientTransform", "rotate(90)");
            var stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#fff");
            gradient.appendChild(stop);
            stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "0.75");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#fff");
            gradient.appendChild(stop);
            stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "1");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#000");
            gradient.appendChild(stop);
            maskEl.appendChild(gradient);
            var maskRect = document.createElementNS(this.SVGNS, 'rect');
            maskRect.setAttribute("fill", "url(#lgF1)");
            maskRect.setAttribute("x", "0");
            maskRect.setAttribute("y", "0");
            maskRect.setAttribute("width", "1");
            maskRect.setAttribute("height", "1");
            maskEl.appendChild(maskRect);
            this.addChild(maskEl);
            // Event image clipping mask
            var clipPath = document.createElementNS(this.SVGNS, 'clipPath');
            clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
            clipPath.setAttribute("id", "c1");
            var clipRect = document.createElementNS(this.SVGNS, 'rect');
            clipRect.setAttribute("x", "0");
            clipRect.setAttribute("y", "0");
            clipRect.setAttribute("width", "1");
            clipRect.setAttribute("height", "1");
            clipRect.setAttribute("rx", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
            clipRect.setAttribute("ry", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
            clipPath.appendChild(clipRect);
            this.addChild(clipPath);
            var aggregator = [];
            // Render top level groups and then insert corresponding elements into them
            for (var _i = 0, _a = this.Timeline.Groups; _i < _a.length; _i++) {
                var groupId = _a[_i];
                var groupEl = document.createElementNS(this.SVGNS, 'g');
                groupEl.setAttribute("id", groupId);
                this.addChild(groupEl);
                // Render individual elements
                for (var _b = 0, _c = this.Timeline.Elements; _b < _c.length; _b++) {
                    var element = _c[_b];
                    if (element.GroupId == groupId) {
                        this.addChild(this.ConstructChild(element, aggregator));
                    }
                }
            }
            // Align text elements (cannot be aligned before they are added to the DOM/SVG tree)
            // It's a workaround for not supported baseline alignment in EDGE/Firefox
            for (var _d = 0, aggregator_1 = aggregator; _d < aggregator_1.length; _d++) {
                var textElement = aggregator_1[_d];
                this.alignTextElement(textElement.Element, textElement.Description);
            }
        };
        return TimelineRenderer;
    }());
    exports.TimelineRenderer = TimelineRenderer;
});
define("entistimeline_placer", ["require", "exports", "RenderModel/renderedtimeline", "RenderModel/renderedtext", "RenderModel/pointspec", "RenderModel/renderedline", "RenderModel/renderedlink", "RenderModel/renderedrectangle", "DataModel/timespecification", "RenderModel/renderedimage", "DataModel/timelinetextpart"], function (require, exports, renderedtimeline_1, renderedtext_2, pointspec_1, renderedline_2, renderedlink_2, renderedrectangle_2, timespecification_3, renderedimage_2, timelinetextpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Helper class for distance between events
     */
    var MaxDistInfo = /** @class */ (function () {
        function MaxDistInfo() {
        }
        return MaxDistInfo;
    }());
    /**
     * Timeline Step enumeration
     */
    var TimelineStep;
    (function (TimelineStep) {
        TimelineStep[TimelineStep["Year"] = 0] = "Year";
        TimelineStep[TimelineStep["Month"] = 1] = "Month";
        TimelineStep[TimelineStep["Day"] = 2] = "Day";
        TimelineStep[TimelineStep["Hour"] = 3] = "Hour";
        TimelineStep[TimelineStep["Minute"] = 4] = "Minute";
        TimelineStep[TimelineStep["Second"] = 5] = "Second";
        TimelineStep[TimelineStep["FiveYears"] = 6] = "FiveYears";
    })(TimelineStep || (TimelineStep = {}));
    /**
     * Timeline Placing Utility
     */
    var TimelinePlacer = /** @class */ (function () {
        /**
         * Create new timeline placer
         * @param timeline timeline model
         * @param renderer timeline renderer
         * @param viewport viewport configuration
         */
        function TimelinePlacer(timeline, renderer, viewport) {
            this.timeline = timeline;
            this.renderer = renderer;
            this.viewport = viewport;
            /**
             * Additional planned space for the footer
             */
            this.footerCompensation = 0;
            /**
             * Default padding between event lines in case of overlaps
             */
            this.eventLinePadding = 6;
            /**
             * Remaining width between category lines and event rectangles for the event lines to be placed
             */
            this.spaceForEventLines = 0;
            /**
             * Whether the event times should be drawn on event lines (if there's enough space) or be part of the event tag
             */
            this.colapseEventTimesIntoTag = false;
            /**
             * Minimum axis difference between nearest (non-identical) events
             */
            this.minEventDiff = 30;
            /**
             * Height of collapsed area made from empty space cuts
             */
            this.cutPlaceholderHeight = 300;
            /**
             * Group for elements related to header
             */
            this.GROUP_HEADER = "GroupHeader";
            /**
             * Group for elements related to axis ticks
             */
            this.GROUP_TIMELINE = "GroupTimeline";
            /**
             * Group for elements related to footer
             */
            this.GROUP_FOOTER = "GroupFooter";
            /**
             * Group for elements related to categories
             */
            this.GROUP_CATEGORIES = "GroupCategories";
            /**
             * Group for elements related to events
             */
            this.GROUP_EVENTS = "GroupEvents";
            this.timelineLinks = [];
        }
        /**
         * Interpolate font size specified as height or width screen ratio based on theme configuration
         * @param heightRatio requested height ratio (might be null if width ratio is specified)
         * @param widthRatio requested width ratio (might be null if height ratio is specified)
         * @param theme current theme
         */
        TimelinePlacer.prototype.calcFontSize = function (heightRatio, widthRatio, theme) {
            return Math.min(Math.max(this.calcRelativeSize(heightRatio, widthRatio, theme), theme.DefaultMinFontSize), theme.DefaultMaxFontSize);
        };
        /**
         * Calculate size as a ratio of viewport width/height
         * @param heightRatio requested height ratio (might be null if width ratio is specified)
         * @param widthRatio requested width ratio (might be null if height ratio is specified)
         * @param theme current theme
         */
        TimelinePlacer.prototype.calcRelativeSize = function (heightRatio, widthRatio, theme) {
            if (heightRatio != null) {
                return heightRatio * this.viewport.Height;
            }
            else {
                return widthRatio * this.viewport.Width;
            }
        };
        /**
         * Find index of given category
         * @param cats
         * @param needle
         */
        TimelinePlacer.prototype.getCategoryIndex = function (cats, needle) {
            var index = 0;
            for (var _i = 0, cats_1 = cats; _i < cats_1.length; _i++) {
                var cat = cats_1[_i];
                if (cat.Id == needle.Id) {
                    return index;
                }
                index++;
            }
            return -1;
        };
        /**
         * Place axis timeline
         */
        TimelinePlacer.prototype.CreateTimeline = function () {
            // relevant axis length
            var diff = this.end - this.start;
            var step = TimelineStep.Year;
            // Detect expected step
            if (diff > 1000 * 60 * 60 * 24 * 365 * 25) { // at least 25 years
                step = TimelineStep.FiveYears;
            }
            else if (diff > 1000 * 60 * 60 * 24 * 365 * 5) { // at least five years
                step = TimelineStep.Year;
            }
            else if (diff > 1000 * 60 * 60 * 24 * 30 * 5) { // at least five months
                step = TimelineStep.Month;
            }
            else if (diff > 1000 * 60 * 60 * 24 * 3) { // at least three days
                step = TimelineStep.Day;
            }
            else if (diff > 1000 * 60 * 60 * 3) { // at least three hours
                step = TimelineStep.Hour;
            }
            else
                step = TimelineStep.Minute;
            var startDate = new Date(this.start);
            var endDate = new Date(this.end);
            var timelineOffset = this.calcRelativeSize(null, 0.01, this.timeline.Theme);
            var fontSize = this.calcFontSize(0.01, null, this.timeline.Theme);
            // Choose starting point w.r.t. step
            if (step === TimelineStep.FiveYears) {
                startDate = new Date(Math.floor(startDate.getFullYear() / 5) * 5, 0, 1, 0, 0, 0, 0);
            }
            else if (step === TimelineStep.Year) {
                startDate = new Date(startDate.getFullYear(), 0, 1, 0, 0, 0, 0);
            }
            else if (step === TimelineStep.Month) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 0);
            }
            else if (step === TimelineStep.Day) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
            }
            else if (step === TimelineStep.Hour) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), 0, 0, 0);
            }
            else if (step === TimelineStep.Minute) {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), 0, 0);
            }
            var lastDate = null;
            var lastTextOffset = 0;
            // Loop from start to end
            while (startDate < endDate) {
                var text = "";
                var includeYear = (lastDate != null && lastDate.getFullYear() == startDate.getFullYear() ? false : true);
                // Prepare text element
                if ((step === TimelineStep.Year) || (step === TimelineStep.FiveYears)) {
                    text = startDate.getFullYear().toString();
                }
                else if (step === TimelineStep.Month) {
                    text = startDate.getMonth() + (includeYear ? "/" + startDate.getFullYear() : "");
                }
                else if (step === TimelineStep.Day) {
                    text = startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + (includeYear ? "" + startDate.getFullYear() : "");
                }
                else if (step === TimelineStep.Hour) {
                    text = startDate.getHours() + "h " + startDate.getDate() + "." + (startDate.getMonth() + 1) + ".";
                }
                else if (step === TimelineStep.Minute) {
                    text = startDate.getHours() + ":" + startDate.getMinutes() + " " + startDate.getDate() + "." + (startDate.getMonth() + 1) + ".";
                }
                var currentPos = timespecification_3.TimeSpecification.CalcTimeVal(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
                var ratio = (currentPos - this.start) / (this.end - this.start);
                var offset = this.topOffset + ratio * (this.availableHeight);
                var eventText = new renderedtext_2.RenderedText(text, this.baseLineOffset - timelineOffset, offset - 5, renderedtext_2.TextAlign.Start, renderedtext_2.TextAlign.Start, event, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, -90, null, null);
                var eventTextBox = this.renderer.measureTextElement(eventText);
                var skip = false;
                // skip if we've got an event for the same timestamp
                for (var _i = 0, _a = this.timeline.Events; _i < _a.length; _i++) {
                    var event_2 = _a[_i];
                    for (var _b = 0, _c = event_2.Occurences; _b < _c.length; _b++) {
                        var occurence = _c[_b];
                        if ((occurence.Time.HasStart && occurence.Time.GetStartDate().getTime() == startDate.getTime())
                            || (occurence.Time.HasEnd && occurence.Time.GetEndDate().getTime() == startDate.getTime())) {
                            skip = true;
                        }
                    }
                }
                // skip if won't fit completely
                if (offset - 5 - eventTextBox.width <= lastTextOffset) {
                    skip = true;
                }
                if (!skip) {
                    lastTextOffset = offset;
                    this.placement.AddElement(eventText, this.GROUP_TIMELINE);
                    this.timelineTexts.push(eventText);
                }
                // Make small tick next to text
                var line = new renderedline_2.RenderedLine("1px", this.timeline.Theme.DefaultNoteFontColor, "transparent", null);
                line.Points.push(new pointspec_1.PointSpec(this.baseLineOffset - timelineOffset, offset));
                line.Points.push(new pointspec_1.PointSpec(this.baseLineOffset, offset));
                this.placement.AddElement(line, this.GROUP_TIMELINE);
                this.timelineLines.push(line);
                lastDate = startDate;
                // Advance to next label
                if (step === TimelineStep.FiveYears) {
                    startDate = new Date(startDate.getFullYear() + 5, 0, 1, 0, 0, 0);
                }
                else if (step === TimelineStep.Year) {
                    startDate = new Date(startDate.getFullYear() + 1, 0, 1, 0, 0, 0);
                }
                else if (step === TimelineStep.Month) {
                    startDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
                }
                else if (step === TimelineStep.Day) {
                    startDate = new Date(startDate.setDate(startDate.getDate() + 1));
                }
                else if (step === TimelineStep.Hour) {
                    startDate = new Date(startDate.setHours(startDate.getHours() + 1));
                }
                else if (step === TimelineStep.Minute) {
                    startDate = new Date(startDate.setMinutes(startDate.getMinutes() + 1));
                }
            }
        };
        /**
         * Merge two arrays
         * @param first first array
         * @param second second array
         */
        TimelinePlacer.prototype.joinArray = function (first, second) {
            for (var _i = 0, second_1 = second; _i < second_1.length; _i++) {
                var item = second_1[_i];
                first.push(item);
            }
        };
        /**
         * Parse text (which might be using b/i/u tags) into internal representation
         * @param text source text
         */
        TimelinePlacer.prototype.parseStructuredText = function (text) {
            var words = [];
            var isBold = false;
            var isItalic = false;
            var isUnderline = false;
            var buffer = '';
            var bufferedSeparator = '';
            var j = 0;
            while (j < text.length) {
                if (text.substr(j, 3).toUpperCase() == "<B>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isBold = true;
                    j += 3;
                }
                else if (text.substr(j, 3).toUpperCase() == "<I>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isItalic = true;
                    j += 3;
                }
                else if (text.substr(j, 3).toUpperCase() == "<U>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isUnderline = true;
                    j += 3;
                }
                else if (text.substr(j, 4).toUpperCase() == "</B>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isBold = false;
                    j += 4;
                }
                else if (text.substr(j, 4).toUpperCase() == "</I>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isItalic = false;
                    j += 4;
                }
                else if (text.substr(j, 4).toUpperCase() == "</U>") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = '';
                    buffer = '';
                    isUnderline = false;
                    j += 4;
                }
                else if (text.substr(j, 1) == " ") {
                    words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                    bufferedSeparator = ' ';
                    buffer = '';
                    j += 1;
                }
                else {
                    buffer += text.substr(j, 1);
                    j += 1;
                }
            }
            if (buffer.length > 0) {
                words.push(new timelinetextpart_1.TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
            }
            return words;
        };
        /**
         * Wrap text so it does not exceeds given width
         * @param timelineText text element
         * @param maxWidth maximum width
         */
        TimelinePlacer.prototype.WrapMultilineText = function (timelineText, maxWidth) {
            var stringParts = timelineText.Text.split(' ');
            var startText = [];
            var lastText = [];
            var lines = [];
            var words = this.parseStructuredText(timelineText.Text);
            // keeps adding one word after another till the text is larger than the maxWidth
            var i = 0;
            while (i < words.length) {
                // slice(0) as clone
                lastText = startText.slice(0);
                var candidates = [];
                candidates.push(words[i]);
                if ((words[i].Text.length <= 3) && words.length > i + 1) {
                    // add one more word, do not leave short words at the end of lines
                    i++;
                    candidates.push(words[i]);
                }
                // one more (for things like "as a")
                if ((words[i].Text.length <= 3) && words.length > i + 1) {
                    i++;
                    candidates.push(words[i]);
                }
                this.joinArray(startText, candidates);
                timelineText.StructuredText = [startText];
                var timelineDescriptionBox = this.renderer.measureTextElement(timelineText);
                // if too wide, break line and continue
                if (timelineDescriptionBox.width > maxWidth) {
                    if (lastText.length > 0) {
                        lines.push(lastText);
                    }
                    // Space separator get's cleared when making new line
                    startText = candidates.slice(0);
                    if (startText.length > 0 && startText[0].Separator == ' ') {
                        startText[0].Separator = '';
                    }
                }
                i++;
            }
            lines.push(startText);
            timelineText.StructuredText = lines;
        };
        /**
         * Place timeline footer (coopyright, datasource info, etc.)
         */
        TimelinePlacer.prototype.CreateFooter = function () {
            // Footer note
            var fontSize = this.calcFontSize(0.015, null, this.timeline.Theme);
            var smallFontSize = this.calcFontSize(0.01, null, this.timeline.Theme);
            // made with entistimeline.com
            var innerText = new renderedtext_2.RenderedText("entistimeline.com", this.placement.TotalWidth - this.padding * 3, this.placement.TotalHeight - this.padding, renderedtext_2.TextAlign.End, renderedtext_2.TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
            var linkEl = new renderedlink_2.RenderedLink("https://timeline.entis-design.com", "blank", "visit timeline.entis-design.com", [innerText], null);
            this.placement.AddElement(linkEl, this.GROUP_FOOTER);
            var linkElBox = this.renderer.measureTextElement(innerText);
            this.placement.AddElement(new renderedtext_2.RenderedText("made with", this.placement.TotalWidth - this.padding * 3 - linkElBox.width, this.placement.TotalHeight - this.padding, renderedtext_2.TextAlign.End, renderedtext_2.TextAlign.Start, null, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultNoteFontColor, 0, null, null), this.GROUP_FOOTER);
            // Datasource info
            if (this.timeline.DataSource != null) {
                var dataSourceText = new renderedtext_2.RenderedText(this.timeline.DataSource, this.padding * 3, this.placement.TotalHeight - this.padding, renderedtext_2.TextAlign.Start, renderedtext_2.TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
                this.WrapMultilineText(dataSourceText, this.baseLineOffset);
                var sourceLinkBox = this.renderer.measureTextElement(dataSourceText);
                this.placement.TotalHeight += sourceLinkBox.height;
                this.footerCompensation += sourceLinkBox.height;
                // Enlarge if needed
                this.RecalcAvailableHeight();
                if (this.timeline.DataSourceLink != null) {
                    var dataSourceLink = new renderedlink_2.RenderedLink(this.timeline.DataSourceLink, "blank", this.timeline.DataSourceLink, [dataSourceText], null);
                    this.placement.AddElement(dataSourceLink, this.GROUP_FOOTER);
                }
                else {
                    this.placement.AddElement(dataSourceText, this.GROUP_FOOTER);
                }
            }
        };
        /**
         * Place timeline header (title, description, links and image)
         */
        TimelinePlacer.prototype.CreateHeader = function () {
            var offset = 0;
            // Title font size
            var fontSize = this.calcFontSize(null, 0.05, this.timeline.Theme);
            // Title image
            if (this.timeline.Image != null) {
                var aspectRatio = this.timeline.Image.Width / this.timeline.Image.Height;
                if ((this.timeline.Image.Width > 0) && (this.timeline.Image.Height > 0)) {
                    var iWidth = this.placement.TotalWidth;
                    var iHeight = iWidth / aspectRatio;
                    var inlineImage = new renderedimage_2.RenderedImage(this.timeline.Image.Url, 0, 0, iWidth, iHeight, false, true, null);
                    this.placement.AddElement(inlineImage, this.GROUP_HEADER);
                }
            }
            // Title
            this.timelineTitle = new renderedtext_2.RenderedText(this.timeline.Title, this.padding, offset, renderedtext_2.TextAlign.End, renderedtext_2.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
            this.WrapMultilineText(this.timelineTitle, this.placement.TotalWidth * 0.45);
            this.placement.AddElement(this.timelineTitle, this.GROUP_HEADER);
            var timelineBox = this.renderer.measureTextElement(this.timelineTitle);
            offset += timelineBox.height + this.padding;
            var descWidth = this.placement.TotalWidth * 0.4;
            // Description
            if ((this.timeline.Description != null) && (this.timeline.Description.length > 0)) {
                fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
                this.timelineDescription = new renderedtext_2.RenderedText(this.timeline.Description, this.padding, offset, renderedtext_2.TextAlign.End, renderedtext_2.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, descWidth);
                this.WrapMultilineText(this.timelineDescription, descWidth);
                this.placement.AddElement(this.timelineDescription, this.GROUP_HEADER);
                var timelineDescriptionBox = this.renderer.measureTextElement(this.timelineDescription);
                offset += timelineDescriptionBox.height;
            }
            // Title links
            if (this.timeline.Links.length > 0) {
                offset += this.padding;
                for (var _i = 0, _a = this.timeline.Links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    var linkEl = new renderedtext_2.RenderedText(link.Text, this.padding + descWidth, offset, renderedtext_2.TextAlign.End, renderedtext_2.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, null);
                    var size = this.renderer.measureTextElement(linkEl);
                    var linkBg = new renderedline_2.RenderedLine(this.eventLineWidth, this.timeline.Theme.HeaderLinkColor, "transparent", null);
                    linkBg.Points.push(new pointspec_1.PointSpec(this.padding + descWidth - size.width, offset + size.height + fontSize * 0.5));
                    linkBg.Points.push(new pointspec_1.PointSpec(this.padding + descWidth, offset + size.height + fontSize * 0.5));
                    var linkParent = new renderedlink_2.RenderedLink(link.Url, link.Target, link.Tooltip, [linkBg, linkEl], null);
                    this.placement.AddElement(linkParent, this.GROUP_HEADER);
                    offset += size.height + fontSize * 1;
                    this.timelineLinks.push({ "line": linkBg, "text": linkEl });
                }
            }
            // Store header height
            this.headerHeight = offset;
        };
        /**
         * Move elements to their correct position based on position of other elements
         * */
        TimelinePlacer.prototype.FinalPlacement = function () {
            // Title, description and links are aligned from right, therefore we need the offset before axis lines)
            this.timelineTitle.PosX = this.baseLineOffset - this.padding * 2;
            if (this.timelineDescription != null) {
                this.timelineDescription.PosX = this.baseLineOffset - this.padding * 2;
            }
            for (var _i = 0, _a = this.timelineLinks; _i < _a.length; _i++) {
                var link = _a[_i];
                link.text.PosX = this.timelineDescription.PosX;
                var linkWidth = link.line.Points[1].PosX - link.line.Points[0].PosX;
                link.line.Points[0].PosX = this.timelineDescription.PosX - linkWidth;
                link.line.Points[1].PosX = this.timelineDescription.PosX;
            }
        };
        /**
         * Place points for axis/category lines based on total height
         */
        TimelinePlacer.prototype.FinalizeCategoryLines = function () {
            var lineOffset = this.baseLineOffset;
            for (var _i = 0, _a = this.timeline.Categories; _i < _a.length; _i++) {
                var category = _a[_i];
                var linePadding = 0;
                if (this.timeline.SelfContained == true) {
                    category.TagLine.StrokeCap = "round";
                    linePadding = this.padding;
                }
                category.TagLine.Points.push(new pointspec_1.PointSpec(lineOffset, linePadding));
                category.TagLine.Points.push(new pointspec_1.PointSpec(lineOffset, this.placement.TotalHeight - linePadding));
                lineOffset += this.categoryLineWidthSpaced;
            }
        };
        /**
         * Place axis/category lines
         */
        TimelinePlacer.prototype.CreateCategoryLines = function () {
            var categoryIndex = 0;
            for (var _i = 0, _a = this.timeline.Categories; _i < _a.length; _i++) {
                var category = _a[_i];
                var categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                var line = new renderedline_2.RenderedLine(this.categoryLineWidth + "px", categoryColor, "transparent", null);
                this.placement.AddElement(line, this.GROUP_CATEGORIES);
                category.TagLine = line;
                categoryIndex++;
            }
        };
        /** Place events
         */
        TimelinePlacer.prototype.CreateEvents = function () {
            // Create two event columns (left/right)
            var eventCols = [];
            var lineAreaSafeMargin = 60;
            // At most 350 pixels wide
            var colWidth = Math.min(350, (this.placement.TotalWidth - this.lineAreaWidth - lineAreaSafeMargin * 2) / 2 - this.padding * 2);
            this.spaceForEventLines = ((this.placement.TotalWidth - this.lineAreaWidth) / 2 - colWidth);
            var eventMargin = this.spaceForEventLines * 0.25;
            // Set column positions
            eventCols.push({ leftOffset: this.padding + eventMargin, width: colWidth, topOffset: this.topOffset, pos: 'onLeft' });
            eventCols.push({ leftOffset: this.placement.TotalWidth - colWidth - this.padding - eventMargin, width: colWidth, topOffset: this.categoryHorizontalOffset, pos: 'onRight' });
            // Events
            var fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
            var smallFontSize = this.calcFontSize(0.015, null, this.timeline.Theme);
            var eventPadding = 5;
            var colNum = 0;
            var eventRect = null;
            var eventLinkRect = null;
            var eventLinkSize = 30;
            var linkLine = null;
            var lastEvent = null;
            var lastEventTimestamp = null;
            // First pass - Loop through events and place them
            for (var _i = 0, _a = this.timeline.Events; _i < _a.length; _i++) {
                var event_3 = _a[_i];
                // pick the column where's more space
                if (eventCols[0].topOffset > eventCols[1].topOffset)
                    colNum = 1;
                else
                    colNum = 0;
                var eventWidth = eventCols[colNum].width;
                var eventHeight = 0; // is calculated by adding numbers below
                var leftOffset = eventCols[colNum].leftOffset;
                var firstOccurence = event_3.Occurences[0];
                var ratio = (timespecification_3.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight) - fontSize - 3;
                eventCols[colNum].topOffset = Math.max(desiredTopOffset, eventCols[colNum].topOffset);
                // Event boxes should preserve time ordering
                if (lastEvent != null) {
                    eventCols[colNum].topOffset = Math.max(eventCols[colNum].topOffset, lastEvent.Tag.PosY + this.padding);
                }
                // Create event link (arrow), place it later
                if (event_3.Link != null) {
                    eventLinkRect = new renderedrectangle_2.RenderedRectangle("5px", "tranparent", this.timeline.Theme.EventBgColor, 0, 0, eventLinkSize, eventLinkSize, 5, 5, event_3);
                    linkLine = new renderedline_2.RenderedLine("3px", "#ccc", "transparent", event_3);
                    linkLine.StrokeCap = "round";
                    var linkHelpLine = new renderedlink_2.RenderedLink(event_3.Link.Url, event_3.Link.Target, event_3.Link.Tooltip, [eventLinkRect, linkLine], event_3);
                    this.placement.AddElement(linkHelpLine, this.GROUP_EVENTS);
                    event_3.Tag.add(linkHelpLine);
                }
                // Place event rectangle (when image or description is present)
                if (event_3.Text != null || event_3.Image != null) {
                    eventRect = new renderedrectangle_2.RenderedRectangle("0", "#fff", this.timeline.Theme.EventBgColor, leftOffset, 0, 5, 5, 5, 5, event_3);
                    this.placement.AddElement(eventRect, this.GROUP_EVENTS);
                    event_3.Tag.add(eventRect);
                }
                // line below event title
                var line = new renderedline_2.RenderedLine(this.eventLineWidth, this.timeline.Theme.EventTitleLineColor, "transparent", null);
                event_3.Tag.add(line);
                this.placement.AddElement(line, this.GROUP_EVENTS);
                var titleAlign = renderedtext_2.TextAlign.Start;
                var titleOffset = leftOffset;
                if (eventCols[colNum].pos == 'onLeft') {
                    titleAlign = renderedtext_2.TextAlign.End;
                    titleOffset = leftOffset + eventWidth;
                }
                var eventTitle = event_3.Title;
                if (this.colapseEventTimesIntoTag) {
                    eventTitle += " (";
                    var first = true;
                    for (var _b = 0, _c = event_3.Occurences; _b < _c.length; _b++) {
                        var occurence = _c[_b];
                        eventTitle += (first ? "" : ", ") + occurence.Time.GetTimeDescription(lastEventTimestamp);
                        lastEventTimestamp = occurence.Time;
                        first = false;
                    }
                    eventTitle += ")";
                }
                // Event title
                var eventText = new renderedtext_2.RenderedText(eventTitle, titleOffset, eventCols[colNum].topOffset - 3, titleAlign, renderedtext_2.TextAlign.End, event_3, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
                event_3.Tag.add(eventText);
                this.placement.AddElement(eventText, this.GROUP_EVENTS);
                // Wrap if too wide
                this.WrapMultilineText(eventText, eventWidth);
                event_3.Tag.Col = colNum;
                var eventTextBox = this.renderer.measureTextElement(eventText);
                // Different for left/right columns
                if (eventCols[colNum].pos == 'onLeft') {
                    event_3.Tag.PosX = leftOffset + eventWidth + eventPadding;
                }
                else {
                    event_3.Tag.PosX = leftOffset - eventPadding;
                }
                eventHeight += eventTextBox.height;
                event_3.Tag.PosY = eventCols[colNum].topOffset + eventTextBox.height;
                event_3.Tag.StartY = eventCols[colNum].topOffset + eventTextBox.height;
                var lineStart = leftOffset - eventPadding;
                var lineEnd = leftOffset + ((event_3.Image != null || event_3.Text != null) ? eventWidth : eventTextBox.width) + eventPadding;
                if ((eventCols[colNum].pos == 'onLeft') && (event_3.Text == null) && (event_3.Image == null)) {
                    lineStart = leftOffset + eventWidth - eventTextBox.width - eventPadding;
                    lineEnd = leftOffset + eventWidth + eventPadding;
                }
                // line below event title
                line.Points.push(new pointspec_1.PointSpec(lineStart, event_3.Tag.PosY));
                line.Points.push(new pointspec_1.PointSpec(lineEnd, event_3.Tag.PosY));
                eventCols[colNum].topOffset += eventTextBox.height;
                // Place event description and/or image
                if (event_3.Text != null || event_3.Image != null) {
                    eventRect.PosX = leftOffset - eventPadding;
                    eventRect.PosY = eventCols[colNum].topOffset;
                    eventCols[colNum].topOffset += eventPadding;
                    // Event description
                    if (event_3.Text != null) {
                        var eventDescription = new renderedtext_2.RenderedText(event_3.Text, leftOffset, eventCols[colNum].topOffset, renderedtext_2.TextAlign.Start, renderedtext_2.TextAlign.End, event_3, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultFontColor, 0, null, eventWidth);
                        event_3.Tag.add(eventDescription);
                        this.placement.AddElement(eventDescription, this.GROUP_EVENTS);
                        this.WrapMultilineText(eventDescription, eventWidth);
                        var eventDescriptionBox = this.renderer.measureTextElement(eventDescription);
                        eventCols[colNum].topOffset += eventDescriptionBox.height;
                        eventCols[colNum].topOffset += eventPadding;
                        eventHeight += eventPadding + eventDescriptionBox.height;
                    }
                    // Event image
                    if (event_3.Image != null) {
                        if (event_3.Text != null) {
                            eventCols[colNum].topOffset += eventPadding;
                        }
                        var aspectRatio = event_3.Image.Width / event_3.Image.Height;
                        if ((event_3.Image.Width > 0) && (event_3.Image.Height > 0)) {
                            var iWidth = eventCols[colNum].width;
                            var iHeight = iWidth / aspectRatio;
                            var inlineImage = new renderedimage_2.RenderedImage(event_3.Image.Url, eventCols[colNum].leftOffset, eventCols[colNum].topOffset, iWidth, iHeight, true, false, event_3);
                            this.placement.AddElement(inlineImage, this.GROUP_EVENTS);
                            eventCols[colNum].topOffset += iHeight;
                            event_3.Tag.add(inlineImage);
                            eventHeight += iHeight;
                        }
                    }
                    eventRect.Width = eventWidth + eventPadding * 2;
                    eventRect.Height = eventCols[colNum].topOffset - eventRect.PosY + eventPadding;
                }
                // Place event link (arrow)
                if (event_3.Link != null) {
                    eventLinkRect.PosX = (colNum == 0 ? lineStart : lineEnd - eventLinkSize);
                    eventLinkRect.PosY = eventCols[colNum].topOffset;
                    linkLine.Points.push(new pointspec_1.PointSpec(eventLinkRect.PosX + eventLinkSize / 3, eventLinkRect.PosY + eventLinkSize / 3));
                    linkLine.Points.push(new pointspec_1.PointSpec(eventLinkRect.PosX + eventLinkSize / 3 * 2, eventLinkRect.PosY + eventLinkSize / 2));
                    linkLine.Points.push(new pointspec_1.PointSpec(eventLinkRect.PosX + eventLinkSize / 3, eventLinkRect.PosY + eventLinkSize / 3 * 2));
                    eventCols[colNum].topOffset += eventLinkSize;
                    eventHeight += eventLinkSize;
                }
                eventCols[colNum].topOffset += this.padding;
                eventHeight += this.padding;
                event_3.Tag.Height = eventHeight;
                // enlarge drawing area if we are outside of the boundaries (add padding for footer height)
                this.placement.TotalHeight = Math.max(this.placement.TotalHeight, eventCols[colNum].topOffset + this.padding * 4);
                lastEvent = event_3;
            }
            // Enlarge if needed
            this.RecalcAvailableHeight();
            var totalLeftDiff = 0;
            var totalRightDiff = 0;
            // Second pass - aggregate differences between vertical offset as requested by event occurences and real offset (as a result of placing)
            for (var y = 0; y < this.timeline.Events.length; y++) {
                var event_4 = this.timeline.Events[y];
                var firstOccurence = event_4.Occurences[0];
                var ratio = (timespecification_3.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight);
                // if yes
                if (desiredTopOffset < event_4.Tag.PosY) {
                    if (event_4.Tag.Col == 0)
                        totalLeftDiff += event_4.Tag.PosY - desiredTopOffset;
                    else
                        totalRightDiff += event_4.Tag.PosY - desiredTopOffset;
                }
            }
            var maximumDiff = Math.max(totalLeftDiff, totalRightDiff);
            // Enlarge area of at least what we need
            this.placement.TotalHeight += maximumDiff;
            // Third pass - zoom axis based on maximum difference between desired and current position
            //for (let y = 0; y < this.timeline.Events.length; y++) {
            //    const event = this.timeline.Events[y];
            //    const newPosY = minPosY + (event.Tag.PosY - minPosY) * upscaleRatio;
            //    //event.Tag.moveVertically(newPosY - event.Tag.PosY);
            //    //event.Tag.PosY = newPosY;
            //}
            this.RecalcAvailableHeight();
            // Fourth pass - check if text is not above desired offsets on axis (should be equal or below, never above)
            for (var y = 0; y < this.timeline.Events.length; y++) {
                var event_5 = this.timeline.Events[y];
                var firstOccurence = event_5.Occurences[0];
                var ratio = (timespecification_3.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight);
                // if yes
                if (desiredTopOffset > event_5.Tag.PosY) {
                    // move the events (and all events below) more to the bottom
                    var diff = desiredTopOffset - event_5.Tag.PosY;
                    for (var z = y; z < this.timeline.Events.length; z++) {
                        if (event_5.Tag.Col == this.timeline.Events[z].Tag.Col) {
                            this.timeline.Events[z].Tag.moveVertically(diff);
                        }
                    }
                }
            }
            // Fifth pass - check if something has fallen out
            for (var z = 0; z < this.timeline.Events.length; z++) {
                var event_6 = this.timeline.Events[z];
                // if there's an event which overflows the original bounds, we need to extend them again
                var overflow = event_6.Tag.PosY + event_6.Tag.Height + this.padding * 2 - this.placement.TotalHeight;
                if (overflow > 0) {
                    this.footerCompensation = Math.max(this.footerCompensation, overflow);
                }
            }
            this.placement.TotalHeight += this.footerCompensation;
            this.RecalcAvailableHeight();
        };
        /**
         * Find maximum distance between subsequent events
         */
        TimelinePlacer.prototype.findMaxDist = function () {
            var result = new MaxDistInfo();
            result.dist = 0;
            for (var i = 0; i < this.timeline.Events.length - 1; i++) {
                var eventPrev = this.timeline.Events[i];
                var eventNext = this.timeline.Events[i + 1];
                var dist = eventNext.Tag.StartY - (eventPrev.Tag.StartY + eventPrev.Tag.Height);
                if (dist > result.dist) {
                    result.dist = dist;
                    result.start = eventPrev.Tag.StartY + eventPrev.Tag.Height;
                    result.end = eventNext.Tag.PosY;
                }
            }
            return result;
        };
        /**
         * Cut empty space between too distant events
         */
        TimelinePlacer.prototype.CutEmptySpace = function () {
            var compensate = 0;
            // We should check for too long empty sections and cut them
            var cutMarkers = [];
            var cntr = 0;
            while (true) {
                // safeguard counter
                cntr++;
                // find longest empty distances between events (incl. start, end)
                var maxDist = this.findMaxDist();
                // repeat until there's something to cut (or the safeguard is met)
                if ((maxDist.dist < this.timeline.Theme.EmptySpaceThreshold) || (cntr > this.timeline.Events.length)) {
                    break;
                }
                // cut the distance and move all elements below higher
                var diff = (maxDist.dist - this.cutPlaceholderHeight);
                compensate -= diff;
                // Move also all existing cut markers
                for (var _i = 0, cutMarkers_1 = cutMarkers; _i < cutMarkers_1.length; _i++) {
                    var el = cutMarkers_1[_i];
                    if (el.PosY > maxDist.start) {
                        el.moveVertically(-diff);
                    }
                }
                // Construct cut sign (three dots in a circle)
                var circleDiameter = 20;
                var smallCircleDiameter = circleDiameter / 40;
                var centerPoint = new pointspec_1.PointSpec(this.baseLineOffset, maxDist.start + this.cutPlaceholderHeight / 2);
                var eventCircle = new renderedrectangle_2.RenderedRectangle((this.viewport.Width * 0.005) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2, circleDiameter, circleDiameter, null);
                this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventCircle);
                var eventSmallCircle = new renderedrectangle_2.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
                this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventSmallCircle);
                eventSmallCircle = new renderedrectangle_2.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
                this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventSmallCircle);
                eventSmallCircle = new renderedrectangle_2.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX + smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
                this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventSmallCircle);
                // Move also all subsequent events
                for (var _a = 0, _b = this.timeline.Events; _a < _b.length; _a++) {
                    var evt = _b[_a];
                    if (evt.Tag.StartY > maxDist.start) {
                        evt.Tag.moveVertically(-diff);
                    }
                }
                // Remove axis ticks and labels that are not needed any more
                var linesToRemove = [];
                var textsToRemove = [];
                for (var _c = 0, _d = this.timelineLines; _c < _d.length; _c++) {
                    var line = _d[_c];
                    if ((line.Points[0].PosY > maxDist.start) && (line.Points[0].PosY < maxDist.end)) {
                        linesToRemove.push(line);
                    }
                }
                for (var _e = 0, linesToRemove_1 = linesToRemove; _e < linesToRemove_1.length; _e++) {
                    var item = linesToRemove_1[_e];
                    this.timelineLines.splice(this.timelineLines.indexOf(item), 1);
                    this.placement.Elements.splice(this.placement.Elements.indexOf(item), 1);
                }
                for (var _f = 0, _g = this.timelineTexts; _f < _g.length; _f++) {
                    var text = _g[_f];
                    if ((text.PosY > maxDist.start) && (text.PosY < maxDist.end)) {
                        textsToRemove.push(text);
                    }
                }
                for (var _h = 0, textsToRemove_1 = textsToRemove; _h < textsToRemove_1.length; _h++) {
                    var item = textsToRemove_1[_h];
                    this.timelineTexts.splice(this.timelineTexts.indexOf(item), 1);
                    this.placement.Elements.splice(this.placement.Elements.indexOf(item), 1);
                }
            }
            // Adjust total height accordingly
            this.placement.TotalHeight += compensate;
        };
        /**
         * Place individual timeline parts in correct order
         */
        TimelinePlacer.prototype.PlaceVertical = function () {
            this.CreateHeader();
            this.CreateCategoryLines();
            this.CreateCategoryLabels();
            this.CreateEvents();
            this.CreateTimeline();
            this.CreateEventLines();
            this.CutEmptySpace();
            this.CreateFooter();
            this.FinalizeCategoryLines();
            this.FinalPlacement();
        };
        /**
         * Place category labels (bound to axis lines, on top of page)
         */
        TimelinePlacer.prototype.CreateCategoryLabels = function () {
            var categoryIndex = 0;
            var lineOffset = this.baseLineOffset;
            var fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
            this.categoryHorizontalOffset = this.padding * 2;
            for (var _i = 0, _a = this.timeline.Categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if ((category.Title != null) && (category.Title.length > 0)) {
                    var categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                    var categoryRect = new renderedrectangle_2.RenderedRectangle("0", "#fff", categoryColor, lineOffset, this.categoryHorizontalOffset, 0, 0, 5, 5, category);
                    this.placement.AddElement(categoryRect, this.GROUP_CATEGORIES);
                    var categoryText = new renderedtext_2.RenderedText(category.Title, lineOffset + this.padding, this.categoryHorizontalOffset, renderedtext_2.TextAlign.Start, renderedtext_2.TextAlign.End, category, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontInverseColor, 0, null, null);
                    this.placement.AddElement(categoryText, this.GROUP_CATEGORIES);
                    var categoryTextBox = this.renderer.measureTextElement(categoryText);
                    categoryRect.Width = categoryTextBox.width + this.padding * 2;
                    categoryRect.Height = categoryTextBox.height + this.padding / 2;
                    this.categoryHorizontalOffset += categoryTextBox.height * 2;
                }
                categoryIndex++;
                lineOffset += this.categoryLineWidthSpaced;
            }
            categoryIndex = 0;
            this.topOffset = Math.max(this.headerHeight + this.padding * 4, this.categoryHorizontalOffset + this.padding * 4);
            this.RecalcAvailableHeight();
        };
        /**
         * Recalculate axis height based on header and footer size
         */
        TimelinePlacer.prototype.RecalcAvailableHeight = function () {
            this.availableHeight = this.placement.TotalHeight - this.topOffset - (this.padding * 4) - this.footerCompensation;
        };
        /**
         * Get horizontal offset for line connecting axis and event based on existing lines (stored in grabbed space)
         * @param grabbedSpace grabbed space register (array of objects with from/to)
         * @param proposal proposed horizontal offset
         * @param start vertical offset of line (start)
         * @param end vertical offset of line (end)
         * @param additional space between lines (it's being added to the proposal)
         * @param onRight flag if line is on the left or right of center
         */
        TimelinePlacer.prototype.checkForGrabbedSpace = function (grabbedSpace, proposal, start, end, additional, onRight) {
            var tolerance = 0;
            var currentExtreme = null;
            // check for all affected lines
            var affects = false;
            for (var _i = 0, grabbedSpace_1 = grabbedSpace; _i < grabbedSpace_1.length; _i++) {
                var space = grabbedSpace_1[_i];
                if (onRight == space.onRight) {
                    // check for overlaps
                    if (space.from <= start + tolerance && space.to >= start - tolerance)
                        affects = true;
                    if (space.from <= end + tolerance && space.to >= end - tolerance)
                        affects = true;
                    // check for containments
                    if (space.from <= start + tolerance && space.to >= end - tolerance)
                        affects = true;
                    if (space.from >= start - tolerance && space.to <= end + tolerance)
                        affects = true;
                    // find their minimum
                    if (affects) {
                        currentExtreme =
                            (currentExtreme == null ? space.offset :
                                (onRight ? Math.min(currentExtreme, space.offset) : Math.max(currentExtreme, space.offset)));
                    }
                }
            }
            // there's nothing in the area yet
            if (currentExtreme == null)
                return proposal;
            else
                return currentExtreme + (onRight ? -additional : additional);
        };
        /**
         * Place lines between events and axis/categories
         */
        TimelinePlacer.prototype.CreateEventLines = function () {
            var lineLabelSize = this.calcFontSize(0.02, null, this.timeline.Theme);
            var circleDiameter = this.calcRelativeSize(null, 0.01, this.timeline.Theme);
            var grabbedSpace = [];
            var lastTimestamp = null;
            // Event points
            for (var _i = 0, _a = this.timeline.Events; _i < _a.length; _i++) {
                var event_7 = _a[_i];
                for (var _b = 0, _c = event_7.Occurences; _b < _c.length; _b++) {
                    var eventOccurence = _c[_b];
                    var categoryIndex = this.getCategoryIndex(this.timeline.Categories, eventOccurence.Category);
                    var categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                    var lineOffset = this.baseLineOffset + categoryIndex * this.categoryLineWidthSpaced;
                    var ratio = (timespecification_3.TimeSpecification.CalcTimeVal(eventOccurence.Time.StartYear, eventOccurence.Time.StartMonth, eventOccurence.Time.StartDay, eventOccurence.Time.StartHour, eventOccurence.Time.StartMinute, eventOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                    var centerPoint = new pointspec_1.PointSpec(lineOffset, this.topOffset + ratio * (this.availableHeight));
                    // Event line connecting the AXIS and the Event rectangle with break
                    var line = new renderedline_2.RenderedLine(this.eventLineWidth, this.timeline.Theme.DefaultEventLineColor, "transparent", null);
                    line.Points.push(centerPoint);
                    var onRight = event_7.Tag.PosX > centerPoint.PosX;
                    var middlePos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.spaceForEventLines / 3 : this.baseLineOffset - this.spaceForEventLines / 3);
                    middlePos = this.checkForGrabbedSpace(grabbedSpace, middlePos, centerPoint.PosY, event_7.Tag.PosY, this.eventLinePadding, onRight);
                    // Place line
                    line.Points.push(new pointspec_1.PointSpec(middlePos, centerPoint.PosY));
                    line.Points.push(new pointspec_1.PointSpec(middlePos, event_7.Tag.PosY));
                    line.Points.push(new pointspec_1.PointSpec(event_7.Tag.PosX + (onRight ? -1 : 1), event_7.Tag.PosY));
                    this.placement.AddElement(line, this.GROUP_EVENTS);
                    event_7.Tag.Elements.push(line);
                    var descriptionPos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.padding * 1 : this.baseLineOffset - this.padding * 1);
                    // store info about line offset being grabbed by this event
                    if (centerPoint.PosY < event_7.Tag.PosY)
                        grabbedSpace.push({ "from": centerPoint.PosY, "to": event_7.Tag.PosY, "offset": middlePos, "onRight": onRight });
                    else
                        grabbedSpace.push({ "to": centerPoint.PosY, "from": event_7.Tag.PosY, "offset": middlePos, "onRight": onRight });
                    // Event Time Description
                    if (!this.colapseEventTimesIntoTag) {
                        var descEl = new renderedtext_2.RenderedText(eventOccurence.Time.GetTimeDescription(lastTimestamp), descriptionPos, centerPoint.PosY - 3, (onRight ? renderedtext_2.TextAlign.Start : renderedtext_2.TextAlign.End), renderedtext_2.TextAlign.Start, null, this.timeline.Theme.DefaultFont, lineLabelSize, this.timeline.Theme.DefaultEventLineColor, 0, null, null);
                        lastTimestamp = eventOccurence.Time;
                        this.placement.AddElement(descEl, this.GROUP_EVENTS);
                        event_7.Tag.Elements.push(descEl);
                    }
                    var height = void 0;
                    if (eventOccurence.Time.HasStart && !eventOccurence.Time.HasEnd) {
                        height = 0;
                    }
                    else if (eventOccurence.Time.HasStart && eventOccurence.Time.HasEnd) {
                        var ratio_1 = (timespecification_3.TimeSpecification.CalcTimeVal(eventOccurence.Time.EndYear, eventOccurence.Time.EndMonth, eventOccurence.Time.EndDay, eventOccurence.Time.EndHour, eventOccurence.Time.EndMinute, eventOccurence.Time.EndSecond) - this.start) / (this.end - this.start);
                        height = this.topOffset + ratio_1 * (this.availableHeight) - centerPoint.PosY;
                    }
                    // Circle/Rectangle on the Axis
                    var eventCircle = new renderedrectangle_2.RenderedRectangle((this.viewport.Width * 0.005) + "px", categoryColor, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2 + height, circleDiameter, circleDiameter, event_7);
                    // enlarge drawing area if needed
                    this.placement.TotalHeight = Math.max(this.placement.TotalHeight, centerPoint.PosY + circleDiameter * 2 + height);
                    this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
                    event_7.Tag.Elements.push(eventCircle);
                }
            }
        };
        /**
         * Place the timeline
         */
        TimelinePlacer.prototype.Place = function () {
            // sort timeline
            this.timeline.SortEvents();
            this.timelineLines = [];
            this.timelineTexts = [];
            // Axis line
            this.start = this.timeline.FindStart();
            this.end = this.timeline.FindEnd();
            // Group (order matters!)
            this.placement = new renderedtimeline_1.RenderedTimeline(this.timeline, this.viewport, this.timeline.Theme.DefaultBackgroundColor);
            this.placement.AddGroup(this.GROUP_HEADER);
            this.placement.AddGroup(this.GROUP_TIMELINE);
            this.placement.AddGroup(this.GROUP_FOOTER);
            this.placement.AddGroup(this.GROUP_CATEGORIES);
            this.placement.AddGroup(this.GROUP_EVENTS);
            // Inject Google Fonts (before text added in order to measure correctly)
            for (var _i = 0, _a = this.timeline.Theme.GoogleFonts; _i < _a.length; _i++) {
                var font = _a[_i];
                this.renderer.InjectGoogleFont(font);
            }
            // Init defaults
            this.padding = this.timeline.Theme.DefaultPadding * this.viewport.Width;
            this.categoryLineWidth = (this.viewport.Width * 0.01);
            this.categoryLineWidthSpaced = this.categoryLineWidth * 2;
            this.lineAreaWidth = this.categoryLineWidthSpaced * (this.timeline.Categories.length - 1);
            this.eventLineWidth = "3px";
            // Vertical support only for the moment
            if (this.viewport.IsVertical) {
                this.placement.TotalWidth = this.viewport.Width;
                this.baseLineOffset = this.placement.TotalWidth / 2 - (this.lineAreaWidth / 2);
                this.colapseEventTimesIntoTag = this.placement.TotalWidth < 1000;
                // Estimate total height based on minimal time difference between events
                if (this.timeline.Events.length > 1) {
                    var minDiff = null;
                    var minStart = null;
                    var maxEnd = null;
                    // find start and end timestamp numbers
                    for (var i = 0; i < this.timeline.Events.length; i++) {
                        var currentTime = this.timeline.Events[i].FindRange(true);
                        minStart = (minStart == null ? currentTime : Math.min(minStart, currentTime));
                        maxEnd = (maxEnd == null ? currentTime : Math.max(maxEnd, currentTime));
                    }
                    // find minimal numeric difference between two subsequent events
                    for (var i = 1; i < this.timeline.Events.length; i++) {
                        var prevTime = this.timeline.Events[i - 1].FindRange(true);
                        var currentTime = this.timeline.Events[i].FindRange(true);
                        var diff = currentTime - prevTime;
                        if (diff > 0) {
                            minDiff = (minDiff == null ? diff : Math.min(diff, minDiff));
                        }
                    }
                    // total height is (for a start) estimated as the worst case scenario (all events need minEventDiff between themselves) 
                    this.placement.TotalHeight = Math.max(this.placement.TotalHeight, ((maxEnd - minStart) / (minDiff)) * this.minEventDiff);
                }
                this.PlaceVertical();
            }
            return this.placement;
        };
        return TimelinePlacer;
    }());
    exports.TimelinePlacer = TimelinePlacer;
});
define("entistimeline_loader", ["require", "exports", "entistimeline_placer", "entistimeline_renderer", "entistimeline_theme", "DataModel/timeline", "DataModel/timelinecategory", "DataModel/timelineevent", "DataModel/timespecification", "DataModel/timelineoccurence", "DataModel/timelineimage", "DataModel/timelinelink"], function (require, exports, entistimeline_placer_1, entistimeline_renderer_1, entistimeline_theme_1, timeline_1, timelinecategory_1, timelineevent_1, timespecification_4, timelineoccurence_1, timelineimage_1, timelinelink_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Timeline Initializer
     */
    var TimelineLoader = /** @class */ (function () {
        /**
         * Create new loader
         */
        function TimelineLoader() {
        }
        /**
         * Combine default theme configuration with provided customization object
         * @param theme default theme object
         * @param override theme customization
         */
        TimelineLoader.prototype.overrideTheme = function (theme, override) {
            if (override != null) {
                if (override.EventBgColor != null) {
                    theme.EventBgColor = override.EventBgColor;
                }
                if (override.DefaultFont != null) {
                    theme.DefaultFont = override.DefaultFont;
                }
                if (override.CategoryColors != null) {
                    theme.CategoryColors = override.CategoryColors;
                }
                if (override.EventTitleLineColor != null) {
                    theme.EventTitleLineColor = override.EventTitleLineColor;
                }
                if (override.DefaultFontColor != null) {
                    theme.DefaultFontColor = override.DefaultFontColor;
                }
                if (override.GoogleFonts != null) {
                    theme.GoogleFonts = override.GoogleFonts;
                }
                if (override.DefaultFontInverseColor != null) {
                    theme.DefaultFontInverseColor = override.DefaultFontInverseColor;
                }
                if (override.DefaultNoteFontColor != null) {
                    theme.DefaultNoteFontColor = override.DefaultNoteFontColor;
                }
                if (override.DefaultBackgroundColor != null) {
                    theme.DefaultBackgroundColor = override.DefaultBackgroundColor;
                }
                if (override.DefaultEventLineColor != null) {
                    theme.DefaultEventLineColor = override.DefaultEventLineColor;
                }
                if (override.DefaultEventPointColor != null) {
                    theme.DefaultEventPointColor = override.DefaultEventPointColor;
                }
                if (override.DefaultMinFontSize != null) {
                    theme.DefaultMinFontSize = override.DefaultMinFontSize;
                }
                if (override.DefaultMaxFontSize != null) {
                    theme.DefaultMaxFontSize = override.DefaultMaxFontSize;
                }
                if (override.HeaderLinkColor != null) {
                    theme.HeaderLinkColor = override.HeaderLinkColor;
                }
                if (override.DefaultImageRadius != null) {
                    theme.DefaultImageRadius = override.DefaultImageRadius;
                }
                if ((override.EmptySpaceThreshold != null) && (override.EmptySpaceThreshold > 300)) {
                    theme.EmptySpaceThreshold = override.EmptySpaceThreshold;
                }
                if (override.CutPlaceholderBorder != null) {
                    theme.CutPlaceholderBorder = override.CutPlaceholderBorder;
                }
                if ((override.TitleImageOpacity != null) && (override.TitleImageOpacity >= 0) && (override.TitleImageOpacity <= 1)) {
                    theme.TitleImageOpacity = override.TitleImageOpacity;
                }
            }
        };
        /**
         * Initialize timelime from external url with given theme and place it into DOM element
         * @param timelineUrl timeline url
         * @param panelId target DOM element id
         * @param customTheme theme configuration
         */
        TimelineLoader.prototype.loadFromUrl = function (timelineUrl, panelId, customTheme) {
            var _this = this;
            this.getJSON(timelineUrl, function (status, data) {
                if (data.Success == true) { // Wrapped by storage-service
                    _this.load(data.Timeline, panelId, customTheme);
                }
                else { // native JSON file
                    _this.load(data, panelId, customTheme);
                }
            });
        };
        /**
         * Initialize timeline from local object with given theme and place it into DOM element
         * @param timelineSpec timeline configuration
         * @param panelId target DOM element id
         * @param customTheme theme configuration
         */
        TimelineLoader.prototype.load = function (timelineSpec, panelId, customTheme) {
            var _this = this;
            this.loadingError = false;
            // Default theme
            var theme = new entistimeline_theme_1.TimelineTheme("Roboto Condensed", "#555", "#fff", "#ccc", 10, 90, "#fff", 0.02, ["Roboto Condensed"], ["#E4572E", "#29335C", "#F3A712", "#EA526F", "#E76B74"], "#eee", "#bbb", "#ddd", "#fff", "#ff0000", 0.04, 600, "#ddd", 0.7);
            // TODO: Add parsing checks
            // Override theme with values provided inside timeline specification
            if (timelineSpec.CustomTheme != null) {
                this.overrideTheme(theme, timelineSpec.CustomTheme);
            }
            // Override theme with provided customization
            if (customTheme != null) {
                this.overrideTheme(theme, customTheme);
            }
            // Create parsed timeline model
            var defaultCategory = null;
            var t = new timeline_1.Timeline(timelineSpec.Title, theme);
            this.timeline = t;
            // Parse data source information
            if (timelineSpec.DataSource != null)
                t.DataSource = timelineSpec.DataSource;
            if (timelineSpec.DataSourceLink != null)
                t.DataSourceLink = timelineSpec.DataSourceLink;
            // Parse main/background image
            if (timelineSpec.Image != null) {
                t.Image = new timelineimage_1.TimelineImage(timelineSpec.Image.Url, timelineSpec.Image.Width, timelineSpec.Image.Height);
            }
            // Parse title description
            t.Description = timelineSpec.Subtitle;
            // Parse categories
            if (Array.isArray(timelineSpec.Categories)) {
                for (var _i = 0, _a = timelineSpec.Categories; _i < _a.length; _i++) {
                    var category = _a[_i];
                    t.Categories.push(new timelinecategory_1.TimelineCategory(category.Id, category.Title));
                }
            }
            // Parse title links
            if (Array.isArray(timelineSpec.Links)) {
                for (var _b = 0, _c = timelineSpec.Links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    t.Links.push(new timelinelink_1.TimelineLink(link.Url, link.Text, link.Target, link.Tooltip));
                }
            }
            // Push default category if none is specified
            if (t.Categories.length == 0) {
                defaultCategory = new timelinecategory_1.TimelineCategory("DEFCAT", "");
                t.Categories.push(defaultCategory);
            }
            // Parse events
            for (var _d = 0, _e = timelineSpec.Events; _d < _e.length; _d++) {
                var event_8 = _e[_d];
                // Assume event id and title
                var evt = new timelineevent_1.TimelineEvent(event_8.Id, event_8.Title);
                // Non-empty event description
                if ((event_8.Description != null) && (event_8.Description !== ""))
                    evt.Text = event_8.Description;
                // Main image
                if (event_8.Image != null) {
                    evt.Image = new timelineimage_1.TimelineImage(event_8.Image.Url, event_8.Image.Width, event_8.Image.Height);
                }
                // Event link
                if (event_8.Link != null) {
                    evt.Link = new timelinelink_1.TimelineLink(event_8.Link.Url, null, event_8.Link.Target, event_8.Link.Tooltip);
                }
                // Event occurences
                for (var _f = 0, _g = event_8.Occurences; _f < _g.length; _f++) {
                    var occurence = _g[_f];
                    var newOccurence = new timelineoccurence_1.TimelineOccurence();
                    newOccurence.Time = new timespecification_4.TimeSpecification(occurence.Year, occurence.Month, occurence.Day, occurence.Hour, occurence.Minute, occurence.Second, occurence.EndYear, occurence.EndMonth, occurence.EndDay, occurence.EndHour, occurence.EndMinute, occurence.EndSecond, occurence.Title);
                    // search categories and bind to them
                    for (var _h = 0, _j = t.Categories; _h < _j.length; _h++) {
                        var category = _j[_h];
                        if (category.Id == occurence.CategoryId) {
                            newOccurence.Category = category;
                            break;
                        }
                    }
                    // Attach to default category if none specified
                    if (newOccurence.Category == null) {
                        if (defaultCategory == null) {
                            console.error("Category of event " + event_8.Title + " not identified. Either specify category in the Categories section or do not use category for events");
                            this.loadingError = true;
                            break;
                        }
                        newOccurence.Category = defaultCategory;
                    }
                    evt.Occurences.push(newOccurence);
                }
                t.Events.push(evt);
            }
            // Default target is whole page
            var targetPanel = document.body;
            // Might be overriden
            if (panelId != null) {
                t.SelfContained = true;
                targetPanel = document.getElementById(panelId);
            }
            else {
                t.SelfContained = false;
                document.title = t.Title;
            }
            // Initialize renderer
            this.renderer = new entistimeline_renderer_1.TimelineRenderer(targetPanel);
            if (this.loadingError) {
                this.renderer.RenderError();
            }
            else {
                // Performs the placing/rendering
                this.refresh();
                // Bind for window resize events (need replacing/re-rendering)
                window.addEventListener('resize', function () { return _this.windowSizeChange(); });
            }
        };
        /**
         * Download JSON from remote source
         * @param url remote url
         * @param callback callback function (with params of status and response)
         */
        TimelineLoader.prototype.getJSON = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status === 200) {
                    callback(null, xhr.response);
                }
                else {
                    callback(status, xhr.response);
                }
            };
            xhr.send();
        };
        /**
         * Re-place current timeline and re-render it after window size chage
         */
        TimelineLoader.prototype.windowSizeChange = function () {
            this.refresh();
        };
        /**
         * Performs placing and rendering of current timeline
         */
        TimelineLoader.prototype.refresh = function () {
            var viewport = this.renderer.GetViewportConfiguration();
            var p = new entistimeline_placer_1.TimelinePlacer(this.timeline, this.renderer, viewport);
            var placedTimeline = p.Place();
            var renderedTimeline = this.renderer.Render(placedTimeline);
        };
        return TimelineLoader;
    }());
    exports.TimelineLoader = TimelineLoader;
});
