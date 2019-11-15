import { TimelineCategory } from "./timelinecategory";
import { TimeSpecification } from "./timespecification";
import { TimelineElement } from "./timelineelement";
import { TimelineOccurence } from "./timelineoccurence";
import { TimelineImage } from "./timelineimage";
import { TimelineLink } from "./timelinelink";
import { EventRenderWrapper } from "../RenderModel/eventrenderwrapper";

export { TimelineEvent };

/**
 * Timeline Event Model
 */
class TimelineEvent extends TimelineElement {
    /**
     * Event Unique Id
     */
    public Id: string;

    /**
     * Event Title (short text)
     */
    public Title: string;

    /**
     * Event Image
     */
    public Image: TimelineImage = null;

    /**
     * Event Link
     */
    public Link: TimelineLink = null;

    /**
     * Event Description
     */
    public Text: string;

    /**
     * Event Occurences (model objects describing when event happened)
     */
    public Occurences: TimelineOccurence[];

    /**
     * Visual representation of the event (used during placing/rendering phase)
     */
    public Tag: EventRenderWrapper = null;

    /**
     * Create new event
     * @param id event unique id
     * @param title event title
     */
    constructor(id: string, title: string) {
        super();
        this.Id = id;
        this.Title = title;
        this.Occurences = new Array();
        this.Tag = new EventRenderWrapper();
    }

    /**
     * Find event start/end timestamp numeric representation
     * @param start true if start timestamp should be found, false for end timestamp
     */
    public FindRange(start: boolean) {
        if (this.Occurences.length > 0) {
            const borderEvent = this.Occurences[(start ? 0 : this.Occurences.length - 1)];
            if (borderEvent.Time.HasStart) {
                return TimeSpecification.CalcTimeVal(borderEvent.Time.StartYear, borderEvent.Time.StartMonth, borderEvent.Time.StartDay, borderEvent.Time.StartHour, borderEvent.Time.StartMinute, borderEvent.Time.StartSecond);
            } else if (borderEvent.Time.HasEnd) {
                return TimeSpecification.CalcTimeVal(borderEvent.Time.EndYear, borderEvent.Time.EndMonth, borderEvent.Time.EndDay, borderEvent.Time.EndHour, borderEvent.Time.EndMinute, borderEvent.Time.EndSecond);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}