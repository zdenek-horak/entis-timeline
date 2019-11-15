export { PointSpec }

/**
 * Point Specification Model Helper
 */
class PointSpec {
    /**
     * Left offset
     */
    public PosX: number;

    /**
     * Top offset
     */
    public PosY: number;

    /**
     * Create new point specification
     * @param posX left offset
     * @param posY top offset
     */
    constructor(posX: number, posY: number) {
        this.PosX = posX;
        this.PosY = posY;
    }
}
