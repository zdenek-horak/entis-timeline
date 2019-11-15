import { RenderedElement } from "./renderedelement";
import { TimelineElement } from "../DataModel/timelineelement";
export { RenderedRectangle }

/**
 * Rendered Rectangle Representation */
class RenderedRectangle extends RenderedElement {

    /**
     * Left offset
     */
    public PosX: number;

    /**
     * Top offset
     */
    public PosY: number;

    /**
     * Rectangle width
     */
    public Width: number;

    /**
     * Rectangle height
     */
    public Height: number;

    /**
     * Rectangle corner horizontal radius
     */
    public RX: number;

    /**
     * Rectangle corner vertical radius
     */
    public RY: number;

    /**
     * Border line width (textual representation using any HTML/SVG units)
     */
    public LineWidth: string;

    /**
     * Border line color (hex/rgba/color name)
     */
    public LineColor: string;

    /**
     * Fill color (hex/rgba/color name)
     */
    public FillColor: string;

    /**
     * Create new rendered rectangle representation
     * @param lineWidth border line width (textual representation using any HTML/SVG units)
     * @param lineColor border line color (hex/rgba/color name)
     * @param fillColor fill color (hex/rgba/color name)
     * @param posX left offset
     * @param posY top offset
     * @param width rectangle width
     * @param height rectangle height
     * @param rx corner horizontal radius
     * @param ry corner vertical radius
     * @param element related timeline element model (optional)
     */
    constructor(lineWidth: string, lineColor: string, fillColor: string, posX: number, posY: number, width: number, height: number, rx: number, ry: number, element: TimelineElement) {
        super(element);

        this.PosX = posX;
        this.PosY = posY;
        this.RX = rx;
        this.RY = ry;
        this.Width = width;
        this.Height = height;
        this.LineWidth = lineWidth;
        this.LineColor = lineColor;
        this.FillColor = fillColor;
    }

    /**
    * Move element vertically (for adjusting position during cuts, etc.)
    * @param amount amount of movement
    */
    moveVertically(amount: number) {
        this.PosY += amount;
    }

}