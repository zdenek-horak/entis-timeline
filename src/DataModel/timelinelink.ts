export { TimelineLink };

/**
 * Hyperlink Model
 */
class TimelineLink {
    /**
     * Hyperlink url
     */
    public Url: string;

    /**
     * Hyperlink target (_blank supported)
     */
    public Target: string;

    /**
     * Hyperlink text (being shown instead of url)
     */
    public Text: string;

    /**
     * Hyperlink tooltip
     */
    public Tooltip: string;

    /**
     * Create hyperlink model
     * @param url hyperlink url
     * @param text hyperlink text
     * @param target hyperlink target
     * @param tooltip hyperlink tooltip
     */
    constructor(url: string, text: string, target: string, tooltip: string) {
        this.Url = url;
        this.Text = text;
        this.Target = target;
        this.Tooltip = tooltip;
    }
}
