/**
 * Visual Theme Configuration Model
 */
export class TimelineTheme {
    /**
     * Default font family
     */
    public DefaultFont: string;

    /**
     * Default font color (hex/rgba/color name)
     */
    public DefaultFontColor: string;

    /**
     * Default font inverse color (hex/rgba/color name)
     */
    public DefaultFontInverseColor: string;

    /**
     * Default text note color (hex/rgba/color name)
     */
    public DefaultNoteFontColor: string;

    /**
     * Minimal font size to be used
     */
    public DefaultMinFontSize: number;

    /**
     * Maximal font size to be used
     */
    public DefaultMaxFontSize: number;

    /**
     * Default background color (hex/rgba/color name)
     */
    public DefaultBackgroundColor: string;

    /**
     * Default padding (being used between events, titles, etc.)
     */
    public DefaultPadding: number;

    /**
     * Google font names to be loaded
     */
    public GoogleFonts: string[] = [];

    /**
     * List of colors to be used for particular categories (cycling is used if more categories than colors specified)
     */
    public CategoryColors: string[];

    /**
     * Event rectangle background color (hex/rgba/color name)
     */
    public EventBgColor: string;

    /**
     * Event title color (hex/rgba/color name)
     */
    public EventTitleLineColor: string;

    /**
     * Event line (below title) color (hex/rgba/color name)
     */
    public DefaultEventLineColor: string;

    /**
     * Event circle color (fill color, border color is taken from category, hex/rgba/color name)
     */
    public DefaultEventPointColor: string;

    /**
     * Color for links in header (hex/rgba/color name)
     */
    public HeaderLinkColor: string;

    /**
     * Default radius for event images (corners can be cut-out)
     */
    public DefaultImageRadius: number;

    /**
     * Threshold of empty space between events which is being collapsed to empty space placeholder
     */
    public EmptySpaceThreshold: number;

    /**
     * Empty space placeholder border color (hex/rgba/color name)
     */
    public CutPlaceholderBorder: string;

    /**
     * Opacity of image used as background (usualy for title, 0 ... 1)
     */
    public TitleImageOpacity: number;

    /**
     * Create new timeline configuration
     * @param defaultFont Default font family
     * @param defaultFontColor Default font color (hex/rgba/color name)
     * @param defaultFontInverseColor Default font inverse color (hex/rgba/color name)
     * @param defaultFontNoteColor DefaultNoteFontColor: string;
     * @param defaultMinFontSize DefaultMinFontSize: number;
     * @param defaultMaxFontSize DefaultMaxFontSize: number;
     * @param defaultBackgroundColor Default background color (hex/rgba/color name)
     * @param defaultPadding Default padding (being used between events, titles, etc.)
     * @param googleFonts Google font names to be loaded
     * @param categoryColors List of colors to be used for particular categories (cycling is used if more categories than colors specified)
     * @param eventBgColor Event rectangle background color (hex/rgba/color name)
     * @param eventTitleLineColor Event title color (hex/rgba/color name)
     * @param defaultEventLineColor Event line (below title) color (hex/rgba/color name)
     * @param defaultEventPointColor Event circle color (fill color, border color is taken from category, hex/rgba/color name)
     * @param headerLinkColor Color for links in header (hex/rgba/color name)
     * @param defaultImageRadius Default radius for event images (corners can be cut-out)
     * @param emptySpaceThreshold Threshold of empty space between events which is being collapsed to empty space placeholder
     * @param cutPlaceholderBorder Empty space placeholder border color (hex/rgba/color name)
     * @param titleImageOpacity Opacity of image used as background (usualy for title, 0 ... 1)
     */
    constructor(defaultFont: string, defaultFontColor: string, defaultFontInverseColor: string, defaultFontNoteColor: string, defaultMinFontSize: number, defaultMaxFontSize: number, defaultBackgroundColor: string, defaultPadding: number, googleFonts: string[], categoryColors: string[], eventBgColor: string, eventTitleLineColor: string, defaultEventLineColor: string, defaultEventPointColor: string, headerLinkColor: string, defaultImageRadius: number, emptySpaceThreshold: number, cutPlaceholderBorder: string, titleImageOpacity: number) {
        this.DefaultFont = defaultFont;
        this.DefaultFontInverseColor = defaultFontInverseColor;
        this.DefaultFontColor = defaultFontColor;
        this.DefaultNoteFontColor = defaultFontNoteColor;
        this.DefaultMinFontSize = defaultMinFontSize;
        this.DefaultMaxFontSize = defaultMaxFontSize;
        this.DefaultPadding = defaultPadding;
        this.GoogleFonts = googleFonts;
        this.DefaultBackgroundColor = defaultBackgroundColor;
        this.CategoryColors = categoryColors;
        this.EventBgColor = eventBgColor;
        this.EventTitleLineColor = eventTitleLineColor;
        this.DefaultEventLineColor = defaultEventLineColor;
        this.DefaultEventPointColor = defaultEventPointColor;
        this.HeaderLinkColor = headerLinkColor;
        this.DefaultImageRadius = defaultImageRadius;
        this.EmptySpaceThreshold = emptySpaceThreshold;
        this.CutPlaceholderBorder = cutPlaceholderBorder;
        this.TitleImageOpacity = titleImageOpacity;
    }
}
