export { TimelineTextPart };

/**
 * Rich Text Part Model
 */
class TimelineTextPart {
    /**
     * Text should be rendered as strong
     */
    public IsBold: boolean;

    /**
     * Text should be rendered in italics
     */
    public IsItalic: boolean;

    /**
     * Text should be rendered as underlined
     */
    public IsUnderline: boolean;

    /**
     * Text
     */
    public Text: string;

    /**
     * Text that should be prepended before the text
     */
    public Separator: string;

    /**
     * Create new rich text model
     * @param text text
     * @param isBold flag for bold text
     * @param isItalic flag for italic text
     * @param isUnderline flag for underlined text
     * @param separator separator to be prepended before the text
     */
    constructor(text: string, isBold: boolean, isItalic: boolean, isUnderline: boolean, separator: string) {
        this.IsBold = isBold;
        this.IsItalic = isItalic;
        this.IsUnderline = isUnderline;
        this.Text = text;
        this.Separator = separator;
    }
}
