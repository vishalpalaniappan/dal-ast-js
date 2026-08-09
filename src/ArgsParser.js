import { Untokenizer } from "./Untokenizer";

/**
 * Structure
 * command(args...)
 * 
 * Example:
 * set(name=book, keys=["name"], value="Harry Potter")
 * 
 * Returns:
 * [
 *      {
 *          "arg": "name",
 *          "type": "name",
 *          "value": "book"
 *      },
 *      {
 *          "arg": "keys",
 *          "type": "list",
 *          "value": ["name"]
 *      },
 *      {
 *          "arg": "value",
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

        this.pairs = [
            {
                start:"QUOTE", 
                end:"QUOTE", 
                type:"string"
            },
            {
                start:"LBRACE", 
                end:"RBRACE", 
                type:"object"
            },
            {
                start:"LBRACKET", 
                end:"RBRACKET", 
                type: "list"
            }
        ]
    }

    run () {
        if (this.tokens.length === 0) {
            return this.parsedArgs;
        }
        this.splitByComma(this.tokens);
        for (const group of this.groupedTokens) {
            this.parsedArgs.push(this.processGroup(group));
        }
        return this.parsedArgs;
    }

    /**
     * Splits the tokens by commas so they can be processed independently.
     * For objects, arrays and strings, it flags that pair is being tracked
     * so that any commmas inside the object or array is ignored.
     * @param {Array} tokens 
     */
    splitByComma (tokens) {
        let pos = 0;
        let group = [];
        this.trackingPair = null;
        do {
            const token = this.tokens[pos];
            if (token.type === "COMMA" && !this.trackingPair) {
                this.groupedTokens.push(group);
                group = [];
                continue;
            } 
            
            if (this.trackingPair && token.type === this.trackingPair) {
                this.trackingPair = null;
            } else if (!this.trackingPair) {
                this.trackingPair = this.isPair(token);
            }
            
            group.push(token);

        } while (++pos < this.tokens.length);

        this.groupedTokens.push(group);
    }

    /**
     * Checks if the token is a pair.
     * @param {Object} token Token being checked.
     * @returns {String|null}
     */
    isPair (token) {
        for(const pair of this.pairs) {
            if (token.type === pair.start) {
                return pair.end;
            }
        }
    }

    /**
     * Process the grouped tokens and returns
     * the type and value of the arguments.
     * 
     * Types:
     * ------
     * Name (this is a participant name)
     * String
     * List or Array
     * Object
     * Number
     * 
     * @param {Array} tokens 
     */
    processGroup (tokens) {
        let type;
        let rawValue = new Untokenizer(tokens).buildString();

        // Turns name="book" to arg= "name" and value = "book"
        const [, arg, value] = rawValue.match(/^(\w+)=("[^"]*")$/);

        if (tokens[0].type === "QUOTE") {
            type = "string";
            value = JSON.parse(value)
        } else if (tokens[0].type === "LBRACKET") {
            type = "list"
            value = JSON.parse(value)
        } else if (tokens[0].type === "LBRACE") {
            type = "object"
            value = JSON.parse(value)
        } else if (!Number.isNaN(Number(value))) {
            type = "number"
            value = parseFloat(value)
        } else {
            type = "name";
            if (value === "true") {
                value = true;
            } else if (value === "false") {
                value = false;
            } else if (value === "null") {
                type = "null";
                value = null;
            }
        }

        return {
            arg: arg,
            type: type,
            value: value
        }
    }
}