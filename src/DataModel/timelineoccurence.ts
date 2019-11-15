import { TimelineCategory } from "./timelinecategory";
import { TimeSpecification } from "./timespecification";

export { TimelineOccurence };

/**
 * Event Occurence (binding event with time and category
 */
class TimelineOccurence {
    /**
     * Attached category
     */
    public Category: TimelineCategory;

    /**
     * Attached time information
     */
    public Time: TimeSpecification;
}