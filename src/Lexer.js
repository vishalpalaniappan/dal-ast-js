export class DalLexer {

    constructor (source) {
        this.currPos = 0;
        this.source = [...source];
        this.scannedTokens = [];
        this.run();
    }

    /**
     * Runs the lexer from the current position,
     */
    run() {
        do  {
            console.log(this.source[this.currPos])
        } while (++this.currPos < this.source.length)
    }

    /**
     * Scans the current position to determine tokens
     * that match. If multiple matches are found, it calls
     * scanForwardFromPosition until only one match remains.
     */
    scanCurrentPosition() {

    }

    /**
     * If multiple tokens are a match for current character, then
     * scan forward until only one token remains.
     */
    scanForwardFromPosition () {

    }

    /**
     * 
     * @param {String} token Identifier for the token.
     * @param {Number} lineNo Line number in source.
     * @param {Number} startCol Starting Column.
     * @param {Number} endCol Ending Column.
     */
    addToken (token, lineNo, startCol, endCol) {

    }
}
