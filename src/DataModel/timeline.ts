import { TimelineEvent } from "./timelineevent";
import { TimelineCategory } from "./timelinecategory";
import { TimeSpecification } from "./timespecification";
import { TimelineOccurence } from "./timelineoccurence";
import { TimelineLink } from "./timelinelink";
import { TimelineImage } from "./timelineimage";
import { TimelineTheme } from "../entistimeline_theme";

export { Timeline };

/**
 * Timeline Model
 */
class Timeline {
    /**
     * Timeline title
     */
    public Title: string;

    /**
     * Categories of timeline
     */
    public Categories: TimelineCategory[];

    /**
     * Events present in timeline
     */
    public Events: TimelineEvent[];

    /**
     * Timeline theme (visuals) configuration
     */
    public Theme: TimelineTheme;

    /**
     * Main timeline image (used as background in header)
     */
    public Image: TimelineImage;

    /**
     * Timeline title description (plaintext with b/i/u tags support)
     */
    public Description: string = '';

    /**
     * Flag if timeline should be rendered inside whole window or as a part of different page
     */
    public SelfContained = false;

    /**
     * Text information about timeline data source (shown in footer)
     */
    public DataSource: string;

    /**
     * Link to timeline data source (used as a link to footer datasource info)
     */
    public DataSourceLink: string;

    /**
     * Timeline related links
     */
    public Links: TimelineLink[];

    /**
     * Compare timestamps of two occurences (used for sorting)
     * @param a first occurence
     * @param b second occurence
     */
    public CompareOccurencies(a: TimelineOccurence, b: TimelineOccurence) {
        let valA, valB;

        if ((a.Time.HasStart) && (b.Time.HasStart)) {
            valA = TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
            valB = TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
        } else if ((a.Time.HasEnd) && (b.Time.HasStart)) {
            valA = TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
            valB = TimeSpecification.CalcTimeVal(b.Time.StartYear, b.Time.StartMonth, b.Time.StartDay, b.Time.StartHour, b.Time.StartMinute, b.Time.StartSecond);
        } else if ((a.Time.HasStart) && (b.Time.HasEnd)) {
            valA = TimeSpecification.CalcTimeVal(a.Time.StartYear, a.Time.StartMonth, a.Time.StartDay, a.Time.StartHour, a.Time.StartMinute, a.Time.StartSecond);
            valB = TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
        } else if ((a.Time.HasEnd) && (b.Time.HasEnd)) {
            valA = TimeSpecification.CalcTimeVal(a.Time.EndYear, a.Time.EndMonth, a.Time.EndDay, a.Time.EndHour, a.Time.EndMinute, a.Time.EndSecond);
            valB = TimeSpecification.CalcTimeVal(b.Time.EndYear, b.Time.EndMonth, b.Time.EndDay, b.Time.EndHour, b.Time.EndMinute, b.Time.StartSecond);
        }

        return (valA > valB ? 1 : (valA < valB ? -1 : 0));
    }

    /**
     * Compare timestamps of two events (used for sorting)
     * @param a first event
     * @param b second event
     */
    public CompareEvents(a: TimelineEvent, b: TimelineEvent) {
        let valA = a.FindRange(true);
        let valB = b.FindRange(true);

        if (valA == valB) {
            return 0;
        } else if (valA > valB) {
            return 1;
        } else
            return -1;
    }

    /**
     * Find numeric representation of timeline start timestamp
     */
    public FindStart(): number {
        return this.FindRange(true);
    }

    /**
     * Find numeric representation of timeline end timestamp
     */
    public FindEnd(): number {
        return this.FindRange(false);
    }

    /**
     * Find numeric representation of timeline start/end
     * @param start flag to check for start (true) or end (false) of timeline range
     */
    private FindRange(start: boolean) {
        if (this.Events.length > 0) {
            const borderEvent = this.Events[(start ? 0 : this.Events.length - 1)];
            return borderEvent.FindRange(start);
        } else {
            return null;
        }
    }

    /**
     * Sort events inside timeline according to their timestamps
     */
    public SortEvents() {
        for (const event of this.Events)
            event.Occurences.sort((a, b) => this.CompareOccurencies(a, b));
        this.Events.sort((a, b) => this.CompareEvents(a, b));
    }

    /**
     * Create new timeline object
     * @param title timeline title
     * @param theme timeline theme configuration
     */
    constructor(title: string, theme: TimelineTheme) {
        this.Image = null;
        this.Title = title;
        this.Categories = [];
        this.Events = [];
        this.Theme = theme;
        this.Links = [];
    }
}
