// This will evaluate the semantic world for inconsistencies.
// Example: Type mistmatch, invalid participants etc. 

// This requires knowledge about the actual transformations semantics, so I will establish that before moving forward with the validation. 
// The synthesis development can happen in parallel because it doesn't impact this process.

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