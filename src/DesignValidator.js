// This will evaluate the semantic world for inconsistencies.
// Example: Type mistmatch, invalid participants etc. 

// This requires knowledge about the actual transformations semantics, so I will establish that before moving forward with the validation. 
// The synthesis development can happen in parallel because it doesn't impact this process.

/**
 * Note: This is not a working implementation, it is just the skeleton to
 * traverse the tree. This will developed further in followup PRs.
 */
export class DesignValidator {

    constructor (ast) {
        this.ast = ast;
        this.currentBehavior;
        this.behaviors = [];
    }

    run() {
        this.processTree(this.ast);
        console.log(JSON.stringify(this.behaviors, null, 4));
    }

    processTree(node) {
        if ("body" in node) {
            for (const child of node["body"]) {
                if (child["type"] === "behavior") {
                    this.currentBehavior = child;
                    this.processBehavior(child);
                }
                this.processTree(child)
            }
        }
    }

    processBehavior(behavior) {
        const behaviorName = behavior["behaviorName"];
        const primitiveTransformations = [];
        const opaqueTransformations = [];
        const createdParticipants = [];
        let nextBehaviorName;
        for (const child of behavior["body"]) {

            const cmd = child["command"];
            const type = child["type"];

            if (type === "cmd") {
                if (cmd === "select") {
                    nextBehaviorName = child["args"][0]["value"];
                } else if (cmd === "create") {
                    createdParticipants.push(child.args);
                } else {
                    primitiveTransformations.push(cmd);
                }
            } else if (type === "registeredCmd") {
                opaqueTransformations.push(cmd);
            }
        }

        /**
         * I am grouping the primitive and opaque transformations
         * separately. I know the exact ast mapping for the primitive
         * transformation and I can automatically identify the invariant
         * that is defined by the transformation.
         * 
         * However, I will allow convention to specify a transformation
         * and the invariants that it enforces on the participants.
         * This will allow a solution that can scale more easily. 
         * Even if I have opaque transformations, I can define its
         * semantics at the boundary.
         **/ 
        this.behaviors.push({
            behavior: this.currentBehavior["behaviorName"],
            createdParticipants: createdParticipants,
            primitiveTransformations: primitiveTransformations,
            opaqueTransformations: opaqueTransformations,
            nextBehavior: nextBehaviorName
        })
    }
}