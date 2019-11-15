export { TimelineImage };

/**
 * Timeline Image Model
 */
class TimelineImage {
    /** 
     *  Image Url
     */
    public Url: string;

    /**
     * Source image Width (used to calculate aspect ratio)
     */
    public Width: number;

    /**
     * Source image height (used to calculate aspect ratio)
     */
    public Height: number;

    /**
     * Create new image model
     * @param url image url
     * @param width source image width
     * @param height source image height
     */
    constructor(url: string, width: number, height: number) {
        this.Url = url;
        this.Width = width;
        this.Height = height;
    }
}
