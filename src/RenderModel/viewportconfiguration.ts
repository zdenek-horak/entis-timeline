export { ViewportConfiguration }

/**
 * Viewport Model
 */
class ViewportConfiguration {
    /**
     * Flag for orientation, only true supported for the moment
     */
    public IsVertical: boolean;

    /**
     * Viewport width (in pixels)
     */
    public Width: number;

    /**
     * Viewport height (in pixels)
     */
    public Height: number;

    /**
     * Create new viewport model
     * @param isVertical flag of viewport orientation, only true supported for the moment
     * @param width viewport width (in pixels)
     * @param height viewpoert height (in pixels)
     */
    constructor(isVertical: boolean, width: number, height: number) {
        this.IsVertical = isVertical;
        this.Width = width;
        this.Height = height;
    }
}
