import { RenderedText, TextAlign } from "./renderedtext";
import { TimelineElement } from "../DataModel/timelineelement";
import { RenderedElement } from "./renderedelement";
export { RenderedLink }

/**
 * Rendered Link Representation 
 */
class RenderedLink extends RenderedElement {
    /**
     * Link URL
     */
    public Link: string;

    /**
     * Link children (usualy RenderedText instances)
     */
    public Children: RenderedElement[];

    /**
     * Link tooltip (optional)
     */
    public Tooltip: string = null;

    /**
     * Link target (eg. _blank, optional)
     */
    public Target: string = null;

    /**
     * Create new rendered link representation
     * @param link link url
     * @param target link target (eg. _blank, optional)
     * @param tooltip link tooltip (optional)
     * @param childrenElements link children (usualy RenderedText instances)
     * @param element related timeline element model (optional)
     */
    constructor(link: string, target: string, tooltip: string, childrenElements: RenderedElement[], element: TimelineElement) {
        super(element);

        this.Children = childrenElements;
        this.Link = link;
        this.Tooltip = tooltip;
        this.Target = target;
    }

    /**
    * Move element vertically (for adjusting position during cuts, etc.)
    * @param amount amount of movement
    */
    moveVertically(amount: number) {
        for (let child of this.Children) {
            child.moveVertically(amount);
        }
    }

}
