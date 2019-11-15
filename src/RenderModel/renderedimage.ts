import { RenderedElement } from "./renderedelement";
import { TimelineElement } from "../DataModel/timelineelement";
export { RenderedImage}

/**
 * Rendered Image Model
 */
class RenderedImage extends RenderedElement {
    /**
     * Image url
     */
    public ImageUrl: string;

    /**
     * Image left offset
     */
    public PosX: number;

    /**
     * Image top offset
     */
    public PosY: number;

    /**
     * Target image width
     */
    public Width: number;

    /**
     * Target image height
     */
    public Height: number;

    /**
     * Flag if image should have cut-out corners
     */
    public EnableBorderRadius: boolean = false;

    /**
     * Flag if image should have fade-out vertical mask (as used for background images)
     */
    public EnableBgMask: boolean = false;

    /**
     * Create new rendered image representation
     * @param imageUrl image url
     * @param posX image left offset
     * @param posY image top offset
     * @param width image width
     * @param height image height
     * @param enableBorderRadius flag if image should have cut-out corners
     * @param enableBgMask flag if image should have fade-out vertical mask (as used for background images)
     * @param element related timeline element model (optional)
     */
    constructor(imageUrl: string, posX: number, posY: number, width: number, height: number, enableBorderRadius: boolean, enableBgMask: boolean, element: TimelineElement) {
        super(element);
        this.ImageUrl = imageUrl;
        this.PosX = posX;
        this.PosY = posY;
        this.Width = width;
        this.Height = height;
        this.EnableBgMask = enableBgMask;
        this.EnableBorderRadius = enableBorderRadius;
    }

    /**
     * Move element vertically (for adjusting position during cuts, etc.)
     * @param amount amount of movement
     */
    moveVertically(amount: number) {
        this.PosY += amount;
    }
}