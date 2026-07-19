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
        const groupedTokens = [];
        const parsedArgs = [];
    }

    /**
     * Splits the tokens by commas so they
     * can be processed independently.
     * @param {Array} tokens 
     */
    splitByComma (tokens) {

    }

    /**
     * Process the grouped tokens and returns
     * the type and value of the arguments.
     * @param {Array} tokens 
     */
    processGroup (tokens) {

    }
}
