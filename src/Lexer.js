import TOKENS from "./TOKENS";

export class DalLexer {

    constructor (source) {
        this.currPos = 0;
        this.source = [...source];
        this.scannedTokens = [];
        this.accumulate = [];
        this.run();
    }

    /**
     * Runs the lexer from the current position,
     */
    run() {
        do  {
            console.log(this.source[this.currPos])
            this.scanCurrentPosition(this.source[this.currPos]);
        } while (++this.currPos < this.source.length);

        console.log(this.scannedTokens);
    }

    /**
     * Scans the current position to determine tokens
     * that match. If multiple matches are found, it calls
     * scanForwardFromPosition until only one match remains.
     */
    scanCurrentPosition(character) {
        for (const [identifier, value] of Object.entries(TOKENS)) {
            if (value[0] !== character) {
                continue;
            }
            if (this.accumulate.length > 0) {
                this.addToken("IDENTIFIER", this.accumulate.join(""));
                this.accumulate = [];
            }
            this.addToken(identifier);
            return;
        }
        this.accumulate.push(character);
    }

    /**
     * If a quote is encountered, scan forward until end of quote is found.
     * Everything inside the quote is part of the string.
     */
    extractStringFromQuotes () {

    }

    /**
     * 
     * @param {String} type Type for the token.
     * @param {Number} value Value of token (example identifier)
     * @param {Number} lineNo Line number in source.
     * @param {Number} startCol Starting Column.
     * @param {Number} endCol Ending Column.
     */
    addToken (type, value, lineNo, startCol, endCol) {
        this.scannedTokens.push({
            type: type,
            value: value
        })
    }
}
