define(["require", "exports", "./RenderModel/renderedtext", "./RenderModel/renderedcircle", "./RenderModel/renderedrectangle", "./RenderModel/renderedline", "./RenderModel/renderedimage", "./RenderModel/renderedlink", "./RenderModel/viewportconfiguration"], function (require, exports, renderedtext_1, renderedcircle_1, renderedrectangle_1, renderedline_1, renderedimage_1, renderedlink_1, viewportconfiguration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Allows timeline rendering using SVG
     */
    var TimelineRenderer = /** @class */ (function () {
        /**
         * Create new renderer
         * @param parent DOM container
         */
        function TimelineRenderer(parent) {
            /**
             * Default SVG namespaces
             */
            this.SVGNS = 'http://www.w3.org/2000/svg';
            /**
             * XLink namespaces (for hyperlinks inside SVG)
             */
            this.XLINKNS = 'http://www.w3.org/1999/xlink';
            /**
             * Rendered elements
             */
            this.Elements = [];
            this.Parent = parent;
            // We need the container physically injected into DOM&Visible because of the BBox measurements
            this.Container = document.createElementNS(this.SVGNS, "svg");
            this.Container.setAttribute('xmlns', this.SVGNS);
            this.Container.setAttribute('xmlns:xlink', this.XLINKNS);
            this.Parent.appendChild(this.Container);
            this.SVGDefs = document.createElementNS(this.SVGNS, 'defs');
            this.Container.appendChild(this.SVGDefs);
        }
        /**
         * Get viewport configuration (used during placing phase)
         */
        TimelineRenderer.prototype.GetViewportConfiguration = function () {
            var viewport = new viewportconfiguration_1.ViewportConfiguration(true, Math.min(window.innerWidth, window.outerWidth), Math.min(window.innerHeight, window.outerHeight));
            viewport.Width = this.Parent.offsetWidth;
            return viewport;
        };
        /**
         * Preload Google Fonts (need to do this because of text measurements during placing phase)
         * @param googleFontName requested Google font name
         */
        TimelineRenderer.prototype.InjectGoogleFont = function (googleFontName) {
            var sheet = document.createElementNS(this.SVGNS, 'style');
            sheet.setAttribute("type", 'text/css');
            sheet.textContent = "@import url('https://fonts.googleapis.com/css?family=" + googleFontName + "&display=swap');"
                + ".fadeIn {opacity: 0; animation-fill-mode: forwards; animation-delay: 0.5s; animation-name: fadeinFrames;animation-duration: 0.5s;}"
                + "@keyframes fadeinFrames { from { opacity: 0; } to { opacity: 1; } }";
            this.SVGDefs.appendChild(sheet);
        };
        /**
         * Show error message cause of init/loading error
         */
        TimelineRenderer.prototype.RenderError = function () {
            this.Parent.append("Ooops, something went wrong. You may look into the console if you're a developer.");
        };
        /**
         * Render given timeline
         * @param renderedTimeline
         */
        TimelineRenderer.prototype.Render = function (renderedTimeline) {
            this.Timeline = renderedTimeline;
            // Clear elements (from previous renders)
            for (var _i = 0, _a = this.Elements; _i < _a.length; _i++) {
                var element = _a[_i];
                this.Container.removeChild(element);
            }
            this.Elements = [];
            // Prepare SVG element (update width/height which might have changed)
            this.Container.setAttribute("height", this.Timeline.TotalHeight.toString());
            this.Container.setAttribute("width", this.Timeline.TotalWidth.toString());
            this.Container.setAttribute("style", "background: " + this.Timeline.ParentTimeline.Theme.DefaultBackgroundColor);
            // Set requested sizing
            var parentStyle = "padding: 0; margin: 0; font-size: 0px; ";
            if (this.Timeline.Viewport.IsVertical)
                parentStyle = parentStyle + "; overflow-x: hidden";
            else
                parentStyle = parentStyle + "; overflow-y: hidden";
            this.Parent.setAttribute("style", parentStyle);
            this.SVGNS = this.Container.namespaceURI;
            // Create individual elements
            this.Construct();
        };
        /**
         * Render hyperlink
         * @param linkUrl link url
         * @param linkTarget link target
         * @param tooltip link tooltip
         */
        TimelineRenderer.prototype.createLinkElement = function (linkUrl, linkTarget, tooltip) {
            var link = document.createElementNS(this.SVGNS, 'a');
            link.setAttribute('class', 'fadeIn');
            if (tooltip != null) {
                var title = document.createElementNS(this.SVGNS, 'title');
                title.innerHTML = tooltip;
                link.appendChild(title);
            }
            if (linkTarget != null) {
                link.setAttribute('target', linkTarget);
            }
            link.setAttributeNS(this.XLINKNS, 'href', linkUrl);
            return link;
        };
        /**
         * Render text
         * @param textEl rendered text element
         * @param allowJustify flag for text justification, not used for the moment
         */
        TimelineRenderer.prototype.createTextElement = function (textEl, allowJustify) {
            var text = document.createElementNS(this.SVGNS, 'text');
            text.setAttribute('x', textEl.PosX.toString());
            text.setAttribute('style', 'font-size: ' + textEl.FontSize + 'px; ' + (textEl.FontWeight != null ? 'font-weight: ' + textEl.FontWeight + ';' : '') + 'font-family: ' + textEl.FontFamily);
            text.setAttribute("fill", textEl.FontColor);
            text.setAttribute('class', 'fadeIn');
            if (textEl.HorizontalAlign == renderedtext_1.TextAlign.Start)
                text.setAttribute('text-anchor', "start");
            else if (textEl.HorizontalAlign == renderedtext_1.TextAlign.Middle)
                text.setAttribute('text-anchor', "middle");
            else if (textEl.HorizontalAlign == renderedtext_1.TextAlign.End)
                text.setAttribute('text-anchor', "end");
            // Structured text support
            if (textEl.StructuredText.length > 0) {
                var dy = 0;
                // structured text consists of separate lines, each line might consist of differently formated parts
                for (var _i = 0, _a = textEl.StructuredText; _i < _a.length; _i++) {
                    var line = _a[_i];
                    var newLine = true;
                    //let lineWidth = 0;
                    var currentLine = [];
                    for (var i = 0; i < line.length; i++) {
                        var tspan = document.createElementNS(this.SVGNS, 'tspan');
                        if (newLine) {
                            tspan.setAttribute('x', textEl.PosX.toString());
                            tspan.setAttribute('dy', dy + "em");
                            newLine = false;
                        }
                        dy = 1.6; // line height
                        //tspan.innerHTML = stringParts[i];
                        if (line[i].IsBold) {
                            tspan.style.fontWeight = "bold";
                        }
                        if (line[i].IsItalic) {
                            tspan.style.fontStyle = "italic";
                        }
                        if (line[i].IsUnderline) {
                            tspan.style.textDecoration = "underline";
                        }
                        tspan.textContent = line[i].Separator + line[i].Text;
                        text.appendChild(tspan);
                        currentLine.push(tspan);
                        //lineWidth += tspan.getBBox().width
                    }
                    //if (allowJustify && textEl.HorizontalAlign == TextAlign.Justify) {
                    //    let availableSpace = textEl.JustifyWidth - lineWidth;
                    //    let spaceForEvery = availableSpace / (currentLine.length - 1);
                    //    for (let k = 1; k < currentLine.length; k++) {
                    //        // currentLine[k].setAttribute('dx', spaceForEvery + "px");
                    //    }
                    //}
                }
            }
            else { // plain text, just multiple lines supported
                var stringParts = textEl.Text.split('\n');
                var dy = 0;
                for (var i = 0; i < stringParts.length; i++) {
                    var tspan = document.createElementNS(this.SVGNS, 'tspan');
                    tspan.setAttribute('x', textEl.PosX.toString());
                    tspan.setAttribute('dy', dy + "em");
                    dy = 1.6; // line height
                    tspan.textContent = stringParts[i];
                    text.appendChild(tspan);
                }
            }
            return text;
        };
        /**
         * Render rectangle
         * @param rectEl rectangle to be rendered
         */
        TimelineRenderer.prototype.createRectangleElement = function (rectEl) {
            var path = document.createElementNS(this.SVGNS, 'rect');
            path.setAttribute('class', 'fadeIn');
            path.setAttribute("stroke", rectEl.LineColor);
            path.setAttribute("stroke-width", rectEl.LineWidth);
            path.setAttribute("fill", rectEl.FillColor);
            path.setAttribute('rx', rectEl.RX.toString());
            path.setAttribute('ry', rectEl.RY.toString());
            path.setAttribute('x', rectEl.PosX.toString());
            path.setAttribute('y', rectEl.PosY.toString());
            path.setAttribute('width', rectEl.Width.toString());
            path.setAttribute('height', rectEl.Height.toString());
            return path;
        };
        /**
         * Render circle
         * @param circleEl circle to be rendered
         */
        TimelineRenderer.prototype.createCircleElement = function (circleEl) {
            var path = document.createElementNS(this.SVGNS, 'circle');
            path.setAttribute('class', 'fadeIn');
            path.setAttribute("stroke", circleEl.LineColor);
            path.setAttribute("stroke-width", circleEl.LineWidth);
            path.setAttribute("fill", circleEl.FillColor);
            path.setAttribute('cx', circleEl.Center.PosX.toString());
            path.setAttribute('cy', circleEl.Center.PosY.toString());
            path.setAttribute('r', circleEl.Radius.toString());
            return path;
        };
        /**
         * Render line
         * @param lineEl line to be rendered
         */
        TimelineRenderer.prototype.createLineElement = function (lineEl) {
            var path = document.createElementNS(this.SVGNS, 'path');
            path.setAttribute('class', 'fadeIn');
            if (lineEl.FillColor != null) {
                path.setAttribute("fill", lineEl.FillColor);
            }
            if (lineEl.StrokeCap != null) {
                path.setAttribute("stroke-linecap", lineEl.StrokeCap);
            }
            path.setAttribute("stroke", lineEl.LineColor);
            path.setAttribute("stroke-width", lineEl.LineWidth);
            var pathDesc = "";
            var first = true;
            for (var _i = 0, _a = lineEl.Points; _i < _a.length; _i++) {
                var point = _a[_i];
                var letter = "L";
                if (first) {
                    first = false;
                    letter = "M";
                }
                pathDesc += letter + " " + point.PosX + " " + point.PosY + " ";
            }
            path.setAttribute('d', pathDesc);
            return path;
        };
        /**
         * Render image
         * @param el
         */
        TimelineRenderer.prototype.createImageElement = function (el) {
            // preloading not used anymore, width and height are specified inside timeline configuration
            //// preload image
            //let img = new Image();
            //img.src = el.ImageUrl;
            //img.onload = () => {
            //};
            var text = document.createElementNS(this.SVGNS, 'image');
            text.setAttribute('class', 'fadeIn');
            if (el.EnableBorderRadius) {
                text.setAttribute('clip-path', "url(#c1)");
            }
            if (el.EnableBgMask) {
                text.setAttribute('mask', "url(#m1)");
            }
            text.setAttribute('x', el.PosX.toString());
            text.setAttribute('y', el.PosY.toString());
            text.setAttribute('width', el.Width.toString());
            text.setAttribute('height', el.Height.toString());
            text.setAttribute('preserveAspectRatio', "xMidYMid  meet");
            text.setAttributeNS(this.XLINKNS, 'href', el.ImageUrl);
            return text;
        };
        /**
         * Perform vertical alignment of given texts (as a workaround for weird SVG baseline align support)
         * @param text text SVG element
         * @param textEl rendered text element
         */
        TimelineRenderer.prototype.alignTextElement = function (text, textEl) {
            var targetY = textEl.PosY;
            var bbox = text.getBBox();
            if (textEl.VerticalAlign == renderedtext_1.TextAlign.Start)
                targetY += 0;
            else if (textEl.VerticalAlign == renderedtext_1.TextAlign.Middle)
                targetY += bbox.height / 2;
            else if (textEl.VerticalAlign == renderedtext_1.TextAlign.End)
                targetY += textEl.FontSize * 1.2; // line height?
            // we just need to shift the first line
            text.setAttribute('y', targetY.toString());
            if (textEl.Rotate != 0) {
                text.setAttribute('transform', "rotate(" + textEl.Rotate.toString() + ", " + textEl.PosX + ", " + textEl.PosY + ")");
            }
        };
        /**
         * Return { width, height} of rendered text
         * @param textEl rendered text element
         */
        TimelineRenderer.prototype.measureTextElement = function (textEl) {
            // Create element, inject it into SVG, measure it, remove (otherwise BBox is 0)
            var text = this.createTextElement(textEl, true);
            this.Container.appendChild(text);
            var bbox = text.getBBox();
            this.Container.removeChild(text);
            return { width: bbox.width, height: bbox.height };
        };
        /**
         * Add child to internal collection and SVG parent
         * @param element
         */
        TimelineRenderer.prototype.addChild = function (element) {
            this.Elements.push(element);
            this.Container.appendChild(element);
        };
        /**
         * Rendering loop for different rendered elements
         * @param element rendered element
         * @param textElementAggregator aggregates all text elements for subsequent alignment workaround
         */
        TimelineRenderer.prototype.ConstructChild = function (element, textElementAggregator) {
            // Render links
            if (element instanceof renderedlink_1.RenderedLink) {
                var rLink = element;
                var link = this.createLinkElement(rLink.Link, rLink.Target, rLink.Tooltip);
                for (var _i = 0, _a = element.Children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    link.appendChild(this.ConstructChild(child, textElementAggregator));
                }
                return link;
            }
            else if (element instanceof renderedtext_1.RenderedText) {
                // Create SVG Text element, insert it into DOM and align it (alignment needs BBOX which needs the DOM presence)
                var textEl = this.createTextElement(element, true);
                textElementAggregator.push({ "Description": element, "Element": textEl });
                return textEl;
            }
            else if (element instanceof renderedline_1.RenderedLine) {
                return this.createLineElement(element);
            }
            else if (element instanceof renderedcircle_1.RenderedCircle) {
                return this.createCircleElement(element);
            }
            else if (element instanceof renderedrectangle_1.RenderedRectangle) {
                return this.createRectangleElement(element);
            }
            else // Render images
             if (element instanceof renderedimage_1.RenderedImage) {
                return this.createImageElement(element);
            }
        };
        /**
         * Render elements
         */
        TimelineRenderer.prototype.Construct = function () {
            // Background rectangle
            var rect = document.createElementNS(this.SVGNS, 'rect');
            rect.setAttribute('x', "0");
            rect.setAttribute('y', "0");
            rect.setAttribute('width', this.Timeline.TotalWidth.toString());
            rect.setAttribute('height', this.Timeline.TotalHeight.toString());
            rect.setAttribute('fill', this.Timeline.BackgroundColor);
            this.addChild(rect);
            // Main image background mask (vertical fade-out)
            var maskEl = document.createElementNS(this.SVGNS, 'mask');
            maskEl.setAttribute("maskUnits", "objectBoundingBox");
            maskEl.setAttribute("maskContentUnits", "objectBoundingBox");
            maskEl.setAttribute("id", "m1");
            var gradient = document.createElementNS(this.SVGNS, 'linearGradient');
            gradient.setAttribute("id", "lgF1");
            gradient.setAttribute("gradientTransform", "rotate(90)");
            var stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "0");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#fff");
            gradient.appendChild(stop);
            stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "0.75");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#fff");
            gradient.appendChild(stop);
            stop = document.createElementNS(this.SVGNS, 'stop');
            stop.setAttribute("offset", "1");
            stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
            stop.setAttribute("stop-color", "#000");
            gradient.appendChild(stop);
            maskEl.appendChild(gradient);
            var maskRect = document.createElementNS(this.SVGNS, 'rect');
            maskRect.setAttribute("fill", "url(#lgF1)");
            maskRect.setAttribute("x", "0");
            maskRect.setAttribute("y", "0");
            maskRect.setAttribute("width", "1");
            maskRect.setAttribute("height", "1");
            maskEl.appendChild(maskRect);
            this.addChild(maskEl);
            // Event image clipping mask
            var clipPath = document.createElementNS(this.SVGNS, 'clipPath');
            clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
            clipPath.setAttribute("id", "c1");
            var clipRect = document.createElementNS(this.SVGNS, 'rect');
            clipRect.setAttribute("x", "0");
            clipRect.setAttribute("y", "0");
            clipRect.setAttribute("width", "1");
            clipRect.setAttribute("height", "1");
            clipRect.setAttribute("rx", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
            clipRect.setAttribute("ry", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
            clipPath.appendChild(clipRect);
            this.addChild(clipPath);
            var aggregator = [];
            // Render top level groups and then insert corresponding elements into them
            for (var _i = 0, _a = this.Timeline.Groups; _i < _a.length; _i++) {
                var groupId = _a[_i];
                var groupEl = document.createElementNS(this.SVGNS, 'g');
                groupEl.setAttribute("id", groupId);
                this.addChild(groupEl);
                // Render individual elements
                for (var _b = 0, _c = this.Timeline.Elements; _b < _c.length; _b++) {
                    var element = _c[_b];
                    if (element.GroupId == groupId) {
                        this.addChild(this.ConstructChild(element, aggregator));
                    }
                }
            }
            // Align text elements (cannot be aligned before they are added to the DOM/SVG tree)
            // It's a workaround for not supported baseline alignment in EDGE/Firefox
            for (var _d = 0, aggregator_1 = aggregator; _d < aggregator_1.length; _d++) {
                var textElement = aggregator_1[_d];
                this.alignTextElement(textElement.Element, textElement.Description);
            }
        };
        return TimelineRenderer;
    }());
    exports.TimelineRenderer = TimelineRenderer;
});
