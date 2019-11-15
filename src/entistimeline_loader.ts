import { TimelinePlacer } from "./entistimeline_placer";
import { TimelineRenderer } from "./entistimeline_renderer";
import { TimelineTheme } from "./entistimeline_theme";
import { ViewportConfiguration } from "./RenderModel/viewportconfiguration";
import { Timeline } from "./DataModel/timeline";
import { TimelineCategory } from "./DataModel/timelinecategory";
import { TimelineEvent } from "./DataModel/timelineevent";
import { TimeSpecification } from "./DataModel/timespecification";
import { TimelineOccurence } from "./DataModel/timelineoccurence";
import { TimelineImage } from "./DataModel/timelineimage";
import { TimelineLink } from "./DataModel/timelinelink";
export { TimelineLoader };

    /**
     * Timeline Initializer
     */
class TimelineLoader {
    /**
     * Timeline model
     */
    timeline: Timeline;

    /**
     * Timeline renderer
     */
    renderer: TimelineRenderer;

    /**
     * Flag for error during initilization
     */
    loadingError: boolean;

    /**
     * Create new loader
     */
    constructor() {
    }


    /**
     * Combine default theme configuration with provided customization object
     * @param theme default theme object
     * @param override theme customization
     */
    private overrideTheme(theme: TimelineTheme, override: any) {
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
            if (override.GoogleFonts!= null) {
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
    }

    /**
     * Initialize timelime from external url with given theme and place it into DOM element
     * @param timelineUrl timeline url
     * @param panelId target DOM element id
     * @param customTheme theme configuration
     */
    public loadFromUrl(timelineUrl: string, panelId: string, customTheme: any) {
        this.getJSON(timelineUrl, (status, data) => {
            if (data.Success == true) { // Wrapped by storage-service
                this.load(data.Timeline, panelId, customTheme);
            } else { // native JSON file
                this.load(data, panelId, customTheme);
            }
        });
    }

    /**
     * Initialize timeline from local object with given theme and place it into DOM element
     * @param timelineSpec timeline configuration
     * @param panelId target DOM element id
     * @param customTheme theme configuration
     */
    public load(timelineSpec: any, panelId: string, customTheme: any) {
        this.loadingError = false;

        // Default theme
        let theme = new TimelineTheme("Roboto Condensed", "#555", "#fff", "#ccc", 10, 90, "#fff", 0.02, ["Roboto Condensed"], ["#E4572E", "#29335C", "#F3A712", "#EA526F", "#E76B74"], "#eee", "#bbb", "#ddd", "#fff", "#ff0000", 0.04, 600, "#ddd", 0.7);

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
        let defaultCategory: TimelineCategory = null;
        let t = new Timeline(timelineSpec.Title, theme);
        this.timeline = t;

        // Parse data source information
        if (timelineSpec.DataSource != null)
            t.DataSource = timelineSpec.DataSource;

        if (timelineSpec.DataSourceLink != null)
            t.DataSourceLink = timelineSpec.DataSourceLink;

        // Parse main/background image
        if (timelineSpec.Image != null) {
            t.Image = new TimelineImage(timelineSpec.Image.Url, timelineSpec.Image.Width, timelineSpec.Image.Height);
        }

        // Parse title description
        t.Description = timelineSpec.Subtitle;

        // Parse categories
        if (Array.isArray(timelineSpec.Categories)) {
            for (const category of timelineSpec.Categories) {
                t.Categories.push(new TimelineCategory(category.Id, category.Title));
            }
        }

        // Parse title links
        if (Array.isArray(timelineSpec.Links)) {
            for (const link of timelineSpec.Links) {
                t.Links.push(new TimelineLink(link.Url, link.Text, link.Target, link.Tooltip));
            }
        }

        // Push default category if none is specified
        if (t.Categories.length == 0) {
            defaultCategory = new TimelineCategory("DEFCAT", "");
            t.Categories.push(defaultCategory);
        }

        // Parse events
        for (const event of timelineSpec.Events) {
            // Assume event id and title
            let evt = new TimelineEvent(event.Id, event.Title);

            // Non-empty event description
            if ((event.Description != null) && (event.Description !== ""))
                evt.Text = event.Description;

            // Main image
            if (event.Image != null) {
                evt.Image = new TimelineImage(event.Image.Url, event.Image.Width, event.Image.Height);
            }

            // Event link
            if (event.Link != null) {
                evt.Link = new TimelineLink(event.Link.Url, null, event.Link.Target, event.Link.Tooltip);
            }

            // Event occurences
            for (const occurence of event.Occurences) {
                const newOccurence = new TimelineOccurence();
                newOccurence.Time = new TimeSpecification(occurence.Year, occurence.Month, occurence.Day, occurence.Hour, occurence.Minute, occurence.Second, occurence.EndYear, occurence.EndMonth, occurence.EndDay, occurence.EndHour, occurence.EndMinute, occurence.EndSecond, occurence.Title);

                // search categories and bind to them
                for (const category of t.Categories) {
                    if (category.Id == occurence.CategoryId) {
                        newOccurence.Category = category;
                        break;
                    }
                }

                // Attach to default category if none specified
                if (newOccurence.Category == null) {
                    if (defaultCategory == null) {
                        console.error("Category of event " + event.Title + " not identified. Either specify category in the Categories section or do not use category for events");
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
        let targetPanel = document.body;

        // Might be overriden
        if (panelId != null) {
            t.SelfContained = true;
            targetPanel = document.getElementById(panelId);
        } else {
            t.SelfContained = false;
            document.title = t.Title;
        }

        // Initialize renderer
        this.renderer = new TimelineRenderer(targetPanel);

        if (this.loadingError) {
            this.renderer.RenderError();
        } else {
            // Performs the placing/rendering
            this.refresh();

            // Bind for window resize events (need replacing/re-rendering)
            window.addEventListener('resize', () => this.windowSizeChange());
        }
    }

    /**
     * Download JSON from remote source
     * @param url remote url
     * @param callback callback function (with params of status and response)
     */
    private getJSON(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            const status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }

    /**
     * Re-place current timeline and re-render it after window size chage
     */
    private windowSizeChange() {
        this.refresh();
    }

    /**
     * Performs placing and rendering of current timeline
     */
    private refresh() {
        var viewport = this.renderer.GetViewportConfiguration();
        const p = new TimelinePlacer(this.timeline, this.renderer, viewport);
        const placedTimeline = p.Place();
        const renderedTimeline = this.renderer.Render(placedTimeline);
    }
}