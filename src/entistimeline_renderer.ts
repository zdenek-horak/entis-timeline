import { RenderedTimeline } from "./RenderModel/renderedtimeline";
import { RenderedText, TextAlign } from "./RenderModel/renderedtext";
import { RenderedCircle } from "./RenderModel/renderedcircle";
import { RenderedRectangle } from "./RenderModel/renderedrectangle";
import { RenderedLine } from "./RenderModel/renderedline";
import { RenderedImage } from "./RenderModel/renderedimage";
import { RenderedLink } from "./RenderModel/renderedlink";
import { RenderedElement } from "./RenderModel/renderedelement";
import { ViewportConfiguration } from "./RenderModel/viewportconfiguration";
export { TimelineRenderer };

/**
 * Allows timeline rendering using SVG
 */
class TimelineRenderer {
    /**
     * Target element in which the timeline will be rendered
     */
    private Parent: HTMLElement;
    /**
     * Rendered timeline model
     */
    private Timeline: RenderedTimeline;

    /**
     * SVG parent element
     */
    private Container: SVGElement;

    /**
     * SVG defs subelement
     */
    private SVGDefs: Element;

    /**
     * Default SVG namespaces
     */
    private SVGNS = 'http://www.w3.org/2000/svg';

    /**
     * XLink namespaces (for hyperlinks inside SVG)
     */
    private XLINKNS = 'http://www.w3.org/1999/xlink';

    /**
     * Rendered elements
     */
    private Elements: SVGElement[] = [];

    /**
     * Create new renderer
     * @param parent DOM container
     */
    constructor(parent: HTMLElement) {
        this.Parent = parent;
        // We need the container physically injected into DOM&Visible because of the BBox measurements
        this.Container = document.createElementNS(this.SVGNS, "svg") as SVGElement;

        this.Container.setAttribute('xmlns', this.SVGNS);
        this.Container.setAttribute('xmlns:xlink', this.XLINKNS);

        this.Parent.appendChild(this.Container);
        this.SVGDefs = document.createElementNS(this.SVGNS, 'defs');

        this.Container.appendChild(this.SVGDefs);
    }

    /**
     * Get viewport configuration (used during placing phase)
     */
    public GetViewportConfiguration() {
        const viewport = new ViewportConfiguration(true, Math.min(window.innerWidth, window.outerWidth), Math.min(window.innerHeight, window.outerHeight));
        viewport.Width = this.Parent.offsetWidth;
        return viewport;
    }

    /**
     * Preload Google Fonts (need to do this because of text measurements during placing phase)
     * @param googleFontName requested Google font name
     */
    public InjectGoogleFont(googleFontName: string) {
        const sheet = document.createElementNS(this.SVGNS, 'style');
        sheet.setAttribute("type", 'text/css');
        sheet.textContent = "@import url('https://fonts.googleapis.com/css?family=" + googleFontName + "&display=swap');"
            + ".fadeIn {opacity: 0; animation-fill-mode: forwards; animation-delay: 0.5s; animation-name: fadeinFrames;animation-duration: 0.5s;}"
            + "@keyframes fadeinFrames { from { opacity: 0; } to { opacity: 1; } }";
        this.SVGDefs.appendChild(sheet);
    }

    /**
     * Show error message cause of init/loading error
     */
    public RenderError() {
        this.Parent.append("Ooops, something went wrong. You may look into the console if you're a developer.");
    }

    /**
     * Render given timeline
     * @param renderedTimeline 
     */
    public Render(renderedTimeline: RenderedTimeline) {
        this.Timeline = renderedTimeline;

        // Clear elements (from previous renders)
        for (const element of this.Elements) {
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
    }

    /**
     * Render hyperlink
     * @param linkUrl link url
     * @param linkTarget link target
     * @param tooltip link tooltip
     */
    private createLinkElement(linkUrl: string, linkTarget: string, tooltip: string): SVGGraphicsElement {
        const link = document.createElementNS(this.SVGNS, 'a') as SVGGraphicsElement;
        link.setAttribute('class', 'fadeIn');

        if (tooltip != null) {
            const title = document.createElementNS(this.SVGNS, 'title') as Element;
            title.innerHTML = tooltip;
            link.appendChild(title);
        }

        if (linkTarget != null) {
            link.setAttribute('target', linkTarget);
        }

        link.setAttributeNS(this.XLINKNS, 'href', linkUrl);
        return link;
    }

    /**
     * Render text
     * @param textEl rendered text element
     * @param allowJustify flag for text justification, not used for the moment
     */
    private createTextElement(textEl: RenderedText, allowJustify: boolean): SVGGraphicsElement {
        const text = document.createElementNS(this.SVGNS, 'text') as SVGGraphicsElement;
        text.setAttribute('x', textEl.PosX.toString());
        text.setAttribute('style', 'font-size: ' + textEl.FontSize + 'px; ' + (textEl.FontWeight != null ? 'font-weight: ' + textEl.FontWeight + ';' : '') + 'font-family: ' + textEl.FontFamily);
        text.setAttribute("fill", textEl.FontColor);
        text.setAttribute('class', 'fadeIn');
        if (textEl.HorizontalAlign == TextAlign.Start)
            text.setAttribute('text-anchor', "start");
        else if (textEl.HorizontalAlign == TextAlign.Middle)
            text.setAttribute('text-anchor', "middle");
        else if (textEl.HorizontalAlign == TextAlign.End)
            text.setAttribute('text-anchor', "end");

        // Structured text support
        if (textEl.StructuredText.length > 0) {
            let dy = 0;

            // structured text consists of separate lines, each line might consist of differently formated parts
            for (let line of textEl.StructuredText) {
                let newLine = true;
                //let lineWidth = 0;
                let currentLine: SVGGraphicsElement[] = [];
                for (let i = 0; i < line.length; i++) {
                    const tspan = document.createElementNS(this.SVGNS, 'tspan') as SVGGraphicsElement;
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
        } else { // plain text, just multiple lines supported
            const stringParts = textEl.Text.split('\n');
            let dy = 0;
            for (let i = 0; i < stringParts.length; i++) {
                const tspan = document.createElementNS(this.SVGNS, 'tspan') as SVGGraphicsElement;
                tspan.setAttribute('x', textEl.PosX.toString());
                tspan.setAttribute('dy', dy + "em");
                dy = 1.6; // line height
                tspan.textContent = stringParts[i];

                text.appendChild(tspan);
            }
        }

        return text;
    }

    /**
     * Render rectangle
     * @param rectEl rectangle to be rendered
     */
    private createRectangleElement(rectEl: RenderedRectangle): SVGGraphicsElement {
        const path = document.createElementNS(this.SVGNS, 'rect') as SVGGraphicsElement;
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
    }

    /**
     * Render circle
     * @param circleEl circle to be rendered
     */
    private createCircleElement(circleEl: RenderedCircle): SVGGraphicsElement {
        const path = document.createElementNS(this.SVGNS, 'circle') as SVGGraphicsElement;
        path.setAttribute('class', 'fadeIn');

        path.setAttribute("stroke", circleEl.LineColor);
        path.setAttribute("stroke-width", circleEl.LineWidth);
        path.setAttribute("fill", circleEl.FillColor);

        path.setAttribute('cx', circleEl.Center.PosX.toString());
        path.setAttribute('cy', circleEl.Center.PosY.toString());
        path.setAttribute('r', circleEl.Radius.toString());

        return path;
    }

    /**
     * Render line
     * @param lineEl line to be rendered
     */
    private createLineElement(lineEl: RenderedLine): SVGGraphicsElement {
        const path = document.createElementNS(this.SVGNS, 'path') as SVGGraphicsElement;
        path.setAttribute('class', 'fadeIn');
        if (lineEl.FillColor != null) {
            path.setAttribute("fill", lineEl.FillColor);
        }
        if (lineEl.StrokeCap != null) {
            path.setAttribute("stroke-linecap", lineEl.StrokeCap);
        }
        path.setAttribute("stroke", lineEl.LineColor);
        path.setAttribute("stroke-width", lineEl.LineWidth);

        let pathDesc = "";
        let first = true;
        for (const point of lineEl.Points) {
            let letter = "L";
            if (first) {
                first = false;
                letter = "M";
            }
            pathDesc += letter + " " + point.PosX + " " + point.PosY + " ";
        }
        path.setAttribute('d', pathDesc);
        return path;
    }

    /**
     * Render image
     * @param el
     */
    private createImageElement(el: RenderedImage): SVGGraphicsElement {

        // preloading not used anymore, width and height are specified inside timeline configuration
        //// preload image
        //let img = new Image();
        //img.src = el.ImageUrl;
        //img.onload = () => {
        //};

        const text = document.createElementNS(this.SVGNS, 'image') as SVGGraphicsElement;
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
    }

    /**
     * Perform vertical alignment of given texts (as a workaround for weird SVG baseline align support)
     * @param text text SVG element
     * @param textEl rendered text element
     */
    private alignTextElement(text: SVGGraphicsElement, textEl: RenderedText) {
        let targetY = textEl.PosY;
        const bbox = text.getBBox();

        if (textEl.VerticalAlign == TextAlign.Start)
            targetY += 0;
        else if (textEl.VerticalAlign == TextAlign.Middle)
            targetY += bbox.height / 2;
        else if (textEl.VerticalAlign == TextAlign.End)
            targetY += textEl.FontSize * 1.2; // line height?

        // we just need to shift the first line
        text.setAttribute('y', targetY.toString());

        if (textEl.Rotate != 0) {
            text.setAttribute('transform', "rotate(" + textEl.Rotate.toString() + ", " + textEl.PosX + ", " + textEl.PosY + ")");
        }
    }

    /**
     * Return { width, height} of rendered text
     * @param textEl rendered text element
     */
    public measureTextElement(textEl: RenderedText) {
        // Create element, inject it into SVG, measure it, remove (otherwise BBox is 0)
        const text = this.createTextElement(textEl, true);
        this.Container.appendChild(text);
        const bbox = text.getBBox();
        this.Container.removeChild(text);
        return { width: bbox.width, height: bbox.height };
    }

    /**
     * Add child to internal collection and SVG parent
     * @param element
     */
    private addChild(element: SVGElement) {
        this.Elements.push(element);
        this.Container.appendChild(element);
    }

    /**
     * Rendering loop for different rendered elements
     * @param element rendered element
     * @param textElementAggregator aggregates all text elements for subsequent alignment workaround
     */
    private ConstructChild(element: RenderedElement, textElementAggregator: any[]): SVGGraphicsElement {
        // Render links
        if (element instanceof RenderedLink) {
            const rLink = (element as RenderedLink);
            const link = this.createLinkElement(rLink.Link, rLink.Target, rLink.Tooltip);
            for (const child of (element as RenderedLink).Children) {
                link.appendChild(this.ConstructChild(child, textElementAggregator));
            }
            return link;
        } else if (element instanceof RenderedText) {
            // Create SVG Text element, insert it into DOM and align it (alignment needs BBOX which needs the DOM presence)
            const textEl = this.createTextElement((element as RenderedText), true);
            textElementAggregator.push({ "Description": element, "Element": textEl });
            return textEl;
        } else if (element instanceof RenderedLine) {
            return this.createLineElement((element as RenderedLine));
        } else if (element instanceof RenderedCircle) {
            return this.createCircleElement((element as RenderedCircle));
        } else if (element instanceof RenderedRectangle) {
            return this.createRectangleElement((element as RenderedRectangle));
        } else // Render images
            if (element instanceof RenderedImage) {
                return this.createImageElement((element as RenderedImage));
            }
    }

    /**
     * Render elements
     */
    private Construct() {

        // Background rectangle
        const rect = document.createElementNS(this.SVGNS, 'rect') as SVGElement;
        rect.setAttribute('x', "0");
        rect.setAttribute('y', "0");
        rect.setAttribute('width', this.Timeline.TotalWidth.toString());
        rect.setAttribute('height', this.Timeline.TotalHeight.toString());
        rect.setAttribute('fill', this.Timeline.BackgroundColor);
        this.addChild(rect);

        // Main image background mask (vertical fade-out)
        const maskEl = document.createElementNS(this.SVGNS, 'mask') as SVGGraphicsElement;
        maskEl.setAttribute("maskUnits", "objectBoundingBox");
        maskEl.setAttribute("maskContentUnits", "objectBoundingBox");
        maskEl.setAttribute("id", "m1");

        const gradient = document.createElementNS(this.SVGNS, 'linearGradient') as SVGGraphicsElement;
        gradient.setAttribute("id", "lgF1");
        gradient.setAttribute("gradientTransform", "rotate(90)");

        let stop = document.createElementNS(this.SVGNS, 'stop') as SVGGraphicsElement;
        stop.setAttribute("offset", "0");
        stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
        stop.setAttribute("stop-color", "#fff");
        gradient.appendChild(stop);

        stop = document.createElementNS(this.SVGNS, 'stop') as SVGGraphicsElement;
        stop.setAttribute("offset", "0.75");
        stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
        stop.setAttribute("stop-color", "#fff");
        gradient.appendChild(stop);

        stop = document.createElementNS(this.SVGNS, 'stop') as SVGGraphicsElement;
        stop.setAttribute("offset", "1");
        stop.setAttribute("stop-opacity", this.Timeline.ParentTimeline.Theme.TitleImageOpacity.toString());
        stop.setAttribute("stop-color", "#000");
        gradient.appendChild(stop);

        maskEl.appendChild(gradient);

        const maskRect = document.createElementNS(this.SVGNS, 'rect') as SVGGraphicsElement;
        maskRect.setAttribute("fill", "url(#lgF1)");
        maskRect.setAttribute("x", "0");
        maskRect.setAttribute("y", "0");
        maskRect.setAttribute("width", "1");
        maskRect.setAttribute("height", "1");
        maskEl.appendChild(maskRect);
        this.addChild(maskEl);

        // Event image clipping mask
        const clipPath = document.createElementNS(this.SVGNS, 'clipPath') as SVGGraphicsElement;
        clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
        clipPath.setAttribute("id", "c1");

        const clipRect = document.createElementNS(this.SVGNS, 'rect') as SVGGraphicsElement;
        clipRect.setAttribute("x", "0");
        clipRect.setAttribute("y", "0");
        clipRect.setAttribute("width", "1");
        clipRect.setAttribute("height", "1");
        clipRect.setAttribute("rx", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
        clipRect.setAttribute("ry", this.Timeline.ParentTimeline.Theme.DefaultImageRadius + "");
        clipPath.appendChild(clipRect);

        this.addChild(clipPath);
        const aggregator = [];

        // Render top level groups and then insert corresponding elements into them
        for (let groupId of this.Timeline.Groups) {
            const groupEl = document.createElementNS(this.SVGNS, 'g') as SVGGraphicsElement;
            groupEl.setAttribute("id", groupId);
            this.addChild(groupEl);

            // Render individual elements
            for (let element of this.Timeline.Elements) {
                if (element.GroupId == groupId) {
                    this.addChild(this.ConstructChild(element, aggregator));
                }
            }
        }

        // Align text elements (cannot be aligned before they are added to the DOM/SVG tree)
        // It's a workaround for not supported baseline alignment in EDGE/Firefox
        for (let textElement of aggregator) {
            this.alignTextElement(textElement.Element, textElement.Description);
        }
    }
}
