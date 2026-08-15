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
            this.closeBlock();
        } else if (token.value === "design") {
            this.processDesignKeyword();
        } else if (token.value === "behavior") {
            this.processBehavior();
        } else if (token.value === "if") {
            this.processIf();
        } else if (token.value === "else") {
            this.processElse();
        } else if (token.value === "for") {
            this.processFor();
        } else if (token.value === "while") {
            this.processWhile();
        } else if (token.value === "invariant") {
            this.processInvariant();
        } else if (token.value === "select") {
            this.processSelect();
        }else if (token.value === "actor") {
            this.processActor();
        } else if (token.value === "include") {
            this.processInclude();
        } else if (token.value === "participant") {
            this.processParticipant();
        } else if (token.value === "compositeBehavior") {
            this.processCompositeBehavior();
        } else if (token.value === "import") {
            this.processImport();
        } else if (token.type === "IDENTIFIER") {
            this.processCmd(token.value);
        }
    }


    /**
     * Closes the nested block by removing it from
     * the top of the stack and adding it to the new
     * node at the top of the stack.
     * 
     * It uses the RBRACE identifier to determine if
     * the top block is closed. 
     * 
     * For if statements, it appends the elif and else
     * blocks to the if block that was already processed
     * so that they can be synthesized in a single AST node.
     */
    closeBlock () {
        const node = this.stack.pop();

        if (node.type === "else") {
            const body = this.stack[this.stack.length - 1].body;
            const ifNode = body[body.length - 1]
            ifNode["else"] = node;
        } else {
            this.stack[this.stack.length - 1].body.push(node); 
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
        const node = {
            type: "behavior",
            behaviorName: behaviorName,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes the behavior block.
     * 
     * behavior <behavior_name>(args1, arg2...argN) {
     * 
     * }
     */
    processCompositeBehavior () {
        const behaviorName = this.tokens[++this.currPos].value;
        const node = {
            type: "compositeBehavior",
            behaviorName: behaviorName,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes the actor block.
     * 
     * actor <actor_name> {
     * 
     * }
     */
    processActor () {
        const actorName = this.tokens[++this.currPos].value;
        const node = {
            type: "actor",
            actorName: actorName,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes the actor block.
     * 
     * actor <actor_name> {
     * 
     * }
     */
    processParticipant () {
        const participantType = this.tokens[++this.currPos].value;
        const node = {
            type: "participant",
            participantType: participantType,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes the include block.
     * 
     * include("config.json","a.py",...)
     */
    processInclude () {
        const parsedArgs = new ArgsParser(this.getArgs()).run();

        const includes = parsedArgs.map((arg) => arg["value"]);

        // TODO: Validate that include is added inside actor block

        const s = this.stack[this.stack.length - 1];
        if ("includes" in s) {
            s.includes.push(includes)
        } else {
            s.includes = [];
            s.includes.push(includes)
        }
    }

    /**
     * Processes the import command.
     * 
     * import("sample.dal")
     */
    processImport() {
        const parsedArgs = new ArgsParser(this.getArgs()).run();

        const imports = parsedArgs.map((arg) => arg["value"]);

        // TODO: Validate that import is added inside actor block

        const s = this.stack[this.stack.length - 1];
        if ("imports" in s) {
            s.imports.push(includes)
        } else {
            s.imports = [];
            s.imports.push(imports)
        }
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
     * Processes invariant block.
     * 
     * invariant {
     * 
     * }
     */
    processInvariant () {
        const invariantName = this.tokens[++this.currPos].value;
        const node = {
            type: "invariant",
            invariantName: invariantName,
            args: [],
            body: []
        }
        this.stack.push(node)
    }
    /**
     * Processes select block.
     * 
     * select {
     * 
     * }
     */
    processSelect () {
        const node = {
            type: "select",
            args: [],
            body: []
        }
        this.stack.push(node)
    }


    /**
     * Processes while block.
     * 
     * while (condition) {
     * 
     * }
     */
    processWhile () {
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const node = {
            type: "while",
            args: parsedArgs,
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes else block.
     * 
     * else (condition) {
     * 
     * }
     */
    processElse () {
        const node = {
            type: "else",
            body: []
        }
        this.stack.push(node)
    }

    /**
     * Processes for block.
     * 
     * for (<participan>, <start>,<end>) {
     * 
     * }
     */
    processFor () {
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const node = {
            type: "for",
            participant: parsedArgs[0],
            start: parsedArgs[1],
            end: parsedArgs[2],
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
     * Process design keyword.
     * 
     * cmd(args1, arg2...argN)
     * 
     * Type:
     * _cmd -> "registeredCmd"
     * cmd -> "cmd"
     */
    processCmd (cmd) {
        const parsedArgs = new ArgsParser(this.getArgs()).run();
        const type = (cmd[0] === "_")?"registeredCmd":"cmd";
        const node = {
            "type": type,
            "command": cmd,
            "args": parsedArgs
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