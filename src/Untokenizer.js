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
}
