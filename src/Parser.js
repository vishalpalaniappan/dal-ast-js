import KEYWORDS from "./KEYWORDS";
import grammar from "./grammar.json"
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
 * on this.
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

    processToken(token) {
        let output;
        if (token.type === "RBRACE") {
            const node = this.stack.pop();
            this.stack[this.stack.length - 1].body.push(node); 
        } else if (token.value === "design") {
            this.processDesignKeyword();
        } else  if (token.value === "behavior") {
            this.processBehavior();
        }else  if (token.value === "if") {
            this.processIf();
        }
    }

    getGrammar(keyword) {
        for (const entry of grammar) {
            if (entry.value === keyword) {
                return entry;
            }
        }
    }

    processBehavior () {
        console.log("Processing behavior keyword");
        const grammar = this.getGrammar("behavior");

        let token = this.tokens[++this.currPos];
        const behaviorName = token.value;

        const args = this.getArgs()
        const parsedArgs = new ArgsParser(args).run();
        
        // Left Brace
        token = this.tokens[++this.currPos];

        const node = {
            type: "behavior",
            behaviorName: behaviorName,
            args: parsedArgs,
            body: []
        }

        this.stack.push(node)
    }

    processIf () {
        console.log("Processing if keyword");
        const grammar = this.getGrammar("if");

        const args = this.getArgs()
        const parsedArgs = new ArgsParser(args).run();
        
        // Left Brace
        const token = this.tokens[++this.currPos];

        const node = {
            type: "if",
            args: parsedArgs,
            body: []
        }

        this.stack.push(node)
    }

    processDesignKeyword () {
        console.log("Processing design keyword");
        const grammar = this.getGrammar("design");

        const args = this.getArgs()
        const parsedArgs = new ArgsParser(args).run();

        const node = {
            "type": "design",
            "design_name": parsedArgs
        }

        this.stack[this.stack.length - 1].body.push(node); 
    }

    getArgs () {
        const token = this.tokens[++this.currPos];
        console.log(token);
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