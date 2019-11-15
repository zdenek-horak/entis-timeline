import { RenderedElement } from "./renderedelement";
export { EventRenderWrapper };

/**
 * Wrapper object for rendered elements related to timeline event
 */
class EventRenderWrapper {
    /**
     * Related elements
     */
    public Elements: RenderedElement[] = [];

    /**
     * Top offset of event-related elements
     */
    public PosY: number;

    /**
     * Left offset of event-related elements
     */
    public PosX: number;

    /**
     * Column index (0 - left column, 1 - right column)
     */
    public Col: number;

    /**
     * Event visual representation height
     */
    public Height: number;

    /**
     * Top offset of event title (offset used for connecting event line to axis)
     */
    public StartY: number;

    /**
     * Create new event render wrapper
     */
    constructor() {
    }

    /**
     * Add new event-related rendered element
     * @param element rendered element
     */
    add(element: RenderedElement) {
        this.Elements.push(element);
    }

    /**
     * Move all event-related elements vertically (used for extending/cutting timeline)
     * @param amount amount of movement
     */
    moveVertically(amount: number) {
        this.PosY += amount;
        this.StartY += amount;
        for (let element of this.Elements) {
            element.moveVertically(amount);
        }
    }
}
