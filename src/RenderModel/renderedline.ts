import { RenderedElement } from "./renderedelement";
import { PointSpec } from "./pointspec";
import { TimelineElement } from "../DataModel/timelineelement";
export { RenderedLine }

/**
 * Rendered Line Model
 */
class RenderedLine extends RenderedElement {
    /**
     * Line points
     */
    public Points: PointSpec[];

    /**
     * Line width (textual representation using any HTML/SVG units)
     */
    public LineWidth: string;

    /**
     * Line color (hex/rgba/color name)
     */
    public LineColor: string;

    /**
     * Fill color (hex/rgba/color name)
     */
    public FillColor: string;

    /**
     * Line stroke cap (eg. round)
     */
    public StrokeCap: string = null;

    /**
     * Create new line representation
     * @param lineWidth line width (textual representation using any HTML/SVG units)
     * @param lineColor line color (hex/rgba/color name)
     * @param fillColor fill color (hex/rgba/color name)
     * @param element related timeline element model (optional)
     */
    constructor(lineWidth: string, lineColor: string, fillColor: string, element: TimelineElement) {
        super(element);

        this.Points = [];
        this.LineWidth = lineWidth;
        this.LineColor = lineColor;
        this.FillColor = fillColor;
    }

    /**
     * Move element vertically (for adjusting position during cuts, etc.)
     * @param amount amount of movement
     */
    moveVertically(amount: number) {
        for (let point of this.Points) {
            point.PosY += amount;
        }
    }

}
