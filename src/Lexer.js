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
        const identifier = this.getToken(character);
        if (identifier) {
            this.addAccumulatedIdentifierToken();
            this.addToken(identifier);
            if (identifier === "QUOTE") {
                this.extractStringFromQuotes();
            }
            return;
        }
        this.accumulate.push(character);
    }

    /**
     * Finds the identifier given the character.
     * @param {String} character Character from scan.
     * @returns 
     */
    getToken (character) {
        for (const [identifier, value] of Object.entries(TOKENS)) {
            if (value[0] !== character) {
                continue;
            }
            return identifier;
        }
    }

    /**
     * If a quote is encountered, scan forward until end of quote is found.
     * Everything inside the quote is part of the string.
     */
    extractStringFromQuotes () {
        this.currPos++;
        do {
            const character = this.source[this.currPos];
            const identifier = this.getToken(character);
            if (identifier !== "QUOTE") {
                this.accumulate.push(character);
                continue;
            }
            this.addAccumulatedIdentifierToken();
            this.addToken(identifier);
            break;
        } while (this.currPos++ < this.source.length)
    }

    /**
     * Non token strings are added to an array which get processed
     * when a token is found. For example, design(lexer), in this case,
     * design will get accumulated and added as an identifier to the
     * scanned tokens when LBRACKET is scanned. In the next stage,
     * the parser will identify the keywords from the identifiers.
     * 
     * [
     *  { type: 'IDENTIFIER', value: 'design' },
     *  { type: 'LBRACKET', value: undefined },
     *  { type: 'IDENTIFIER', value: 'lexer' },
     *  { type: 'RBRACKET', value: undefined },
     * ]
     */
    addAccumulatedIdentifierToken () {
        if (this.accumulate.length > 0) {
            this.addToken("IDENTIFIER", this.accumulate.join(""));
            this.accumulate = [];
        }
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
