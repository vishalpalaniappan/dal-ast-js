import TOKENS from "./TOKENS";

/**
 * Builds string back from the tokens.
 * 
 * Ex:
 * LBRACKET QUOTE IDENTIFIER("test") QUOTE RBRACKET
 * ("test")
 */
export class Untokenizer {

    constructor (tokens) {
        this.tokens = tokens;
    }

    /**
     * Builds string from tokens.
     * @param {Array} tokens 
     * @returns 
     */
    buildString(tokens) {
        let str = "";

        for (const token of this.tokens) {
            if (token.type === "IDENTIFIER") {
                str = str + token.value
            } else {
                str = str + TOKENS[token.type];
            }
        }

        return str;
    }

    /**
     * This function accepts an AST and converts it into tokens that
     * can be generated into a DAL source. Technically this method
     * isn't necessary because I can just add to the DAL spec and then
     * synthesize it directly. However, it would be great to be able to
     * see the output of the invariant placement. I can also use this
     * to perform some basic formatting of the script so it is consistent.
     * 
     * While placing invariants, the AST is where I will be injecting the
     * actual invariants through the provenance of the participants in the
     * transformation.
     * @param {Object} ast 
     */
    astToTokens(ast) {

    }
}
