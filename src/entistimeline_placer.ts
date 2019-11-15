import { TimelineRenderer } from "./entistimeline_renderer";
import { ViewportConfiguration } from "./RenderModel/viewportconfiguration";
import { RenderedTimeline } from "./RenderModel/renderedtimeline";
import { RenderedText, TextAlign } from "./RenderModel/renderedtext";
import { PointSpec } from "./RenderModel/pointspec";
import { RenderedLine } from "./RenderModel/renderedline";
import { RenderedCircle } from "./RenderModel/renderedcircle";
import { RenderedLink } from "./RenderModel/renderedlink";
import { RenderedRectangle } from "./RenderModel/renderedrectangle";
import { Timeline } from "./DataModel/timeline";
import { TimelineCategory } from "./DataModel/timelinecategory";
import { TimeSpecification } from "./DataModel/timespecification";
import { RenderedImage } from "./RenderModel/renderedimage";
import { TimelineEvent } from "./DataModel/timelineevent";
import { TimelineTextPart } from "./DataModel/timelinetextpart";
import { RenderedElement } from "./RenderModel/renderedelement";
import { TimelineTheme } from "./entistimeline_theme";
export { TimelinePlacer };

/**
 * Helper class for distance between events
 */
class MaxDistInfo {
    /**
     * Start of event visual representation
     */
    start: number;

    /**
     * End of event visual representation
     */
    end: number;

    /**
     * Distance to previous event
     */
    dist: number;
}

/**
 * Timeline Step enumeration
 */
enum TimelineStep {
    Year = 0,
    Month = 1,
    Day = 2,
    Hour = 3,
    Minute = 4,
    Second = 5,
    FiveYears = 6
}

/**
 * Timeline Placing Utility
 */
class TimelinePlacer {

    /**
     * Rendered timeline title
     */
    private timelineTitle: RenderedText;

    /**
     * Rendered timeline description
     */
    private timelineDescription: RenderedText;

    /**
     * Rendered timeline links
     */
    private timelineLinks: any[];

    /**
     * Timeline placement
     */
    private placement: RenderedTimeline;

    /**
     * Rendered timeline axis ticks (may be cut out in the end)
     */
    private timelineLines: RenderedLine[];

    /**
     * Rendered timeline axis labels (may be cut out in the end)
     */
    private timelineTexts: RenderedText[];

    /**
     * Default padding between elements
     */
    private padding: number;

    /**
     * start of timeline (as a result of getTime call on date obj)
     */
    private start: number;

    /**
     * end of timeline (as a result of getTime call on date obj)
     */
    private end: number;

    /**
     * Spot just before the category lines (always available)
     */
    private baseLineOffset: number;
    /**
    * Y-offset after category labels and timeline title (available after CreateCategories, max of categoryHorizontalOffset and headerHeight)
    */
    private topOffset: number;
    /**
    * Y-offset after category labels (available after CreateCategories)
    */
    private categoryHorizontalOffset: number;
    /**
    * Timeline title and description height (available after CreateHeader)
    */
    private headerHeight: number;
    /**
    * Available space for events (available after CreateCategories)
    */
    private availableHeight: number;
    /**
    * Default event line width (available always)
    */
    private eventLineWidth: string;
    /**
    * Width of the area for category lines in the center of the page (available always)
    */
    private lineAreaWidth: number;
    /**
    * Category line width plus spacing on both sides (always available)
    */
    private categoryLineWidthSpaced: number;
    /**
    * Default category line width (always available)
    */
    private categoryLineWidth: number;

    /**
     * Additional planned space for the footer
     */
    private footerCompensation: number = 0;
    /**
     * Default padding between event lines in case of overlaps
     */
    private eventLinePadding: number = 6;

    /**
     * Remaining width between category lines and event rectangles for the event lines to be placed
     */
    private spaceForEventLines: number = 0;

    /**
     * Whether the event times should be drawn on event lines (if there's enough space) or be part of the event tag
     */
    private colapseEventTimesIntoTag = false;

    /**
     * Minimum axis difference between nearest (non-identical) events
     */
    private minEventDiff = 30;

    /**
     * Height of collapsed area made from empty space cuts
     */
    private cutPlaceholderHeight = 300;

    /**
     * Create new timeline placer
     * @param timeline timeline model
     * @param renderer timeline renderer
     * @param viewport viewport configuration
     */
    constructor(private timeline: Timeline, private renderer: TimelineRenderer, private viewport: ViewportConfiguration) {
        this.timelineLinks = [];
    }

    /**
     * Interpolate font size specified as height or width screen ratio based on theme configuration
     * @param heightRatio requested height ratio (might be null if width ratio is specified)
     * @param widthRatio requested width ratio (might be null if height ratio is specified)
     * @param theme current theme
     */
    private calcFontSize(heightRatio: number, widthRatio: number, theme: TimelineTheme): number {
        return Math.min(Math.max(this.calcRelativeSize(heightRatio, widthRatio, theme), theme.DefaultMinFontSize), theme.DefaultMaxFontSize);
    }

    /**
     * Calculate size as a ratio of viewport width/height
     * @param heightRatio requested height ratio (might be null if width ratio is specified)
     * @param widthRatio requested width ratio (might be null if height ratio is specified)
     * @param theme current theme
     */
    private calcRelativeSize(heightRatio: number, widthRatio: number, theme: TimelineTheme): number {
        if (heightRatio != null) {
            return heightRatio * this.viewport.Height;
        } else {
            return widthRatio * this.viewport.Width;
        }
    }

    /**
     * Find index of given category
     * @param cats
     * @param needle
     */
    private getCategoryIndex(cats: TimelineCategory[], needle: TimelineCategory) {
        let index = 0;
        for (const cat of cats) {
            if (cat.Id == needle.Id) {
                return index;
            }
            index++;
        }

        return -1;
    }

    /**
     * Place axis timeline
     */
    public CreateTimeline() {
        // relevant axis length
        const diff = this.end - this.start;

        let step = TimelineStep.Year;

        // Detect expected step
        if (diff > 1000 * 60 * 60 * 24 * 365 * 25) { // at least 25 years
            step = TimelineStep.FiveYears;
        } else if (diff > 1000 * 60 * 60 * 24 * 365 * 5) { // at least five years
            step = TimelineStep.Year;
        } else if (diff > 1000 * 60 * 60 * 24 * 30 * 5) { // at least five months
            step = TimelineStep.Month;
        } else if (diff > 1000 * 60 * 60 * 24 * 3) { // at least three days
            step = TimelineStep.Day;
        } else if (diff > 1000 * 60 * 60 * 3) { // at least three hours
            step = TimelineStep.Hour;
        } else
            step = TimelineStep.Minute;

        let startDate = new Date(this.start);
        let endDate = new Date(this.end);
        const timelineOffset = this.calcRelativeSize(null, 0.01, this.timeline.Theme);
        const fontSize = this.calcFontSize(0.01, null, this.timeline.Theme);

        // Choose starting point w.r.t. step
        if (step === TimelineStep.FiveYears) {
            startDate = new Date(Math.floor(startDate.getFullYear() / 5) * 5, 0, 1, 0, 0, 0, 0);
        } else if (step === TimelineStep.Year) {
            startDate = new Date(startDate.getFullYear(), 0, 1, 0, 0, 0, 0);
        } else if (step === TimelineStep.Month) {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 0, 0, 0, 0);
        } else if (step === TimelineStep.Day) {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
        } else if (step === TimelineStep.Hour) {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), 0, 0, 0);
        } else if (step === TimelineStep.Minute) {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), 0, 0);
        }
        let lastDate = null;

        let lastTextOffset = 0;
        // Loop from start to end
        while (startDate < endDate) {
            let text = "";

            let includeYear = (lastDate != null && lastDate.getFullYear() == startDate.getFullYear() ? false : true);

            // Prepare text element
            if ((step === TimelineStep.Year) || (step === TimelineStep.FiveYears)) {
                text = startDate.getFullYear().toString();
            } else if (step === TimelineStep.Month) {
                text = startDate.getMonth() + (includeYear ? "/" + startDate.getFullYear() : "");
            } else if (step === TimelineStep.Day) {
                text = startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + (includeYear ? "" + startDate.getFullYear() : "");
            } else if (step === TimelineStep.Hour) {
                text = startDate.getHours() + "h " + startDate.getDate() + "." + (startDate.getMonth() + 1) + ".";
            } else if (step === TimelineStep.Minute) {
                text = startDate.getHours() + ":" + startDate.getMinutes() + " " + startDate.getDate() + "." + (startDate.getMonth() + 1) + ".";
            }
            const currentPos = TimeSpecification.CalcTimeVal(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
            const ratio = (currentPos - this.start) / (this.end - this.start);
            const offset = this.topOffset + ratio * (this.availableHeight);
            const eventText = new RenderedText(text, this.baseLineOffset - timelineOffset, offset - 5, TextAlign.Start, TextAlign.Start, event, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, -90, null, null);
            const eventTextBox = this.renderer.measureTextElement(eventText);

            let skip = false;
            // skip if we've got an event for the same timestamp
            for (let event of this.timeline.Events) {
                for (let occurence of event.Occurences) {
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
            const line = new RenderedLine("1px", this.timeline.Theme.DefaultNoteFontColor, "transparent", null);
            line.Points.push(new PointSpec(this.baseLineOffset - timelineOffset, offset));
            line.Points.push(new PointSpec(this.baseLineOffset, offset));
            this.placement.AddElement(line, this.GROUP_TIMELINE);
            this.timelineLines.push(line);
            lastDate = startDate;

            // Advance to next label
            if (step === TimelineStep.FiveYears) {
                startDate = new Date(startDate.getFullYear() + 5, 0, 1, 0, 0, 0);
            } else if (step === TimelineStep.Year) {
                startDate = new Date(startDate.getFullYear() + 1, 0, 1, 0, 0, 0);
            } else if (step === TimelineStep.Month) {
                startDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
            } else if (step === TimelineStep.Day) {
                startDate = new Date(startDate.setDate(startDate.getDate() + 1));
            } else if (step === TimelineStep.Hour) {
                startDate = new Date(startDate.setHours(startDate.getHours() + 1));
            } else if (step === TimelineStep.Minute) {
                startDate = new Date(startDate.setMinutes(startDate.getMinutes() + 1));
            }
        }

    }

    /**
     * Merge two arrays
     * @param first first array
     * @param second second array
     */
    private joinArray(first: TimelineTextPart[], second: TimelineTextPart[]) {
        for (let item of second) {
            first.push(item);
        }
    }

    /**
     * Parse text (which might be using b/i/u tags) into internal representation
     * @param text source text
     */
    private parseStructuredText(text: string): TimelineTextPart[] {
        let words: TimelineTextPart[] = [];
        let isBold = false;
        let isItalic = false;
        let isUnderline = false;
        let buffer = '';
        let bufferedSeparator = '';
        let j = 0;
        while (j < text.length) {
            if (text.substr(j, 3).toUpperCase() == "<B>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isBold = true;
                j += 3;
            } else if (text.substr(j, 3).toUpperCase() == "<I>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isItalic = true;
                j += 3;

            } else if (text.substr(j, 3).toUpperCase() == "<U>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isUnderline = true;
                j += 3;
            } else if (text.substr(j, 4).toUpperCase() == "</B>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isBold = false;
                j += 4;
            } else if (text.substr(j, 4).toUpperCase() == "</I>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isItalic = false;
                j += 4;

            } else if (text.substr(j, 4).toUpperCase() == "</U>") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = '';
                buffer = '';
                isUnderline = false;
                j += 4;
            } else if (text.substr(j, 1) == " ") {
                words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
                bufferedSeparator = ' ';
                buffer = '';
                j += 1;
            } else {
                buffer += text.substr(j, 1);
                j += 1;
            }
        }
        if (buffer.length > 0) {
            words.push(new TimelineTextPart(buffer, isBold, isItalic, isUnderline, bufferedSeparator));
        }

        return words;
    }

    /**
     * Wrap text so it does not exceeds given width
     * @param timelineText text element
     * @param maxWidth maximum width
     */
    private WrapMultilineText(timelineText: RenderedText, maxWidth: number) {
        const stringParts = timelineText.Text.split(' ');
        let startText: TimelineTextPart[] = [];
        let lastText: TimelineTextPart[] = [];
        let lines = [];

        let words: TimelineTextPart[] = this.parseStructuredText(timelineText.Text);
        // keeps adding one word after another till the text is larger than the maxWidth
        let i = 0;
        while (i < words.length) {
            // slice(0) as clone
            lastText = startText.slice(0);
            let candidates: TimelineTextPart[] = [];

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
            const timelineDescriptionBox = this.renderer.measureTextElement(timelineText);

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
    }

    /**
     * Place timeline footer (coopyright, datasource info, etc.)
     */
    private CreateFooter() {

        // Footer note
        let fontSize = this.calcFontSize(0.015, null, this.timeline.Theme);
        let smallFontSize = this.calcFontSize(0.01, null, this.timeline.Theme);

        // made with entistimeline.com
        let innerText = new RenderedText("entistimeline.com", this.placement.TotalWidth - this.padding * 3, this.placement.TotalHeight - this.padding, TextAlign.End, TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
        let linkEl = new RenderedLink("https://timeline.entis-design.com", "blank", "visit timeline.entis-design.com", [innerText], null);
        this.placement.AddElement(linkEl, this.GROUP_FOOTER);
        const linkElBox = this.renderer.measureTextElement(innerText);
        this.placement.AddElement(new RenderedText("made with", this.placement.TotalWidth - this.padding * 3 - linkElBox.width, this.placement.TotalHeight - this.padding, TextAlign.End, TextAlign.Start, null, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultNoteFontColor, 0, null, null),
            this.GROUP_FOOTER);

        // Datasource info
        if (this.timeline.DataSource != null) {
            let dataSourceText = new RenderedText(this.timeline.DataSource, this.padding * 3, this.placement.TotalHeight - this.padding, TextAlign.Start, TextAlign.Start, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultNoteFontColor, 0, 'bold', null);
            this.WrapMultilineText(dataSourceText, this.baseLineOffset);
            const sourceLinkBox = this.renderer.measureTextElement(dataSourceText);
            this.placement.TotalHeight += sourceLinkBox.height;
            this.footerCompensation += sourceLinkBox.height;
            // Enlarge if needed
            this.RecalcAvailableHeight();

            if (this.timeline.DataSourceLink != null) {
                let dataSourceLink = new RenderedLink(this.timeline.DataSourceLink, "blank", this.timeline.DataSourceLink, [dataSourceText], null);
                this.placement.AddElement(dataSourceLink, this.GROUP_FOOTER);
            } else {
                this.placement.AddElement(dataSourceText, this.GROUP_FOOTER);
            }
        }
    }

    /**
     * Place timeline header (title, description, links and image)
     */
    private CreateHeader() {
        let offset = 0;
        // Title font size
        let fontSize = this.calcFontSize(null, 0.05, this.timeline.Theme);

        // Title image
        if (this.timeline.Image != null) {
            const aspectRatio = this.timeline.Image.Width / this.timeline.Image.Height;
            if ((this.timeline.Image.Width > 0) && (this.timeline.Image.Height > 0)) {
                const iWidth = this.placement.TotalWidth;
                const iHeight = iWidth / aspectRatio;
                const inlineImage = new RenderedImage(this.timeline.Image.Url, 0, 0, iWidth, iHeight, false, true, null);
                this.placement.AddElement(inlineImage, this.GROUP_HEADER);
            }
        }

        // Title
        this.timelineTitle = new RenderedText(this.timeline.Title, this.padding, offset, TextAlign.End, TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
        this.WrapMultilineText(this.timelineTitle, this.placement.TotalWidth * 0.45);
        this.placement.AddElement(this.timelineTitle, this.GROUP_HEADER);

        const timelineBox = this.renderer.measureTextElement(this.timelineTitle);
        offset += timelineBox.height + this.padding;
        let descWidth = this.placement.TotalWidth * 0.4;

        // Description
        if ((this.timeline.Description != null) && (this.timeline.Description.length > 0)) {
            fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
            this.timelineDescription = new RenderedText(this.timeline.Description, this.padding, offset, TextAlign.End, TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, descWidth);
            this.WrapMultilineText(this.timelineDescription, descWidth);
            this.placement.AddElement(this.timelineDescription, this.GROUP_HEADER);
            const timelineDescriptionBox = this.renderer.measureTextElement(this.timelineDescription);
            offset += timelineDescriptionBox.height;
        }

        // Title links
        if (this.timeline.Links.length > 0) {
            offset += this.padding;
            for (let link of this.timeline.Links) {
                let linkEl = new RenderedText(link.Text, this.padding + descWidth, offset, TextAlign.End, TextAlign.End, null, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, null, null);
                let size = this.renderer.measureTextElement(linkEl);
                let linkBg = new RenderedLine(this.eventLineWidth, this.timeline.Theme.HeaderLinkColor, "transparent", null);
                linkBg.Points.push(new PointSpec(this.padding + descWidth - size.width, offset + size.height + fontSize * 0.5));
                linkBg.Points.push(new PointSpec(this.padding + descWidth, offset + size.height + fontSize * 0.5))
                let linkParent = new RenderedLink(link.Url, link.Target, link.Tooltip, [linkBg, linkEl], null);
                this.placement.AddElement(linkParent, this.GROUP_HEADER);
                offset += size.height + fontSize * 1;
                this.timelineLinks.push({ "line": linkBg, "text": linkEl });
            }
        }

        // Store header height
        this.headerHeight = offset;
    }

    /**
     * Move elements to their correct position based on position of other elements
     * */
    private FinalPlacement() {

        // Title, description and links are aligned from right, therefore we need the offset before axis lines)
        this.timelineTitle.PosX = this.baseLineOffset - this.padding * 2;

        if (this.timelineDescription != null) {
            this.timelineDescription.PosX = this.baseLineOffset - this.padding * 2;
        }

        for (let link of this.timelineLinks) {
            link.text.PosX = this.timelineDescription.PosX;
            let linkWidth = link.line.Points[1].PosX - link.line.Points[0].PosX;
            link.line.Points[0].PosX = this.timelineDescription.PosX - linkWidth;
            link.line.Points[1].PosX = this.timelineDescription.PosX;
        }
    }

    /**
     * Place points for axis/category lines based on total height
     */
    private FinalizeCategoryLines() {
        let lineOffset = this.baseLineOffset;

        for (const category of this.timeline.Categories) {
            let linePadding = 0;

            if (this.timeline.SelfContained == true) {
                category.TagLine.StrokeCap = "round";
                linePadding = this.padding;
            }
            category.TagLine.Points.push(new PointSpec(lineOffset, linePadding));
            category.TagLine.Points.push(new PointSpec(lineOffset, this.placement.TotalHeight - linePadding));
            lineOffset += this.categoryLineWidthSpaced;
        }
    }

    /**
     * Place axis/category lines
     */
    private CreateCategoryLines() {

        let categoryIndex = 0;

        for (const category of this.timeline.Categories) {
            const categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
            const line = new RenderedLine(this.categoryLineWidth + "px", categoryColor, "transparent", null);

            this.placement.AddElement(line, this.GROUP_CATEGORIES);
            category.TagLine = line;
            categoryIndex++;
        }
    }

    /** Place events
     */
    private CreateEvents() {
        // Create two event columns (left/right)
        let eventCols: any[] = [];
        let lineAreaSafeMargin = 60;

        // At most 350 pixels wide
        const colWidth = Math.min(350, (this.placement.TotalWidth - this.lineAreaWidth - lineAreaSafeMargin * 2) / 2 - this.padding * 2);

        this.spaceForEventLines = ((this.placement.TotalWidth - this.lineAreaWidth) / 2 - colWidth);
        const eventMargin = this.spaceForEventLines * 0.25;
        // Set column positions
        eventCols.push({ leftOffset: this.padding + eventMargin, width: colWidth, topOffset: this.topOffset, pos: 'onLeft' });
        eventCols.push({ leftOffset: this.placement.TotalWidth - colWidth - this.padding - eventMargin, width: colWidth, topOffset: this.categoryHorizontalOffset, pos: 'onRight' });

        // Events
        let fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);
        var smallFontSize = this.calcFontSize(0.015, null, this.timeline.Theme);
        const eventPadding = 5;
        let colNum = 0;
        let eventRect: RenderedRectangle = null;
        let eventLinkRect: RenderedRectangle = null;
        const eventLinkSize = 30;
        let linkLine: RenderedLine = null;
        let lastEvent: TimelineEvent = null;
        let lastEventTimestamp: TimeSpecification = null;

        // First pass - Loop through events and place them
        for (const event of this.timeline.Events) {

            // pick the column where's more space
            if (eventCols[0].topOffset > eventCols[1].topOffset)
                colNum = 1;
            else
                colNum = 0;

            const eventWidth = eventCols[colNum].width;
            let eventHeight = 0; // is calculated by adding numbers below

            const leftOffset = eventCols[colNum].leftOffset;
            const firstOccurence = event.Occurences[0];
            const ratio = (TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);

            const desiredTopOffset = this.topOffset + ratio * (this.availableHeight) - fontSize - 3;
            eventCols[colNum].topOffset = Math.max(desiredTopOffset, eventCols[colNum].topOffset);

            // Event boxes should preserve time ordering
            if (lastEvent != null) {
                eventCols[colNum].topOffset = Math.max(eventCols[colNum].topOffset, lastEvent.Tag.PosY + this.padding);
            }

            // Create event link (arrow), place it later
            if (event.Link != null) {
                eventLinkRect = new RenderedRectangle("5px", "tranparent", this.timeline.Theme.EventBgColor, 0, 0, eventLinkSize, eventLinkSize, 5, 5, event);
                linkLine = new RenderedLine("3px", "#ccc", "transparent", event);
                linkLine.StrokeCap = "round";

                let linkHelpLine = new RenderedLink(event.Link.Url, event.Link.Target, event.Link.Tooltip, [eventLinkRect, linkLine], event);
                this.placement.AddElement(linkHelpLine, this.GROUP_EVENTS);
                event.Tag.add(linkHelpLine);
            }

            // Place event rectangle (when image or description is present)
            if (event.Text != null || event.Image != null) {
                eventRect = new RenderedRectangle("0", "#fff", this.timeline.Theme.EventBgColor, leftOffset, 0, 5, 5, 5, 5, event);
                this.placement.AddElement(eventRect, this.GROUP_EVENTS);
                event.Tag.add(eventRect);
            }

            // line below event title
            const line = new RenderedLine(this.eventLineWidth, this.timeline.Theme.EventTitleLineColor, "transparent", null);
            event.Tag.add(line);
            this.placement.AddElement(line, this.GROUP_EVENTS);

            let titleAlign = TextAlign.Start;
            let titleOffset = leftOffset;
            if (eventCols[colNum].pos == 'onLeft') {
                titleAlign = TextAlign.End;
                titleOffset = leftOffset + eventWidth;
            }
            let eventTitle = event.Title;
            if (this.colapseEventTimesIntoTag) {
                eventTitle += " (";
                let first = true;
                for (const occurence of event.Occurences) {
                    eventTitle += (first ? "" : ", ") + occurence.Time.GetTimeDescription(lastEventTimestamp);
                    lastEventTimestamp = occurence.Time;
                    first = false;
                }
                eventTitle += ")"
            }

            // Event title
            const eventText = new RenderedText(eventTitle, titleOffset, eventCols[colNum].topOffset - 3, titleAlign, TextAlign.End, event, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontColor, 0, 'bold', null);
            event.Tag.add(eventText);

            this.placement.AddElement(eventText, this.GROUP_EVENTS);

            // Wrap if too wide
            this.WrapMultilineText(eventText, eventWidth);

            event.Tag.Col = colNum;

            const eventTextBox = this.renderer.measureTextElement(eventText);

            // Different for left/right columns
            if (eventCols[colNum].pos == 'onLeft') {
                event.Tag.PosX = leftOffset + eventWidth + eventPadding;
            } else {
                event.Tag.PosX = leftOffset - eventPadding;
            }
            eventHeight += eventTextBox.height;
            event.Tag.PosY = eventCols[colNum].topOffset + eventTextBox.height;
            event.Tag.StartY = eventCols[colNum].topOffset + eventTextBox.height;
            let lineStart = leftOffset - eventPadding;
            let lineEnd = leftOffset + ((event.Image != null || event.Text != null) ? eventWidth : eventTextBox.width) + eventPadding;
            if ((eventCols[colNum].pos == 'onLeft') && (event.Text == null) && (event.Image == null)) {
                lineStart = leftOffset + eventWidth - eventTextBox.width - eventPadding;
                lineEnd = leftOffset + eventWidth + eventPadding;
            }

            // line below event title
            line.Points.push(new PointSpec(lineStart, event.Tag.PosY));
            line.Points.push(new PointSpec(lineEnd, event.Tag.PosY));
            eventCols[colNum].topOffset += eventTextBox.height;

            // Place event description and/or image
            if (event.Text != null || event.Image != null) {

                eventRect.PosX = leftOffset - eventPadding;
                eventRect.PosY = eventCols[colNum].topOffset;

                eventCols[colNum].topOffset += eventPadding;

                // Event description
                if (event.Text != null) {
                    const eventDescription = new RenderedText(event.Text, leftOffset, eventCols[colNum].topOffset, TextAlign.Start, TextAlign.End, event, this.timeline.Theme.DefaultFont, smallFontSize, this.timeline.Theme.DefaultFontColor, 0, null, eventWidth);
                    event.Tag.add(eventDescription);

                    this.placement.AddElement(eventDescription, this.GROUP_EVENTS);
                    this.WrapMultilineText(eventDescription, eventWidth);

                    const eventDescriptionBox = this.renderer.measureTextElement(eventDescription);
                    eventCols[colNum].topOffset += eventDescriptionBox.height;
                    eventCols[colNum].topOffset += eventPadding;
                    eventHeight += eventPadding + eventDescriptionBox.height;
                }

                // Event image
                if (event.Image != null) {
                    if (event.Text != null) {
                        eventCols[colNum].topOffset += eventPadding;
                    }
                    const aspectRatio = event.Image.Width / event.Image.Height;
                    if ((event.Image.Width > 0) && (event.Image.Height > 0)) {
                        const iWidth = eventCols[colNum].width;
                        const iHeight = iWidth / aspectRatio;
                        const inlineImage = new RenderedImage(event.Image.Url, eventCols[colNum].leftOffset, eventCols[colNum].topOffset, iWidth, iHeight, true, false, event);
                        this.placement.AddElement(inlineImage, this.GROUP_EVENTS);
                        eventCols[colNum].topOffset += iHeight;
                        event.Tag.add(inlineImage);
                        eventHeight += iHeight;
                    }
                }

                eventRect.Width = eventWidth + eventPadding * 2;
                eventRect.Height = eventCols[colNum].topOffset - eventRect.PosY + eventPadding;
            }

            // Place event link (arrow)
            if (event.Link != null) {
                eventLinkRect.PosX = (colNum == 0 ? lineStart : lineEnd - eventLinkSize);
                eventLinkRect.PosY = eventCols[colNum].topOffset;
                linkLine.Points.push(new PointSpec(eventLinkRect.PosX + eventLinkSize / 3, eventLinkRect.PosY + eventLinkSize / 3));
                linkLine.Points.push(new PointSpec(eventLinkRect.PosX + eventLinkSize / 3 * 2, eventLinkRect.PosY + eventLinkSize / 2));
                linkLine.Points.push(new PointSpec(eventLinkRect.PosX + eventLinkSize / 3, eventLinkRect.PosY + eventLinkSize / 3 * 2));
                eventCols[colNum].topOffset += eventLinkSize;
                eventHeight += eventLinkSize;
            }
            eventCols[colNum].topOffset += this.padding;
            eventHeight += this.padding;
            event.Tag.Height = eventHeight;
            // enlarge drawing area if we are outside of the boundaries (add padding for footer height)
            this.placement.TotalHeight = Math.max(this.placement.TotalHeight, eventCols[colNum].topOffset + this.padding * 4);

            lastEvent = event;
        }

        // Enlarge if needed
        this.RecalcAvailableHeight();

        let totalLeftDiff = 0;
        let totalRightDiff = 0;

        // Second pass - aggregate differences between vertical offset as requested by event occurences and real offset (as a result of placing)
        for (let y = 0; y < this.timeline.Events.length; y++) {
            const event = this.timeline.Events[y];

            const firstOccurence = event.Occurences[0];
            const ratio = (TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
            const desiredTopOffset = this.topOffset + ratio * (this.availableHeight);

            // if yes
            if (desiredTopOffset < event.Tag.PosY) {
                if (event.Tag.Col == 0)
                    totalLeftDiff += event.Tag.PosY - desiredTopOffset;
                else
                    totalRightDiff += event.Tag.PosY - desiredTopOffset;
            }
        }

        let maximumDiff = Math.max(totalLeftDiff, totalRightDiff);

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
        for (let y = 0; y < this.timeline.Events.length; y++) {
            const event = this.timeline.Events[y];

            const firstOccurence = event.Occurences[0];
            const ratio = (TimeSpecification.CalcTimeVal(firstOccurence.Time.StartYear, firstOccurence.Time.StartMonth, firstOccurence.Time.StartDay, firstOccurence.Time.StartHour, firstOccurence.Time.StartMinute, firstOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
            const desiredTopOffset = this.topOffset + ratio * (this.availableHeight);

            // if yes
            if (desiredTopOffset > event.Tag.PosY) {
                // move the events (and all events below) more to the bottom
                let diff = desiredTopOffset - event.Tag.PosY;

                for (let z = y; z < this.timeline.Events.length; z++) {
                    if (event.Tag.Col == this.timeline.Events[z].Tag.Col) {
                        this.timeline.Events[z].Tag.moveVertically(diff);
                    }
                }
            }
        }

        // Fifth pass - check if something has fallen out
        for (let z = 0; z < this.timeline.Events.length; z++) {
            const event = this.timeline.Events[z];
            // if there's an event which overflows the original bounds, we need to extend them again
            let overflow = event.Tag.PosY + event.Tag.Height + this.padding * 2 - this.placement.TotalHeight;
            if (overflow > 0) {
                this.footerCompensation = Math.max(this.footerCompensation, overflow);
            }
        }


        this.placement.TotalHeight += this.footerCompensation;
        this.RecalcAvailableHeight();
    }

    /**
     * Find maximum distance between subsequent events
     */
    private findMaxDist(): MaxDistInfo {
        const result = new MaxDistInfo();
        result.dist = 0;

        for (let i = 0; i < this.timeline.Events.length - 1; i++) {
            const eventPrev = this.timeline.Events[i];
            const eventNext = this.timeline.Events[i + 1];
            const dist = eventNext.Tag.StartY - (eventPrev.Tag.StartY + eventPrev.Tag.Height);

            if (dist > result.dist) {
                result.dist = dist;
                result.start = eventPrev.Tag.StartY + eventPrev.Tag.Height;
                result.end = eventNext.Tag.PosY;
            }
        }
        return result;
    }

    /**
     * Cut empty space between too distant events
     */
    private CutEmptySpace() {
        let compensate = 0;
        // We should check for too long empty sections and cut them
        const cutMarkers: RenderedElement[] = [];
        let cntr = 0;

        while (true) {
            // safeguard counter
            cntr++;

            // find longest empty distances between events (incl. start, end)
            const maxDist = this.findMaxDist();

            // repeat until there's something to cut (or the safeguard is met)
            if ((maxDist.dist < this.timeline.Theme.EmptySpaceThreshold) || (cntr > this.timeline.Events.length)) {
                break;
            }

            // cut the distance and move all elements below higher
            const diff = (maxDist.dist - this.cutPlaceholderHeight);
            compensate -= diff;

            // Move also all existing cut markers
            for (const el of cutMarkers) {
                if ((el as RenderedRectangle).PosY > maxDist.start) {
                    el.moveVertically(-diff);
                }
            }

            // Construct cut sign (three dots in a circle)
            const circleDiameter = 20;
            const smallCircleDiameter = circleDiameter / 40;
            const centerPoint = new PointSpec(this.baseLineOffset, maxDist.start + this.cutPlaceholderHeight / 2);
            const eventCircle = new RenderedRectangle((this.viewport.Width * 0.005) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2, circleDiameter, circleDiameter, null);
            this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
            cutMarkers.push(eventCircle);

            let eventSmallCircle = new RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
            this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
            cutMarkers.push(eventSmallCircle);
            eventSmallCircle = new RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
            this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
            cutMarkers.push(eventSmallCircle);
            eventSmallCircle = new RenderedRectangle((this.viewport.Width * 0.002) + "px", this.timeline.Theme.CutPlaceholderBorder, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX + smallCircleDiameter * 14, centerPoint.PosY - smallCircleDiameter, smallCircleDiameter * 2, smallCircleDiameter * 2, smallCircleDiameter, smallCircleDiameter, null);
            this.placement.AddElement(eventSmallCircle, this.GROUP_EVENTS);
            cutMarkers.push(eventSmallCircle);

            // Move also all subsequent events
            for (const evt of this.timeline.Events) {
                if (evt.Tag.StartY > maxDist.start) {
                    evt.Tag.moveVertically(-diff);
                }
            }

            // Remove axis ticks and labels that are not needed any more
            const linesToRemove: RenderedLine[] = [];
            const textsToRemove: RenderedText[] = [];

            for (const line of this.timelineLines) {
                if ((line.Points[0].PosY > maxDist.start) && (line.Points[0].PosY < maxDist.end)) {
                    linesToRemove.push(line);
                }
            }

            for (const item of linesToRemove) {
                this.timelineLines.splice(this.timelineLines.indexOf(item), 1);
                this.placement.Elements.splice(this.placement.Elements.indexOf(item), 1);
            }

            for (const text of this.timelineTexts) {
                if ((text.PosY > maxDist.start) && (text.PosY < maxDist.end)) {
                    textsToRemove.push(text);
                }
            }

            for (const item of textsToRemove) {
                this.timelineTexts.splice(this.timelineTexts.indexOf(item), 1);
                this.placement.Elements.splice(this.placement.Elements.indexOf(item), 1);
            }
        }

        // Adjust total height accordingly
        this.placement.TotalHeight += compensate;
    }

    /**
     * Place individual timeline parts in correct order
     */
    private PlaceVertical() {
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
    }

    /**
     * Place category labels (bound to axis lines, on top of page)
     */
    private CreateCategoryLabels() {
        let categoryIndex = 0;
        let lineOffset = this.baseLineOffset;
        const fontSize = this.calcFontSize(0.02, null, this.timeline.Theme);

        this.categoryHorizontalOffset = this.padding * 2;
        for (const category of this.timeline.Categories) {
            if ((category.Title != null) && (category.Title.length > 0)) {
                const categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                const categoryRect = new RenderedRectangle("0", "#fff", categoryColor, lineOffset, this.categoryHorizontalOffset, 0, 0, 5, 5, category);
                this.placement.AddElement(categoryRect, this.GROUP_CATEGORIES);

                const categoryText = new RenderedText(category.Title, lineOffset + this.padding, this.categoryHorizontalOffset, TextAlign.Start, TextAlign.End, category, this.timeline.Theme.DefaultFont, fontSize, this.timeline.Theme.DefaultFontInverseColor, 0, null, null);
                this.placement.AddElement(categoryText, this.GROUP_CATEGORIES);
                const categoryTextBox = this.renderer.measureTextElement(categoryText);
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
    }

    /**
     * Recalculate axis height based on header and footer size
     */
    private RecalcAvailableHeight() {
        this.availableHeight = this.placement.TotalHeight - this.topOffset - (this.padding * 4) - this.footerCompensation;
    }

    /**
     * Get horizontal offset for line connecting axis and event based on existing lines (stored in grabbed space)
     * @param grabbedSpace grabbed space register (array of objects with from/to)
     * @param proposal proposed horizontal offset
     * @param start vertical offset of line (start)
     * @param end vertical offset of line (end)
     * @param additional space between lines (it's being added to the proposal)
     * @param onRight flag if line is on the left or right of center
     */
    private checkForGrabbedSpace(grabbedSpace, proposal: number, start: number, end: number, additional: number, onRight: boolean) {
        const tolerance = 0;
        let currentExtreme = null;

        // check for all affected lines
        let affects = false;
        for (const space of grabbedSpace) {
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
            return currentExtreme + (onRight ? - additional : additional);
    }

    /**
     * Place lines between events and axis/categories
     */
    private CreateEventLines() {
        const lineLabelSize = this.calcFontSize(0.02, null, this.timeline.Theme);
        const circleDiameter = this.calcRelativeSize(null, 0.01, this.timeline.Theme);
        const grabbedSpace = [];
        let lastTimestamp: TimeSpecification = null;

        // Event points
        for (const event of this.timeline.Events) {
            for (const eventOccurence of event.Occurences) {
                const categoryIndex = this.getCategoryIndex(this.timeline.Categories, eventOccurence.Category);

                const categoryColor = this.timeline.Theme.CategoryColors[categoryIndex % this.timeline.Theme.CategoryColors.length];
                const lineOffset = this.baseLineOffset + categoryIndex * this.categoryLineWidthSpaced;
                const ratio = (TimeSpecification.CalcTimeVal(eventOccurence.Time.StartYear, eventOccurence.Time.StartMonth, eventOccurence.Time.StartDay, eventOccurence.Time.StartHour, eventOccurence.Time.StartMinute, eventOccurence.Time.StartSecond) - this.start) / (this.end - this.start);
                const centerPoint = new PointSpec(lineOffset, this.topOffset + ratio * (this.availableHeight));

                // Event line connecting the AXIS and the Event rectangle with break
                const line = new RenderedLine(this.eventLineWidth, this.timeline.Theme.DefaultEventLineColor, "transparent", null);
                line.Points.push(centerPoint);
                const onRight = event.Tag.PosX > centerPoint.PosX;
                let middlePos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.spaceForEventLines / 3 : this.baseLineOffset - this.spaceForEventLines / 3);

                middlePos = this.checkForGrabbedSpace(grabbedSpace, middlePos, centerPoint.PosY, event.Tag.PosY, this.eventLinePadding, onRight);

                // Place line
                line.Points.push(new PointSpec(middlePos, centerPoint.PosY));
                line.Points.push(new PointSpec(middlePos, event.Tag.PosY));
                line.Points.push(new PointSpec(event.Tag.PosX + (onRight ? -1 : 1), event.Tag.PosY));
                this.placement.AddElement(line, this.GROUP_EVENTS);
                event.Tag.Elements.push(line);
                const descriptionPos = (onRight ? this.baseLineOffset + this.lineAreaWidth + this.padding * 1 : this.baseLineOffset - this.padding * 1);

                // store info about line offset being grabbed by this event
                if (centerPoint.PosY < event.Tag.PosY)
                    grabbedSpace.push({ "from": centerPoint.PosY, "to": event.Tag.PosY, "offset": middlePos, "onRight": onRight });
                else
                    grabbedSpace.push({ "to": centerPoint.PosY, "from": event.Tag.PosY, "offset": middlePos, "onRight": onRight });

                // Event Time Description
                if (!this.colapseEventTimesIntoTag) {
                    const descEl = new RenderedText(eventOccurence.Time.GetTimeDescription(lastTimestamp), descriptionPos, centerPoint.PosY - 3, (onRight ? TextAlign.Start : TextAlign.End), TextAlign.Start, null, this.timeline.Theme.DefaultFont, lineLabelSize, this.timeline.Theme.DefaultEventLineColor, 0, null, null);
                    lastTimestamp = eventOccurence.Time;
                    this.placement.AddElement(
                        descEl,
                        this.GROUP_EVENTS);
                    event.Tag.Elements.push(descEl);
                }

                let height;
                if (eventOccurence.Time.HasStart && !eventOccurence.Time.HasEnd) {
                    height = 0;
                } else if (eventOccurence.Time.HasStart && eventOccurence.Time.HasEnd) {
                    const ratio = (TimeSpecification.CalcTimeVal(eventOccurence.Time.EndYear, eventOccurence.Time.EndMonth, eventOccurence.Time.EndDay, eventOccurence.Time.EndHour, eventOccurence.Time.EndMinute, eventOccurence.Time.EndSecond) - this.start) / (this.end - this.start);
                    height = this.topOffset + ratio * (this.availableHeight) - centerPoint.PosY;
                }
                // Circle/Rectangle on the Axis

                const eventCircle = new RenderedRectangle((this.viewport.Width * 0.005) + "px", categoryColor, this.timeline.Theme.DefaultEventPointColor, centerPoint.PosX - circleDiameter, centerPoint.PosY - circleDiameter, circleDiameter * 2, circleDiameter * 2 + height, circleDiameter, circleDiameter, event);
                // enlarge drawing area if needed
                this.placement.TotalHeight = Math.max(this.placement.TotalHeight, centerPoint.PosY + circleDiameter * 2 + height);
                this.placement.AddElement(eventCircle, this.GROUP_EVENTS);
                event.Tag.Elements.push(eventCircle);

            }
        }
    }

    /**
     * Group for elements related to header
     */
    private GROUP_HEADER: string = "GroupHeader";

    /**
     * Group for elements related to axis ticks
     */
    private GROUP_TIMELINE: string = "GroupTimeline";

    /**
     * Group for elements related to footer
     */
    private GROUP_FOOTER: string = "GroupFooter";

    /**
     * Group for elements related to categories
     */
    private GROUP_CATEGORIES: string = "GroupCategories";

    /**
     * Group for elements related to events
     */
    private GROUP_EVENTS: string = "GroupEvents";

    /**
     * Place the timeline
     */
    public Place() {
        // sort timeline
        this.timeline.SortEvents();

        this.timelineLines = [];
        this.timelineTexts = [];

        // Axis line
        this.start = this.timeline.FindStart();
        this.end = this.timeline.FindEnd();

        // Group (order matters!)
        this.placement = new RenderedTimeline(this.timeline, this.viewport, this.timeline.Theme.DefaultBackgroundColor);
        this.placement.AddGroup(this.GROUP_HEADER);
        this.placement.AddGroup(this.GROUP_TIMELINE);
        this.placement.AddGroup(this.GROUP_FOOTER);
        this.placement.AddGroup(this.GROUP_CATEGORIES);
        this.placement.AddGroup(this.GROUP_EVENTS);

        // Inject Google Fonts (before text added in order to measure correctly)
        for (const font of this.timeline.Theme.GoogleFonts) {
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
                let minDiff: number = null;
                let minStart: number = null;
                let maxEnd: number = null;

                // find start and end timestamp numbers
                for (var i = 0; i < this.timeline.Events.length; i++) {
                    const currentTime = this.timeline.Events[i].FindRange(true);
                    minStart = (minStart == null ? currentTime : Math.min(minStart, currentTime));
                    maxEnd = (maxEnd == null ? currentTime : Math.max(maxEnd, currentTime));
                }

                // find minimal numeric difference between two subsequent events
                for (var i = 1; i < this.timeline.Events.length; i++) {
                    const prevTime = this.timeline.Events[i - 1].FindRange(true);
                    const currentTime = this.timeline.Events[i].FindRange(true);
                    const diff = currentTime - prevTime;

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
    }
}