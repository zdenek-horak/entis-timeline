import { TimelineElement } from "../DataModel/timelineelement";

export { RenderedElement }

/**
 * Base class for rendered elements
 */
abstract class RenderedElement {
    /**
     * Related timeline element (usualy event)
     */
    public Element: TimelineElement;

    /**
     * Id of rendered element group (groups are rendered in one layer)
     */
    public GroupId: string = null;

    /**
     * Create new rendered element
     * @param element
     */
    constructor(element: TimelineElement) {
        this.Element = element;
    }

    /**
     * Move element vertically (for adjusting position during cuts, etc.)
     * @param amount amount of movement
     */
    abstract moveVertically(amount: number);
}