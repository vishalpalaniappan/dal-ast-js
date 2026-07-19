import KEYWORDS from "./KEYWORDS";
import grammar from "./grammar.json"

/**
 * This class produces an AST given the scanned tokens.
 * 
 * Steps:
 * - Visit token and calls process token
 * - Check if identifier
 *      - if identifier, check if keyword
 *          - if keyword, follow grammar for keyword
 *          - if not keyword, follow grammar for instruction
 *      - if not identifier, syntax error
 * 
 * When following the grammar for the keyword, when body is
 * encountered, the token processor is recursively called
 * and result is appended to the body key of the keywords
 * tree.
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
        this.run();
    }

    run () {
        do {
            const token = this.tokens[this.currPos];
            this.processToken(token);
        } while (++this.currPos < this.tokens.length)
    }

    processToken(token) {
        if (KEYWORDS.includes(token.value)) {
            if (token.value === "design") {
                this.processDesignKeyword();
            }
        }
    }

    getGrammar(keyword) {
        for (const entry of grammar) {
            if (entry.value === keyword) {
                return entry;
            }
        }
    }

    processDesignKeyword () {
        console.log("Processing design keyword");
        const grammar = this.getGrammar("design");

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
        // 
        // There is a better way to do this, so this will get replaced.
        if (!foundRParen) {
            throw new Error("Expected RPAREN, Syntax error")
        }

        // Process args here, they need to be parsed.

        return {
            "type": "design",
            "design_name": []
        }
    }

}