import TOKENS from "./TOKENS";

/**
 * This lexer is a simple implementation and on a high
 * level, it works as follows:
 * - Scans current position
 * - If it is not a token:
 *      - adds to identifier accumulator
 * - If it is a token:
 *      - it saves what is in the accumulator to scannedTokens
 *      - then it saves the token to scannedTokens
 * - If a token is a quote:
 *      - saves quote to scanned token
 *      - scans forward to end of quote while accumulating identifier
 *      - saves accumulator to scanned tokens
 *      - saves quote to scanned tokens
 * 
 * I am not scanning for keywords here, I just save them as
 * identifiers and then in the parse stage I will classify them.
 * This makes the algorithm very simple.
 * 
 * So for example:
 * ----
 * design ("name")
 * IDENTIFIER LPAREN QUOTE IDENTIFIER QUOTE RPAREN
 * 
 * I also save the line/col number (starting and ending). This will be
 * useful for visualization in the workbench.
 */
export class DalLexer {
    constructor (source) {
        this.currPos = 0;
        this.source = [...source];
        this.scannedTokens = [];

        // Current line and colno
        this.lineno = 1;
        this.colno = 0;

        // Accumulates identifiers until tokens are visited.
        this.accumulatedIdentifier = [];
        this.startColIdentifier;
        this.startLineIdentifier;

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
        // Starting lineno is 0, so we start at col 1
        this.colno++;

        if (character == " ") {
            this.addAccumulatedIdentifierToken();
            return;
        } else if (character == "\n") {
            this.lineno++;
            this.colno = 0;
            return;
        }

        const identifier = this.getToken(character);
        if (identifier) {
            this.addAccumulatedIdentifierToken();
            this.addToken(identifier);
            if (identifier === "QUOTE") {
                this.extractStringFromQuotes();
            }
            return;
        }
        this.addToAccumulator(character);
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
        this.colno++;
        this.currPos++;
        do {
            const character = this.source[this.currPos];
            const identifier = this.getToken(character);
            if (character === "\n") {
                this.lineno++;
                this.colno = 0;
                continue;
            }
            if (identifier !== "QUOTE") {
                this.addToAccumulator(character);
                this.colno++;
                continue;
            }
            this.addAccumulatedIdentifierToken();
            this.addToken(identifier);
            break;
        } while (this.currPos++ < this.source.length)
    }

    /**
     * Adds to accumulator. Saves starting position
     * of accumulated identifier.
     * 
     * @param {String} character Character to add to accumulate.
     */
    addToAccumulator (character) {
        if (this.accumulatedIdentifier.length === 0) {
            this.startColIdentifier = this.colno;
            this.startLineIdentifier = this.lineno;
        }
        this.accumulatedIdentifier.push(character);
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
        if (this.accumulatedIdentifier.length > 0) {
            this.addToken("IDENTIFIER", this.accumulatedIdentifier.join(""));
            this.accumulatedIdentifier = [];
        }
    }

    /**
     * 
     * @param {String} type Type for the token.
     * @param {Number} value Value of token (example identifier)
     */
    addToken (type, value) {

        if (type === "IDENTIFIER") {
            this.scannedTokens.push({
                type: type,
                value: value,
                startLineno: this.startLineIdentifier,
                startColno: this.startColIdentifier,
                endLineno: this.lineno,
                endColno: this.colno - 1
            })
        } else {
            this.scannedTokens.push({
                type: type,
                value: value,
                startLineno: this.lineno,
                startColno: this.colno,
                endLineno: this.lineno,
                endColno: this.colno
            })
        }
    }
}
