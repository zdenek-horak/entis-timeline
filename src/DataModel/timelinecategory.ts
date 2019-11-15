import { TimelineEvent } from "./timelineevent";
import { TimelineElement } from "./timelineelement";

export { TimelineCategory };

/**
 * Timeline Category Model
 */
class TimelineCategory extends TimelineElement {
    /**
     * Category id
     */
    public Id: string;

    /**
     * Category title
     */
    public Title: string;

    /**
     * Events attached to this category
     */
    public Events: TimelineEvent[];

    /**
     * Visual representation of the category (used during placing/rendering phase)
     */
    public TagLine: any = null;

    /**
     * Create new timeline category
     * @param id category unique id
     * @param title category title
     */
    constructor(id: string, title: string) {
        super();
        this.Id = id;
        this.Title = title;
        this.Events = new Array();
    }
}
