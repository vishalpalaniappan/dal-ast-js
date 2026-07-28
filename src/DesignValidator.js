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
        const transformations = [];
        const createdParticipants = [];
        let nextBehaviorName;
        for (const child of behavior["body"]) {
            if (child["type"] === "cmd" && child["command"] === "select") {
                nextBehaviorName = child["args"][0]["value"];
            }
            if (child["type"] === "cmd" && child["command"] === "create") {
                createdParticipants.push(child.args);
            }
        }

        this.behaviors.push({
            behavior: this.currentBehavior["behaviorName"],
            createdParticipants: createdParticipants,
            transformations: [],
            nextBehavior: nextBehaviorName
        })
    }
}