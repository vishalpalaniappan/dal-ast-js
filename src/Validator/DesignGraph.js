
/**
 * This class reprents a graph of the design. It will
 * accepts behaviors with the metadata from the AST
 * and will expose operations that can be performed
 * on the graph.
 * 
 * For example, find the provenance of a participant. I will
 * also provide a method to walk the design and as each
 * transformation is encountered, it can be processed to
 * identify the semantic validity and the invariants it reveals.
 */
export class DesignGraph {

    constructor () {
        this.behaviors = [];
    }

    addBehavior (behavior) {
        this.behaviors.push(behavior)
    }
}