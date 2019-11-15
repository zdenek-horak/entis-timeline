define(["require", "exports", "./RenderModel/renderedtimeline", "./RenderModel/renderedtext", "./RenderModel/pointspec", "./RenderModel/renderedline", "./RenderModel/renderedlink", "./RenderModel/renderedrectangle", "./DataModel/timespecification", "./RenderModel/renderedimage", "./DataModel/timelinetextpart"], function (require, exports, renderedtimeline_1, renderedtext_1, pointspec_1, renderedline_1, renderedlink_1, renderedrectangle_1, timespecification_1, renderedimage_1, timelinetextpart_1) {
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
                var currentPos = timespecification_1.TimeSpecification.CalcTimeVal(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
                var ratio = (currentPos - this.start) / (this.end - this.start);
                var offset = this.topOffset + ratio * (this.availableHeight);
                var eventText = new renderedtext_1.RenderedText(text, this.baseLineOffset - timelineOffset, offset - 5, renderedtext_1.TextAlign.Start, renderedtext_1.TextAlign.Start, event, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, -90, null, null);
                var eventTextBox = this.renderer.measureTextElement(eventText);
                var skip = false;
                // skip if we've got an event for the same timestamp
                for (var _i = 0, _a = this.timeline.Events; _i < _a.length; _i++) {
                    var event_1 = _a[_i];
                    for (var _b = 0, _c = event_1.Occurences; _b < _c.length; _b++) {
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
                var line = new renderedline_1.RenderedLine("1px", this.timeline.Theme.DefaultNoteFontColor, "transparent", null);
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
            var innerText = new renderedtext_1.RenderedText("entistimeline.com", this.placement.TotalWidth - this.padding * 3, this.placement.TotalHeight - this.padding, renderedtext_1.TextAlign.End, renderedtext_1.TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
            var linkEl = new renderedlink_1.RenderedLink("https://timeline.entis-design.com", "blank", "visit timeline.entis-design.com", [innerText], null);
            this.placement.AddElement(linkEl, this.GROUP_FOOTER);
            var linkElBox = this.renderer.measureTextElement(innerText);
            this.placement.AddElement(new renderedtext_1.RenderedText("made with", this.placement.TotalWidth - this.padding * 3 - linkElBox.width, this.placement.TotalHeight - this.padding, renderedtext_1.TextAlign.End, renderedtext_1.TextAlign.Start, null, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultNoteFontColor, 0, null, null), this.GROUP_FOOTER);
            // Datasource info
            if (this.timeline.DataSource != null) {
                var dataSourceText = new renderedtext_1.RenderedText(this.timeline.DataSource, this.padding * 3, this.placement.TotalHeight - this.padding, renderedtext_1.TextAlign.Start, renderedtext_1.TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
                this.WrapMultilineText(dataSourceText, this.baseLineOffset);
                var sourceLinkBox = this.renderer.measureTextElement(dataSourceText);
                this.placement.TotalHeight += sourceLinkBox.height;
                this.footerCompensation += sourceLinkBox.height;
                // Enlarge if needed
                this.RecalcAvailableHeight();
                if (this.timeline.DataSourceLink != null) {
                    var dataSourceLink = new renderedlink_1.RenderedLink(this.timeline.DataSourceLink, "blank", this.timeline.DataSourceLink, [dataSourceText], null);
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
                    var inlineImage = new renderedimage_1.RenderedImage(this.timeline.Image.Url, 0, 0, iWidth, iHeight, false, true, null);
                    this.placement.AddElement(inlineImage, this.GROUP_HEADER);
                }
            }
            // Title
            this.timelineTitle = new renderedtext_1.RenderedText(this.timeline.Title, this.padding, offset, renderedtext_1.TextAlign.End, renderedtext_1.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
            this.WrapMultilineText(this.timelineTitle, this.placement.TotalWidth * 0.45);
            this.placement.AddElement(this.timelineTitle, this.GROUP_HEADER);
            var timelineBox = this.renderer.measureTextElement(this.timelineTitle);
            offset += timelineBox.height + this.padding;
            var descWidth = this.placement.TotalWidth * 0.4;
            // Description
            if ((this.timeline.Description != null) && (this.timeline.Description.length > 0)) {
                fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
                this.timelineDescription = new renderedtext_1.RenderedText(this.timeline.Description, this.padding, offset, renderedtext_1.TextAlign.End, renderedtext_1.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, descWidth);
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
                    var linkEl = new renderedtext_1.RenderedText(link.Text, this.padding + descWidth, offset, renderedtext_1.TextAlign.End, renderedtext_1.TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, null);
                    var size = this.renderer.measureTextElement(linkEl);
                    var linkBg = new renderedline_1.RenderedLine(this.eventLineWidth, this.timeline.Theme.HeaderLinkColor, "transparent", null);
                    linkBg.Points.push(new pointspec_1.PointSpec(this.padding + descWidth - size.width, offset + size.height + fontSize * 0.5));
                    linkBg.Points.push(new pointspec_1.PointSpec(this.padding + descWidth, offset + size.height + fontSize * 0.5));
                    var linkParent = new renderedlink_1.RenderedLink(link.Url, link.Target, link.Tooltip, [linkBg, linkEl], null);
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
                var line = new renderedline_1.RenderedLine(this.categoryLineWidth + "px", categoryColor, "transparent", null);
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
                var event_2 = _a[_i];
                // pick the column where's more space
                if (eventCols[0].topOffset > eventCols[1].topOffset)
                    colNum = 1;
                else
                    colNum = 0;
                var eventWidth = eventCols[colNum].width;
                var eventHeight = 0; // is calculated by adding numbers below
                var leftOffset = eventCols[colNum].leftOffset;
                var firstOccurence = event_2.Occurences[0];
                var ratio = (timespecification_1.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight) - fontSize - 3;
                eventCols[colNum].topOffset = Math.max(desiredTopOffset, eventCols[colNum].topOffset);
                // Event boxes should preserve time ordering
                if (lastEvent != null) {
                    eventCols[colNum].topOffset = Math.max(eventCols[colNum].topOffset, lastEvent.Tag.PosY + this.padding);
                }
                // Create event link (arrow), place it later
                if (event_2.Link != null) {
                    eventLinkRect = new renderedrectangle_1.RenderedRectangle("5px", "tranparent", this.timeline.Theme.EventBgColor, 0, 0, eventLinkSize, eventLinkSize, 5, 5, event_2);
                    linkLine = new renderedline_1.RenderedLine("3px", "#ccc", "transparent", event_2);
                    linkLine.StrokeCap = "round";
                    var linkHelpLine = new renderedlink_1.RenderedLink(event_2.Link.Url, event_2.Link.Target, event_2.Link.Tooltip, [eventLinkRect, linkLine], event_2);
                    this.placement.AddElement(linkHelpLine, this.GROUP_EVENTS);
                    event_2.Tag.add(linkHelpLine);
                }
                // Place event rectangle (when image or description is present)
                if (event_2.Text != null || event_2.Image != null) {
                    eventRect = new renderedrectangle_1.RenderedRectangle("0", "#fff", this.timeline.Theme.EventBgColor, leftOffset, 0, 5, 5, 5, 5, event_2);
                    this.placement.AddElement(eventRect, this.GROUP_EVENTS);
                    event_2.Tag.add(eventRect);
                }
                // line below event title
                var line = new renderedline_1.RenderedLine(this.eventLineWidth, this.timeline.Theme.EventTitleLineColor, "transparent", null);
                event_2.Tag.add(line);
                this.placement.AddElement(line, this.GROUP_EVENTS);
                var titleAlign = renderedtext_1.TextAlign.Start;
                var titleOffset = leftOffset;
                if (eventCols[colNum].pos == 'onLeft') {
                    titleAlign = renderedtext_1.TextAlign.End;
                    titleOffset = leftOffset + eventWidth;
                }
                var eventTitle = event_2.Title;
                if (this.colapseEventTimesIntoTag) {
                    eventTitle += " (";
                    var first = true;
                    for (var _b = 0, _c = event_2.Occurences; _b < _c.length; _b++) {
                        var occurence = _c[_b];
                        eventTitle += (first ? "" : ", ") + occurence.Time.GetTimeDescription(lastEventTimestamp);
                        lastEventTimestamp = occurence.Time;
                        first = false;
                    }
                    eventTitle += ")";
                }
                // Event title
                var eventText = new renderedtext_1.RenderedText(eventTitle, titleOffset, eventCols[colNum].topOffset - 3, titleAlign, renderedtext_1.TextAlign.End, event_2, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
                event_2.Tag.add(eventText);
                this.placement.AddElement(eventText, this.GROUP_EVENTS);
                // Wrap if too wide
                this.WrapMultilineText(eventText, eventWidth);
                event_2.Tag.Col = colNum;
                var eventTextBox = this.renderer.measureTextElement(eventText);
                // Different for left/right columns
                if (eventCols[colNum].pos == 'onLeft') {
                    event_2.Tag.PosX = leftOffset + eventWidth + eventPadding;
                }
                else {
                    event_2.Tag.PosX = leftOffset - eventPadding;
                }
                eventHeight += eventTextBox.height;
                event_2.Tag.PosY = eventCols[colNum].topOffset + eventTextBox.height;
                event_2.Tag.StartY = eventCols[colNum].topOffset + eventTextBox.height;
                var lineStart = leftOffset - eventPadding;
                var lineEnd = leftOffset + ((event_2.Image != null || event_2.Text != null) ? eventWidth : eventTextBox.width) + eventPadding;
                if ((eventCols[colNum].pos == 'onLeft') && (event_2.Text == null) && (event_2.Image == null)) {
                    lineStart = leftOffset + eventWidth - eventTextBox.width - eventPadding;
                    lineEnd = leftOffset + eventWidth + eventPadding;
                }
                // line below event title
                line.Points.push(new pointspec_1.PointSpec(lineStart, event_2.Tag.PosY));
                line.Points.push(new pointspec_1.PointSpec(lineEnd, event_2.Tag.PosY));
                eventCols[colNum].topOffset += eventTextBox.height;
                // Place event description and/or image
                if (event_2.Text != null || event_2.Image != null) {
                    eventRect.PosX = leftOffset - eventPadding;
                    eventRect.PosY = eventCols[colNum].topOffset;
                    eventCols[colNum].topOffset += eventPadding;
                    // Event description
                    if (event_2.Text != null) {
                        var eventDescription = new renderedtext_1.RenderedText(event_2.Text, leftOffset, eventCols[colNum].topOffset, renderedtext_1.TextAlign.Start, renderedtext_1.TextAlign.End, event_2, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultFontColor, 0, null, eventWidth);
                        event_2.Tag.add(eventDescription);
                        this.placement.AddElement(eventDescription, this.GROUP_EVENTS);
                        this.WrapMultilineText(eventDescription, eventWidth);
                        var eventDescriptionBox = this.renderer.measureTextElement(eventDescription);
                        eventCols[colNum].topOffset += eventDescriptionBox.height;
                        eventCols[colNum].topOffset += eventPadding;
                        eventHeight += eventPadding + eventDescriptionBox.height;
                    }
                    // Event image
                    if (event_2.Image != null) {
                        if (event_2.Text != null) {
                            eventCols[colNum].topOffset += eventPadding;
                        }
                        var aspectRatio = event_2.Image.Width / event_2.Image.Height;
                        if ((event_2.Image.Width > 0) && (event_2.Image.Height > 0)) {
                            var iWidth = eventCols[colNum].width;
                            var iHeight = iWidth / aspectRatio;
                            var inlineImage = new renderedimage_1.RenderedImage(event_2.Image.Url, eventCols[colNum].leftOffset, eventCols[colNum].topOffset, iWidth, iHeight, true, false, event_2);
                            this.placement.AddElement(inlineImage, this.GROUP_EVENTS);
                            eventCols[colNum].topOffset += iHeight;
                            event_2.Tag.add(inlineImage);
                            eventHeight += iHeight;
                        }
                    }
                    eventRect.Width = eventWidth + eventPadding * 2;
                    eventRect.Height = eventCols[colNum].topOffset - eventRect.PosY + eventPadding;
                }
                // Place event link (arrow)
                if (event_2.Link != null) {
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
                event_2.Tag.Height = eventHeight;
                // enlarge drawing area if we are outside of the boundaries (add padding for footer height)
                this.placement.TotalHeight = Math.max(this.placement.TotalHeight, eventCols[colNum].topOffset + this.padding * 4);
                lastEvent = event_2;
            }
            // Enlarge if needed
            this.RecalcAvailableHeight();
            var totalLeftDiff = 0;
            var totalRightDiff = 0;
            // Second pass - aggregate differences between vertical offset as requested by event occurences and real offset (as a result of placing)
            for (var y = 0; y < this.timeline.Events.length; y++) {
                var event_3 = this.timeline.Events[y];
                var firstOccurence = event_3.Occurences[0];
                var ratio = (timespecification_1.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight);
                // if yes
                if (desiredTopOffset < event_3.Tag.PosY) {
                    if (event_3.Tag.Col == 0)
                        totalLeftDiff += event_3.Tag.PosY - desiredTopOffset;
                    else
                        totalRightDiff += event_3.Tag.PosY - desiredTopOffset;
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
                var event_4 = this.timeline.Events[y];
                var firstOccurence = event_4.Occurences[0];
                var ratio = (timespecification_1.TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                var desiredTopOffset = this.topOffset + ratio * (this.availableHeight);
                // if yes
                if (desiredTopOffset > event_4.Tag.PosY) {
                    // move the events (and all events below) more to the bottom
                    var diff = desiredTopOffset - event_4.Tag.PosY;
                    for (var z = y; z < this.timeline.Events.length; z++) {
                        if (event_4.Tag.Col == this.timeline.Events[z].Tag.Col) {
                            this.timeline.Events[z].Tag.moveVertically(diff);
                        }
                    }
                }
            }
            // Fifth pass - check if something has fallen out
            for (var z = 0; z < this.timeline.Events.length; z++) {
                var event_5 = this.timeline.Events[z];
                // if there's an event which overflows the original bounds, we need to extend them again
                var overflow = event_5.Tag.PosY + event_5.Tag.Height + this.padding * 2 - this.placement.TotalHeight;
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
                var eventCircle = new renderedrectangle_1.RenderedRectangle((this.viewport.Width * 0.005) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2, circleDiameter, circleDiameter, null);
                this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventCircle);
                var eventSmallCircle = new renderedrectangle_1.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
                this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventSmallCircle);
                eventSmallCircle = new renderedrectangle_1.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
                this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
                cutMarkers.push(eventSmallCircle);
                eventSmallCircle = new renderedrectangle_1.RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX + smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
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
                    var categoryRect = new renderedrectangle_1.RenderedRectangle("0", "#fff", categoryColor, lineOffset, this.categoryHorizontalOffset, 0, 0, 5, 5, category);
                    this.placement.AddElement(categoryRect, this.GROUP_CATEGORIES);
                    var categoryText = new renderedtext_1.RenderedText(category.Title, lineOffset + this.padding, this.categoryHorizontalOffset, renderedtext_1.TextAlign.Start, renderedtext_1.TextAlign.End, category, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontInverseColor, 0, null, null);
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
                var event_6 = _a[_i];
                for (var _b = 0, _c = event_6.Occurences; _b < _c.length; _b++) {
                    var eventOccurence = _c[_b];
                    var categoryIndex = this.getCategoryIndex(this.timeline.Categories, eventOccurence.Category);
                    var categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                    var lineOffset = this.baseLineOffset + categoryIndex * this.categoryLineWidthSpaced;
                    var ratio = (timespecification_1.TimeSpecification.CalcTimeVal(eventOccurence.Time.StartYear, eventOccurence.Time.StartMonth, eventOccurence.Time.StartDay, eventOccurence.Time.StartHour, eventOccurence.Time.StartMinute, eventOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                    var centerPoint = new pointspec_1.PointSpec(lineOffset, this.topOffset + ratio * (this.availableHeight));
                    // Event line connecting the AXIS and the Event rectangle with break
                    var line = new renderedline_1.RenderedLine(this.eventLineWidth, this.timeline.Theme.DefaultEventLineColor, "transparent", null);
                    line.Points.push(centerPoint);
                    var onRight = event_6.Tag.PosX > centerPoint.PosX;
                    var middlePos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.spaceForEventLines / 3 : this.baseLineOffset - this.spaceForEventLines / 3);
                    middlePos = this.checkForGrabbedSpace(grabbedSpace, middlePos, centerPoint.PosY, event_6.Tag.PosY, this.eventLinePadding, onRight);
                    // Place line
                    line.Points.push(new pointspec_1.PointSpec(middlePos, centerPoint.PosY));
                    line.Points.push(new pointspec_1.PointSpec(middlePos, event_6.Tag.PosY));
                    line.Points.push(new pointspec_1.PointSpec(event_6.Tag.PosX + (onRight ? -1 : 1), event_6.Tag.PosY));
                    this.placement.AddElement(line, this.GROUP_EVENTS);
                    event_6.Tag.Elements.push(line);
                    var descriptionPos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.padding * 1 : this.baseLineOffset - this.padding * 1);
                    // store info about line offset being grabbed by this event
                    if (centerPoint.PosY < event_6.Tag.PosY)
                        grabbedSpace.push({ "from": centerPoint.PosY, "to": event_6.Tag.PosY, "offset": middlePos, "onRight": onRight });
                    else
                        grabbedSpace.push({ "to": centerPoint.PosY, "from": event_6.Tag.PosY, "offset": middlePos, "onRight": onRight });
                    // Event Time Description
                    if (!this.colapseEventTimesIntoTag) {
                        var descEl = new renderedtext_1.RenderedText(eventOccurence.Time.GetTimeDescription(lastTimestamp), descriptionPos, centerPoint.PosY - 3, (onRight ? renderedtext_1.TextAlign.Start : renderedtext_1.TextAlign.End), renderedtext_1.TextAlign.Start, null, this.timeline.Theme.DefaultFont, lineLabelSize, this.timeline.Theme.DefaultEventLineColor, 0, null, null);
                        lastTimestamp = eventOccurence.Time;
                        this.placement.AddElement(descEl, this.GROUP_EVENTS);
                        event_6.Tag.Elements.push(descEl);
                    }
                    var height = void 0;
                    if (eventOccurence.Time.HasStart && !eventOccurence.Time.HasEnd) {
                        height = 0;
                    }
                    else if (eventOccurence.Time.HasStart && eventOccurence.Time.HasEnd) {
                        var ratio_1 = (timespecification_1.TimeSpecification.CalcTimeVal(eventOccurence.Time.EndYear, eventOccurence.Time.EndMonth, eventOccurence.Time.EndDay, eventOccurence.Time.EndHour, eventOccurence.Time.EndMinute, eventOccurence.Time.EndSecond) - this.start) / (this.end - this.start);
                        height = this.topOffset + ratio_1 * (this.availableHeight) - centerPoint.PosY;
                    }
                    // Circle/Rectangle on the Axis
                    var eventCircle = new renderedrectangle_1.RenderedRectangle((this.viewport.Width * 0.005) + "px", categoryColor, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2 + height, circleDiameter, circleDiameter, event_6);
                    // enlarge drawing area if needed
                    this.placement.TotalHeight = Math.max(this.placement.TotalHeight, centerPoint.PosY + circleDiameter * 2 + height);
                    this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
                    event_6.Tag.Elements.push(eventCircle);
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
