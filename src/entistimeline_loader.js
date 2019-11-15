define(["require", "exports", "./entistimeline_placer", "./entistimeline_renderer", "./entistimeline_theme", "./DataModel/timeline", "./DataModel/timelinecategory", "./DataModel/timelineevent", "./DataModel/timespecification", "./DataModel/timelineoccurence", "./DataModel/timelineimage", "./DataModel/timelinelink"], function (require, exports, entistimeline_placer_1, entistimeline_renderer_1, entistimeline_theme_1, timeline_1, timelinecategory_1, timelineevent_1, timespecification_1, timelineoccurence_1, timelineimage_1, timelinelink_1) {
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
                var event_1 = _e[_d];
                // Assume event id and title
                var evt = new timelineevent_1.TimelineEvent(event_1.Id, event_1.Title);
                // Non-empty event description
                if ((event_1.Description != null) && (event_1.Description !== ""))
                    evt.Text = event_1.Description;
                // Main image
                if (event_1.Image != null) {
                    evt.Image = new timelineimage_1.TimelineImage(event_1.Image.Url, event_1.Image.Width, event_1.Image.Height);
                }
                // Event link
                if (event_1.Link != null) {
                    evt.Link = new timelinelink_1.TimelineLink(event_1.Link.Url, null, event_1.Link.Target, event_1.Link.Tooltip);
                }
                // Event occurences
                for (var _f = 0, _g = event_1.Occurences; _f < _g.length; _f++) {
                    var occurence = _g[_f];
                    var newOccurence = new timelineoccurence_1.TimelineOccurence();
                    newOccurence.Time = new timespecification_1.TimeSpecification(occurence.Year, occurence.Month, occurence.Day, occurence.Hour, occurence.Minute, occurence.Second, occurence.EndYear, occurence.EndMonth, occurence.EndDay, occurence.EndHour, occurence.EndMinute, occurence.EndSecond, occurence.Title);
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
                            console.error("Category of event " + event_1.Title + " not identified. Either specify category in the Categories section or do not use category for events");
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
