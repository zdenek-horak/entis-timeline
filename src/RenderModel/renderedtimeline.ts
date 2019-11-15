import { RenderedElement } from "./renderedelement";
import { ViewportConfiguration } from "./viewportconfiguration";
import { Timeline } from "../DataModel/timeline";
export { RenderedTimeline }

/**
 * Rendered Timeline Model
 */
class RenderedTimeline {
    /**
     * Target area width
     */
    public TotalWidth: number;

    /**
     * Target area height
     */
    public TotalHeight: number;

    /**
     * Default background color (hex/rgba/color name)
     */
    public BackgroundColor: string;

    /**
     * Timeline model
     */
    public ParentTimeline: Timeline;

    /**
     * Information about target viewport
     */
    public Viewport: ViewportConfiguration;

    /**
     * Elements to render
     */
    public Elements: Array<RenderedElement>;

    /**
     * Element group ids (groups are rendered in layers)
     */
    public Groups: Array<string>;

    /**
     * Create new rendered timeline representation
     * @param timeline timeline model
     * @param viewport viewport information
     * @param bgColor background color (hex/rgba/color name)
     */
    constructor(timeline: Timeline, viewport: ViewportConfiguration, bgColor: string) {
        this.ParentTimeline = timeline;
        this.TotalWidth = 500;
        this.TotalHeight = 1000;
        this.Viewport = viewport;
        this.BackgroundColor = bgColor;
        this.Elements = new Array<RenderedElement>();
        this.Groups = new Array<string>();
    }
    /**
     * Create new group
     * @param groupId unique group id
     */
    public AddGroup(groupId: string) {
        this.Groups.push(groupId);
    }
    /**
     * Add new element and assign corresponding group
     * @param element rendered element
     * @param groupId group id to assing
     */
    public AddElement(element: RenderedElement, groupId: string) {
        element.GroupId = groupId;
        this.Elements.push(element);
    }
}