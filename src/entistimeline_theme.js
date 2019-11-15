define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Visual Theme Configuration Model
     */
    var TimelineTheme = /** @class */ (function () {
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
        function TimelineTheme(defaultFont, defaultFontColor, defaultFontInverseColor, defaultFontNoteColor, defaultMinFontSize, defaultMaxFontSize, defaultBackgroundColor, defaultPadding, googleFonts, categoryColors, eventBgColor, eventTitleLineColor, defaultEventLineColor, defaultEventPointColor, headerLinkColor, defaultImageRadius, emptySpaceThreshold, cutPlaceholderBorder, titleImageOpacity) {
            /**
             * Google font names to be loaded
             */
            this.GoogleFonts = [];
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
        return TimelineTheme;
    }());
    exports.TimelineTheme = TimelineTheme;
});
