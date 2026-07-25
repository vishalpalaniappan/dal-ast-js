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
    }

    run() {
        this.processTree(this.ast);
    }

    processTree(node) {
        if ("body" in node) {
            for (const child of node["body"]) {
                if (child["type"] === "behavior") {
                    this.currentBehavior = child;
                }
                this.processTree(child)
            }
            // Process else blocks in if statements.
            if ("else" in node) {
                this.processTree(node["else"]);
            }
        } else {
            this.processNode(node);
        }

    }

    processNode(node) {
        if (node.type === "cmd" && node.command === "create") {
            console.log(`Participant ${node.args[0].value} created in behavior ${this.currentBehavior["behaviorName"]}`, )
        }
    }
}