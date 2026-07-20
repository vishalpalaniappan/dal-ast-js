import KEYWORDS from "./KEYWORDS";
import { ArgsParser } from "./ArgsParser";

/**
 * This class produces an AST given the scanned tokens.
 * 
 * Steps:
 * - Process current token
 * - Visit keyword and create node 
 * - Parse the args and save node metadata
 * - If node has a body (if, behavior), add to stack
 * - If node doesn't have body, add to body of stack top
 * - When rbrace is encountered, pop stack and add
 *   to body of top of stack.
 * 
 * It is a very simple algorithm because my language is basic.
 * I create stack to track the nested body being processed. 
 * I use rbrace as marker to finish a nested block and build the tree.
 * 
 * Note: This was the first way I thought to implement this
 * but I think there is a better way, I am going to iterate
 * on this. This approach does not identify syntax errors 
 * properly.
 * 
 * The actual commands are very simple in this language
 * because I am always following the format shown below:
 * 
 * command(args)
 * 
 * So every identifier that isn't a keyword while scanning
 * forward is a command.
 */
export class DalParser {

    constructor (tokens) {
        this.tokens = tokens;
        this.currPos = 0;
        this.ast = {
            type: "root",
            body: []
        }
        this.stack = [this.ast];
        this.run();
    }

    run () {
        do {
            const token = this.tokens[this.currPos];
            this.processToken(token);
        } while (++this.currPos < this.tokens.length);
    }

    /**
     * Process the current token.
     * 
     * RBRACE indicates current block is over.
     * behavior and if are blocks and have a body
     * design is a statement.
     * 
     * @param {String} token 
     */
    processToken(token) {
        let output;
        if (token.type === "RBRACE") {
            const node = this.stack.pop();
            this.stack[this.stack.length - 1].body.push(node); 
        } else if (token.value === "design") {
            this.processDesignKeyword();
        } else if (token.value === "behavior") {
            this.processBehavior();
        } else if (token.value === "if") {
            this.processIf();
        }
    }

    /**
     * Processes the behavior block.
     * 
     * behavior <behavior_name>(args1, arg2...argN) {
     * 
     * }
     */
    processBehavior () {
        const behaviorName = this.tokens[++this.currPos].value;
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const node = {
            type: "behavior",
            behaviorName: behaviorName,
            args: parsedArgs,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes if block.
     * 
     * if (condition) {
     * 
     * }
     */
    processIf () {
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const node = {
            type: "if",
            args: parsedArgs,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Process design keyword.
     * 
     * design(<design_name>)
     */
    processDesignKeyword () {
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const node = {
            "type": "design",
            "design_name": parsedArgs
        }
        this.stack[this.stack.length - 1].body.push(node); 
    }

    /**
     * Parse the args.
     * 
     * command("test",varName, 123,["count"])
     * 
     * "args": [
     *      {
     *          "type": "string",
     *          "value": "test"
     *      },
     *      {
     *           "type": "name",
     *          "value": "varName"
     *      },
     *      {
     *          "type": "number",
     *          "value": 123
     *      },
     *      {
     *          "type": "list",
     *          "value": [
     *              "count"
     *          ]
     *      }
     *  ]
     * 
     * @returns {Object} Returns the processed args.
     */
    getArgs () {
        const token = this.tokens[++this.currPos];
        if (token.type !== "LPAREN") {
            throw new Error("Expected LPAREN, Syntax error")
        }

        const args = [];
        let foundRParen = false;
        do {
            const token = this.tokens[++this.currPos];
            if (token.type === "RPAREN") {
                foundRParen = true;
                break;
            } else {
                args.push(token);
            }
        } while (this.currPos < this.tokens.length)

        // This is a crude attempt to see if brackets are closed
        // It has obvious flaws, if the parenthesis isn't closed and
        // then another identifier opens and closes parenthesis, it
        // will keep moving forward until it reaches it. 
 
        // There is a better way to do this, so this will get replaced.
        if (!foundRParen) {
            throw new Error("Expected RPAREN, Syntax error")
        }

        return args;
    }

}