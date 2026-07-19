import KEYWORDS from "./KEYWORDS";

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
        this.currentPosition = 0;
        this.run();
    }

    run () {
        for (const token of this.tokens) {
            this.processToken(token);
        }
    }

    processToken(token) {
        if (this.isKeyword(token)) {
            console.log("Keyword:", token.value);
        }
    }

    isKeyword (token) {
        return KEYWORDS.includes(token.value);
    }

}