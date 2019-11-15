import { RenderedElement } from "./renderedelement";
import { PointSpec } from "./pointspec";
import { TimelineElement } from "../DataModel/timelineelement";
export { RenderedCircle }

/**
 * Rendered Circle Model
 */
class RenderedCircle extends RenderedElement {

    /**
     * Circle center specification
     */
    public Center: PointSpec;

    /**
     * Circle border line width (might use HTML/SVG units for now)
     */
    public LineWidth: string;

    /**
     * Circle border color (hex/rgba/color name)
     */
    public LineColor: string;

    /**
     * Circle fill color (hex/rgba/color name)
     */
    public FillColor: string;

    /**
     * Circle radius (same units as in center specification)
     */
    public Radius: number;

    /**
     * Create new circle representation
     * @param lineWidth border line width (might use HTML/SVG units for now)
     * @param lineColor border line color (hex/rgba/color name)
     * @param fillColor fill color (hex/rgba/color name)
     * @param center circle center
     * @param radius circle radius
     * @param element related timeline model element (usually event, optional)
     */
    constructor(lineWidth: string, lineColor: string, fillColor: string, center: PointSpec, radius: number, element: TimelineElement) {
        super(element);

        this.Center = center;
        this.LineWidth = lineWidth;
        this.LineColor = lineColor;
        this.FillColor = fillColor;
        this.Radius = radius;
    }

    /**
     * Move element vertically
     * @param amount amount of movement
     */
    moveVertically(amount: number) {
        this.Center.PosY += amount;
    }

}
