define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rendered Timeline Model
     */
    var RenderedTimeline = /** @class */ (function () {
        /**
         * Create new rendered timeline representation
         * @param timeline timeline model
         * @param viewport viewport information
         * @param bgColor background color (hex/rgba/color name)
         */
        function RenderedTimeline(timeline, viewport, bgColor) {
            this.ParentTimeline = timeline;
            this.TotalWidth = 500;
            this.TotalHeight = 1000;
            this.Viewport = viewport;
            this.BackgroundColor = bgColor;
            this.Elements = new Array();
            this.Groups = new Array();
        }
        /**
         * Create new group
         * @param groupId unique group id
         */
        RenderedTimeline.prototype.AddGroup = function (groupId) {
            this.Groups.push(groupId);
        };
        /**
         * Add new element and assign corresponding group
         * @param element rendered element
         * @param groupId group id to assing
         */
        RenderedTimeline.prototype.AddElement = function (element, groupId) {
            element.GroupId = groupId;
            this.Elements.push(element);
        };
        return RenderedTimeline;
    }());
    exports.RenderedTimeline = RenderedTimeline;
});
