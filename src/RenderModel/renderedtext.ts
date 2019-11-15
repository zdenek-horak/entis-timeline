import { RenderedElement } from "./renderedelement";
import { TimelineElement } from "../DataModel/timelineelement";
import { TimelineTextPart } from "../DataModel/timelinetextpart";
export { TextAlign, RenderedText}

/**
 * Text Align Enum
 */
enum TextAlign {
    /**
     * Align to start (left/top)
     */
    Start,
    /**
     * Align to center
     */
    Middle,
    /**
     * Align to end (right/bottom
     */
    End
}

/**
 * Rendered Text Model
 */
class RenderedText extends RenderedElement {
    /**
     * Contained text (wrapped for rich-text support)
     */
    public StructuredText: TimelineTextPart[][] = [];
    /**
     * Plain text alternative (used when StructuredText is empty)
     */
    public Text: string;

    /**
     * Left offset
     */
    public PosX: number;

    /**
     * Top offset
     */
    public PosY: number;

    /**
     * Horizontal Align
     */
    public HorizontalAlign: TextAlign;

    /**
     * Vertical Align
     */
    public VerticalAlign: TextAlign;

    /**
     * Font name (HTML/SVG format)
     */
    public FontFamily: string;

    /**
     * Font size (in target units)
     */
    public FontSize: number;

    /**
     * Font color (hex/rgba/color name)
     */
    public FontColor: string;

    /**
     * Angle of rotation (in degrees, -180 ... 180)
     */
    public Rotate: number;

    /**
     * Font weight (eg. bold/100/200/300/etc.)
     */
    public FontWeight: string;

    /**
     * Width to be used when justifying text (not used for the moment)
     */
    public JustifyWidth: number = null;

    /**
     * Create new rendered text representation
     * @param text Plain text to be rendered
     * @param posX left offset
     * @param posY top offset
     * @param horizontalAlign horizontal align
     * @param verticalAlign vertical align
     * @param element related timeline element model
     * @param fontFamily font family (HTML/SVG format)
     * @param fontSize font size (in target units)
     * @param fontColor font color (hex/rgba/color name)
     * @param rotate text rotation (in degrees, -180 ... 180)
     * @param fontWeight font weight (eg. bold/100/200/300)
     * @param justifyWidth width to be used when justifying text (not used for the moment)
     */
    constructor(text: string, posX: number, posY: number, horizontalAlign: TextAlign, verticalAlign: TextAlign, element: TimelineElement, fontFamily: string, fontSize: number, fontColor: string, rotate: number, fontWeight: string, justifyWidth: number) {
        super(element);

        this.Text = text;
        this.PosX = posX;
        this.PosY = posY;
        this.HorizontalAlign = horizontalAlign;
        this.VerticalAlign = verticalAlign;
        this.FontColor = fontColor;
        this.FontFamily = fontFamily;
        this.FontSize = fontSize;
        this.Rotate = rotate;
        this.FontWeight = fontWeight;
        this.JustifyWidth = justifyWidth;
    }
    /**
    * Move element vertically (for adjusting position during cuts, etc.)
    * @param amount amount of movement
    */
    moveVertically(amount: number) {
        this.PosY += amount;
    }

}