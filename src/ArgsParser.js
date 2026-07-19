/**
 * Structure
 * command(args...)
 * 
 * Example:
 * set(book, ["name"], "Harry Potter")
 * 
 * Returns:
 * [
 *      {
 *          "type": "name",
 *          "value": "book"
 *      },
 *      {
 *          "type": "list",
 *          "value": ["name"]
 *      },
 *      {
 *          "type": "string",
 *          "value": "Harry Potter"
 *      }    
 * ]
 * 
 * This class parses the arguments from parser
 * for a keyword or command instruction.
 */
export class ArgsParser {
    constructor (tokens) {
        this.tokens = tokens;
        this.groupedTokens = [];
        this.parsedArgs = [];

        console.log("Received args:", tokens);

        this.run();
    }

    run () {
        this.splitByComma(this.tokens);

        for (const group of this.groupedTokens) {
            console.log(this.processGroup(group));
        }
    }

    /**
     * Splits the tokens by commas so they
     * can be processed independently.
     * @param {Array} tokens 
     */
    splitByComma (tokens) {
        let pos = 0;
        let group = [];
        do {
            const token = this.tokens[pos];
            if (token.type === "COMMA") {
                this.groupedTokens.push(group);
                group = [];
            } else {
                group.push(token);
            }
        } while (++pos < this.tokens.length);

        this.groupedTokens.push(group);
    }

    /**
     * Process the grouped tokens and returns
     * the type and value of the arguments.
     * @param {Array} tokens 
     */
    processGroup (tokens) {
        if (tokens[0].type === "QUOTE") {
            const value = `"${tokens[1].value}"`
            return {
                type: "string",
                value: JSON.parse(value)
            }
        }
    }
}
