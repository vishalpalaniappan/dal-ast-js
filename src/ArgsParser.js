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
        const match = rawValue.match(/^([^=]+)=(.*)$/);
        
        let arg, value
        if (match) {
            [, arg, value] = match;
        } else {
            arg = null;
            value = rawValue;
        }
        
        /**
         * TODO: I am doing a step here that should be done in the lexer. I should
         * be tokenizing the args so that the prop, = and value are tokenized. Instead,
         * I am untokenizing and then parsing. This is obviously wrong/bad practice
         * because its moving the tokenizers responsibility here, so I will fix this.
         */
        let processedValue;
        if (value [0] === "\"") {
            type = "string"
            processedValue = JSON.parse(value);
        } else if (value [0] === "[") {
            type = "list"
            processedValue = JSON.parse(value);
        } else if (value [0] === "{") {
            type = "object"
            processedValue = JSON.parse(value);
        } else if (!Number.isNaN(Number(value))) {
            type = "number"
            processedValue = parseFloat(value)
        } else if (value === "true") {
            type = "boolean";
            processedValue = true;
        } else if (value === "false") {
            type = "boolean";
            processedValue = false;
        } else if (value === "null") {
            type = "null";
            processedValue = null;
        } else {
            type = "name"
            processedValue = value;
        }

        return {
            arg: arg,
            type: type,
            value: processedValue
        }
    }
}